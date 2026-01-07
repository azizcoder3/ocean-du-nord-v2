import { Package, Mail, BusFront, ArrowRight } from "lucide-react";
import Link from "next/link";

const SERVICES = [
  {
    icon: Mail,
    title: "Courrier Express",
    subtitle: "Envoi & Réception",
    description:
      "Envoyez vos lettres et petits documents en toute sécurité entre nos différentes agences.",
    link: "/services/courrier",
  },
  {
    icon: Package,
    title: "Service Fret",
    subtitle: "Colis & Marchandises",
    description:
      "Une solution fiable pour l'expédition de vos colis, cartons et marchandises volumineuses.",
    link: "/services/fret",
  },
  {
    icon: BusFront,
    title: "Location de Bus",
    subtitle: "Événements & Privé",
    description:
      "Louez un bus entier avec chauffeur pour vos mariages, excursions ou déplacements d'entreprise.",
    link: "/services/location",
  },
];

export default function OurServices() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre de Section */}
        <div className="text-center mb-16">
          <span className="text-secondary font-bold tracking-wider uppercase text-sm">
            Ce que nous faisons
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Nos Services <span className="text-primary">Exclusifs</span>
          </h2>
          <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Grille des Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary/30 relative overflow-hidden"
            >
              {/* Effet de fond au survol (Cercle décoratif) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/10"></div>

              {/* Icône */}
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <service.icon className="w-8 h-8" />
              </div>

              {/* Textes */}
              <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-secondary font-semibold mb-4 uppercase tracking-wide">
                {service.subtitle}
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Lien / Bouton */}
              <Link
                href={service.link}
                className="inline-flex items-center text-gray-900 font-semibold group-hover:text-primary transition-colors"
              >
                En savoir plus
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
