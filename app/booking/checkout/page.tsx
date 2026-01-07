// app/booking/checkout/page.tsx
// app/booking/checkout/page.tsx
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
  ShieldCheck,
  Mail,
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

// Frais de transaction (2%)
const FEE_PERCENT = 0.02;

// Fonction pour récupérer l'image dynamique selon la ville
const getImageForCity = (cityName: string) => {
  const images: Record<string, string> = {
    "Pointe-Noire":
      "https://images.unsplash.com/photo-1572979246397-9e66179313db?q=80&w=1000",
    Dolisie:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
    Ouesso:
      "https://images.unsplash.com/photo-1502442468593-9c8cb1d7945d?q=80&w=1000",
    Oyo: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1000",
    Nkayi:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
    Cameroun:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a5535?q=80&w=1000",
  };
  return (
    images[cityName] ||
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000"
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

  // Paiement
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentProvider, setPaymentProvider] = useState<Provider>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Modale & Status
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");

  // Polling ref
  const [currentPaymentRef, setCurrentPaymentRef] = useState<string | null>(
    null
  );

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
        if (!response.ok) throw new Error("Voyage non trouvé");
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

  // Redirection erreur
  useEffect(() => {
    if (!loading && (!tripId || error)) {
      const timer = setTimeout(() => router.push("/booking"), 3000);
      return () => clearTimeout(timer);
    }
  }, [loading, tripId, error, router]);

  // --- LOGIQUE POLLING (Vérification statut boucle) ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (
      isPaymentModalOpen &&
      paymentStatus === "processing" &&
      currentPaymentRef
    ) {
      console.log("🔄 Démarrage du polling pour :", currentPaymentRef);

      intervalId = setInterval(async () => {
        try {
          const res = await fetch(
            `/api/payment/check?ref=${currentPaymentRef}`
          );
          const data = await res.json();

          console.log("Statut reçu :", data.status);

          if (data.status === "SUCCESSFUL") {
            setPaymentStatus("success");
            clearInterval(intervalId);

            // Redirection
            setTimeout(() => {
              // On utilise window.bookingReference stocké lors du POST initial
              // ou on redirige vers une page générique si perdue
              const targetRef = window.bookingReference || "unknown";
              router.push(`/booking/success?ref=${targetRef}`);
            }, 2000);
          } else if (data.status === "FAILED") {
            setPaymentStatus("failed");
            setErrorMessage("Paiement échoué ou expiré.");
            clearInterval(intervalId);
          }
        } catch (e) {
          console.error("Erreur polling:", e);
        }
      }, 3000); // Vérifie toutes les 3 secondes
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPaymentModalOpen, paymentStatus, currentPaymentRef, router]);

  // --- LOGIQUE SIÈGES ---
  const handleSeatSelection = (seats: number[]) => {
    setSelectedSeats(seats);
    setPassengers((prev) =>
      seats.map((seatId) => {
        const existing = prev.find((p) => p.seatId === seatId);
        return existing || { seatId, type: "adult", fullName: "" };
      })
    );
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

  // Calculs Prix
  const subTotal = passengers.reduce((total, p) => {
    if (!trip) return 0;
    return (
      total +
      (p.type === "adult" ? trip.route.priceAdult : trip.route.priceChild)
    );
  }, 0);

  const fees = Math.ceil(subTotal * FEE_PERCENT);
  const totalPrice = subTotal + fees;

  // --- LOGIQUE PAIEMENT ---
  const handlePaymentClick = async () => {
    setErrorMessage("");

    // Validations
    const emptyNames = passengers.filter((p) => p.fullName.trim() === "");
    if (emptyNames.length > 0) {
      setErrorMessage(`Nom manquant pour le siège ${emptyNames[0].seatId}`);
      return;
    }
    if (!paymentProvider) {
      setErrorMessage("Choisissez MTN ou Airtel.");
      return;
    }
    if (!phoneNumber || phoneNumber.length < 9) {
      setErrorMessage("Numéro de téléphone invalide.");
      return;
    }
    const cleanPhone = phoneNumber.replace(/\s/g, "");
    if (paymentProvider === "MTN" && !cleanPhone.startsWith("06")) {
      setErrorMessage("Numéro MTN invalide (06...)");
      return;
    }
    if (paymentProvider === "AIRTEL" && !cleanPhone.startsWith("05")) {
      setErrorMessage("Numéro Airtel invalide (05...)");
      return;
    }

    const payload = {
      tripId: trip?.id,
      passengers: passengers.map((p) => ({
        fullName: p.fullName,
        type: p.type,
        seatId: p.seatId,
      })),
      totalPrice: subTotal,
      paymentMethod: paymentProvider,
      contactInfo: { phone: cleanPhone, email: email.trim() || undefined },
    };

    try {
      setIsPaymentModalOpen(true);
      setPaymentStatus("processing");

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur réservation");
      }

      const result = await response.json();

      if (result.status === "PENDING" && result.paymentId) {
        setCurrentPaymentRef(result.paymentId);
        window.bookingReference = result.reference;
      } else {
        setPaymentStatus("success");
        setTimeout(
          () => router.push(`/booking/success?ref=${result.reference}`),
          1500
        );
      }
    } catch (error) {
      console.error("Erreur:", error);
      setIsPaymentModalOpen(false);
      setPaymentStatus("idle");
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
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
          {/* GAUCHE : PLAN */}
          <div className="lg:col-span-2">
            {trip ? (
              <SeatSelector
                pricePerSeat={trip.route.priceAdult}
                onSelectionChange={handleSeatSelection}
                occupiedSeats={trip.occupiedSeats || []}
              />
            ) : (
              <div className="bg-white p-6 text-center rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
              </div>
            )}
          </div>

          {/* DROITE : FORMULAIRE */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Votre Voyage
              </h3>

              {/* Info Voyage */}
              {trip && (
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
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
              )}

              {/* Passagers */}
              {selectedSeats.length > 0 ? (
                <div className="mb-6 space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Passagers ({selectedSeats.length})</span>
                  </div>
                  {passengers.map((p) => (
                    <div
                      key={p.seatId}
                      className="bg-gray-50 p-3 rounded-xl border border-gray-200"
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold px-2 py-1 bg-white rounded border">
                          Siège {p.seatId}
                        </span>
                        <select
                          className="text-xs bg-transparent font-bold"
                          value={p.type}
                          onChange={(e) =>
                            updatePassenger(p.seatId, "type", e.target.value)
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
                          className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg bg-white"
                          placeholder="Nom complet"
                          value={p.fullName}
                          onChange={(e) =>
                            updatePassenger(
                              p.seatId,
                              "fullName",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl text-center">
                  👈 Veuillez sélectionner vos places.
                </div>
              )}

              {/* RÉSUMÉ PRIX */}
              {selectedSeats.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-xl mb-6 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Sous-total</span>
                    <span>{subTotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Frais ({FEE_PERCENT * 100}%)</span>
                    <span>{fees.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-900">
                      Total à payer
                    </span>
                    <span className="font-bold text-xl text-primary">
                      {totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                </div>
              )}

              {/* Paiement */}
              {selectedSeats.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentProvider("MTN")}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center ${
                        paymentProvider === "MTN"
                          ? "border-[#ffcc00] bg-[#ffcc00]/10"
                          : "border-gray-100"
                      }`}
                    >
                      <span className="font-bold text-xs">MTN</span>
                    </button>
                    <button
                      onClick={() => setPaymentProvider("AIRTEL")}
                      className={`p-3 rounded-xl border-2 flex flex-col items-center ${
                        paymentProvider === "AIRTEL"
                          ? "border-[#ff0000] bg-[#ff0000]/10"
                          : "border-gray-100"
                      }`}
                    >
                      <span className="font-bold text-xs">Airtel</span>
                    </button>
                  </div>

                  {paymentProvider && (
                    <div className="animate-fade-in-down space-y-3">
                      {/* Téléphone */}
                      <div className="flex items-center border-2 rounded-xl overflow-hidden bg-white">
                        <div className="bg-gray-100 px-3 py-3 border-r font-bold text-sm text-gray-500">
                          +242
                        </div>
                        <input
                          type="tel"
                          maxLength={9}
                          className="w-full p-3 font-bold outline-none"
                          placeholder="06 600..."
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>

                      {/* Email (AJOUTÉ ICI) */}
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-3 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm outline-none focus:border-secondary transition-colors"
                          placeholder="Email (pour recevoir le billet)"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                  )}

                  {/* <button
                    onClick={handlePaymentClick}
                    className="w-full py-4 bg-secondary text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition-all flex justify-center items-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" />
                    Payer {totalPrice.toLocaleString()} FCFA
                  </button> */}
                  <button
                    onClick={handlePaymentClick}
                    // 1. AJOUTE CETTE LIGNE : On désactive si c'est en cours ou fini
                    disabled={
                      paymentStatus === "processing" ||
                      paymentStatus === "success"
                    }
                    // 2. MODIFIE LA CLASSNAME pour changer l'apparence quand c'est désactivé
                    className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex justify-center items-center gap-2
                      ${
                        paymentStatus === "processing" ||
                        paymentStatus === "success"
                          ? "bg-gray-400 cursor-not-allowed" // Gris si désactivé
                          : "bg-secondary hover:bg-amber-600 shadow-secondary/20 active:scale-95" // Orange normal
                      }
                    `}
                  >
                    {/* 3. Change le texte et l'icône si ça charge */}
                    {paymentStatus === "processing" ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Traitement en cours...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-5 h-5" />
                        Payer {totalPrice.toLocaleString()} FCFA
                      </>
                    )}
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
                className={`p-6 text-center text-white ${
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
                    <p className="text-gray-600 mb-1">
                      Veuillez valider le retrait de :
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mb-4">
                      {totalPrice.toLocaleString()} FCFA
                    </p>
                    <p className="text-gray-500 mb-6">
                      Sur le numéro (+242) {phoneNumber}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-xs bg-blue-50 text-blue-700 p-3 rounded-lg animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      En attente de votre validation...
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
                      Génération du billet en cours...
                    </p>
                    {/* Redirection gérée par le useEffect */}
                  </div>
                )}

                {paymentStatus === "failed" && (
                  <div className="py-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-red-700">
                      Paiement Échoué
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
                    <button
                      onClick={() => {
                        setIsPaymentModalOpen(false);
                        setPaymentStatus("idle");
                      }}
                      className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold"
                    >
                      Fermer et réessayer
                    </button>
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

// Hack pour TypeScript pour stocker la ref globalement
declare global {
  interface Window {
    bookingReference?: string;
  }
}

// --- FONCTIONS UTILITAIRES (AJOUTÉES ICI) ---
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
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}h${minutes}`;
}

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   User,
//   Users,
//   Smartphone,
//   AlertCircle,
//   Check,
//   Loader2,
// } from "lucide-react";
// import SeatSelector from "@/components/booking/SeatSelector";
// import Link from "next/link";

// interface Passenger {
//   seatId: number;
//   type: "adult" | "child";
//   fullName: string;
// }

// interface Trip {
//   id: string;
//   date: string;
//   route: {
//     fromCity: string;
//     toCity: string;
//     priceAdult: number;
//     priceChild: number;
//   };
//   occupiedSeats?: number[];
// }

// type Provider = "MTN" | "AIRTEL" | null;

// // Fonction pour récupérer l'image dynamique selon la ville
// const getImageForCity = (cityName: string) => {
//   const images: Record<string, string> = {
//     "Pointe-Noire":
//       "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000",
//     Dolisie:
//       "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
//     Ouesso:
//       "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
//     Oyo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000",
//     Nkayi:
//       "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000",
//     Cameroun:
//       "https://images.unsplash.com/photo-1523539693385-e5e8995777df?q=80&w=1000",
//   };
//   return (
//     images[cityName] ||
//     "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000"
//   );
// };

// export default function CheckoutPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   // --- ÉTATS ---
//   const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
//   const [passengers, setPassengers] = useState<Passenger[]>([]);
//   const [trip, setTrip] = useState<Trip | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Le téléphone pour le paiement
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [email, setEmail] = useState("");
//   const [paymentProvider, setPaymentProvider] = useState<Provider>(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState<
//     "idle" | "processing" | "success"
//   >("idle");

//   // Récupérer le tripId depuis l'URL
//   const tripId = searchParams.get("tripId");

//   // Charger les données du voyage
//   useEffect(() => {
//     if (!tripId) {
//       setError("Aucun voyage spécifié");
//       setLoading(false);
//       return;
//     }

//     const fetchTripData = async () => {
//       try {
//         const response = await fetch(`/api/trips/${tripId}`);
//         if (!response.ok) {
//           throw new Error("Voyage non trouvé");
//         }
//         const data = await response.json();
//         setTrip(data);
//       } catch (err) {
//         const error = err as Error;
//         setError(error.message || "Erreur de chargement du voyage");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTripData();
//   }, [tripId]);

//   // Rediriger si erreur ou pas de tripId
//   useEffect(() => {
//     if (!loading && (!tripId || error)) {
//       const timer = setTimeout(() => {
//         router.push("/booking");
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [loading, tripId, error, router]);

//   // --- LOGIQUE SIÈGES ---
//   const handleSeatSelection = (seats: number[]) => {
//     setSelectedSeats(seats);
//     setPassengers((prevPassengers) => {
//       return seats.map((seatId) => {
//         const existingPassenger = prevPassengers.find(
//           (p) => p.seatId === seatId
//         );
//         return (
//           existingPassenger || { seatId: seatId, type: "adult", fullName: "" }
//         );
//       });
//     });
//   };

//   const updatePassenger = (
//     seatId: number,
//     field: keyof Passenger,
//     value: string
//   ) => {
//     setPassengers((prev) =>
//       prev.map((p) => (p.seatId === seatId ? { ...p, [field]: value } : p))
//     );
//   };

//   const totalPrice = passengers.reduce((total, p) => {
//     if (!trip) return 0;
//     return (
//       total +
//       (p.type === "adult" ? trip.route.priceAdult : trip.route.priceChild)
//     );
//   }, 0);

//   // --- LOGIQUE PAIEMENT ---
//   const handlePaymentClick = async () => {
//     setErrorMessage("");

//     // Validation Noms
//     const emptyNames = passengers.filter((p) => p.fullName.trim() === "");
//     if (emptyNames.length > 0) {
//       setErrorMessage(`Nom manquant pour le siège ${emptyNames[0].seatId}`);
//       return;
//     }

//     // Validation Réseau
//     if (!paymentProvider) {
//       setErrorMessage("Choisissez MTN ou Airtel.");
//       return;
//     }

//     // Validation Téléphone
//     if (!phoneNumber || phoneNumber.length < 9) {
//       setErrorMessage("Numéro de téléphone invalide.");
//       return;
//     }

//     // Validation Préfixe
//     const cleanPhone = phoneNumber.replace(/\s/g, "");
//     if (paymentProvider === "MTN" && !cleanPhone.startsWith("06")) {
//       setErrorMessage("Numéro MTN invalide (doit commencer par 06)");
//       return;
//     }
//     if (paymentProvider === "AIRTEL" && !cleanPhone.startsWith("05")) {
//       setErrorMessage("Numéro Airtel invalide (doit commencer par 05)");
//       return;
//     }

//     // Validation Email (si fourni)
//     let cleanEmail = null;
//     if (email && email.trim() !== "") {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setErrorMessage("Adresse email invalide.");
//         return;
//       }
//       cleanEmail = email.trim();
//     }

//     // Préparation du payload pour l'API
//     const payload = {
//       tripId: trip?.id,
//       passengers: passengers.map((p) => ({
//         fullName: p.fullName,
//         type: p.type,
//         seatId: p.seatId,
//       })),
//       totalPrice: totalPrice,
//       paymentMethod: paymentProvider,
//       contactInfo: {
//         phone: cleanPhone,
//         email: cleanEmail,
//       },
//     };

//     try {
//       // Appel API vers /api/bookings
//       setIsPaymentModalOpen(true);
//       setPaymentStatus("processing");

//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Erreur lors de la réservation");
//       }

//       const result = await response.json();

//       // Succès - Afficher le message et rediriger avec la référence
//       setPaymentStatus("success");
//       setTimeout(() => {
//         router.push(`/booking/success?ref=${result.reference}`);
//       }, 1500);
//     } catch (error) {
//       console.error("Erreur lors de la réservation:", error);
//       // Fermer la modale et afficher l'erreur
//       setIsPaymentModalOpen(false);
//       setPaymentStatus("idle");
//       const errorMessage =
//         error instanceof Error
//           ? error.message
//           : "Erreur lors de la réservation";
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 pt-24 pb-20 relative">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <Link
//             href="/destinations/pointe-noire"
//             className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5 text-gray-600" />
//           </Link>
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Finaliser votre réservation
//             </h1>
//             <p className="text-sm text-gray-500">
//               Sélectionnez vos places à gauche, remplissez les infos à droite.
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* --- COLONNE GAUCHE : JUSTE LE PLAN --- */}
//           <div className="lg:col-span-2">
//             {trip ? (
//               <SeatSelector
//                 pricePerSeat={trip.route.priceAdult}
//                 onSelectionChange={(seats) => handleSeatSelection(seats)}
//                 occupiedSeats={trip.occupiedSeats || []}
//               />
//             ) : (
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
//                 <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
//                 <p className="text-gray-500">Chargement du plan de siège...</p>
//               </div>
//             )}
//           </div>

//           {/* --- COLONNE DROITE : TOUT LE RESTE (STICKY) --- */}
//           <div className="lg:col-span-1">
//             <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
//                 Votre Voyage
//               </h3>

//               {/* Infos Trajet */}
//               {loading ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
//                   <span className="text-gray-500">
//                     Chargement des informations du voyage...
//                   </span>
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center gap-3 mb-6 bg-red-50 border border-red-200 p-4 rounded-lg">
//                   <AlertCircle className="w-5 h-5 text-red-500" />
//                   <div>
//                     <h4 className="font-bold text-red-700 text-sm">Erreur</h4>
//                     <p className="text-xs text-red-600 mt-1">{error}</p>
//                     <p className="text-xs text-red-600 mt-1">
//                       Redirection vers la recherche...
//                     </p>
//                   </div>
//                 </div>
//               ) : trip ? (
//                 <div className="flex items-start gap-3 mb-6">
//                   <div className="w-14 h-14 rounded-lg overflow-hidden relative flex-shrink-0">
//                     <Image
//                       // MODIFICATION ICI : On utilise la fonction avec la ville dynamique
//                       src={getImageForCity(trip.route.toCity)}
//                       alt={trip.route.toCity}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div>
//                     <h4 className="font-bold text-gray-900 text-sm">
//                       {trip.route.fromCity} ➔ {trip.route.toCity}
//                     </h4>
//                     <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
//                       <Calendar className="w-3 h-3" />{" "}
//                       <span>{formatDate(trip.date)}</span>
//                       <Clock className="w-3 h-3" />{" "}
//                       <span>{formatTime(trip.date)}</span>
//                     </div>
//                   </div>
//                 </div>
//               ) : null}

//               {/* --- FORMULAIRE PASSAGERS --- */}
//               {selectedSeats.length > 0 ? (
//                 <div className="mb-6 animate-fade-in">
//                   <div className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-700">
//                     <Users className="w-4 h-4 text-primary" />
//                     <span>Passagers ({selectedSeats.length})</span>
//                   </div>

//                   {/* Zone scrollable si beaucoup de passagers */}
//                   <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
//                     {passengers.map((passenger) => (
//                       <div
//                         key={passenger.seatId}
//                         className="bg-gray-50 p-3 rounded-xl border border-gray-200"
//                       >
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-xs font-bold bg-white px-2 py-1 rounded border border-gray-200 text-secondary">
//                             Siège {passenger.seatId}
//                           </span>
//                           <select
//                             className="text-xs bg-transparent font-bold text-gray-700 outline-none cursor-pointer text-right"
//                             value={passenger.type}
//                             onChange={(e) =>
//                               updatePassenger(
//                                 passenger.seatId,
//                                 "type",
//                                 e.target.value
//                               )
//                             }
//                           >
//                             <option value="adult">Adulte</option>
//                             <option value="child">Enfant</option>
//                           </select>
//                         </div>
//                         <div className="relative">
//                           <User className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
//                           <input
//                             type="text"
//                             className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-secondary outline-none transition-colors"
//                             placeholder="Nom complet"
//                             value={passenger.fullName}
//                             onChange={(e) =>
//                               updatePassenger(
//                                 passenger.seatId,
//                                 "fullName",
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-xl text-center border border-blue-100">
//                   👈 Veuillez sélectionner vos places sur le plan à gauche.
//                 </div>
//               )}

//               {/* Total */}
//               {selectedSeats.length > 0 && (
//                 <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-6">
//                   <span className="font-bold text-gray-900">Total à payer</span>
//                   <span className="font-bold text-xl text-primary">
//                     {totalPrice.toLocaleString()} FCFA
//                   </span>
//                 </div>
//               )}

//               {/* --- SECTION PAIEMENT --- */}
//               {selectedSeats.length > 0 && (
//                 <div className="animate-fade-in space-y-4">
//                   {/* 1. Choix Réseau */}
//                   <div>
//                     <p className="text-xs font-bold text-gray-500 uppercase mb-2">
//                       Paiement Mobile Money
//                     </p>
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         onClick={() => {
//                           setPaymentProvider("MTN");
//                           setErrorMessage("");
//                         }}
//                         className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
//                           paymentProvider === "MTN"
//                             ? "border-[#ffcc00] bg-[#ffcc00]/10"
//                             : "border-gray-100 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="w-6 h-6 rounded-full bg-[#ffcc00] text-[10px] flex items-center justify-center font-bold text-black mb-1">
//                           MTN
//                         </div>
//                         <span className="text-xs font-bold text-gray-700">
//                           MTN
//                         </span>
//                       </button>

//                       <button
//                         onClick={() => {
//                           setPaymentProvider("AIRTEL");
//                           setErrorMessage("");
//                         }}
//                         className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
//                           paymentProvider === "AIRTEL"
//                             ? "border-[#ff0000] bg-[#ff0000]/10"
//                             : "border-gray-100 hover:border-gray-300"
//                         }`}
//                       >
//                         <div className="w-6 h-6 rounded-full bg-[#ff0000] text-[10px] flex items-center justify-center font-bold text-white mb-1">
//                           Ai
//                         </div>
//                         <span className="text-xs font-bold text-gray-700">
//                           Airtel
//                         </span>
//                       </button>
//                     </div>
//                   </div>

//                   {/* 2. Champ Téléphone */}
//                   {paymentProvider && (
//                     <div className="animate-fade-in-down">
//                       <div
//                         className={`
//                                 flex items-center border-2 rounded-xl overflow-hidden bg-white transition-colors
//                                 ${
//                                   errorMessage &&
//                                   errorMessage.includes("numéro")
//                                     ? "border-red-300"
//                                     : "border-gray-200 focus-within:border-secondary"
//                                 }
//                             `}
//                       >
//                         <div className="bg-gray-100 px-3 py-3 border-r border-gray-200 text-gray-500 font-bold text-sm select-none">
//                           +242
//                         </div>
//                         <input
//                           type="tel"
//                           maxLength={9}
//                           placeholder={
//                             paymentProvider === "MTN"
//                               ? "06 600..."
//                               : "05 500..."
//                           }
//                           className="w-full p-3 outline-none font-bold text-gray-900 placeholder:font-normal placeholder:text-gray-300"
//                           value={phoneNumber}
//                           onChange={(e) => {
//                             setErrorMessage("");
//                             setPhoneNumber(e.target.value);
//                           }}
//                         />
//                         {phoneNumber.length >= 9 && !errorMessage && (
//                           <div className="pr-3 text-green-500">
//                             <Check className="w-5 h-5" />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {/* 3. Champ Email (optionnel) */}
//                   {paymentProvider && (
//                     <div className="animate-fade-in-down">
//                       <div className="relative">
//                         <input
//                           type="email"
//                           className="w-full pl-3 pr-3 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm focus:border-secondary outline-none transition-colors"
//                           placeholder="Adresse email (optionnel pour recevoir votre billet)"
//                           value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* Message Erreur */}
//                   {errorMessage && (
//                     <div className="flex items-center gap-2 text-xs text-red-500 font-medium bg-red-50 p-2 rounded-lg animate-pulse">
//                       <AlertCircle className="w-4 h-4 flex-shrink-0" />
//                       <span>{errorMessage}</span>
//                     </div>
//                   )}

//                   {/* BOUTON PAYER */}
//                   <button
//                     onClick={handlePaymentClick}
//                     className="w-full py-4 bg-secondary hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
//                   >
//                     Payer {totalPrice.toLocaleString()} FCFA
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* --- MODALE DE PAIEMENT --- */}
//         {isPaymentModalOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
//             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative">
//               <div
//                 className={`p-6 text-center text-white relative ${
//                   paymentProvider === "MTN" ? "bg-[#ffcc00]" : "bg-[#ff0000]"
//                 }`}
//               >
//                 <h3
//                   className={`text-xl font-bold ${
//                     paymentProvider === "MTN" ? "text-black" : "text-white"
//                   }`}
//                 >
//                   Paiement {paymentProvider}
//                 </h3>
//               </div>
//               <div className="p-8 text-center">
//                 {paymentStatus === "processing" && (
//                   <>
//                     <div className="relative mx-auto w-20 h-20 mb-6">
//                       <div
//                         className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${
//                           paymentProvider === "MTN"
//                             ? "border-[#ffcc00]"
//                             : "border-[#ff0000]"
//                         }`}
//                       ></div>
//                       <Smartphone className="absolute inset-0 m-auto text-gray-400 w-8 h-8 animate-pulse" />
//                     </div>
//                     <p className="text-gray-600 mb-2">
//                       Veuillez valider sur votre téléphone :
//                     </p>
//                     <p className="text-xl font-bold text-gray-900 mb-6 tracking-wide">
//                       (+242) {phoneNumber}
//                     </p>
//                     <div className="text-xs bg-gray-100 p-2 rounded text-gray-500">
//                       En attente du code PIN...
//                     </div>
//                   </>
//                 )}
//                 {paymentStatus === "success" && (
//                   <div className="py-4 animate-scale-in">
//                     <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
//                       <Check className="w-8 h-8" />
//                     </div>
//                     <h4 className="text-lg font-bold text-green-700">
//                       Paiement Accepté !
//                     </h4>
//                     <p className="text-sm text-gray-500 mt-2">
//                       Redirection vers votre billet...
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// // Fonctions utilitaires pour formater la date et l'heure
// function formatDate(dateString: string): string {
//   const date = new Date(dateString);
//   const days = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
//   const months = [
//     "Jan.",
//     "Fév.",
//     "Mar.",
//     "Avr.",
//     "Mai.",
//     "Juin.",
//     "Juil.",
//     "Août.",
//     "Sep.",
//     "Oct.",
//     "Nov.",
//     "Déc.",
//   ];

//   const dayName = days[date.getDay()];
//   const day = date.getDate();
//   const monthName = months[date.getMonth()];

//   return `${dayName} ${day} ${monthName}`;
// }

// function formatTime(dateString: string): string {
//   const date = new Date(dateString);
//   const hours = date.getHours().toString().padStart(2, "0");
//   const minutes = date.getMinutes().toString().padStart(2, "0");
//   return `${hours}h${minutes}`;
// }
