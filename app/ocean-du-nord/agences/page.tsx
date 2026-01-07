// Agences Page

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Phone,
  FileText,
  Navigation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- 1. DONNÉES COMPLÈTES (43 Agences reconstituées) ---
const ALL_AGENCIES = [
  // Brazzaville
  {
    id: 1,
    name: "Direction Générale (Mikalou)",
    city: "Brazzaville",
    axis: "Nord",
    address: "1, rue ango avenue de la tsiémé",
    phone: "00242065874460",
  },
  {
    id: 2,
    name: "Angola libre",
    city: "Brazzaville",
    axis: "Nord",
    address: "Avenue de l'OUA enceinte angola libre",
    phone: "00242067048874",
  },
  {
    id: 3,
    name: "Diata",
    city: "Brazzaville",
    axis: "Nord",
    address: "Croisement Av. 5 Février et Av. crabe rouge",
    phone: "00242067048873",
  },
  {
    id: 4,
    name: "Kinsoudi - Nzoko",
    city: "Brazzaville",
    axis: "Nord",
    address: "Av. cardinal Emile Biayenda",
    phone: "00242065100628",
  },
  {
    id: 5,
    name: "Kintélé",
    city: "Brazzaville",
    axis: "Nord",
    address: "Après les eucalyptus, péage kintélé",
    phone: "00242065100622",
  },
  {
    id: 6,
    name: "Moukondo",
    city: "Brazzaville",
    axis: "Nord",
    address: "1er pilonne face SNE Mazala",
    phone: "00242067048876",
  },
  {
    id: 7,
    name: "Moungali",
    city: "Brazzaville",
    axis: "Nord",
    address: "131 Avenue des 3 martyrs",
    phone: "00242068814273",
  },
  {
    id: 8,
    name: "Nkombo",
    city: "Brazzaville",
    axis: "Nord",
    address: "Esplanade de la Télé",
    phone: "00242067048872",
  },
  {
    id: 9,
    name: "Talangaï",
    city: "Brazzaville",
    axis: "Nord",
    address: "20 rue Bouenza, face CEG la liberté",
    phone: "00242066869898",
  },

  // Pointe-Noire
  {
    id: 10,
    name: "Mpaka",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Arrêt boulangerie 5 chemins",
    phone: "00242067021523",
  },
  {
    id: 11,
    name: "Ngoyo",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Arrêt deux (02) conteneurs",
    phone: "00242067048882",
  },
  {
    id: 12,
    name: "Nkayi",
    city: "Nkayi",
    axis: "Sud",
    address: "En face du stade du village",
    phone: "00242068808467",
  }, // Nkayi est une ville, mais parfois classée avec le Sud
  {
    id: 13,
    name: "Nkouikou",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Arrêt ex Zando",
    phone: "00242065100625",
  },
  {
    id: 14,
    name: "OCH",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Av bord-bord non loin du chateau",
    phone: "0024205276174",
  },
  {
    id: 15,
    name: "Siafoumou",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Arrêt Camille Dhello Siafoumou",
    phone: "00242066185712",
  },
  {
    id: 16,
    name: "Tiétié",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Station SNPC",
    phone: "00242065871951",
  },
  {
    id: 17,
    name: "Vindoulou",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Arrêt pharmacie Phonix",
    phone: "00242067048881",
  },
  {
    id: 18,
    name: "Voungou",
    city: "Pointe-noire",
    axis: "Sud",
    address: "Avenue de la liberté Arrêt Etage",
    phone: "00242068181809",
  },

  // Intérieur du pays (Nord & Sud)
  {
    id: 19,
    name: "Betou",
    city: "Betou",
    axis: "Nord",
    address: "La grande av entre le grand marché",
    phone: "0024206511966",
  },
  {
    id: 20,
    name: "Bouansa",
    city: "Bouansa",
    axis: "Sud",
    address: "En face de la station total",
    phone: "00242065117807",
  },
  {
    id: 21,
    name: "Boundji",
    city: "Boundji",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065090852",
  },
  {
    id: 22,
    name: "Djambala",
    city: "Djambala",
    axis: "Nord",
    address: "Rond-point, avenue Fulbert Youlou",
    phone: "00242065958486",
  },
  {
    id: 23,
    name: "Dolisie",
    city: "Dolisie",
    axis: "Sud",
    address: "04 rue jolie, Grand marché",
    phone: "00242065002798",
  },
  {
    id: 24,
    name: "Dongou",
    city: "Dongou",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242056519040",
  },
  {
    id: 25,
    name: "Enyelle",
    city: "Enyelle",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242055513884",
  },
  {
    id: 26,
    name: "Etoumbi",
    city: "Etoumbi",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065090856",
  },
  {
    id: 27,
    name: "Ewo",
    city: "Ewo",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065090853",
  },
  {
    id: 28,
    name: "Gamboma",
    city: "Gamboma",
    axis: "Nord",
    address: "Marché Gamboma",
    phone: "00242065090850",
  },
  {
    id: 29,
    name: "Impfondo",
    city: "Impfondo",
    axis: "Nord",
    address: "Av Denis Sassou Nguesso",
    phone: "00242065658462",
  },
  {
    id: 30,
    name: "Kéllé",
    city: "Kéllé",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065090857",
  },
  {
    id: 31,
    name: "Loutété",
    city: "Loutété",
    axis: "Sud",
    address: "Centre ville",
    phone: "00242064034508",
  },
  {
    id: 32,
    name: "Madingou",
    city: "Madingou",
    axis: "Sud",
    address: "Madingou Poste (La mairie)",
    phone: "00242065117804",
  },
  {
    id: 33,
    name: "Makoua",
    city: "Makoua",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065090855",
  },
  {
    id: 34,
    name: "Ngo",
    city: "Ngo",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242069350433",
  },
  {
    id: 35,
    name: "Okoyo",
    city: "Okoyo",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242064091994",
  },
  {
    id: 36,
    name: "Ollombo",
    city: "Ollombo",
    axis: "Nord",
    address: "Quartier Marien Ngouabi",
    phone: "00242066613161",
  },
  {
    id: 37,
    name: "Ouesso",
    city: "Ouesso",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242065068254",
  },
  {
    id: 38,
    name: "Owando",
    city: "Owando",
    axis: "Nord",
    address: "Rue monseigneur N°23",
    phone: "00242065090854",
  },
  {
    id: 39,
    name: "Oyo",
    city: "Oyo",
    axis: "Nord",
    address: "Av Marcel Okoyo",
    phone: "00242066660916",
  },
  {
    id: 40,
    name: "Pokola",
    city: "Pokola",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242066185712",
  },
  {
    id: 41,
    name: "Sibiti",
    city: "Sibiti",
    axis: "Sud",
    address: "Centre ville",
    phone: "00242066329913",
  },
  {
    id: 42,
    name: "Souanké",
    city: "Souanké",
    axis: "Nord",
    address: "Centre ville",
    phone: "00242068926160",
  },
  {
    id: 43,
    name: "Thanry",
    city: "Thanry",
    axis: "Nord",
    address: "Av principale devant le super marché",
    phone: "00242065569863",
  },
];

