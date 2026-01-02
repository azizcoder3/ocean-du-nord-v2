"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

// Définition du format des filtres
export interface Filters {
  maxPrice: number;
  departureTimes: string[]; // "morning", "afternoon"
  busTypes: string[]; // "Standard", "VIP"
}

interface FilterSidebarProps {
  onFilterChange: (filters: Filters) => void;
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  // État local des filtres
  const [filters, setFilters] = useState<Filters>({
    maxPrice: 35000,
    departureTimes: [],
    busTypes: [],
  });

  // À chaque changement local, on prévient le parent
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Gestion des Checkboxes (Ajout/Retrait)
  const handleCheckboxChange = (
    category: "departureTimes" | "busTypes",
    value: string
  ) => {
    setFilters((prev) => {
      const list = prev[category];
      const newList = list.includes(value)
        ? list.filter((item) => item !== value) // On retire si déjà présent
        : [...list, value]; // On ajoute sinon

      return { ...prev, [category]: newList };
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
        <h2 className="font-bold text-gray-900">Filtrer les résultats</h2>
      </div>

      {/* 1. DÉPART */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Départ
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              checked={filters.departureTimes.includes("morning")}
              onChange={() => handleCheckboxChange("departureTimes", "morning")}
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors text-sm">
              Matin (06h - 12h)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              checked={filters.departureTimes.includes("afternoon")}
              onChange={() =>
                handleCheckboxChange("departureTimes", "afternoon")
              }
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors text-sm">
              Après-midi (12h - 18h)
            </span>
          </label>
        </div>
      </div>

      {/* 2. CONFORT */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Confort
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              checked={filters.busTypes.includes("Standard")}
              onChange={() => handleCheckboxChange("busTypes", "Standard")}
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors text-sm">
              Standard
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 accent-primary"
              checked={filters.busTypes.includes("VIP")}
              onChange={() => handleCheckboxChange("busTypes", "VIP")}
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors text-sm">
              VIP (Clim + TV)
            </span>
          </label>
        </div>
      </div>

      {/* 3. PRIX MAX */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
          Prix max.
        </h3>
        <div className="flex justify-between text-xs font-bold text-primary mb-2">
          <span>{filters.maxPrice.toLocaleString()} F</span>
        </div>
        <input
          type="range"
          min="5000"
          max="35000"
          step="1000"
          className="w-full accent-secondary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
          }
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>5 000 F</span>
          <span>35 000 F</span>
        </div>
      </div>

      <button
        onClick={() =>
          setFilters({ maxPrice: 35000, departureTimes: [], busTypes: [] })
        }
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors text-sm"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}
