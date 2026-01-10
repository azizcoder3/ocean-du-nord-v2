// app/api/bookings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/mail";
import { sendSMS } from "@/lib/sms";
import { initMtnPayment } from "@/lib/mtn";
import { airtelMoneyProvider } from "@/lib/airtel"; // ✅ NOUVEAU : Import Airtel

// Frais (2%)
const FEE_PERCENT = 0.02;

type PassengerInput = {
  fullName: string;
  type?: string;
  seatId: number | string;
};

type BookingRequest = {
  tripId: number | string;
  contactInfo?: { phone?: string; email?: string };
  passengers: PassengerInput[];
  totalPrice: number;
  paymentMethod?: string;
};

function generateReference() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "ODN-";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingRequest;
    const { tripId, passengers, totalPrice, paymentMethod } = body;

    // 1. Validation de base
    if (!tripId || !passengers || passengers.length === 0) {
      return NextResponse.json(
        { error: "Données incomplètes" },
        { status: 400 }
      );
    }

    // 2. Vérification Disponibilité
    const trip = await prisma.trip.findUnique({
      where: { id: String(tripId) },
      include: {
        bookings: { include: { passengers: true } },
        route: true,
      },
    });

    if (!trip)
      return NextResponse.json(
        { error: "Voyage introuvable" },
        { status: 404 }
      );

    const occupiedSeats = trip.bookings.flatMap((b) =>
      b.passengers.map((p) => p.seatNumber)
    );
    const requestedSeats = passengers.map((p) => Number(p.seatId));

    if (requestedSeats.some((seat) => occupiedSeats.includes(seat))) {
      return NextResponse.json(
        { error: "Un ou plusieurs sièges sont déjà réservés." },
        { status: 409 }
      );
    }

    // --- GESTION UTILISATEUR CONNECTÉ ---
    let userId = null;
    const session = await auth();
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { phone: session.user.email },
      });
      if (user) userId = user.id;
    }

    // --- LOGIQUE DE PAIEMENT INTELLIGENTE ---
    let bookingStatus: "PENDING" | "PAID" = "PAID";
    let paymentId = null;
    let finalPrice = totalPrice;
    const bookingRef = generateReference();
    const phoneToBill = body.contactInfo?.phone || "";

    // A. LOGIQUE MTN
    if (paymentMethod === "MTN") {
      bookingStatus = "PENDING";
      const fees = Math.ceil(totalPrice * FEE_PERCENT);
      finalPrice = totalPrice + fees;

      console.log(`📡 Init MTN pour ${finalPrice} XAF vers ${phoneToBill}`);
      const mtnResponse = await initMtnPayment(finalPrice, phoneToBill);

      if (!mtnResponse.success) {
        return NextResponse.json(
          { error: "Échec initialisation MTN. Vérifiez le numéro." },
          { status: 502 }
        );
      }
      paymentId = mtnResponse.referenceId;
    }

    // B. LOGIQUE AIRTEL (NOUVEAU ✅)
    else if (paymentMethod === "AIRTEL") {
      bookingStatus = "PENDING";
      const fees = Math.ceil(totalPrice * FEE_PERCENT);
      finalPrice = totalPrice + fees;

      console.log(`📡 Init AIRTEL pour ${finalPrice} XAF vers ${phoneToBill}`);

      try {
        const airtelResponse = await airtelMoneyProvider.initiatePayment(
          finalPrice,
          phoneToBill,
          bookingRef // On utilise la référence générée pour Airtel
        );
        paymentId = airtelResponse.airtelTransactionId;
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("❌ Erreur Airtel:", errorMessage);
        return NextResponse.json(
          { error: "Échec initialisation Airtel. Réessayez." },
          { status: 502 }
        );
      }
    }

    // 3. Création Réservation
    const newBooking = await prisma.booking.create({
      data: {
        reference: bookingRef,
        totalPrice: finalPrice,
        status: bookingStatus,
        paymentMethod: paymentMethod,
        paymentId: paymentId,
        tripId: String(tripId),
        userId: userId,
        passengers: {
          create: passengers.map((p) => ({
            fullName: p.fullName,
            type:
              p.type && String(p.type).toLowerCase() === "adult"
                ? "ADULT"
                : "CHILD",
            seatNumber: Number(p.seatId),
          })),
        },
      },
    });

    // 4. Notifications (SEULEMENT SI DÉJÀ PAYÉ / Cash)
    if (bookingStatus === "PAID") {
      // A. Email
      if (body.contactInfo?.email) {
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1e40af;">OCEAN DU NORD - Confirmation de Réservation</h2>
            <p>Bonjour,</p>
            <p>Votre réservation a été confirmée avec succès !</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Détails de la réservation :</h3>
              <p><strong>Référence :</strong> ${newBooking.reference}</p>
              <p><strong>Trajet :</strong> ${trip.route.fromCity} → ${
          trip.route.toCity
        }</p>
              <p><strong>Date et heure :</strong> ${new Date(
                trip.date
              ).toLocaleDateString("fr-FR")} à ${new Date(
          trip.date
        ).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
              <p><strong>Prix total :</strong> ${finalPrice} XAF</p>
              <h4>Passagers :</h4>
              <ul>
                ${passengers
                  .map((p) => `<li>${p.fullName} (Siège ${p.seatId})</li>`)
                  .join("")}
              </ul>
            </div>
            <p>Nous vous souhaitons un agréable voyage !</p>
            <p>Cordialement,<br>L'équipe Ocean du Nord</p>
          </div>
        `;

        sendEmail({
          to: body.contactInfo.email,
          subject: `Confirmation de réservation - ${newBooking.reference}`,
          html: emailHtml,
        }).catch((err) => console.error("⚠️ Email échoué:", err.message));
      }

      // B. SMS (Immédiat)
      if (body.contactInfo?.phone) {
        const travelDateSimple = new Date(trip.date).toLocaleDateString(
          "fr-FR",
          { day: "2-digit", month: "2-digit" }
        );
        const travelTime = new Date(trip.date).toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const smsMessage = `OCEAN DU NORD\nVoyage Confirmé ✅\nRéf: ${newBooking.reference}\nDe: ${trip.route.fromCity}\nVers: ${trip.route.toCity}\nLe: ${travelDateSimple} à ${travelTime}`;

        sendSMS({
          to: body.contactInfo.phone,
          message: smsMessage,
        }).catch((err) => console.error("⚠️ SMS échoué:", err.message));
      }

      // C. Points
      if (userId) {
        await prisma.user
          .update({
            where: { id: userId },
            data: { points: { increment: Math.floor(finalPrice / 100) } },
          })
          .catch((e) => console.error(e));
      }
    }

    // 5. Réponse au Frontend
    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      reference: newBooking.reference,
      status: bookingStatus,
      paymentId: paymentId,
    });
  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// import prisma from "@/lib/prisma";// // Fichier : app/api/bookings/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@/auth";
// import { sendEmail } from "@/lib/mail";
// import { sendSMS } from "@/lib/sms";
// import { initMtnPayment } from "@/lib/mtn"; // <--- NOUVEAU : Import MTN

// // Frais (2%)
// const FEE_PERCENT = 0.02;

// type PassengerInput = {
//   fullName: string;
//   type?: string;
//   seatId: number | string;
// };

// type BookingRequest = {
//   tripId: number | string;
//   contactInfo?: { phone?: string; email?: string };
//   passengers: PassengerInput[];
//   totalPrice: number;
//   paymentMethod?: string;
// };

// function generateReference() {
//   const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
//   let result = "ODN-";
//   for (let i = 0; i < 4; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// export async function POST(request: Request) {
//   try {
//     const body = (await request.json()) as BookingRequest;
//     const { tripId, passengers, totalPrice, paymentMethod } = body;

//     // 1. Validation de base
//     if (!tripId || !passengers || passengers.length === 0) {
//       return NextResponse.json(
//         { error: "Données incomplètes" },
//         { status: 400 }
//       );
//     }

//     // 2. Vérification Disponibilité
//     const trip = await prisma.trip.findUnique({
//       where: { id: String(tripId) },
//       include: {
//         bookings: { include: { passengers: true } },
//         route: true,
//       },
//     });

//     if (!trip)
//       return NextResponse.json(
//         { error: "Voyage introuvable" },
//         { status: 404 }
//       );

//     const occupiedSeats = trip.bookings.flatMap((b) =>
//       b.passengers.map((p) => p.seatNumber)
//     );
//     const requestedSeats = passengers.map((p) => Number(p.seatId));

//     if (requestedSeats.some((seat) => occupiedSeats.includes(seat))) {
//       return NextResponse.json(
//         { error: "Un ou plusieurs sièges sont déjà réservés." },
//         { status: 409 }
//       );
//     }

//     // --- GESTION UTILISATEUR CONNECTÉ ---
//     let userId = null;
//     const session = await auth();
//     if (session?.user?.email) {
//       const user = await prisma.user.findUnique({
//         where: { phone: session.user.email },
//       });
//       if (user) userId = user.id;
//     }

//     // --- LOGIQUE DE PAIEMENT INTELLIGENTE ---
//     let bookingStatus: "PENDING" | "PAID" = "PAID"; // Par défaut "Payé" (si cash/autre)
//     let paymentId = null;
//     let finalPrice = totalPrice;

//     // SI C'EST MTN : ON MET EN ATTENTE ET ON APPELLE L'API
//     if (paymentMethod === "MTN") {
//       bookingStatus = "PENDING"; // On bloque la validation

//       // On recalcule les frais (Prix + 2%)
//       const fees = Math.ceil(totalPrice * FEE_PERCENT);
//       finalPrice = totalPrice + fees;

//       const phoneToBill = body.contactInfo?.phone || "";

//       console.log(`📡 Init MTN pour ${finalPrice} XAF vers ${phoneToBill}`);

//       // Appel API MTN
//       const mtnResponse = await initMtnPayment(finalPrice, phoneToBill);

//       if (!mtnResponse.success) {
//         return NextResponse.json(
//           { error: "Échec initialisation MTN. Vérifiez le numéro." },
//           { status: 502 }
//         );
//       }

//       paymentId = mtnResponse.referenceId; // On garde l'UUID pour le polling
//     }

//     // 3. Création Réservation
//     const newBooking = await prisma.booking.create({
//       data: {
//         reference: generateReference(),
//         totalPrice: finalPrice, // On enregistre le prix AVEC frais
//         status: bookingStatus, // PENDING ou PAID
//         paymentMethod: paymentMethod,
//         paymentId: paymentId, // UUID MTN
//         tripId: String(tripId),
//         userId: userId,
//         passengers: {
//           create: passengers.map((p) => ({
//             fullName: p.fullName,
//             type:
//               p.type && String(p.type).toLowerCase() === "adult"
//                 ? "ADULT"
//                 : "CHILD",
//             seatNumber: Number(p.seatId),
//           })),
//         },
//       },
//     });

//     // 4. Notifications (SEULEMENT SI DÉJÀ PAYÉ)
//     // Si c'est PENDING (MTN), on n'envoie RIEN maintenant. C'est l'API de vérification qui le fera.

//     if (bookingStatus === "PAID") {
//       // A. Email
//       if (body.contactInfo?.email) {
//         const emailHtml = `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//             <h2 style="color: #1e40af;">OCEAN DU NORD - Confirmation de Réservation</h2>
//             <p>Bonjour,</p>
//             <p>Votre réservation a été confirmée avec succès !</p>
//             <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
//               <h3>Détails de la réservation :</h3>
//               <p><strong>Référence :</strong> ${newBooking.reference}</p>
//               <p><strong>Trajet :</strong> ${trip.route.fromCity} → ${
//           trip.route.toCity
//         }</p>
//               <p><strong>Date et heure :</strong> ${new Date(
//                 trip.date
//               ).toLocaleDateString("fr-FR")} à ${new Date(
//           trip.date
//         ).toLocaleTimeString("fr-FR", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}</p>
//               <p><strong>Prix total :</strong> ${finalPrice} XAF</p>
//               <h4>Passagers :</h4>
//               <ul>
//                 ${passengers
//                   .map((p) => `<li>${p.fullName} (Siège ${p.seatId})</li>`)
//                   .join("")}
//               </ul>
//             </div>
//             <p>Nous vous souhaitons un agréable voyage !</p>
//             <p>Cordialement,<br>L'équipe Ocean du Nord</p>
//           </div>
//         `;

//         sendEmail({
//           to: body.contactInfo.email,
//           subject: `Confirmation de réservation - ${newBooking.reference}`,
//           html: emailHtml,
//         }).catch((err) => console.error("⚠️ Email échoué:", err.message));
//       }

//       // B. SMS (Immédiat)
//       if (body.contactInfo?.phone) {
//         const travelDateSimple = new Date(trip.date).toLocaleDateString(
//           "fr-FR",
//           { day: "2-digit", month: "2-digit" }
//         );
//         const travelTime = new Date(trip.date).toLocaleTimeString("fr-FR", {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         const smsMessage = `OCEAN DU NORD\nVoyage Confirmé ✅\nRéf: ${newBooking.reference}\nDe: ${trip.route.fromCity}\nVers: ${trip.route.toCity}\nLe: ${travelDateSimple} à ${travelTime}`;

//         sendSMS({
//           to: body.contactInfo.phone,
//           message: smsMessage,
//         }).catch((err) => console.error("⚠️ SMS échoué:", err.message));
//       }

//       // C. Points
//       if (userId) {
//         await prisma.user
//           .update({
//             where: { id: userId },
//             data: { points: { increment: Math.floor(finalPrice / 100) } },
//           })
//           .catch((e) => console.error(e));
//       }
//     }

//     // 5. Réponse au Frontend
//     // C'est ici que le frontend reçoit le signal pour commencer le polling
//     return NextResponse.json({
//       success: true,
//       bookingId: newBooking.id,
//       reference: newBooking.reference,
//       status: bookingStatus, // "PENDING"
//       paymentId: paymentId, // UUID
//     });
//   } catch (error) {
//     console.error("Erreur création:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