export default function AgencesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAxis, setSelectedAxis] = useState<"Tous" | "Nord" | "Sud">(
    "Tous"
  );

  // --- 2. LOGIQUE DE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // A. Filtrer
  const filteredAgencies = ALL_AGENCIES.filter((agency) => {
    const matchesSearch =
      agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAxis = selectedAxis === "Tous" || agency.axis === selectedAxis;
    return matchesSearch && matchesAxis;
  });

  // B. Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAgencies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1);
    if (filterType === "search") setSearchTerm(value);
    // @ts-expect-error - value type checking
    if (filterType === "axis") setSelectedAxis(value);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20 flex flex-col">
      {/* 1. BARRE DE FILTRES */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-secondary" />
              Nos Agences ({filteredAgencies.length})
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Recherche */}
              <div className="relative group min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher une agence..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              {/* Filtre Axe */}
              <select
                className="px-4 py-2.5 bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-primary outline-none font-medium text-gray-700 cursor-pointer"
                value={selectedAxis}
                onChange={(e) => handleFilterChange("axis", e.target.value)}
              >
                <option value="Tous">Tous les axes</option>
                <option value="Nord">Axe Nord</option>
                <option value="Sud">Axe Sud</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden">
        {/* LISTE */}
        <div className="w-full lg:w-[55%] xl:w-[50%] p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-140px)] custom-scrollbar flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentItems.map((agency) => (
              // <div
              //   key={agency.id}
              //   className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col justify-between h-full"
              // >
              //   <div>
              //     <div className="flex justify-between items-start mb-4">
              //       <div className="flex items-center gap-3">
              //         <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg border border-primary/10">
              //           {agency.name.charAt(0)}
              //         </div>
              //         <div>
              //           <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
              //             {agency.name}
              //           </h3>
              //           <span
              //             className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              //               agency.axis === "Nord"
              //                 ? "bg-blue-50 text-blue-600"
              //                 : "bg-orange-50 text-orange-600"
              //             }`}
              //           >
              //             Axe {agency.axis}
              //           </span>
              //         </div>
              //       </div>
              //     </div>

              //     <div className="space-y-3 text-sm text-gray-600 mb-6">
              //       <div className="flex gap-2">
              //         <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              //         <span className="line-clamp-2">
              //           {agency.address} -{" "}
              //           <strong className="text-gray-900">{agency.city}</strong>
              //         </span>
              //       </div>
              //       <div className="flex items-center gap-2">
              //         <Phone className="w-4 h-4 text-gray-400" />
              //         <span className="font-mono">{agency.phone}</span>
              //       </div>
              //     </div>
              //   </div>

              //   {/* --- C'EST ICI QUE LES BOUTONS SONT CORRIGÉS --- */}
              //   <div className="flex gap-2 mt-auto">
              //     {/* Lien vers tarifs */}
              //     <Link
              //       href="/tarifs"
              //       className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
              //     >
              //       <FileText className="w-3 h-3" />
              //       Grille Tarifaire
              //     </Link>

              //     {/* Lien Google Maps */}
              //     <a
              //       href={`https://www.google.com/maps/search/Agence+Océan+du+Nord+${agency.name}+${agency.city}`}
              //       target="_blank"
              //       rel="noopener noreferrer"
              //       className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
              //       title="Voir sur la carte"
              //     >
              //       <Navigation className="w-4 h-4" />
              //     </a>
              //   </div>
              // </div>

              <div
                key={agency.id}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold text-lg border border-primary/10">
                        {agency.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">
                          {agency.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            agency.axis === "Nord"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          Axe {agency.axis}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {agency.address} -{" "}
                        <strong className="text-gray-900">{agency.city}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="font-mono font-bold text-gray-700">
                        {agency.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* --- ZONE BOUTONS CORRIGÉE --- */}
                <div className="flex gap-3 mt-auto">
                  {/* Lien Tarifs */}
                  <Link
                    href="/ocean-du-nord/tarifs"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary hover:bg-amber-600 text-white rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Grille Tarifaire</span>
                  </Link>

                  {/* Lien Google Maps */}
                  <a
                    href={`https://www.google.com/maps/search/Agence+Océan+du+Nord+${agency.name}+${agency.city}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors border border-gray-200"
                    title="Ouvrir la localisation GPS"
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination (Identique à avant) */}
          {filteredAgencies.length > itemsPerPage && (
            <div className="mt-auto pt-6 border-t border-gray-100 flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>

        {/* CARTE INTERACTIVE GOOGLE MAPS */}
        <div className="hidden lg:block w-[45%] xl:w-[50%] h-[calc(100vh-140px)] sticky top-[140px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d127324.08840210747!2d15.2531433!3d-4.2440461!3m2!1i1024!2i768!4f13.1!2m1!1socean%20du%20nord!5e0!3m2!1sfr!2scg!4v1767629807403!5m2!1sfr!2scg"
            className="w-full h-full grayscale hover:grayscale-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
            <p className="text-sm text-gray-700 font-medium">
              Explorez les agences Ocean du Nord sur la carte
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
