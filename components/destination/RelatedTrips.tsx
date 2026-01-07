import Image from "next/image";
import Link from "next/link";
import { Calendar, Bus } from "lucide-react";

// Définir le type Route manuellement pour éviter les problèmes d'import
type RouteDetails =
  | {
      about?: string;
      departureAgency?: {
        name?: string;
        phone?: string;
      };
      arrivalAgency?: {
        name?: string;
        phone?: string;
      };
      departureStops?: string[];
      arrivalStops?: string[];
      technicalDetails?: {
        busType?: string;
        allowedBaggage?: string;
        onboardServices?: string[];
        usualDepartureTime?: string;
      };
      [key: string]: unknown;
    }
  | string
  | number
  | boolean
  | { [key: string]: unknown }
  | unknown[];

interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  distance: number;
  duration: string;
  priceAdult: number;
  priceChild: number;
  image: string | null;
  details: RouteDetails | null;
}

// Props pour le composant
interface RelatedTripsProps {
  routes: Route[];
}

// Fonction pour obtenir une image par défaut si l'image de la route est vide
const getDefaultImageForCity = (cityName: string) => {
  const images: Record<string, string> = {
    "Pointe-Noire":
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop",
    Dolisie:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop",
    Ouesso:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000&auto=format&fit=crop",
    Oyo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop",
    Cameroun:
      "https://images.unsplash.com/photo-1523539693385-e5e8995777df?q=80&w=1000&auto=format&fit=crop",
  };
  return (
    images[cityName] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop"
  );
};

// Fonction pour générer un titre déterministe basé sur la ville
const getTitleForCity = (cityName: string, index: number) => {
  const titlePrefixes = [
    "Escapade à",
    "Voyage vers",
    "Découverte de",
    "Aventure à",
  ];
  const prefixIndex = index % titlePrefixes.length;
  return `${titlePrefixes[prefixIndex]} ${cityName}`;
};

// Fonction pour générer un type de bus déterministe
const getBusType = (index: number) => {
  const busTypes = ["Bus", "Bus VIP", "Bus Standard"];
  return busTypes[index % busTypes.length];
};

// Fonction pour générer une fréquence déterministe
const getFrequency = (index: number) => {
  const frequencies = ["Quotidien", "2 jours", "3 jours", "Week-end"];
  return frequencies[index % frequencies.length];
};

export default function RelatedTrips({ routes }: RelatedTripsProps) {
  return (
    <section className="py-16 border-t border-gray-200 mt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Voyages Associés
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Découvrez d&apos;autres destinations populaires avec Océan du Nord
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route, index) => {
            // Générer un titre déterministe
            const title = getTitleForCity(route.toCity, index);

            // Générer une description dynamique
            const description = `Découvrez ${route.toCity} au départ de ${route.fromCity} avec nos bus confortables.`;

            // Générer un slug pour le lien
            const slug = route.toCity.toLowerCase().replace(/\s+/g, "-");

            return (
              <Link
                key={route.id}
                href={`/destinations/${slug}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 w-full">
                  <Image
                    src={route.image || getDefaultImageForCity(route.toCity)}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 right-0 bg-secondary text-white font-bold px-3 py-1.5 text-xs rounded-tl-xl">
                    {route.priceAdult.toLocaleString()} /{" "}
                    {route.priceChild.toLocaleString()} FCFA
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                    {description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Bus className="w-4 h-4 text-primary" />
                      <span>{getBusType(index)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span>{getFrequency(index)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
