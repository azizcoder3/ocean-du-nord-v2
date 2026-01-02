//components/home/PopularRoutes.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Users, ArrowRight, Loader2 } from "lucide-react";

interface Route {
  id: string | number;
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
}

export default function PopularRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch("/api/routes"); // Ton API backend
        const data = await res.json();
        // On ne prend que les 4 premières pour l'accueil
        setRoutes(data.slice(0, 4));
      } catch (e) {
        console.error("Erreur chargement routes accueil", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPopular();
  }, []);

  // Fonction utilitaire pour l'image (en attendant le stockage en DB)
  const getImage = (city: string) => {
    if (city === "Pointe-Noire")
      return "https://images.unsplash.com/photo-1572985025096-724d2757ebbe?q=80&w=1000";
    if (city === "Cameroun")
      return "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1000";
    if (city === "Dolisie")
      return "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000";
    if (city === "Ouesso")
      return "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000";
    return "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000";
  };

  if (loading)
    return (
      <div className="py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos destinations{" "}
            <span className="text-primary">les plus prisées</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={getImage(route.toCity)}
                  alt={route.toCity}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* DOUBLE PRIX : Adulte et Enfant */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl font-bold text-primary shadow-sm border border-gray-100 text-xs text-right">
                  <div>Adulte : {route.priceAdult.toLocaleString()} F</div>
                  <div className="text-gray-500 font-normal">
                    Enfant : {route.priceChild.toLocaleString()} F
                  </div>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  {route.fromCity}{" "}
                  <ArrowRight className="w-4 h-4 text-gray-400" />{" "}
                  {route.toCity}
                </h3>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-6 border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-1.5 font-bold text-secondary">
                    <Clock className="w-4 h-4" /> {route.duration}
                  </div>
                  <span>Départs quotidiens</span>
                </div>

                <Link
                  href={`/destinations/${route.toCity
                    .toLowerCase()
                    .replace(" ", "-")}`}
                  className="w-full block text-center bg-gray-100 hover:bg-primary hover:text-white text-gray-900 font-semibold py-3 rounded-xl transition-colors"
                >
                  Détails & Réservation
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/destinations"
            className="text-primary font-bold hover:underline flex items-center justify-center gap-2"
          >
            Voir toutes les destinations <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
