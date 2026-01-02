import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  Calendar,
} from "lucide-react";
import TripsTable from "./TripsTable";

export default async function AdminTrajetsPage() {
  // 1. Récupération des données nécessaires
  const trips = await prisma.trip.findMany({
    include: {
      route: true,
      bus: true,
    },
    orderBy: { date: "asc" },
  });

  const routes = await prisma.route.findMany({ orderBy: { toCity: "asc" } });
  const buses = await prisma.bus.findMany({ orderBy: { name: "asc" } });

  // 2. Server Action pour créer un voyage
  async function addTrip(formData: FormData) {
    "use server";

    const routeId = formData.get("routeId") as string;
    const busId = formData.get("busId") as string;
    const dateStr = formData.get("date") as string; // Format: YYYY-MM-DDTHH:mm

    if (!routeId || !busId || !dateStr) return;

    await prisma.trip.create({
      data: {
        date: new Date(dateStr),
        routeId: routeId,
        busId: busId,
        status: "SCHEDULED",
      },
    });

    revalidatePath("/admin/trajets");
  }

  // Sérialiser les dates pour le composant client
  const serializedTrips = trips.map((trip) => ({
    ...trip,
    date: trip.date,
    route: {
      id: trip.route.id,
      fromCity: trip.route.fromCity,
      toCity: trip.route.toCity,
    },
    bus: {
      id: trip.bus.id,
      name: trip.bus.name,
      type: trip.bus.type,
      capacity: trip.bus.capacity,
    },
  }));

  const serializedBuses = buses.map((bus) => ({
    id: bus.id,
    name: bus.name,
    type: bus.type,
    capacity: bus.capacity,
  }));

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Planning des Voyages
        </h1>
        <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-lg text-sm font-bold">
          {trips.length} départs programmés
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* FORMULAIRE DE PLANIFICATION (1/4 de l'écran) */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Programmer un bus
            </h2>
            <form action={addTrip} className="space-y-4">
              {/* Choix du trajet */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Ligne / Trajet
                </label>
                <select
                  name="routeId"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                >
                  <option value="">Sélectionner une ligne</option>
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fromCity} ➔ {r.toCity} ({r.priceAdult} F)
                    </option>
                  ))}
                </select>
              </div>

              {/* Choix du Bus */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Bus affecté
                </label>
                <select
                  name="busId"
                  required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                >
                  <option value="">Sélectionner un véhicule</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.type} - {b.capacity} places)
                    </option>
                  ))}
                </select>
              </div>

              {/* Choix Date et Heure */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Date et Heure de départ
                </label>
                <input
                  name="date"
                  required
                  type="datetime-local"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-primary/20"
              >
                Ajouter au planning
              </button>
            </form>
          </div>
        </div>

        {/* LISTE DES VOYAGES (3/4 de l'écran) */}
        <div className="xl:col-span-3">
          <TripsTable trips={serializedTrips} buses={serializedBuses} />
        </div>
      </div>
    </div>
  );
}
