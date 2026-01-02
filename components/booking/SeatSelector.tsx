"use client";

import { useState } from "react";
import { Armchair } from "lucide-react";

interface SeatSelectorProps {
  pricePerSeat: number;
  onSelectionChange: (selectedSeats: number[], total: number) => void;
  occupiedSeats?: number[];
}

// Configuration d'un bus standard (4 rangées, allée centrale)
const TOTAL_SEATS = 50;

export default function SeatSelector({
  pricePerSeat,
  onSelectionChange,
  occupiedSeats = [],
}: SeatSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const toggleSeat = (seatId: number) => {
    if (occupiedSeats.includes(seatId)) return; // On ne peut pas cliquer sur une place occupée

    let newSelection;
    if (selectedSeats.includes(seatId)) {
      // Désélectionner
      newSelection = selectedSeats.filter((id) => id !== seatId);
    } else {
      // Sélectionner (Max 5 places par exemple)
      if (selectedSeats.length >= 5) {
        alert("Vous ne pouvez réserver que 5 places maximum.");
        return;
      }
      newSelection = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelection);
    // Renvoie les infos au composant parent pour le calcul du prix
    onSelectionChange(newSelection, newSelection.length * pricePerSeat);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Choisissez vos places
      </h3>

      {/* Légende */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-100 border border-gray-300 flex items-center justify-center">
            <Armchair className="w-4 h-4 text-gray-400" />
          </div>
          <span className="text-gray-600">Libre</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-secondary text-white flex items-center justify-center shadow-md">
            <Armchair className="w-4 h-4 fill-current" />
          </div>
          <span className="text-gray-900 font-bold">Sélectionné</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-800 text-gray-500 flex items-center justify-center opacity-50 cursor-not-allowed">
            <Armchair className="w-4 h-4 fill-current" />
          </div>
          <span className="text-gray-400">Occupé</span>
        </div>
      </div>

      {/* Le Bus */}
      <div className="max-w-[280px] mx-auto bg-gray-50 rounded-t-[3rem] rounded-b-3xl border-2 border-gray-200 p-4 relative pb-12">
        {/* Cabine Chauffeur */}
        <div className="flex justify-end mb-10 border-b-2 border-dashed border-gray-200 pb-4 opacity-50">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full border-4 border-gray-400"></div>
            <span className="text-[10px] uppercase font-bold text-gray-400">
              Chauffeur
            </span>
          </div>
        </div>

        {/* Grille des sièges */}
        <div className="grid grid-cols-5 gap-y-4 gap-x-2">
          {Array.from({ length: TOTAL_SEATS }).map((_, index) => {
            const seatNum = index + 1;
            const isOccupied = occupiedSeats.includes(seatNum);
            const isSelected = selectedSeats.includes(seatNum);

            // Créer l'allée centrale (Col 3 vide)
            const isAisle = index % 5 === 2; // Si c'est la 3ème colonne (index 2)

            if (isAisle)
              return <div key={`aisle-${index}`} className="w-8"></div>;

            return (
              <button
                key={seatNum}
                disabled={isOccupied}
                onClick={() => toggleSeat(seatNum)}
                className={`
                    group relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${
                      isOccupied
                        ? "bg-gray-800 text-gray-600 cursor-not-allowed opacity-40"
                        : isSelected
                        ? "bg-secondary text-white shadow-lg scale-110 ring-2 ring-secondary ring-offset-1 z-10"
                        : "bg-white border border-gray-300 text-gray-500 hover:border-secondary hover:text-secondary"
                    }
                 `}
              >
                <Armchair
                  className={`w-5 h-5 ${isSelected ? "fill-current" : ""}`}
                />
                <span className="absolute -top-2 -right-2 text-[8px] bg-gray-100 text-gray-500 px-1 rounded border border-gray-200 font-mono">
                  {seatNum}
                </span>
              </button>
            );
          })}
        </div>

        {/* Arrière du bus */}
        <div className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
          Fond du bus
        </div>
      </div>

      {/* Récapitulatif sélection mobile */}
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Vous avez sélectionné :{" "}
          <span className="font-bold text-gray-900">
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Aucun"}
          </span>
        </p>
      </div>
    </div>
  );
}
