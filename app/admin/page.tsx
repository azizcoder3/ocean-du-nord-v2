import prisma from "@/lib/prisma";
import {
  Ticket,
  Users,
  Bus,
  Banknote,
  Clock,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import DashboardChart from "@/components/admin/DashboardChart";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. STATISTIQUES GLOBALES
  const totalBookings = await prisma.booking.count();
  const totalUsers = await prisma.user.count();
  const totalBuses = await prisma.bus.count();
  const revenue = await prisma.booking.aggregate({
    _sum: { totalPrice: true },
  });

  // 2. ACTIVITÉ RÉCENTE (5 dernières réservations)
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      trip: { include: { route: true } },
    },
  });

  // 3. PROCHAINS DÉPARTS (5 prochains voyages programmés)
  const upcomingTrips = await prisma.trip.findMany({
    take: 5,
    where: { date: { gte: new Date() } },
    orderBy: { date: "asc" },
    include: { route: true, bus: true },
  });

  // 4. DONNÉES DU GRAPHIQUE (Revenus réels par destination)
  // On récupère les réservations avec leurs trips et routes
  const bookingsWithRoutes = await prisma.booking.findMany({
    include: {
      trip: {
        include: {
          route: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100, // Limite pour les performances
  });

  // On calcule le total des revenus par route
  const routeRevenueMap = new Map<string, number>();
  bookingsWithRoutes.forEach((booking) => {
    const routeId = booking.trip.routeId;
    const currentTotal = routeRevenueMap.get(routeId) || 0;
    routeRevenueMap.set(routeId, currentTotal + booking.totalPrice);
  });

  // On récupère les informations des routes et on crée les données du graphique
  const routeIds = Array.from(routeRevenueMap.keys());
  const routes = await prisma.route.findMany({
    where: {
      id: {
        in: routeIds,
      },
    },
  });

  const chartData = routes
    .map((route) => ({
      name: route.toCity.substring(0, 5),
      total: routeRevenueMap.get(route.id) || 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          Dernière mise à jour : {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Banknote />}
          color="bg-green-500"
          label="Revenus totaux"
          value={`${(revenue._sum.totalPrice || 0).toLocaleString()} F`}
        />
        <StatCard
          icon={<Ticket />}
          color="bg-blue-500"
          label="Réservations"
          value={totalBookings}
        />
        <StatCard
          icon={<Users />}
          color="bg-orange-500"
          label="Utilisateurs"
          value={totalUsers}
        />
        <StatCard
          icon={<Bus />}
          color="bg-purple-500"
          label="Bus actifs"
          value={totalBuses}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* GRAPHIQUE DES VENTES */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> Performance par
              ligne
            </h3>
          </div>
          <DashboardChart data={chartData} />
        </div>

        {/* PROCHAINS DÉPARTS */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-6">Prochains départs</h3>
          <div className="space-y-4">
            {upcomingTrips.map((trip) => (
              <div
                key={trip.id}
                className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {trip.route.fromCity} ➔ {trip.route.toCity}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(trip.date).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • {trip.bus.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/trajets"
            className="w-full mt-6 flex items-center justify-center gap-2 py-3 text-sm font-bold text-primary hover:bg-gray-50 rounded-xl transition-colors"
          >
            Voir tout le planning <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ACTIVITÉ RÉCENTE */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-secondary" /> Réservations récentes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-widest border-b border-gray-50">
                <th className="pb-4">Passager Principal</th>
                <th className="pb-4">Ligne</th>
                <th className="pb-4 text-center">Places</th>
                <th className="pb-4 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr
                  key={b.id}
                  className="group hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4">
                    <p className="text-sm font-bold text-gray-800">
                      {b.user?.fullName || "Invité"}
                    </p>
                    <p className="text-[10px] text-gray-400">{b.reference}</p>
                  </td>
                  <td className="py-4">
                    <p className="text-sm text-gray-600">
                      {b.trip.route.fromCity} ➔ {b.trip.route.toCity}
                    </p>
                  </td>
                  <td className="py-4 text-center">
                    <span className="px-2 py-1 bg-primary/5 text-primary rounded-lg text-xs font-bold">
                      1
                    </span>
                  </td>
                  <td className="py-4 text-right font-bold text-gray-900">
                    {b.totalPrice.toLocaleString()} F
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Petit composant utilitaire pour les cartes de stats
function StatCard({
  icon,
  color,
  label,
  value,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-2xl text-white ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}
