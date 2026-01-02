// Fichier : app/api/profile/bookings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Vérifier la session
    const session = await auth();

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Trouver l'utilisateur via son téléphone (stocké dans email)
    const user = await prisma.user.findUnique({
      where: { phone: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // 3. Récupérer l'historique
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        trip: {
          include: {
            route: true, // Pour avoir : Brazzaville -> Pointe-Noire
            bus: true, // Pour avoir : Yutong VIP
          },
        },
        passengers: true, // Pour compter les passagers
      },
      orderBy: {
        createdAt: "desc", // Les plus récents en premier
      },
    });

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    console.error("Erreur profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
