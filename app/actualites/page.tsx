//actualites/page.tsx
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Megaphone, Clock } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ActualitesPage() {
  // Récupérer les articles depuis la base de données
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  // Formater les articles pour correspondre à l'interface attendue
  const formattedArticles = articles.map((article) => ({
    id: article.slug,
    title: article.title,
    category: article.category,
    date: new Date(article.publishedAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    image:
      article.image ||
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    excerpt: article.content.substring(0, 100) + "...",
    isFeatured: article.isFeatured,
  }));

  // Récupérer l'article en vedette pour le Flash Info, ou le plus récent par défaut
  const featuredArticle =
    articles.find((article) => article.isFeatured) || articles[0];
  const otherArticles = articles.filter(
    (article) => article.id !== featuredArticle?.id
  );

  // Formater les autres articles pour la grille
  const formattedOtherArticles = otherArticles.map((article) => ({
    id: article.slug,
    title: article.title,
    category: article.category,
    date: new Date(article.publishedAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    image:
      article.image ||
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop",
    excerpt: article.content.substring(0, 100) + "...",
    isFeatured: article.isFeatured,
  }));
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* 1. Header Simple */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">
            Blog & Informations
          </span>
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            L&apos;Actualité Océan du Nord
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Restez informés des dernières nouveautés, des nouvelles lignes et de
            la vie de votre compagnie de transport préférée.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* 2. ARTICLE EN VEDETTE (Dynamique) */}
        {featuredArticle && (
          <div className="mb-16 animate-fade-in-up">
            <div className="group relative rounded-3xl overflow-hidden shadow-xl bg-white grid grid-cols-1 lg:grid-cols-2 min-h-125">
              {/* Image */}
              <div className="relative h-64 lg:h-full overflow-hidden">
                <Image
                  src={
                    featuredArticle.image ||
                    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop"
                  }
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-4 py-1 rounded-full text-sm shadow-lg flex items-center gap-2">
                  <Megaphone className="w-4 h-4" /> FLASH INFO
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />{" "}
                    {new Date(featuredArticle.publishedAt).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span className="text-secondary font-bold uppercase">
                    {featuredArticle.category}
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  {featuredArticle.title}
                </h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {featuredArticle.content.substring(0, 150)}
                  {featuredArticle.content.length > 150 ? "..." : ""}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-secondary/20"
                  >
                    Réserver ce trajet
                  </Link>

                  {/* --- LIEN DYNAMIQUE AVEC SLUG --- */}
                  <Link
                    href={`/actualites/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 text-gray-600 font-bold hover:text-primary transition-colors py-3 px-4"
                  >
                    Lire l&apos;article complet{" "}
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. GRILLE DES AUTRES ARTICLES (en excluant le Flash Info) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {formattedOtherArticles.map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col h-full"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide">
                  {article.category}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-medium">
                  <Clock className="w-3 h-3" />
                  {article.date}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                  {article.excerpt}
                </p>

                {/* --- CORRECTION ICI : LIEN DYNAMIQUE --- */}
                {/* Comme article.id est maintenant "nouveaux-bus-yutong-vip", le lien sera correct */}
                <Link
                  href={`/actualites/${article.id}`}
                  className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Lire la suite <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* 4. NEWSLETTER */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ne manquez aucune info
            </h2>
            <p className="text-gray-400 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir nos promotions
              exclusives et les informations sur le trafic routier.
            </p>

            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-secondary focus:bg-white/20 backdrop-blur-sm transition-all"
              />
              <button className="px-8 py-4 bg-secondary hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-secondary/20">
                S&apos;abonner
              </button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              Pas de spam, désinscription à tout moment.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
