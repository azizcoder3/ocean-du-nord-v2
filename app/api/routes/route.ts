import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // On récupère toutes les routes depuis la base de données
    const routes = await prisma.route.findMany({
      orderBy: {
        toCity: "asc", // On trie par ville d'arrivée alphabétique
      },
    });

    return NextResponse.json(routes);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors du chargement des routes" },
      { status: 500 }
    );
  }
}
