"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  category: string;
  publishedAt: string;
}

export default function LatestNews() {
  // On initialise avec un tableau vide pour éviter les erreurs "undefined"
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch("/api/articles/latest");

        // 1. On vérifie si la réponse HTTP est OK (Code 200)
        if (!res.ok) {
          throw new Error(`Erreur API: ${res.status}`);
        }

        const data = await res.json();

        // 2. SÉCURITÉ : On vérifie que 'data' est bien un tableau (Array)
        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          console.error(
            "Format de données invalide reçu pour les articles:",
            data
          );
          setArticles([]); // En cas de doute, on garde un tableau vide
        }
      } catch (e) {
        console.error("Impossible de charger les actus:", e);
        setArticles([]); // En cas d'erreur, tableau vide pour ne pas crasher l'UI
      } finally {
        setLoading(false);
      }
    }
    fetchLatest();
  }, []);

  // Ces vérifications fonctionneront maintenant sans planter car articles est garanti d'être un tableau
  if (loading) return null;
  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Actualités & <span className="text-primary">Nouveautés</span>
            </h2>
            <p className="text-gray-500 mt-2">
              Suivez la vie de la compagnie Océan du Nord.
            </p>
          </div>
          <Link
            href="/actualites"
            className="hidden md:flex items-center gap-2 text-primary font-bold hover:underline"
          >
            Voir tout le blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link
              href={`/actualites/${article.slug}`}
              key={article.id}
              className="group"
            >
              <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={
                    article.image ||
                    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000"
                  }
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-primary uppercase">
                  {article.category}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <Calendar className="w-3 h-3" />
                {new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                })}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>

        <div className="mt-10 md:hidden text-center">
          <Link
            href="/actualites"
            className="text-primary font-bold inline-flex items-center gap-2"
          >
            Tout le blog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
