import Image from "next/image";
import { Calendar, Bus } from "lucide-react";

// Données simulées pour les visites associées
const RELATED = [
  {
    id: 1,
    title: "Escapade à Oyo",
    desc: "Découvrez la ville d'Oyo et ses environs verdoyants.",
    prices: { adult: 8000, child: 5000 },
    days: "Quotidien",
    image:
      "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000&auto=format&fit=crop", // Savane
    type: "Bus",
  },
  {
    id: 2,
    title: "Visite de Dolisie",
    desc: "Plongez au cœur du Mayombe et de l'or vert.",
    prices: { adult: 7000, child: 7000 },
    days: "Quotidien",
    image:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop", // Route verte
    type: "Bus",
  },
  {
    id: 3,
    title: "Aventure à Ouesso",
    desc: "L'expérience ultime de la forêt équatoriale.",
    // Remplacement de 'price: 15000' par l'objet ci-dessous :
    prices: {
      adult: 15000,
      child: 10000, // Mettre le prix enfant correspondant ici
    },
    days: "2 jours",
    image:
      "https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1000&auto=format&fit=crop",
    type: "Bus VIP",
  },
  {
    id: 4,
    title: "Détente à la Côte Sauvage",
    desc: "Profitez des plages de Pointe-Noire le week-end.",
    prices: {
      adult: 12000,
      child: 8000,
    },
    days: "Week-end",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop", // Plage
    type: "Bus",
  },
];

export default function RelatedTrips() {
  return (
    <section className="py-16 border-t border-gray-200 mt-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Voiyage Associées
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            L&apos;élévation de la voix dit qu&apos;elle avait surtout atténué
            ses exigences. Calme, il a mené sa propre cause à trois. Devant, pas
            de parti, jeune.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RELATED.map((trip) => (
            <div
              key={trip.id}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={trip.image}
                  alt={trip.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-0 right-0 bg-secondary text-white font-bold px-3 py-1.5 text-xs rounded-tl-xl">
                  {trip.prices.adult.toLocaleString()} /{" "}
                  {trip.prices.child.toLocaleString()} FCFA
                </div>
              </div>

              {/* Contenu */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-primary transition-colors">
                  {trip.title}
                </h3>
                <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                  {trip.desc}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs font-medium text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-primary" />
                    <span>{trip.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{trip.days}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
