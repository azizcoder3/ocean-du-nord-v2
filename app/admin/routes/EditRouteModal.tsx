"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number;
}

interface EditRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  onSave: (id: string, data: {
    fromCity: string;
    toCity: string;
    priceAdult: number;
    priceChild: number;
    duration: string;
    distance: number
  }) => Promise<void>;
}

export default function EditRouteModal({ isOpen, onClose, route, onSave }: EditRouteModalProps) {
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    priceAdult: 0,
    priceChild: 0,
    duration: "",
    distance: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route) {
      setFormData({
        fromCity: route.fromCity,
        toCity: route.toCity,
        priceAdult: route.priceAdult,
        priceChild: route.priceChild,
        duration: route.duration,
        distance: route.distance,
      });
    }
  }, [route]);

  if (!isOpen || !route) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(route.id, formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Modifier la ligne</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville de départ
              </label>
              <input
                type="text"
                required
                value={formData.fromCity}
                onChange={(e) => setFormData({ ...formData, fromCity: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville d&apos;arrivée
              </label>
              <input
                type="text"
                required
                value={formData.toCity}
                onChange={(e) => setFormData({ ...formData, toCity: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Adulte (F)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.priceAdult}
                  onChange={(e) => setFormData({ ...formData, priceAdult: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Enfant (F)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.priceChild}
                  onChange={(e) => setFormData({ ...formData, priceChild: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (ex: 8h 30m)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (km)
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: parseInt(e.target.value) || 0 })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
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
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
