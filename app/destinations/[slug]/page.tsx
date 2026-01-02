import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  Clock,
  MapPin,
  Info,
  CheckCircle,
  Calendar,
  Bus,
  Briefcase,
  Map,
  Phone,
} from "lucide-react";

import ReviewsSection from "@/components/destination/ReviewsSection";
import RelatedTrips from "@/components/destination/RelatedTrips";

// --- UTILITAIRES ---

const getImageForCity = (cityName: string) => {
  const images: Record<string, string> = {
    "Pointe-Noire": "/images/belle-souvenir.jpg",
    "Dolisie": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
    "Ouesso": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
    "Oyo": "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000",
    "Cameroun": "https://images.unsplash.com/photo-1523539693385-e5e8995777df?q=80&w=1000"
  };
  return images[cityName] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000";
};

// Données statiques complémentaires (Agences/Détails) pour les villes connues
// À terme, ces informations pourraient être déplacées en base de données

interface AgencyStop {
  city: string;
  stops: string[];
  phone: string;
}

interface ExtraContent {
  subtitle: string;
  about: string;
  highlights: string[];
  agencies: {
    departure: AgencyStop;
    arrival: AgencyStop;
  } | null;
}

const EXTRA_CONTENT: Record<string, ExtraContent> = {
  "pointe-noire": {
    subtitle: "La capitale économique et ville balnéaire par excellence.",
    about: "Le trajet vers Pointe-Noire est l'une de nos lignes les plus fréquentées. Nos bus climatisés assurent la liaison quotidiennement en garantissant un confort optimal.",
    highlights: ["Plage de la Côte Sauvage", "Gare CFCO", "Marché du Plateau", "Port Autonome"],
    agencies: {
      departure: { city: "Brazzaville", stops: ["Mikalou", "Moungali", "Moukondo", "Makélékélé"], phone: "06 990 1906" },
      arrival: { city: "Pointe-Noire", stops: ["Nkouinkou", "Voungou", "Tiétié", "Ngoyo"], phone: "N/D" }
    }
  }
};

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function DestinationDetail({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 1. On transforme le slug en nom de ville (ex: "pointe-noire" -> "Pointe-Noire")
  const cityName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  // 2. RECHERCHE EN BASE DE DONNÉES
  const route = await prisma.route.findFirst({
    where: {
      toCity: { equals: cityName, mode: 'insensitive' }
    }
  });

  // Si la route n'existe pas en base, on affiche une page 404
  if (!route) {
    notFound();
  }

  // 3. Préparation du contenu (Mix entre DB et contenu statique)
  const extra = EXTRA_CONTENT[slug] || {
    subtitle: `Découvrez la liaison vers ${route.toCity}.`,
    about: `Voyagez en toute sécurité entre ${route.fromCity} et ${route.toCity} avec Océan du Nord.`,
    highlights: ["Service client 24h/24", "Bus confortables", "Sécurité garantie"],
    agencies: null
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20 pt-20">
      {/* 1. HERO BANNER DYNAMIQUE */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={getImageForCity(route.toCity)}
          alt={`Voyage vers ${route.toCity}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end pb-12 px-4">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <span className="bg-secondary text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4 inline-block shadow-sm">
              Ligne Officielle
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
              Voyagez vers {route.toCity}
            </h1>
            <p className="text-gray-100 text-lg max-w-2xl leading-relaxed">
              {extra.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Stats depuis la DB */}
            <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap gap-6 items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Durée</p>
                  <p className="font-bold text-gray-900 text-lg">{route.duration || "N/A"}</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-full">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Distance</p>
                  <p className="font-bold text-gray-900 text-lg">{route.distance} km</p>
                </div>
              </div>
              <div className="w-px h-10 bg-gray-100 hidden md:block"></div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-full">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Fréquence</p>
                  <p className="font-bold text-gray-900 text-lg">Quotidien</p>
                </div>
              </div>
            </div>

            {/* Contenu dynamique */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos du trajet</h2>
              <p className="text-gray-600 leading-relaxed mb-8">{extra.about}</p>

              <h3 className="text-lg font-bold text-gray-900 mb-4">Points d&apos;intérêts à {route.toCity}</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                {extra.highlights.map((point: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-600">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agences (si disponibles) */}
            {extra.agencies && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Map className="w-6 h-6 text-primary" /> Agences et Points d&apos;arrêt
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">Départ {extra.agencies.departure.city}</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {extra.agencies.departure.stops.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> {s}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t flex items-center gap-2 text-primary font-bold">
                        <Phone className="w-4 h-4"/> {extra.agencies.departure.phone}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-primary mb-4 border-b pb-2">Arrivée {extra.agencies.arrival.city}</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      {extra.agencies.arrival.stops.map((s: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <ReviewsSection />
          </div>

          {/* --- COLONNE DROITE : RÉSERVATION DYNAMIQUE --- */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Tarifs par personne</h3>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl mb-3">
                <span className="font-semibold text-gray-600 text-lg">Adulte</span>
                <div className="text-xl font-bold text-primary">
                  {route.priceAdult.toLocaleString()} <span className="text-xs text-gray-500 font-normal">FCFA</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl mb-8">
                <span className="font-semibold text-gray-600 text-lg">Enfant</span>
                <div className="text-xl font-bold text-primary">
                  {route.priceChild.toLocaleString()} <span className="text-xs text-gray-500 font-normal">FCFA</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 mb-6 hover:border-secondary transition-colors bg-white">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1 block">Date de voyage</label>
                <div className="flex items-center justify-between gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <input type="date" className="bg-transparent font-bold text-gray-900 outline-none w-full cursor-pointer text-sm" />
                </div>
              </div>

              <Link
                href={`/booking?from=${route.fromCity}&to=${route.toCity}`}
                className="block w-full bg-secondary hover:bg-amber-600 text-white font-bold text-center py-4 rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 text-lg"
              >
                Réserver un Billet
              </Link>

              <div className="mt-8 pt-4 border-t border-gray-100 text-center space-y-3">
                <p className="text-xs text-gray-400">Paiement 100% sécurisé via</p>
                <div className="flex justify-center gap-3">
                  <div className="px-3 py-1 bg-[#ffcc00] text-black text-[10px] font-bold rounded shadow-sm">MTN</div>
                  <div className="px-3 py-1 bg-[#ff0000] text-white text-[10px] font-bold rounded shadow-sm">AIRTEL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RelatedTrips />
    </main>
  );
}