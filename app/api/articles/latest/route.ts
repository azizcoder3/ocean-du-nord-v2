import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const latestArticles = await prisma.article.findMany({
      take: 3, // On ne prend que les 3 derniers
      orderBy: {
        publishedAt: 'desc' // Du plus récent au plus ancien
      }
    });

    return NextResponse.json(latestArticles);
  } catch (error) {
    console.error(":", error) // Il faut ajouter du phrase dans ce console
    return NextResponse.json({ error: "Erreur lors du chargement des articles" }, { status: 500 });
  }
}