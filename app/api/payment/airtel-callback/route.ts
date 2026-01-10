// app/api/payment/airtel-callback/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("📩 Rappel Airtel reçu :", JSON.stringify(body, null, 2));

    /**
     * Structure typique du body Airtel :
     * {
     *   "transaction": {
     *     "id": "UG230101.1234.H12345", // ID Airtel (paymentId en DB)
     *     "status": "SUCCESS",
     *     "message": "Transaction Success",
     *     "reference_id": "ODN-ABCD" // Notre référence interne
     *   }
     * }
     */

    const { transaction } = body;

    if (!transaction || !transaction.id) {
      return NextResponse.json(
        { message: "Données invalides" },
        { status: 400 }
      );
    }

    // 1. Chercher la réservation liée à cet ID de transaction Airtel
    const booking = await prisma.booking.findFirst({
      where: { paymentId: transaction.id },
      include: {
        trip: { include: { route: true } },
        passengers: true,
      },
    });

    if (!booking) {
      console.error(
        "❌ Réservation introuvable pour le paymentId:",
        transaction.id
      );
      return NextResponse.json(
        { message: "Réservation introuvable" },
        { status: 404 }
      );
    }

    // 2. Si le statut est SUCCESS et que la résa est encore PENDING
    if (transaction.status === "SUCCESS" && booking.status === "PENDING") {
      // A. Mettre à jour le statut en base de données
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "PAID" },
      });

      console.log(
        `✅ Réservation ${booking.reference} confirmée via Rappel Airtel`
      );

      // B. Envoyer le SMS de confirmation
      const travelDate = new Date(booking.trip.date).toLocaleDateString(
        "fr-FR",
        { day: "2-digit", month: "2-digit" }
      );
      const travelTime = new Date(booking.trip.date).toLocaleTimeString(
        "fr-FR",
        { hour: "2-digit", minute: "2-digit" }
      );

      const smsMessage = `OCEAN DU NORD\nPaiement Airtel Reçu ✅\nRéf: ${booking.reference}\nDépart: ${travelDate} à ${travelTime}`;

      // Récupération du numéro (On suppose que le premier passager ou le user a un numéro)
      // Note: Vous pouvez améliorer cela en stockant le téléphone de contact dans la table Booking
      const user = booking.userId
        ? await prisma.user.findUnique({ where: { id: booking.userId } })
        : null;
      const phone = user?.phone;

      if (phone) {
        await sendSMS({ to: phone, message: smsMessage }).catch((e) =>
          console.error("Erreur SMS Callback:", e)
        );
      }
    }

    // Airtel attend une réponse 200 OK pour arrêter de renvoyer la notification
    return NextResponse.json({ status: "ACKNOWLEDGED" }, { status: 200 });
  } catch (error) {
    console.error("❌ Erreur dans le Callback Airtel :", error);
    // On renvoie quand même un 200 à Airtel pour éviter les boucles de tentatives en cas d'erreur de logique interne
    return NextResponse.json({ error: "Internal Error" }, { status: 200 });
  }
}

// Airtel peut parfois envoyer un GET pour vérifier si l'URL existe
export async function GET() {
  return NextResponse.json({ status: "Airtel Callback is active" });
}
