// app/api/payment/check/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { checkMtnStatus } from "@/lib/mtn";
import { airtelMoneyProvider } from "@/lib/airtel"; // ✅ Import Airtel
import { sendSMS } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get("ref"); // C'est le paymentId stocké en DB

    if (!paymentId) {
      return NextResponse.json(
        { error: "Référence manquante" },
        { status: 400 }
      );
    }

    // 1. Chercher la réservation en base pour connaître le moyen de paiement utilisé
    const booking = await prisma.booking.findFirst({
      where: { paymentId: paymentId },
      include: { trip: { include: { route: true } } },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    let finalStatus = "PENDING";
    let reason = "";

    // 2. Interroger le bon fournisseur (MTN ou Airtel)
    if (booking.paymentMethod === "AIRTEL") {
      // --- LOGIQUE AIRTEL ---
      try {
        const airtelStatus = await airtelMoneyProvider.checkStatus(paymentId);

        // Unification des statuts pour le Frontend (Airtel utilise SUCCESS/FAILURE)
        if (airtelStatus === "SUCCESS") {
          finalStatus = "SUCCESSFUL";
        } else if (
          airtelStatus === "FAILURE" ||
          airtelStatus === "AM_FAILURE"
        ) {
          finalStatus = "FAILED";
          reason = "Transaction échouée côté Airtel";
        } else {
          finalStatus = "PENDING";
        }
      } catch (err) {
        console.error("Erreur check Airtel:", err);
        finalStatus = "PENDING";
      }
    } else {
      // --- LOGIQUE MTN (Défaut) ---
      const mtnResult = await checkMtnStatus(paymentId);
      if (mtnResult) {
        finalStatus = mtnResult.status; // SUCCESSFUL, PENDING, FAILED
        reason = mtnResult.reason || "";
      }
    }

    // 3. Si le paiement est réussi ("SUCCESSFUL"), on met à jour la base de données
    if (finalStatus === "SUCCESSFUL" && booking.status === "PENDING") {
      console.log(
        `💰 Paiement validé (${booking.paymentMethod}) pour la résa ${booking.reference}`
      );

      // A. Mise à jour DB
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "PAID" },
      });

      // B. Préparation et Envoi du SMS
      const travelDate = new Date(booking.trip.date).toLocaleDateString(
        "fr-FR",
        { day: "2-digit", month: "2-digit" }
      );
      const travelTime = new Date(booking.trip.date).toLocaleTimeString(
        "fr-FR",
        { hour: "2-digit", minute: "2-digit" }
      );

      const smsMessage = `OCEAN DU NORD\nPaiement Reçu ✅\nRéf: ${booking.reference}\nTrajet: ${booking.trip.route.fromCity}->${booking.trip.route.toCity}\nLe: ${travelDate} à ${travelTime}`;

      // Récupération du numéro de téléphone
      // On regarde d'abord si un utilisateur est lié, sinon on pourrait stocker le téléphone dans la table Booking
      if (booking.userId) {
        const user = await prisma.user.findUnique({
          where: { id: booking.userId },
        });
        if (user?.phone) {
          sendSMS({ to: user.phone, message: smsMessage }).catch((e) =>
            console.error("SMS Error", e)
          );
        }
      }
    }

    // 4. On renvoie le statut unifié au Frontend
    return NextResponse.json({
      status: finalStatus, // "SUCCESSFUL" | "PENDING" | "FAILED"
      reason: reason,
    });
  } catch (error) {
    console.error("Erreur globale check payment:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// // app/api/payment/check/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { checkMtnStatus } from "@/lib/mtn";
// import { sendSMS } from "@/lib/sms";

// export const dynamic = "force-dynamic";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const referenceId = searchParams.get("ref");

//     if (!referenceId) {
//       return NextResponse.json(
//         { error: "Référence manquante" },
//         { status: 400 }
//       );
//     }

//     // 1. Interroger MTN
//     const mtnResult = await checkMtnStatus(referenceId);

//     if (!mtnResult) {
//       return NextResponse.json({ status: "PENDING" }); // En cas d'erreur MTN, on dit d'attendre
//     }

//     // 2. Si le paiement est réussi, on met à jour la base de données
//     if (mtnResult.status === "SUCCESSFUL") {
//       // On cherche la réservation liée à ce paiement
//       const booking = await prisma.booking.findFirst({
//         where: { paymentId: referenceId },
//         include: { trip: { include: { route: true } } },
//       });

//       if (booking) {
//         // IMPORTANT : On ne met à jour que si elle n'est pas déjà payée
//         // (Pour éviter d'envoyer 2 fois le SMS si le client clique vite)
//         if (booking.status === "PENDING") {
//           console.log(`💰 Paiement validé pour la résa ${booking.reference}`);

//           // A. Mise à jour DB
//           await prisma.booking.update({
//             where: { id: booking.id },
//             data: { status: "PAID" },
//           });

//           // B. Envoi du SMS de confirmation (Fire and Forget)
//           // On reconstruit le message car on est dans une nouvelle requête
//           const travelDate = new Date(booking.trip.date).toLocaleDateString(
//             "fr-FR",
//             { day: "2-digit", month: "2-digit" }
//           );
//           const travelTime = new Date(booking.trip.date).toLocaleTimeString(
//             "fr-FR",
//             { hour: "2-digit", minute: "2-digit" }
//           );

//           const smsMessage = `OCEAN DU NORD\nPaiement Reçu ✅\nRéf: ${booking.reference}\nTrajet: ${booking.trip.route.fromCity}->${booking.trip.route.toCity}\nLe: ${travelDate} à ${travelTime}`;

//           // On tente d'envoyer le SMS (si un numéro était lié au compte utilisateur ou stocké ailleurs)
//           // Note: Dans ta structure actuelle, le téléphone est dans 'contactInfo' qui n'est pas stocké en clair dans Booking,
//           // mais souvent on peut le récupérer via le User lié ou on l'avait passé.
//           // Pour simplifier ici, on suppose qu'on récupère le numéro du User si lié :
//           if (booking.userId) {
//             const user = await prisma.user.findUnique({
//               where: { id: booking.userId },
//             });
//             if (user?.phone) {
//               sendSMS({ to: user.phone, message: smsMessage }).catch((e) =>
//                 console.error("SMS Error", e)
//               );
//             }
//           }
//           // Si tu stockes le téléphone de contact dans la réservation (ce serait mieux pour les invités), tu l'utiliserais ici.
//         }
//       }
//     }

//     // 3. On renvoie le statut au Frontend
//     return NextResponse.json({
//       status: mtnResult.status, // SUCCESSFUL, PENDING, FAILED
//       reason: mtnResult.reason,
//     });
//   } catch (error) {
//     console.error("Erreur check payment:", error);
//     return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
//   }
// }
