import prisma from "@/lib/prisma";
import { Ticket, Search, Banknote, Tag } from "lucide-react";

export default async function AdminReservationsPage() {
  // 1. Récupération des réservations avec toutes les relations
  const bookings = await prisma.booking.findMany({
    include: {
      user: true, // L'acheteur
      passengers: true, // Les gens dans le bus
      trip: {
        include: {
          route: true, // Détails du trajet
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Calculs rapides pour le résumé
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const totalTickets = bookings.reduce(
    (sum, b) => sum + b.passengers.length,
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ventes et Réservations
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Historique complet des billets émis
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">
                CA Total
              </p>
              <p className="text-sm font-bold">
                {totalRevenue.toLocaleString()} F
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Ticket className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Billets
              </p>
              <p className="text-sm font-bold">{totalTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LISTE DES RÉSERVATIONS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une référence ou un nom..."
            className="text-sm outline-none w-full"
          />
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black">
              <th className="px-6 py-4">Référence</th>
              <th className="px-6 py-4">Client / Acheteur</th>
              <th className="px-6 py-4">Trajet</th>
              <th className="px-6 py-4">Places</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="hover:bg-gray-50 transition-colors text-sm"
              >
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-secondary bg-secondary/5 px-2 py-1 rounded">
                    {booking.reference}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase">
                      {booking.user?.fullName?.charAt(0) || "G"}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">
                        {booking.user?.fullName || "Client Passage"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {booking.user?.phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-700 flex items-center gap-1">
                      {booking.trip.route.fromCity}{" "}
                      <ArrowRight className="w-2 h-2" />{" "}
                      {booking.trip.route.toCity}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(booking.trip.date).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-primary" />
                    <span className="font-medium text-gray-600">
                      {booking.passengers.length} siège(s)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {booking.totalPrice.toLocaleString()} F
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                      booking.status === "PAID"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-yellow-50 text-yellow-600 border-yellow-100"
                    }`}
                  >
                    {booking.status === "PAID" ? "Payé" : "En attente"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-gray-400 text-xs">
                  {new Date(booking.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {bookings.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center">
            <Ticket className="w-12 h-12 text-gray-100 mb-4" />
            <p className="text-gray-400 font-medium">
              Aucune vente enregistrée pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Petit composant flèche pour le trajet
function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}
