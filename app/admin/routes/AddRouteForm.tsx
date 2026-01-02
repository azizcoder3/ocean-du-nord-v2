"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addRoute } from "./actions";

export default function AddRouteForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      // Convert form data to typed object with proper number conversion
      const data = {
        fromCity: formData.get("fromCity") as string,
        toCity: formData.get("toCity") as string,
        priceAdult: parseInt(formData.get("priceAdult") as string) || 0,
        priceChild: parseInt(formData.get("priceChild") as string) || 0,
        duration: formData.get("duration") as string,
        distance: parseInt(formData.get("distance") as string) || 0,
      };

      await addRoute(data);

      // Reset form
      e.currentTarget.reset();

      toast.success("Ligne créée avec succès", {
        description: "La nouvelle ligne a été ajoutée.",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ligne:", error);
      toast.error("Erreur lors de la création", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la ligne.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-secondary"/> Nouvelle Ligne
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="fromCity"
          placeholder="Ville de départ (ex: Brazzaville)"
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
          required
        />
        <input
          name="toCity"
          placeholder="Ville d'arrivée (ex: Cameroun)"
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            name="priceAdult"
            type="number"
            placeholder="Prix Adulte"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
          <input
            name="priceChild"
            type="number"
            placeholder="Prix Enfant"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
        </div>
        <input
          name="duration"
          placeholder="Durée (ex: 8h 30m)"
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
        />
        <input
          name="distance"
          type="number"
          placeholder="Distance (km)"
          className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white p-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Création en cours..." : "Créer la destination"}
        </button>
      </form>
    </div>
  );
}
