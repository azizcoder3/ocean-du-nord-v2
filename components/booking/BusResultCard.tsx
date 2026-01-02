import Image from "next/image";
import Link from "next/link"; // <--- LA CORRECTION EST ICI (next/link et pas lucide-react)
import { Clock, Wifi, Coffee, Tv, Armchair } from "lucide-react";

interface BusResultCardProps {
  id: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
  duration: string;
  prices: { adult: number; child: number }; // <--- On attend un objet maintenant
  type: "Standard" | "VIP" | "Business";
  seatsAvailable: number;
}

export default function BusResultCard({
  id,
  departureTime,
  arrivalTime,
  from,
  to,
  duration,
  prices,
  type,
  seatsAvailable,
}: BusResultCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
      {/* 1. IMAGE & TYPE */}
      <div className="relative w-full md:w-48 h-40 flex-shrink-0 rounded-xl overflow-hidden group">
        <Image
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop"
          alt="Bus Océan du Nord"
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-primary uppercase">
          {type}
        </div>
      </div>

      {/* 2. DÉTAILS DU TRAJET */}
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {departureTime} <span className="text-gray-400 mx-2">➔</span>{" "}
              {arrivalTime}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {from} vers {to}
            </p>
          </div>
          <div className="text-right">
            <span className="flex items-center gap-1 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4" />
              {duration}
            </span>
          </div>
        </div>

        {/* Ligne visuelle */}
        <div className="relative flex items-center mb-6">
          <div className="h-[2px] w-full bg-gray-200 rounded-full"></div>
          <div className="absolute left-0 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute right-0 w-3 h-3 bg-secondary rounded-full border-2 border-white shadow-sm"></div>
          <div className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
          <span className="absolute left-1/2 -translate-x-1/2 top-4 text-[10px] text-gray-400 uppercase tracking-wide">
            1 Escale
          </span>
        </div>

        {/* Équipements */}
        <div className="flex gap-4 text-gray-400">
          <div
            className="flex items-center gap-1 text-xs"
            title="Climatisation"
          >
            <Armchair className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1 text-xs" title="WiFi">
            <Wifi className="w-4 h-4" />
          </div>
          {type === "VIP" && (
            <div
              className="flex items-center gap-1 text-xs text-secondary"
              title="Snacks"
            >
              <Coffee className="w-4 h-4" />
            </div>
          )}
          <div className="flex items-center gap-1 text-xs" title="TV">
            <Tv className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. PRIX & ACTION */}
      <div className="w-full md:w-auto flex flex-col items-center md:items-end justify-between gap-4 pl-0 md:pl-6 md:border-l border-gray-100 min-w-[160px]">
        {/* Affichage des deux prix */}
        <div className="text-center md:text-right w-full space-y-1">
          <div className="flex justify-between md:justify-end items-baseline gap-2">
            <span className="text-xs text-gray-400 uppercase font-bold">
              Adulte
            </span>
            <span className="text-xl font-bold text-primary">
              {prices.adult.toLocaleString()}{" "}
              <span className="text-xs text-gray-500 font-normal">F</span>
            </span>
          </div>
          <div className="flex justify-between md:justify-end items-baseline gap-2">
            <span className="text-xs text-gray-400 uppercase font-bold">
              Enfant
            </span>
            <span className="text-lg font-bold text-gray-600">
              {prices.child.toLocaleString()}{" "}
              <span className="text-xs text-gray-500 font-normal">F</span>
            </span>
          </div>
        </div>

        <Link
          // On passe l'ID. Le prix sera recalculé dans le checkout selon le type passager.
          href={`/booking/checkout?tripId=${id}`}
          className="w-full block text-center bg-secondary hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-secondary/20 active:scale-95"
        >
          Choisir
        </Link>

        <p className="text-xs text-red-500 font-medium animate-pulse">
          Plus que {seatsAvailable} places !
        </p>
      </div>
    </div>
  );
}
