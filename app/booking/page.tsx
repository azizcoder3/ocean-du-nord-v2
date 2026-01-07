// app/booking/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import FilterSidebar, { Filters } from "@/components/booking/FilterSidebar";
import BusResultCard from "@/components/booking/BusResultCard";
import { Loader2, Frown, MapPin } from "lucide-react";

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

// ✅ Fonction utilitaire pour obtenir la date locale au format YYYY-MM-DD
function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function BookingContent() {
  const searchParams = useSearchParams();

  // États des champs de recherche
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [searchDate, setSearchDate] = useState("");

  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilters, setActiveFilters] = useState<Filters>({
    maxPrice: 35000,
    departureTimes: [],
    busTypes: [],
  });

  useEffect(() => {
    const urlFrom = searchParams.get("from")?.trim();
    const urlTo = searchParams.get("to")?.trim();
    const urlDate = searchParams.get("date");

    console.log("📍 Paramètres URL détectés:", { urlFrom, urlTo, urlDate });

    // Valeurs par défaut si pas de paramètres
    const defaultFrom = "Brazzaville";
    const defaultTo = "Pointe-Noire";
    const defaultDate = getLocalDateString(); // ✅ CORRECTION: Utilisation de la date locale

    console.log("📅 Date par défaut (locale):", defaultDate);

    // ✅ Forcer la mise à jour même si les valeurs semblent identiques
    setSearchFrom(urlFrom || defaultFrom);
    setSearchTo(urlTo || defaultTo);
    setSearchDate(urlDate || defaultDate);
  }, [searchParams]);

  // Fonction de recherche des voyages
  const fetchTrips = useCallback(async () => {
    // Ne pas rechercher si les champs ne sont pas initialisés
    if (!searchFrom || !searchTo || !searchDate) {
      console.log("⏳ En attente de l'initialisation des paramètres...");
      return;
    }

    console.log("🚀 Recherche lancée avec:", {
      searchFrom,
      searchTo,
      searchDate,
    });
    setLoading(true);

    try {
      const url = `/api/trips?from=${encodeURIComponent(
        searchFrom
      )}&to=${encodeURIComponent(searchTo)}&date=${searchDate}`;
      console.log("📡 URL API:", url);

      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ ${data.length} voyage(s) reçu(s):`, data);
        setTrips(data);
      } else {
        const errorData = await res.json();
        console.error("❌ Erreur API:", errorData);
        setTrips([]);
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  }, [searchFrom, searchTo, searchDate]);

  // ✅ Lancer la recherche automatiquement quand les paramètres changent
  useEffect(() => {
    if (searchFrom && searchTo && searchDate) {
      fetchTrips();
    }
  }, [searchFrom, searchTo, searchDate, fetchTrips]);

  // Logique de filtrage client-side
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

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-75 w-full">
        <Image
          src="/images/bus.webp"
          alt="Réservation Bus"
          fill
          className="object-cover object-[center_80%]"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Réservez votre prochain voyage
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl">
            Comparez les horaires, choisissez votre siège et payez en toute
            sécurité avec Mobile Money.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        {/* Header de recherche */}
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
            {loading ? "Recherche..." : "Actualiser"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filtres */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar onFilterChange={setActiveFilters} />
          </div>

          {/* Liste des résultats */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">
                {loading
                  ? "Recherche en cours..."
                  : `${filteredTrips.length} Bus disponible${
                      filteredTrips.length > 1 ? "s" : ""
                    }`}
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
                <p>Recherche des meilleurs trajets...</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="space-y-4">
                {filteredTrips.map((bus) => (
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
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Frown className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Aucun voyage disponible
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-4">
                  Aucun voyage trouvé pour <strong>{searchFrom}</strong> →{" "}
                  <strong>{searchTo}</strong> le{" "}
                  <strong>
                    {new Date(searchDate + "T00:00:00").toLocaleDateString(
                      "fr-FR"
                    )}
                  </strong>
                </p>
                <p className="text-sm text-gray-400">
                  Essayez de modifier vos critères de recherche ou vérifiez
                  qu&apos;il existe bien des voyages programmés pour cette date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Wrapper avec Suspense pour gérer le chargement des searchParams
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
