// Fichier : app/api/bookings/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth"; // Import de l'authentification
import { sendEmail } from "@/lib/mail"; // Import de la fonction d'envoi d'email

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

    // 1. Validation
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
        route: true, // Include the route relation to access fromCity and toCity
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

    const hasConflict = requestedSeats.some((seat) =>
      occupiedSeats.includes(seat)
    );
    if (hasConflict) {
      return NextResponse.json(
        { error: "Un ou plusieurs sièges ont déjà été réservés." },
        { status: 409 }
      );
    }

    // --- GESTION UTILISATEUR CONNECTÉ ---
    let userId = null;
    const session = await auth();

    if (session && session.user && session.user.email) {
      const user = await prisma.user.findUnique({
        where: { phone: session.user.email },
      });
      if (user) {
        userId = user.id;
      }
    }

    // 3. Création Réservation
    const newBooking = await prisma.booking.create({
      data: {
        reference: generateReference(),
        totalPrice: totalPrice,
        status: "PAID",
        paymentMethod: paymentMethod,
        tripId: String(tripId),
        userId: userId, // On lie la réservation au compte ici
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

    // 4. Envoi du billet par Email si le client a fourni une adresse
    if (body.contactInfo?.email) {
      const { fromCity, toCity } = trip.route;
      const travelDate = new Date(trip.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      await sendEmail({
        to: body.contactInfo.email,
        subject: `Votre Billet Océan du Nord - Réf: ${newBooking.reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #064e3b; color: white; pading: 20px; text-align: center;">
              <h1 style="margin: 0;">OCEAN DU NORD</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.8;">République du Congo</p>
            </div>
            <div style="padding: 30px;">
              <h2 style="color: #333;">Confirmation de Réservation</h2>
              <p>Bonjour,</p>
              <p>Merci d'avoir choisi Océan du Nord. Votre voyage est confirmé.</p>
              
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase;">Référence du billet</p>
                <p style="font-size: 24px; font-weight: bold; color: #f59e0b; margin: 5px 0;">${
                  newBooking.reference
                }</p>
                
                <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
                
                <p><strong>Trajet :</strong> ${fromCity} ➔ ${toCity}</p>
                <p><strong>Date :</strong> ${travelDate}</p>
                <p><strong>Départ :</strong> ${new Date(
                  trip.date
                ).toLocaleTimeString("fr-FR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}</p>
              </div>

              <p style="font-size: 14px; color: #666;">
                <strong>Note importante :</strong> Veuillez vous présenter à l'agence de départ 2 jours avant le voyage pour retirer votre ticket physique muni de cette référence.
              </p>
            </div>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #999;">
              © 2025 Océan du Nord - Sécurité • Confort • Fiabilité
            </div>
          </div>
        `,
      });
    }

    // --- INTÉGRATION DES POINTS ONC ---
    // Si l'utilisateur est connecté (userId existe), on met à jour ses points
    if (userId) {
      try {
        await prisma.user.update({
          where: { id: userId },
          data: {
            // On utilise l'opérateur 'increment' de Prisma pour ajouter aux points existants
            // Exemple : 1% du prix payé (totalPrice / 100)
            points: { increment: Math.floor(totalPrice / 100) },
          },
        });
        console.log(
          `Points de fidélité mis à jour pour l'utilisateur ${userId}`
        );
      } catch (pointError) {
        // On log l'erreur mais on ne bloque pas la réponse (la réservation est déjà créée)
        console.error("Erreur mise à jour points de fidélité:", pointError);
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: newBooking.id,
      reference: newBooking.reference,
    });
  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
