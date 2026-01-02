import prisma from "@/lib/prisma";
import BusTable from "./BusTable";
import AddBusForm from "./AddBusForm";

export default async function AdminBusPage() {
  // Récupérer les bus depuis la DB
  const buses = await prisma.bus.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion de la Flotte
        </h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold">
          {buses.length} Bus actifs
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORMULAIRE D'AJOUT (Colonne droite sur large écran) */}
        <div className="xl:col-span-1">
          <AddBusForm />
        </div>

        {/* LISTE DES BUS (Colonne gauche) */}
        <div className="xl:col-span-2">
          <BusTable buses={buses} />
        </div>
      </div>
    </div>
  );
}
