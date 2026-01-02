// "use client";

// import { useState, useEffect, Suspense } from "react"; // Added Suspense
// import Image from "next/image";
// import Link from "next/link";
// import { Search, Loader2, Frown, MapPin } from "lucide-react";
// import FilterSidebar from "@/components/booking/FilterSidebar";
// import BusResultCard from "@/components/booking/BusResultCard";
// import { useSearchParams } from "next/navigation"; // Import pour lire les params

// // Interface des données venant de l'API
// interface TripData {
//   id: string;
//   departureTime: string;
//   arrivalTime: string;
//   from: string;
//   to: string;
//   duration: string;
//   prices: { adult: number; child: number };
//   type: "Standard" | "VIP";
//   seatsAvailable: number;
// }

// function BookingContent() {
//   const searchParams = useSearchParams();
//   const initialFrom = searchParams.get("from") || "Brazzaville";
//   const initialTo = searchParams.get("to") || "Pointe-Noire";
//   const initialDate =
//     searchParams.get("date") || new Date().toISOString().split("T")[0];

//   const [trips, setTrips] = useState<TripData[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [searchFrom, setSearchFrom] = useState(initialFrom);
//   const [searchTo, setSearchTo] = useState(initialTo);
//   const [searchDate, setSearchDate] = useState(initialDate);

//   // Déclaration de fetchTrips *avant* le useEffect
//   const fetchTrips = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `/api/trips?from=${searchFrom}&to=${searchTo}&date=${searchDate}`
//       );
//       if (res.ok) {
//         const data = await res.json();
//         setTrips(data);
//       } else {
//         setTrips([]);
//       }
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Appel de fetchTrips avec la bonne dépendance
//   useEffect(() => {
//     fetchTrips();
//   }, [searchFrom, searchTo, searchDate]); // Ajout des dépendances

//   return (
//     <>
//       {/* 1. HERO SECTION (Repositionné plus haut, comme avant le 'main') */}
//       <div className="relative h-[40vh] min-h-[300px] w-full">
//         <Image
//           src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" // Image de fond
//           alt="Réservation Bus"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-4">
//           <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
//             Réservez votre prochain voyage
//           </h1>
//           <p className="text-lg text-gray-200 max-w-2xl">
//             Comparez les horaires, choisissez votre siège et payez en toute
//             sécurité.
//           </p>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
//         {/* BARRE DE RECHERCHE INTERNE */}
//         <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-end">
//           <div className="flex-1 w-full">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//               Départ
//             </label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchFrom}
//                 onChange={(e) => setSearchFrom(e.target.value)}
//                 className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:border-secondary outline-none transition-colors font-bold"
//               />
//             </div>
//           </div>
//           <div className="flex-1 w-full">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//               Arrivée
//             </label>
//             <div className="relative">
//               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchTo}
//                 onChange={(e) => setSearchTo(e.target.value)}
//                 className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-secondary transition-colors"
//               />
//             </div>
//           </div>
//           <div className="flex-1 w-full">
//             <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               value={searchDate}
//               onChange={(e) => setSearchDate(e.target.value)}
//               className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg font-bold outline-none focus:border-secondary transition-colors"
//             />
//           </div>
//           <button
//             onClick={fetchTrips}
//             className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-secondary/20 h-full w-full md:w-auto"
//           >
//             Actualiser
//           </button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* SIDEBAR FILTRES */}
//           <div className="hidden lg:block lg:col-span-1">
//             <FilterSidebar />
//           </div>

