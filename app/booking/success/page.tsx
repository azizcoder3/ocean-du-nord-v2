//  app/booking/success/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  Home,
  Calendar,
  Clock,
  Bus,
  Armchair,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import dynamic from "next/dynamic";

// On importe dynamiquement car react-pdf ne marche que côté client
const DownloadTicketButton = dynamic(
  () => import("@/components/pdf/DownloadTicketButton"),
  { ssr: false }
);

// --- INTERFACES ---
interface Passenger {
  id: string;
  fullName: string;
  type: string;
  seatNumber: number;
}

interface BookingDetail {
  reference: string;
  totalPrice: number;
  paymentMethod: string | null;
  trip: {
    date: string;
    bus: { name: string; type: string };
    route: { fromCity: string; toCity: string };
  };
  passengers: Passenger[];
}

// --- UTILITAIRES ---
const getImageForCity = (cityName: string): string => {
  const images: Record<string, string> = {
    "Pointe-Noire":
      "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000",
    Dolisie:
      "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000",
    Ouesso:
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000",
    Oyo: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1000",
    Cameroun:
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1000",
  };
  return (
    images[cityName] ||
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1000"
  );
};

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!ref) {
      setError("Référence de réservation manquante.");
      setLoading(false);
      return;
    }

    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${ref}`);
        if (!res.ok) throw new Error("Réservation introuvable.");
        const data = await res.json();
        setBooking(data);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur de connexion";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [ref]);

  if (loading)
    return (
      <div className="text-center py-20">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-500 font-medium italic">
          Chargement de votre billet...
        </p>
      </div>
    );

  if (error || !booking)
    return (
      <div className="text-center py-20 px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur</h2>
        <p className="text-gray-600 mb-6">{error || "Billet introuvable."}</p>
        <Link
          href="/"
          className="px-8 py-3 bg-primary text-white rounded-xl font-bold"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );

  const qrData = {
    reference: booking.reference,
    trajet: `${booking.trip.route.fromCity} → ${booking.trip.route.toCity}`,
    date: new Date(booking.trip.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    heure: new Date(booking.trip.date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    vehicule: booking.trip.bus.name,
    passagers: booking.passengers.map((p) => ({
      nom: p.fullName,
      siege: p.seatNumber,
      type: p.type,
    })),
    prix: `${booking.totalPrice
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`,
    paiement: booking.paymentMethod || "Mobile Money",
    compagnie: "OCÉAN DU NORD",
  };

  const qrString = JSON.stringify(qrData, null, 2);

  return (
    <div className="max-w-2xl w-full px-4 animate-fade-in-up">
      {/* MESSAGE DE SUCCÈS */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Réservation Validée !
        </h1>
      </div>

      {/* BLOC INSTRUCTIONS IMPORTANTES */}
      <div className="bg-amber-50 border-2 border-amber-200 p-5 rounded-2xl mb-8 flex items-start gap-4">
        <div className="bg-amber-100 p-2 rounded-full text-amber-700">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <p className="text-amber-900 font-black text-sm uppercase mb-1">
            Instruction Importante
          </p>
          <p className="text-amber-800 text-sm leading-relaxed">
            Veuillez vous présenter à l&apos;agence de départ de{" "}
            <strong>{booking.trip.route.fromCity}</strong> muni de ce billet
            électronique au moins <strong>2 jours avant votre départ</strong>{" "}
            pour obtenir votre ticket physique définitif.
          </p>
        </div>
      </div>

      {/* LE BILLET ÉLECTRONIQUE (Optimisé pour Capture d'écran) */}
      <div className="bg-white rounded-4xl shadow-2xl overflow-hidden relative border border-gray-100">
        {/* HEADER */}
        <div
          className="p-6 text-white flex justify-between items-center"
          style={{ backgroundColor: "#064e3b" }}
        >
          <div>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-70">
              Billet Électronique
            </p>
            <h2 className="text-xl font-black uppercase tracking-tighter">
              Océan du Nord
            </h2>
          </div>
          <div className="bg-white p-1.5 rounded-lg">
            <Image
              src="/images/logo-ocean-du-nord.webp"
              alt="Logo"
              width={100}
              height={30}
              className="object-contain"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* TRAJET */}
          <div className="flex justify-between items-center border-b border-gray-100 pb-6">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Départ
              </p>
              <h3 className="text-xl font-black text-gray-900">
                {booking.trip.route.fromCity}
              </h3>
            </div>
            <div className="flex flex-col items-center opacity-30">
              <Bus className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">
                Destination
              </p>
              <h3 className="text-xl font-black text-gray-900">
                {booking.trip.route.toCity}
              </h3>
            </div>
          </div>

          {/* INFOS VOYAGE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-300" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">
                  Date
                </p>
                <p className="text-xs font-bold text-gray-800">
                  {new Date(booking.trip.date).toLocaleDateString("fr-FR", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-300" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">
                  Heure
                </p>
                <p className="text-xs font-bold text-gray-800">
                  {new Date(booking.trip.date).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
              <Bus className="w-5 h-5 text-gray-300" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">
                  Véhicule
                </p>
                <p className="text-xs font-bold text-gray-800">
                  {booking.trip.bus.name}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl flex items-center gap-3">
              <Armchair className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase leading-none mb-1">
                  Sièges
                </p>
                <p className="text-xs font-black text-amber-600">
                  {booking.passengers.map((p) => p.seatNumber).join(", ")}
                </p>
              </div>
            </div>
          </div>

          {/* PASSAGERS */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-3">
              Détails des passagers
            </p>
            <div className="space-y-2">
              {booking.passengers.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center text-xs"
                >
                  <span className="font-bold text-gray-700">{p.fullName}</span>
                  <span className="text-[9px] font-bold text-gray-400 uppercase">
                    {p.type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QR CODE & RÉFÉRENCE */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-gray-100">
            {/* <div className="flex items-center gap-4">
              <div className="p-1 bg-white border-2 border-gray-900 rounded-lg">
                <QrCode className="w-16 h-16 text-gray-900" />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase">
                  Réf. Réservation
                </p>
                <p className="text-2xl font-mono font-black text-gray-900 tracking-tighter">
                  {booking.reference}
                </p>
              </div>
            </div> */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white border-2 border-gray-900 rounded-xl shadow-sm">
                {/* GÉNÉRATION DU VRAI QR CODE */}
                {/* <QRCodeSVG
                  value={`http://https://preobediently-diarch-annamarie.ngrok-free.dev/verify/${booking.reference}`} // Donnée encodée
                  size={80}
                  level={"H"} // Haute protection contre les erreurs
                  marginSize={0}
                /> */}
                {/* En voie  */}
                <QRCodeSVG
                  value={qrString} // ✅ Toutes les données encodées en JSON
                  size={120}
                  level={"H"} // Correction d'erreur maximale
                  marginSize={0}
                />
              </div>
              <div>
                <p className="text-[9px] text-gray-400 font-bold uppercase">
                  Référence
                </p>
                <p className="text-2xl font-mono font-black text-gray-900 tracking-tighter">
                  {booking.reference}
                </p>
              </div>
            </div>
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-sm">
              <Image
                src={getImageForCity(booking.trip.route.toCity)}
                alt="city"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 text-center text-[8px] font-bold text-gray-400 border-t border-gray-50 uppercase tracking-[0.2em]">
          Scannez ce code ou présentez cette page à l&apos;agence
        </div>
      </div>

      {/* BOUTONS D'ACTION */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4">
        {/* BOUTON TÉLÉCHARGER PDF (NOUVEAU) */}
        <DownloadTicketButton booking={booking} />

        {/* BOUTON RETOUR ACCUEIL (EXISTANT) */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-gray-700 bg-white border-2 border-gray-100 hover:bg-gray-50 transition-all shadow-sm"
        >
          <Home className="w-5 h-5" /> Retour
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400 italic max-w-sm mx-auto">
        Conseil : Téléchargez le PDF pour avoir une copie officielle imprimable.
      </p>

      {/* BOUTON RETOUR (Pas de PDF ici) */}
      <div className="mt-10 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3 px-12 py-4 rounded-2xl font-black text-white shadow-xl hover:brightness-110 active:scale-95 transition-all"
          style={{ backgroundColor: "#f59e0b" }}
        >
          <Home className="w-6 h-6" /> Retour à l&apos;accueil
        </Link>
        <p className="mt-4 text-xs text-gray-400 italic">
          Conseil : Faites une capture d&apos;écran de ce billet pour le
          conserver hors-ligne.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="font-bold text-primary animate-pulse">
            Affichage du billet...
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </main>
  );
}
