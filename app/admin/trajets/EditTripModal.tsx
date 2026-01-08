//app/admin/trajets/EditTripModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Calendar, Bus } from "lucide-react";

interface TripData {
  id: string;
  date: Date;
  busId: string;
  status: string;
  route: {
    id: string;
    fromCity: string;
    toCity: string;
  };
  bus: {
    id: string;
    name: string;
    type: string;
    capacity: number;
  };
}

interface BusData {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripData | null;
  buses: BusData[];
  onSave: (id: string, data: { date: Date; busId: string }) => Promise<void>;
}

export default function EditTripModal({
  isOpen,
  onClose,
  trip,
  buses,
  onSave,
}: EditTripModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    busId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (trip) {
      const date = new Date(trip.date);

      // Correction du décalage horaire pour l'affichage local (Congo UTC+1)
      // On récupère le décalage en minutes (ex: -60 pour le Congo) et on l'ajuste
      const offset = date.getTimezoneOffset() * 60000; // décalage en millisecondes
      const localDate = new Date(date.getTime() - offset);
      const formattedDate = localDate.toISOString().slice(0, 16);

      setFormData({
        date: formattedDate,
        busId: trip.busId,
      });
    }
  }, [trip]);

  if (!isOpen || !trip) return null;

  // Check if trip can be modified (only SCHEDULED or BOARDING)
  const canModify = trip.status === "SCHEDULED" || trip.status === "BOARDING";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canModify) return;

    setIsLoading(true);
    try {
      await onSave(trip.id, {
        date: new Date(formData.date),
        busId: formData.busId,
      });
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Récupérez la date actuelle au format input
  const now = new Date();
  const minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Modifier le voyage
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Trip Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-bold text-gray-900">
                {trip.route.fromCity}
              </span>
              <span className="text-gray-400">➔</span>
              <span className="font-bold text-gray-900">
                {trip.route.toCity}
              </span>
            </div>
          </div>

          {!canModify && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-6 text-sm">
              <strong>Attention:</strong> Ce voyage est déjà en cours ou
              terminé. Vous ne pouvez plus modifier le bus ou l&apos;heure de
              départ.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date et Heure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Date et Heure de départ
              </label>
              <input
                type="datetime-local"
                required
                min={minDate} // ✅ Empêche de sélectionner une date passée
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !canModify}
              />
            </div>

            {/* Bus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 items-center gap-2">
                <Bus className="w-4 h-4 text-primary" />
                Bus affecté
              </label>
              <select
                required
                value={formData.busId}
                onChange={(e) =>
                  setFormData({ ...formData, busId: e.target.value })
                }
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !canModify}
              >
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.name} ({bus.type} - {bus.capacity} places)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Annuler
              </button>
              {canModify && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
