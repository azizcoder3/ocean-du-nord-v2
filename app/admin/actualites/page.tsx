import prisma from "@/lib/prisma";
import ArticleTable from "./ArticleTable";
import AddArticleForm from "./AddArticleForm";

export default async function AdminActualitesPage() {
  // Récupérer les articles depuis la DB
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des Actualités
        </h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold">
          {articles.length} Articles publiés
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORMULAIRE D'AJOUT (Colonne droite sur large écran) */}
        <div className="xl:col-span-1">
          <AddArticleForm />
        </div>

        {/* LISTE DES ARTICLES (Colonne gauche) */}
        <div className="xl:col-span-2">
          <ArticleTable articles={articles} />
        </div>
      </div>
    </div>
  );
}
