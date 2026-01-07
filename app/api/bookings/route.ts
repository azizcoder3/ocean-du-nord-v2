// Fichier : app/api/bookings/route.ts
// Fichier : app/api/bookings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/mail";
import { sendSMS } from "@/lib/sms";
import { initMtnPayment } from "@/lib/mtn"; // <--- NOUVEAU : Import MTN

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
    let bookingStatus: "PENDING" | "PAID" = "PAID"; // Par défaut "Payé" (si cash/autre)
    let paymentId = null;
    let finalPrice = totalPrice;

    // SI C'EST MTN : ON MET EN ATTENTE ET ON APPELLE L'API
    if (paymentMethod === "MTN") {
      bookingStatus = "PENDING"; // On bloque la validation

      // On recalcule les frais (Prix + 2%)
      const fees = Math.ceil(totalPrice * FEE_PERCENT);
      finalPrice = totalPrice + fees;

      const phoneToBill = body.contactInfo?.phone || "";

      console.log(`📡 Init MTN pour ${finalPrice} XAF vers ${phoneToBill}`);

      // Appel API MTN
      const mtnResponse = await initMtnPayment(finalPrice, phoneToBill);

      if (!mtnResponse.success) {
        return NextResponse.json(
          { error: "Échec initialisation MTN. Vérifiez le numéro." },
          { status: 502 }
        );
      }

      paymentId = mtnResponse.referenceId; // On garde l'UUID pour le polling
    }

    // 3. Création Réservation
    const newBooking = await prisma.booking.create({
      data: {
        reference: generateReference(),
        totalPrice: finalPrice, // On enregistre le prix AVEC frais
        status: bookingStatus, // PENDING ou PAID
        paymentMethod: paymentMethod,
        paymentId: paymentId, // UUID MTN
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

    // 4. Notifications (SEULEMENT SI DÉJÀ PAYÉ)
    // Si c'est PENDING (MTN), on n'envoie RIEN maintenant. C'est l'API de vérification qui le fera.

    if (bookingStatus === "PAID") {
      // A. Email
      if (body.contactInfo?.email) {
        // ... (Code Email standard) ...
        // Pour alléger le code ici, je ne remets pas tout le HTML,
        // mais imagine que ton code sendEmail est ici.
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
    // C'est ici que le frontend reçoit le signal pour commencer le polling
    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      reference: newBooking.reference,
      status: bookingStatus, // "PENDING"
      paymentId: paymentId, // UUID
    });
  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { auth } from "@/auth"; // Import de l'authentification
// import { sendEmail } from "@/lib/mail"; // Import de la fonction d'envoi d'email
// import { sendSMS } from "@/lib/sms";

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

//     // 1. Validation
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
//         route: true, // Include the route relation to access fromCity and toCity
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

//     const hasConflict = requestedSeats.some((seat) =>
//       occupiedSeats.includes(seat)
//     );
//     if (hasConflict) {
//       return NextResponse.json(
//         { error: "Un ou plusieurs sièges ont déjà été réservés." },
//         { status: 409 }
//       );
//     }

//     // --- GESTION UTILISATEUR CONNECTÉ ---
//     let userId = null;
//     const session = await auth();

//     if (session && session.user && session.user.email) {
//       const user = await prisma.user.findUnique({
//         where: { phone: session.user.email },
//       });
//       if (user) {
//         userId = user.id;
//       }
//     }

//     // 3. Création Réservation
//     const newBooking = await prisma.booking.create({
//       data: {
//         reference: generateReference(),
//         totalPrice: totalPrice,
//         status: "PAID",
//         paymentMethod: paymentMethod,
//         tripId: String(tripId),
//         userId: userId, // On lie la réservation au compte ici
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

//     // Préparation des formats de date pour les notifications
//     const travelDateSimple = new Date(trip.date).toLocaleDateString("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//     });
//     const travelTime = new Date(trip.date).toLocaleTimeString("fr-FR", {
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//     // 4. Envoi du billet par Email si le client a fourni une adresse
//     if (body.contactInfo?.email) {
//       const { fromCity, toCity } = trip.route;
//       const travelDate = new Date(trip.date).toLocaleDateString("fr-FR", {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       });

//       await sendEmail({
//         to: body.contactInfo.email,
//         subject: `Votre Billet Océan du Nord - Réf: ${newBooking.reference}`,
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
//             <div style="background-color: #064e3b; color: white; pading: 20px; text-align: center;">
//               <h1 style="margin: 0;">OCEAN DU NORD</h1>
//               <p style="margin: 5px 0 0 0; opacity: 0.8;">République du Congo</p>
//             </div>
//             <div style="padding: 30px;">
//               <h2 style="color: #333;">Confirmation de Réservation</h2>
//               <p>Bonjour,</p>
//               <p>Merci d'avoir choisi Océan du Nord. Votre voyage est confirmé.</p>

//               <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
//                 <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Référence du billet</p>
//                 <p style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 5px 0;">${
//                   newBooking.reference
//                 }</p>

//                 <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">

//                 <p><strong>Trajet :</strong> ${fromCity} ➔ ${toCity}</p>
//                 <p><strong>Date :</strong> ${travelDate}</p>
//                 <p><strong>Départ :</strong> ${new Date(
//                   trip.date
//                 ).toLocaleTimeString("fr-FR", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                 })}</p>
//               </div>

//               <p style="font-size: 14px; color: #666;">
//                 <strong>Note importante :</strong> Veuillez vous présenter à l'agence de départ 2 jours avant le voyage pour retirer votre ticket physique muni de cette référence.
//               </p>
//             </div>
//             <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
//               © 2025 Océan du Nord - Sécurité • Confort • Fiabilité
//             </div>
//           </div>
//         `,
//       });
//     }

//     // 5. [OPTIMISÉ] Envoi SMS en arrière-plan (Non-bloquant) 🚀
//     if (body.contactInfo?.phone) {
//       const smsMessage = `OCEAN DU NORD\nVoyage Confirmé ✅\nRéf: ${newBooking.reference}\nDe: ${trip.route.fromCity}\nVers: ${trip.route.toCity}\nLe: ${travelDateSimple} à ${travelTime}\nPrésentez cette Réf à l'agence.`;

//       // On lance l'envoi SANS "await". Le code continue immédiatement.
//       // Si ça échoue dans 30s, ça s'affichera dans la console serveur, mais le client aura déjà son billet.
//       sendSMS({
//         to: body.contactInfo.phone,
//         message: smsMessage,
//       }).catch((err) =>
//         console.error("⚠️ SMS échoué (Background):", err.message)
//       );
//     }

//     // // 5. [NOUVEAU] Envoi de la confirmation par SMS 📱
//     // if (body.contactInfo?.phone) {
//     //   // On construit un message court et efficace (max 160 caractères idéalement)
//     //   const smsMessage = `OCEAN DU NORD\nVoyage Confirmé ✅\nRéf: ${newBooking.reference}\nDe: ${trip.route.fromCity}\nVers: ${trip.route.toCity}\nLe: ${travelDateSimple} à ${travelTime}\nPrésentez cette Réf à l'agence.`;

//     //   // On appelle la fonction sans "await" bloquant strict, ou avec un catch pour ne pas échouer la requête si Twilio échoue
//     //   try {
//     //     await sendSMS({
//     //       to: body.contactInfo.phone,
//     //       message: smsMessage,
//     //     });
//     //   } catch (smsError) {
//     //     console.error("Erreur lors de l'envoi du SMS:", smsError);
//     //     // On continue, car la réservation est valide même si le SMS échoue
//     //   }
//     // }

//     // --- INTÉGRATION DES POINTS ONC ---
//     // Si l'utilisateur est connecté (userId existe), on met à jour ses points
//     if (userId) {
//       try {
//         await prisma.user.update({
//           where: { id: userId },
//           data: {
//             // On utilise l'opérateur 'increment' de Prisma pour ajouter aux points existants
//             // Exemple : 1% du prix payé (totalPrice / 100)
//             points: { increment: Math.floor(totalPrice / 100) },
//           },
//         });
//         console.log(
//           `Points de fidélité mis à jour pour l'utilisateur ${userId}`
//         );
//       } catch (pointError) {
//         // On log l'erreur mais on ne bloque pas la réponse (la réservation est déjà créée)
//         console.error("Erreur mise à jour points de fidélité:", pointError);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       bookingId: newBooking.id,
//       reference: newBooking.reference,
//     });
//   } catch (error) {
//     console.error("Erreur création:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
