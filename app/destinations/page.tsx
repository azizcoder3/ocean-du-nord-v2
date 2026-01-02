"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Loader2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

// Image mapping pour garder le design avec des belles photos
const getImageForCity = (cityName: string) => {
  const images: Record<string, string> = {
    "Pointe-Noire": "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000",
    "Dolisie": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
    "Ouesso": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
    "Oyo": "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000",
    "Nkayi": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
    "Cameroun": "https://images.unsplash.com/photo-1523539693385-e5e8995777df?q=80&w=1000"
  };
  return images[cityName] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000";
};

interface RouteDB {
  id: string;
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
}

export default function DestinationsListingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [destinations, setDestinations] = useState<RouteDB[]>([]);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 9;

  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch("/api/routes");
        const data = await response.json();
        setDestinations(data);
      } catch (error) {
        console.error("Erreur chargement", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRoutes();
  }, []);

  const filteredDestinations = destinations.filter((dest) =>
    dest.toCity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-primary py-16 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-2 block">Congo Brazzaville</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6">Nos Destinations</h1>
          <p className="text-primary-100 text-lg">Découvrez toutes les lignes desservies par notre flotte.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 max-w-3xl mx-auto border border-gray-100">
          <Search className="w-6 h-6 text-gray-400 ml-2" />
          <input
            type="text"
            placeholder="Quelle ville recherchez-vous ?"
            className="flex-1 py-3 bg-transparent outline-none text-lg text-gray-700 placeholder:text-gray-400"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentItems.map((dest) => (
              <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1">
                <div className="relative h-56 overflow-hidden">
                  <Image src={getImageForCity(dest.toCity)} alt={dest.toCity} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  
                  {/* AFFICHAGE DES DEUX PRIX */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl font-bold text-primary shadow-sm border border-gray-100 text-xs text-right">
                    <div>Adulte : {dest.priceAdult.toLocaleString()} F</div>
                    <div className="text-gray-500 font-normal text-[10px]">Enfant : {dest.priceChild.toLocaleString()} F</div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{dest.toCity}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3 text-secondary" />
                        <span>Départ de {dest.fromCity}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/destinations/${dest.toCity.toLowerCase().replace(" ", "-")}`}
                    className="block w-full py-3 rounded-xl border border-gray-200 text-center font-bold text-gray-600 hover:bg-primary hover:text-white transition-colors mt-4"
                  >
                    Détails & Réservation
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><h3 className="text-xl font-bold text-gray-900">Aucune destination trouvée</h3></div>
        )}

        {/* PAGINATION */}
        {filteredDestinations.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-3 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button key={number} onClick={() => paginate(number)} className={`w-12 h-12 rounded-xl font-bold text-sm ${currentPage === number ? "bg-primary text-white shadow-lg" : "bg-white text-gray-600 border border-gray-200"}`}>{number}</button>
            ))}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-3 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
          </div>
        )}
      </div>
    </main>
  );
}