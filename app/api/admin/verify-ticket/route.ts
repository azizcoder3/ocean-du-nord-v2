import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || session.user?.role === "USER") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { reference } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { reference },
      include: { passengers: true, trip: { include: { route: true } } },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Billet introuvable" },
        { status: 404 }
      );
    }

    if (booking.status === "USED") {
      return NextResponse.json(
        {
          error: "ATTENTION : Ce billet a déjà été scanné !",
          booking,
        },
        { status: 400 }
      );
    }

    // CORRECTION ICI : On ajoute 'include' pour récupérer TOUTES les infos après la mise à jour
    const updatedBooking = await prisma.booking.update({
      where: { reference },
      data: { status: "USED" },
      include: {
        passengers: true,
        trip: { include: { route: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Billet validé avec succès",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du billet :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
