"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Ticket, LogOut, Loader2, Clock } from "lucide-react";

// --- Définition des types ---
interface Passenger {
  id: string;
  fullName: string;
  type: "ADULT" | "CHILD";
  seatNumber: number;
  bookingId: string;
}

interface BookingDB {
  id: string;
  reference: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  trip: {
    date: string;
    route: { fromCity: string; toCity: string; duration: string };
    bus: { name: string; type: string };
  };
  passengers: Passenger[];
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState<BookingDB[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // 1. Protection : Si pas connecté, on renvoie au login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // 2. Chargement des données depuis l'API
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile/bookings")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBookings(data);
          }
          setLoadingBookings(false);
        })
        .catch((err) => {
          console.error(err);
          setLoadingBookings(false);
        });
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- SIDEBAR GAUCHE (Menu) --- */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary font-bold text-2xl uppercase">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
                <h2 className="font-bold text-gray-900 text-lg">
                  {session.user?.name}
                </h2>
                <p className="text-sm text-gray-500">Membre Client</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                    activeTab === "bookings"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Ticket className="w-5 h-5" /> Mes Réservations
                </button>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${
                    activeTab === "profile"
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <User className="w-5 h-5" /> Mon Profil
                </button>

                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm text-red-500 hover:bg-red-50 border-t border-gray-100 mt-4 pt-4"
                >
                  <LogOut className="w-5 h-5" /> Se déconnecter
                </button>
              </nav>
            </div>
          </div>

          {/* --- CONTENU PRINCIPAL (Droite) --- */}
          <div className="lg:w-3/4">
            {/* ONGLET : MES RÉSERVATIONS */}
            {activeTab === "bookings" && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Mes Voyages
                </h1>

                {loadingBookings ? (
                  <div className="text-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : bookings.length > 0 ? (
                  <div className="space-y-6">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-md transition-shadow"
                      >
                        {/* Date / Statut */}
                        <div className="md:w-1/4 text-center md:text-left md:border-r border-gray-100 md:pr-6 w-full border-b md:border-b-0 pb-4 md:pb-0">
                          <div className="text-sm text-gray-500 mb-1">
                            Départ le
                          </div>
                          <div className="font-bold text-gray-900 text-lg mb-2">
                            {new Date(booking.trip.date).toLocaleDateString()}
                          </div>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {booking.status === "PAID"
                              ? "Confirmé"
                              : booking.status}
                          </span>
                        </div>

                        {/* Détails */}
                        <div className="flex-1 w-full text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mb-3 justify-center md:justify-start">
                            <div className="text-xl font-bold text-gray-900">
                              {booking.trip.route.fromCity}
                            </div>
                            <div className="hidden md:block w-12 h-0.5 bg-gray-300 relative"></div>
                            <div className="md:hidden text-gray-400">↓</div>
                            <div className="text-xl font-bold text-gray-900">
                              {booking.trip.route.toCity}
                            </div>
                          </div>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />{" "}
                              {new Date(booking.trip.date).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </span>
                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                              Réf: {booking.reference}
                            </span>
                          </div>
                        </div>

                        {/* Bouton Voir */}
                        <div className="md:w-auto w-full">
                          <Link
                            href={`/booking/success?ref=${booking.reference}`}
                            className="block w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-bold text-center hover:bg-gray-800 transition-colors"
                          >
                            Voir le billet
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                    <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Aucune réservation
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Vous n&apos;avez pas encore effectué de voyage avec nous.
                    </p>
                    <Link
                      href="/booking"
                      className="inline-block bg-secondary text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
                    >
                      Réserver un billet
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ONGLET : MON PROFIL */}
            {activeTab === "profile" && (
              <div className="animate-fade-in">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Mon Profil
                </h1>
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                  <form className="space-y-6 max-w-lg">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        disabled
                        value={session.user?.name || ""}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        type="text"
                        disabled
                        value={session.user?.email || ""}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
