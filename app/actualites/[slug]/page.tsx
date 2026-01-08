import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Facebook,
  Twitter,
  Linkedin,
  Share2,
} from "lucide-react";

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

// --- 2. DÉFINITION DES PROPS ---
type Props = {
  params: Promise<{ slug: string }>;
};

// --- 3. COMPOSANT PRINCIPAL ---
export default async function ArticleDetailPage({ params }: Props) {
  // Récupération asynchrone des paramètres (Next.js 15+)
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Récupération de l'article depuis la base de données
  const article = await prisma.article.findUnique({
    where: { slug },
  });

  // Si l'article n'existe pas, retourner une page 404
  if (!article) {
    return notFound();
  }

  // Formater la date
  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "fr-FR",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-white pt-20">
      {/* A. HERO IMAGE (En-tête de l'article) */}
      <div className="relative h-[60vh] w-full min-h-100">
        <Image
          src={
            article.image ||
            "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
          }
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay sombre pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-md">
              {article.title}
            </h1>

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300 text-sm font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-secondary" /> {formattedDate}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" /> {article.author}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary" /> 3 min de lecture
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* B. CONTENU DE L'ARTICLE */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100">
          {/* Corps du texte */}
          <div className="prose prose-lg prose-green max-w-none text-gray-600 leading-relaxed">
            {article.content}
          </div>

          {/* Barre de partage */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-bold text-gray-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-secondary" />
              Partager cet article
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-transform hover:scale-110 shadow-sm">
                <Facebook className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-transform hover:scale-110 shadow-sm">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-90 transition-transform hover:scale-110 shadow-sm">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* C. BOUTON RETOUR */}
        <div className="mt-12 text-center">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 font-bold hover:bg-gray-50 hover:text-primary transition-all shadow-sm hover:shadow-md group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Retour aux actualités
          </Link>
        </div>
      </div>
    </main>
  );
}
