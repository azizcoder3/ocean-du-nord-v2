"use client";

import { useState } from "react";
import { Search, MapPin, User, Baby, ArrowRight, Download } from "lucide-react";
import Link from "next/link";

// --- DONNÉES ---
// J'ai structuré vos données par "Zones" pour un affichage propre
const TARIFF_DATA = [
  {
    category: "Départs de Pointe-Noire",
    zones: [
      {
        name: "Liaisons Sud & Principales",
        routes: [
          { to: "Madingou", adult: 7000, child: 5000 },
          { to: "Dolisie", adult: 5000, child: 4000 },
          { to: "Sibiti", adult: 10000, child: 10000 },
          { to: "Nkayi", adult: 6000, child: 6000 },
        ],
      },
    ],
  },
  {
    category: "Départs de Brazzaville",
    zones: [
      {
        name: "Principales & Sud",
        routes: [
          { to: "Pointe-Noire", adult: 9000, child: 9000 },
          { to: "Dolisie", adult: 7000, child: 7000 },
          { to: "Nkayi", adult: 7000, child: 6000 },
          { to: "Madingou", adult: 7000, child: 5000 },
          { to: "Sibiti", adult: 7000, child: 7000 },
          { to: "Bouansa", adult: 7000, child: 5000 },
          { to: "Loutété", adult: 7000, child: 5000 },
          { to: "Loudima", adult: 9000, child: 7000 },
          { to: "Mindouli", adult: 5000, child: 4000 },
        ],
      },
      {
        name: "Nord & Plateaux",
        routes: [
          { to: "Oyo", adult: 6000, child: 6000 },
          { to: "Ollombo", adult: 6000, child: 6000 },
          { to: "Obouya", adult: 7000, child: 7000 },
          { to: "Boundji", adult: 8000, child: 8000 },
          { to: "Owando", adult: 8000, child: 8000 },
          { to: "Makoua", adult: 10000, child: 10000 },
          { to: "Ouesso", adult: 9000, child: 9000 },
          { to: "Gamboma", adult: 5000, child: 5000 },
          { to: "Ngo", adult: 4000, child: 4000 },
          { to: "Djambala", adult: 6000, child: 5000 },
          { to: "Etoumbi", adult: 12000, child: 10000 },
          { to: "Ewo", adult: 12000, child: 10000 },
          { to: "Okoyo", adult: 10000, child: 10000 },
          { to: "Kéllé", adult: 15000, child: 12000 },
        ],
      },
      {
        name: "Grand Nord (Likouala / Sangha)",
        routes: [
          { to: "Pokola", adult: 14000, child: 14000 },
          { to: "Thanry", adult: 25000, child: 20000 },
          { to: "Dongou", adult: 32000, child: 30000 },
          { to: "Impfondo", adult: 35000, child: 30000 },
          { to: "Betou", adult: 35000, child: 30000 },
          { to: "Enyelle", adult: 30000, child: 25000 },
          { to: "Epere", adult: 13000, child: 11000 },
        ],
      },
    ],
  },
];

export default function GrilleTarifairePage() {
  const [activeTab, setActiveTab] = useState("Départs de Brazzaville");
  const [searchTerm, setSearchTerm] = useState("");

  // Logique de filtrage complexe (Recherche dans les sous-catégories)
  const currentCategoryData = TARIFF_DATA.find((d) => d.category === activeTab);

  const filteredZones = currentCategoryData?.zones
    .map((zone) => {
      // Si la recherche est vide, on garde tout
      if (!searchTerm) return zone;

      // Sinon on filtre les routes qui correspondent à la recherche
      const filteredRoutes = zone.routes.filter((route) =>
        route.to.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // On retourne la zone seulement si elle a des routes correspondantes
      return filteredRoutes.length > 0
        ? { ...zone, routes: filteredRoutes }
        : null;
    })
    .filter(
      (zone): zone is (typeof currentCategoryData.zones)[0] => zone !== null
    ); // Retire les zones nulles (vides)

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* 1. EN-TÊTE & RECHERCHE */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Grille Tarifaire Officielle
              </h1>
              <p className="text-gray-500">
                Consultez nos tarifs pour toutes les destinations.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Onglets */}
              <div className="bg-gray-100 p-1 rounded-xl flex">
                {TARIFF_DATA.map((tab) => (
                  <button
                    key={tab.category}
                    onClick={() => setActiveTab(tab.category)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      activeTab === tab.category
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.category === "Départs de Brazzaville"
                      ? "Départ Brazzaville"
                      : "Départ Pointe-Noire"}
                  </button>
                ))}
              </div>

              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Chercher une destination..."
                  className="pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LISTE DES TARIFS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Affichage des zones filtrées */}
        {filteredZones && filteredZones.length > 0 ? (
          <div className="space-y-12">
            {filteredZones.map((zone, index) => (
              <div key={index} className="animate-fade-in-up">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-l-4 border-secondary pl-3">
                  {zone.name}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {zone.routes.map((route, rIndex) => (
                    <div
                      key={rIndex}
                      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group relative overflow-hidden"
                    >
                      {/* Destination */}
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">
                            Destination
                          </p>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                            {route.to}
                          </h3>
                        </div>
                        <div className="w-10 h-10 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Prix */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                              Adulte
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">
                            {route.adult.toLocaleString()} F
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <Baby className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                              Enfant
                            </span>
                          </div>
                          <span className="font-bold text-gray-900">
                            {route.child.toLocaleString()} F
                          </span>
                        </div>
                      </div>

                      {/* Bouton Voir Détails */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href={`/destinations/${route.to.toLowerCase()}`}
                          className="flex items-center justify-center gap-2 py-2 px-4 bg-secondary text-white rounded-xl font-bold transition-all hover:bg-amber-600 shadow-sm active:scale-95"
                        >
                          Voir Détails <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Aucun résultat</h3>
            <p className="text-gray-500">
              Essayez de chercher une autre ville.
            </p>
          </div>
        )}

        {/* Bouton Télécharger PDF (Décoratif pour l'instant) */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg">
            <Download className="w-5 h-5" />
            Télécharger la grille (PDF)
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Dernière mise à jour : Octobre 2025
          </p>
        </div>
      </div>
    </main>
  );
}
