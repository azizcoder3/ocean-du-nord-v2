"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addBus } from "./actions";

export default function AddBusForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    plate: "",
    capacity: 50,
    type: "VIP",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await addBus({
        name: formData.name,
        plateNumber: formData.plate,
        capacity: formData.capacity,
        type: formData.type,
      });
      
      toast.success("Bus ajouté avec succès", {
        description: `Le bus "${formData.name}" a été ajouté à la flotte.`,
      });

      // Réinitialiser le formulaire
      setFormData({
        name: "",
        plate: "",
        capacity: 50,
        type: "VIP",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'ajout du bus.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-secondary" /> Ajouter un nouveau bus
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du bus (Ex: Yutong VIP 01)
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
            value={formData.plate}
            onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enregistrement..." : "Enregistrer le bus"}
        </button>
      </form>
    </div>
  );
}