//           {/* LISTE DES RÉSULTATS */}
//           <div className="lg:col-span-3">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-bold text-gray-800 text-lg">
//                 {loading ? "Recherche..." : `${trips.length} Bus disponibles`}
//               </h2>
//               <div className="text-sm text-gray-500">
//                 Pour le{" "}
//                 {new Date(searchDate).toLocaleDateString("fr-FR", {
//                   weekday: "long",
//                   day: "numeric",
//                   month: "long",
//                 })}
//               </div>
//             </div>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-20 text-gray-400">
//                 <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
//                 <p>Recherche des meilleurs trajets...</p>
//               </div>
//             ) : trips.length > 0 ? (
//               <div className="space-y-4">
//                 {trips.map((bus) => (
//                   <BusResultCard
//                     key={bus.id}
//                     id={bus.id}
//                     departureTime={bus.departureTime}
//                     arrivalTime={bus.arrivalTime}
//                     from={bus.from}
//                     to={bus.to}
//                     duration={bus.duration}
//                     prices={bus.prices} // On passe l'objet {adult, child} ici
//                     type={bus.type}
//                     seatsAvailable={bus.seatsAvailable}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
//                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
//                   <Frown className="w-10 h-10" />
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-2">
//                   Aucun bus trouvé
//                 </h3>
//                 <p className="text-gray-500 max-w-md mx-auto">
//                   Essayez de changer la date ou les villes de départ/arrivée.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // Le Wrapper Suspense est essentiel car nous utilisons useSearchParams
// export default function BookingPage() {
//   return (
//     <main className="min-h-screen bg-gray-50">
//       <Suspense
//         fallback={
//           <div className="h-screen flex items-center justify-center text-primary">
//             <Loader2 className="w-10 h-10 animate-spin mr-4" />
//             Chargement des trajets...
//           </div>
//         }
//       >
//         <BookingContent />
//       </Suspense>
//     </main>
//   );
// }

"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
// 1. On importe l'interface Filters
import FilterSidebar, { Filters } from "@/components/booking/FilterSidebar";
import BusResultCard from "@/components/booking/BusResultCard";
import { Loader2, Frown, MapPin } from "lucide-react";

// ... (Interface TripData reste identique)
interface TripData {
  id: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  prices: { adult: number; child: number };
  type: "Standard" | "VIP";
  seatsAvailable: number;
}

function BookingContent() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get("from") || "Brazzaville";
  const initialTo = searchParams.get("to") || "Pointe-Noire";
  const initialDate =
    searchParams.get("date") || new Date().toISOString().split("T")[0];

  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchFrom, setSearchFrom] = useState(initialFrom);
  const [searchTo, setSearchTo] = useState(initialTo);
  const [searchDate, setSearchDate] = useState(initialDate);

  // 2. État pour stocker les filtres actuels
  const [activeFilters, setActiveFilters] = useState<Filters>({
    maxPrice: 35000,
    departureTimes: [],
    busTypes: [],
  });

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/trips?from=${searchFrom}&to=${searchTo}&date=${searchDate}`
      );
      if (res.ok) {
        const data = await res.json();
        setTrips(data);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error("Erreur chargement", error);
    } finally {
      setLoading(false);
    }
  }, [searchFrom, searchTo, searchDate]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  // 3. LOGIQUE DE FILTRAGE (Magie ici !)
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      // A. Filtre Prix
      if (trip.prices.adult > activeFilters.maxPrice) return false;

      // B. Filtre Type Bus (Standard/VIP)
      if (
        activeFilters.busTypes.length > 0 &&
        !activeFilters.busTypes.includes(trip.type)
      ) {
        return false;
      }

      // C. Filtre Heure Départ
      if (activeFilters.departureTimes.length > 0) {
        const hour = parseInt(trip.departureTime.split(":")[0]); // "07:00" -> 7

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
      {/* 1. NOUVEAU HERO SECTION */}
      <div className="relative h-[40vh] min-h-[300px] w-full">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop"
          alt="Réservation Bus"
          fill
          className="object-cover"
          priority
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
        {/* Header de recherche interne */}
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
            className="bg-secondary text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-secondary/20"
          >
            Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR ACTIVE */}
          <div className="hidden lg:block lg:col-span-1">
            {/* 4. On passe la fonction de mise à jour au composant */}
            <FilterSidebar onFilterChange={setActiveFilters} />
          </div>

          {/* LISTE DES RÉSULTATS FILTRÉS */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-gray-800 text-lg">
                {/* 5. On affiche le nombre de bus filtrés */}
                {loading
                  ? "Recherche..."
                  : `${filteredTrips.length} Bus disponibles`}
              </h2>
              <div className="text-sm text-gray-500">
                {new Date(searchDate).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
                <p>Recherche des meilleurs trajets...</p>
              </div>
            ) : filteredTrips.length > 0 ? (
              <div className="space-y-4">
                {/* 6. On mappe sur filteredTrips au lieu de trips */}
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
                  Aucun bus ne correspond
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Essayez de modifier vos filtres (prix, horaires) ou changez de
                  date.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Wrapper Suspense
export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <Suspense
        fallback={<div className="pt-20 text-center">Chargement...</div>}
      >
        <BookingContent />
      </Suspense>
    </main>
  );
}
