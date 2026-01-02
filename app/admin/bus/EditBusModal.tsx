"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Bus {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  type: string;
}

interface EditBusModalProps {
  isOpen: boolean;
  onClose: () => void;
  bus: Bus | null;
  onSave: (id: string, data: { name: string; plateNumber: string; capacity: number; type: string }) => Promise<void>;
}

export default function EditBusModal({ isOpen, onClose, bus, onSave }: EditBusModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    plateNumber: "",
    capacity: 50,
    type: "VIP",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (bus) {
      setFormData({
        name: bus.name,
        plateNumber: bus.plateNumber,
        capacity: bus.capacity,
        type: bus.type,
      });
    }
  }, [bus]);

  if (!isOpen || !bus) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(bus.id, formData);
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
            <h3 className="text-xl font-bold text-gray-900">Modifier le bus</h3>
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
                Nom du bus
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaque d&apos;immatriculation
              </label>
              <input
                type="text"
                required
                value={formData.plateNumber}
                onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité (Sièges)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                >
                  <option value="VIP">VIP</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
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

