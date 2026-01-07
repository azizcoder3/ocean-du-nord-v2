// app/api/articles/latest/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Important pour ne pas mettre en cache statique

export async function GET() {
  try {
    console.log("Tentative de connexion à la DB pour les articles...");

    const latestArticles = await prisma.article.findMany({
      take: 3,
      orderBy: {
        publishedAt: "desc",
      },
      // On ne sélectionne que les champs nécessaires pour alléger la requête
      select: {
        id: true,
        title: true,
        slug: true,
        image: true,
        category: true,
        publishedAt: true,
      },
    });

    console.log(`Succès : ${latestArticles.length} articles trouvés.`);
    return NextResponse.json(latestArticles);
  } catch (error) {
    // C'est ici qu'on gère l'erreur de connexion DB
    console.error("❌ ERREUR CRITIQUE DB (Articles):", error);

    // Au lieu de planter (500), on renvoie un tableau vide.
    // Comme ça, le site continue de fonctionner, juste sans les actus.
    return NextResponse.json([], { status: 200 });
  }
}

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET() {
//   try {
//     const latestArticles = await prisma.article.findMany({
//       take: 3, // On ne prend que les 3 derniers
//       orderBy: {
//         publishedAt: 'desc' // Du plus récent au plus ancien
//       }
//     });

//     return NextResponse.json(latestArticles);
//   } catch (error) {
//     console.error(":", error) // Il faut ajouter du phrase dans ce console
//     return NextResponse.json({ error: "Erreur lors du chargement des articles" }, { status: 500 });
//   }
// }
