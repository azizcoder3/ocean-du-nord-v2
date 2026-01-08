// app/booking/page.tsx
// app/booking/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import FilterSidebar, { Filters } from "@/components/booking/FilterSidebar";
import BusResultCard from "@/components/booking/BusResultCard";
import {
  Loader2,
  Frown,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// --- CONSTANTES ---
const ITEMS_PER_PAGE = 4; // Nombre de voyages par page

// --- INTERFACES & UTILITAIRES ---

interface TripData {
  id: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  prices: {
    adult: number;
    child: number;
  };
  type: "Standard" | "VIP" | "Business";
  seatsAvailable: number;
}

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// --- COMPOSANT PRINCIPAL (CONTENU) ---

function BookingContent() {
  const searchParams = useSearchParams();

  // États des champs de recherche
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  // État de Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Filtres actifs (Sidebar)
  const [activeFilters, setActiveFilters] = useState<Filters>({
    maxPrice: 35000,
    departureTimes: [],
    busTypes: [],
  });

  // 1. INITIALISATION
  useEffect(() => {
    const urlFrom = searchParams.get("from")?.trim() || "";
    const urlTo = searchParams.get("to")?.trim() || "";
    const urlDate = searchParams.get("date");
    const defaultDate = getLocalDateString();

    setSearchFrom(urlFrom);
    setSearchTo(urlTo);
    setSearchDate(urlDate || defaultDate);
  }, [searchParams]);

  // 2. RECHERCHE API
  const fetchTrips = useCallback(async () => {
    if (!searchDate) return;
    setLoading(true);
    // On remet la page à 1 à chaque nouvelle recherche
    setCurrentPage(1);

    try {
      const params = new URLSearchParams();
      params.append("date", searchDate);
      if (searchFrom) params.append("from", searchFrom);
      if (searchTo) params.append("to", searchTo);

      const url = `/api/trips?${params.toString()}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [searchFrom, searchTo, searchDate]);

  // 3. DÉCLENCHEUR
  useEffect(() => {
    if (searchDate) {
      fetchTrips();
    }
  }, [searchDate, fetchTrips]);

  // 4. FILTRAGE
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // Filtre Prix
      if (trip.prices.adult > activeFilters.maxPrice) return false;
      // Filtre Type Bus
      if (
        activeFilters.busTypes.length > 0 &&
        !activeFilters.busTypes.includes(trip.type)
      ) {
        return false;
      }
      // Filtre Heure Départ
      if (activeFilters.departureTimes.length > 0) {
        const hour = parseInt(trip.departureTime.split(":")[0]);
        const isMorning = hour >= 6 && hour < 12;
        const isAfternoon = hour >= 12 && hour < 18;

        let matchesTime = false;
        if (activeFilters.departureTimes.includes("morning") && isMorning)
          matchesTime = true;
        if (activeFilters.departureTimes.includes("afternoon") && isAfternoon)
          matchesTime = true;

        if (!matchesTime) return false;
      }
      return true;
    });
  }, [trips, activeFilters]);

  // Quand les filtres changent, on remet la pagination à 1
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters]);

  // 5. LOGIQUE DE PAGINATION
  const totalItems = filteredTrips.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedTrips = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredTrips.slice(startIndex, endIndex);
  }, [filteredTrips, currentPage]);

  // Fonction pour changer de page et remonter en haut
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" }); // Scroll vers le haut de la liste
  };

  return (
    <>
      {/* HERO SECTION */}
      <div className="relative h-[50vh] min-h-75 w-full">
        <Image
          src="/images/bus.webp"
          alt="Réservation Bus"
          fill
          className="object-cover object-[center_80%]"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Réservez votre prochain voyage
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Comparez les horaires, choisissez votre siège et payez en toute
            sécurité.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        {/* BARRE DE RECHERCHE */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Départ
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-secondary transition-colors"
                placeholder="Ville de départ"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Arrivée
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-secondary transition-colors"
                placeholder="Ville d'arrivée"
              />
            </div>
          </div>
          <div className="flex-1 w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">
              Date
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold outline-none focus:border-secondary transition-colors"
            />
          </div>
          <button
            onClick={fetchTrips}
            disabled={loading}
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Actualiser"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTRES */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar onFilterChange={setActiveFilters} />
          </div>

          {/* LISTE DES RÉSULTATS */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">
                {loading
                  ? "Recherche en cours..."
                  : `${totalItems} Bus disponible${totalItems > 1 ? "s" : ""}`}
              </h2>
              {searchDate && (
                <div className="text-sm text-gray-500">
                  {new Date(searchDate + "T00:00:00").toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    }
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p>Chargement des voyages...</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              <>
                {/* Liste paginée */}
                <div className="space-y-4 min-h-125">
                  {paginatedTrips.map((bus) => (
                    <BusResultCard
                      key={bus.id}
                      id={bus.id}
                      departureTime={bus.departureTime}
                      arrivalTime={bus.arrivalTime}
                      from={bus.from}
                      to={bus.to}
                      duration={bus.duration}
                      prices={bus.prices}
                      type={bus.type}
                      seatsAvailable={bus.seatsAvailable}
                    />
                  ))}
                </div>

                {/* BARRE DE PAGINATION */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    {/* Bouton Précédent */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>

                    {/* Numéros de page */}
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                              currentPage === page
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {/* Bouton Suivant */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}

                {/* Info Pagination */}
                {totalPages > 1 && (
                  <p className="text-center text-xs text-gray-400 mt-4">
                    Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1} à{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} sur{" "}
                    {totalItems} résultats
                  </p>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <Frown className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aucun voyage trouvé
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Aucun bus n&apos;est programmé pour cette date
                  {searchFrom && ` au départ de ${searchFrom}`}
                  {searchTo && ` vers ${searchTo}`}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// --- WRAPPER ---
export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        }
      >
        <BookingContent />
      </Suspense>
    </main>
  );
}
