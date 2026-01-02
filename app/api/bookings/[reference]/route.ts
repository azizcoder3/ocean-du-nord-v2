import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Correction de l'import (Default import)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    // On attend la résolution des paramètres (Next.js 15+)
    const { reference } = await params;

    if (!reference) {
      return NextResponse.json(
        { error: "Référence manquante" },
        { status: 400 }
      );
    }

    // Recherche en base de données
    const booking = await prisma.booking.findUnique({
      where: { reference: reference },
      include: {
        passengers: true,
        trip: {
          include: {
            route: true,
            bus: true,
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Réservation introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error: unknown) {
    // Correction de l'erreur "any" : on utilise unknown + vérification de type
    const message =
      error instanceof Error
        ? error.message
        : "Une erreur inconnue est survenue";

    console.error("Erreur serveur API Booking:", message);

    return NextResponse.json(
      { error: "Erreur interne du serveur", details: message },
      { status: 500 }
    );
  }
}
