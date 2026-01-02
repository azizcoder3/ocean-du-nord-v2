"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Users,
  Smartphone,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import SeatSelector from "@/components/booking/SeatSelector";
import Link from "next/link";

interface Passenger {
  seatId: number;
  type: "adult" | "child";
  fullName: string;
}

interface Trip {
  id: string;
  date: string;
  route: {
    fromCity: string;
    toCity: string;
    priceAdult: number;
    priceChild: number;
  };
  occupiedSeats?: number[];
}

type Provider = "MTN" | "AIRTEL" | null;

// Fonction pour récupérer l'image dynamique selon la ville
const getImageForCity = (cityName: string) => {
  const images: Record<string, string> = {
    "Pointe-Noire":
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000",
    Dolisie:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
    Ouesso:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
    Oyo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000",
    Nkayi:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
    Cameroun:
      "https://images.unsplash.com/photo-1523539693385-e5e8995777df?q=80&w=1000",
  };
  return (
    images[cityName] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- ÉTATS ---
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Le téléphone pour le paiement
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentProvider, setPaymentProvider] = useState<Provider>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success"
  >("idle");

  // Récupérer le tripId depuis l'URL
  const tripId = searchParams.get("tripId");

  // Charger les données du voyage
  useEffect(() => {
    if (!tripId) {
      setError("Aucun voyage spécifié");
      setLoading(false);
      return;
    }

    const fetchTripData = async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) {
          throw new Error("Voyage non trouvé");
        }
        const data = await response.json();
        setTrip(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "Erreur de chargement du voyage");
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [tripId]);

  // Rediriger si erreur ou pas de tripId
  useEffect(() => {
    if (!loading && (!tripId || error)) {
      const timer = setTimeout(() => {
        router.push("/booking");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, tripId, error, router]);

  // --- LOGIQUE SIÈGES ---
  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats);
    setPassengers((prevPassengers) => {
      return seats.map((seatId) => {
        const existingPassenger = prevPassengers.find(
          (p) => p.seatId === seatId
        );
        return (
          existingPassenger || { seatId: seatId, type: "adult", fullName: "" }
        );
      });
    });
  };

  const updatePassenger = (
    seatId: number,
    field: keyof Passenger,
    value: string
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.seatId === seatId ? { ...p, [field]: value } : p))
    );
  };

  const totalPrice = passengers.reduce((total, p) => {
    if (!trip) return 0;
    return (
      total +
      (p.type === "adult" ? trip.route.priceAdult : trip.route.priceChild)
    );
  }, 0);

  // --- LOGIQUE PAIEMENT ---
  const handlePaymentClick = async () => {
    setErrorMessage("");

    // Validation Noms
    const emptyNames = passengers.filter((p) => p.fullName.trim() === "");
    if (emptyNames.length > 0) {
      setErrorMessage(`Nom manquant pour le siège ${emptyNames[0].seatId}`);
      return;
    }

    // Validation Réseau
    if (!paymentProvider) {
      setErrorMessage("Choisissez MTN ou Airtel.");
      return;
    }

    // Validation Téléphone
    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage("Numéro de téléphone invalide.");
      return;
    }

    // Validation Préfixe
    const cleanPhone = phoneNumber.replace(/\s/g, "");
    if (paymentProvider === "MTN" && !cleanPhone.startsWith("06")) {
      setErrorMessage("Numéro MTN invalide (doit commencer par 06)");
      return;
    }
    if (paymentProvider === "AIRTEL" && !cleanPhone.startsWith("05")) {
      setErrorMessage("Numéro Airtel invalide (doit commencer par 05)");
      return;
    }

    // Validation Email (si fourni)
    let cleanEmail = null;
    if (email && email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage("Adresse email invalide.");
        return;
      }
      cleanEmail = email.trim();
    }

    // Préparation du payload pour l'API
    const payload = {
      tripId: trip?.id,
      passengers: passengers.map((p) => ({
        fullName: p.fullName,
        type: p.type,
        seatId: p.seatId,
      })),
      totalPrice: totalPrice,
      paymentMethod: paymentProvider,
      contactInfo: {
        phone: cleanPhone,
        email: cleanEmail,
      },
    };

    try {
      // Appel API vers /api/bookings
      setIsPaymentModalOpen(true);
      setPaymentStatus("processing");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la réservation");
      }

      const result = await response.json();

      // Succès - Afficher le message et rediriger avec la référence
      setPaymentStatus("success");
      setTimeout(() => {
        router.push(`/booking/success?ref=${result.reference}`);
      }, 1500);
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      // Fermer la modale et afficher l'erreur
      setIsPaymentModalOpen(false);
      setPaymentStatus("idle");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la réservation";
      toast.error(errorMessage);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/destinations/pointe-noire"
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Finaliser votre réservation
            </h1>
            <p className="text-sm text-gray-500">
              Sélectionnez vos places à gauche, remplissez les infos à droite.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* --- COLONNE GAUCHE : JUSTE LE PLAN --- */}
          <div className="lg:col-span-2">
            {trip ? (
              <SeatSelector
                pricePerSeat={trip.route.priceAdult}
                onSelectionChange={(seats) => handleSeatSelection(seats)}
                occupiedSeats={trip.occupiedSeats || []}
              />
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Chargement du plan de siège...</p>
              </div>
            )}
          </div>

          {/* --- COLONNE DROITE : TOUT LE RESTE (STICKY) --- */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Votre Voyage
              </h3>

              {/* Infos Trajet */}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
                  <span className="text-gray-500">
                    Chargement des informations du voyage...
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-3 mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <h4 className="font-bold text-red-700 text-sm">Erreur</h4>
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Redirection vers la recherche...
                    </p>
                  </div>
                </div>
              ) : trip ? (
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      // MODIFICATION ICI : On utilise la fonction avec la ville dynamique
                      src={getImageForCity(trip.route.toCity)}
                      alt={trip.route.toCity}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {trip.route.fromCity} ➔ {trip.route.toCity}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />{" "}
                      <span>{formatDate(trip.date)}</span>
                      <Clock className="w-3 h-3" />{" "}
                      <span>{formatTime(trip.date)}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* --- FORMULAIRE PASSAGERS --- */}
              {selectedSeats.length > 0 ? (
                <div className="mb-6 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Passagers ({selectedSeats.length})</span>
                  </div>

                  {/* Zone scrollable si beaucoup de passagers */}
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {passengers.map((passenger) => (
                      <div
                        key={passenger.seatId}
                        className="bg-gray-50 p-3 rounded-xl border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-secondary">
                            Siège {passenger.seatId}
                          </span>
                          <select
                            className="text-xs bg-transparent font-bold text-gray-700 outline-none cursor-pointer text-right"
                            value={passenger.type}
                            onChange={(e) =>
                              updatePassenger(
                                passenger.seatId,
                                "type",
                                e.target.value
                              )
                            }
                          >
                            <option value="adult">Adulte</option>
                            <option value="child">Enfant</option>
                          </select>
                        </div>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-secondary outline-none transition-colors"
                            placeholder="Nom complet"
                            value={passenger.fullName}
                            onChange={(e) =>
                              updatePassenger(
                                passenger.seatId,
                                "fullName",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl text-center border border-blue-100">
                  👈 Veuillez sélectionner vos places sur le plan à gauche.
                </div>
              )}

              {/* Total */}
              {selectedSeats.length > 0 && (
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
                  <span className="font-bold text-gray-900">Total à payer</span>
                  <span className="font-bold text-xl text-primary">
                    {totalPrice.toLocaleString()} FCFA
                  </span>
                </div>
              )}

              {/* --- SECTION PAIEMENT --- */}
              {selectedSeats.length > 0 && (
                <div className="animate-fade-in space-y-4">
                  {/* 1. Choix Réseau */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Paiement Mobile Money
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => {
                          setPaymentProvider("MTN");
                          setErrorMessage("");
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          paymentProvider === "MTN"
                            ? "border-[#ffcc00] bg-[#ffcc00]/10"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-[#ffcc00] text-[10px] flex items-center justify-center font-bold text-black mb-1">
                          MTN
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          MTN
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setPaymentProvider("AIRTEL");
                          setErrorMessage("");
                        }}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          paymentProvider === "AIRTEL"
                            ? "border-[#ff0000] bg-[#ff0000]/10"
                            : "border-gray-100 hover:border-gray-300"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-[#ff0000] text-[10px] flex items-center justify-center font-bold text-white mb-1">
                          Ai
                        </div>
                        <span className="text-xs font-bold text-gray-700">
                          Airtel
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 2. Champ Téléphone */}
                  {paymentProvider && (
                    <div className="animate-fade-in-down">
                      <div
                        className={`
                                flex items-center border-2 rounded-xl overflow-hidden bg-white transition-colors
                                ${
                                  errorMessage &&
                                  errorMessage.includes("numéro")
                                    ? "border-red-300"
                                    : "border-gray-200 focus-within:border-secondary"
                                }
                            `}
                      >
                        <div className="bg-gray-100 px-3 py-3 border-r border-gray-200 text-gray-500 font-bold text-sm select-none">
                          +242
                        </div>
                        <input
                          type="tel"
                          maxLength={9}
                          placeholder={
                            paymentProvider === "MTN"
                              ? "06 600..."
                              : "05 500..."
                          }
                          className="w-full p-3 outline-none font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-300"
                          value={phoneNumber}
                          onChange={(e) => {
                            setErrorMessage("");
                            setPhoneNumber(e.target.value);
                          }}
                        />
                        {phoneNumber.length >= 9 && !errorMessage && (
                          <div className="pr-3 text-green-500">
                            <Check className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 3. Champ Email (optionnel) */}
                  {paymentProvider && (
                    <div className="animate-fade-in-down">
                      <div className="relative">
                        <input
                          type="email"
                          className="w-full pl-3 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-secondary outline-none transition-colors"
                          placeholder="Adresse email (optionnel pour recevoir votre billet)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Message Erreur */}
                  {errorMessage && (
                    <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg animate-pulse">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* BOUTON PAYER */}
                  <button
                    onClick={handlePaymentClick}
                    className="w-full py-4 bg-secondary hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    Payer {totalPrice.toLocaleString()} FCFA
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- MODALE DE PAIEMENT --- */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <div
                className={`p-6 text-center text-white relative ${
                  paymentProvider === "MTN" ? "bg-[#ffcc00]" : "bg-[#ff0000]"
                }`}
              >
                <h3
                  className={`text-xl font-bold ${
                    paymentProvider === "MTN" ? "text-black" : "text-white"
                  }`}
                >
                  Paiement {paymentProvider}
                </h3>
              </div>
              <div className="p-8 text-center">
                {paymentStatus === "processing" && (
                  <>
                    <div className="relative mx-auto w-20 h-20 mb-6">
                      <div
                        className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
                          paymentProvider === "MTN"
                            ? "border-[#ffcc00]"
                            : "border-[#ff0000]"
                        }`}
                      ></div>
                      <Smartphone className="absolute inset-0 m-auto text-gray-400 w-8 h-8 animate-pulse" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      Veuillez valider sur votre téléphone :
                    </p>
                    <p className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
                      (+242) {phoneNumber}
                    </p>
                    <div className="text-xs bg-gray-100 p-2 rounded text-gray-500">
                      En attente du code PIN...
                    </div>
                  </>
                )}
                {paymentStatus === "success" && (
                  <div className="py-4 animate-scale-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <Check className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-green-700">
                      Paiement Accepté !
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Redirection vers votre billet...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Fonctions utilitaires pour formater la date et l'heure
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const days = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
  const months = [
    "Jan.",
    "Fév.",
    "Mar.",
    "Avr.",
    "Mai.",
    "Juin.",
    "Juil.",
    "Août.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Déc.",
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const monthName = months[date.getMonth()];

  return `${dayName} ${day} ${monthName}`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
}
