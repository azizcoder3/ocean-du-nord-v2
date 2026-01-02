import prisma from "@/lib/prisma";
import RouteTable from "./RouteTable";
import AddRouteForm from "./AddRouteForm";

export default async function AdminRoutesPage() {
  // Récupérer les lignes depuis la DB
  const routes = await prisma.route.findMany({
    orderBy: { toCity: "asc" }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des Lignes (Destinations)
        </h1>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold">
          {routes.length} {routes.length === 1 ? "ligne" : "lignes"} active{routes.length > 1 ? "s" : ""}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* FORMULAIRE D'AJOUT (Colonne droite sur large écran) */}
        <div className="xl:col-span-1">
          <AddRouteForm />
        </div>

        {/* LISTE DES LIGNES (Colonne gauche) */}
        <div className="xl:col-span-2">
          <RouteTable routes={routes} />
        </div>
      </div>
    </div>
  );
}
