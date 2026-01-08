"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import {
  Camera,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

// Define proper TypeScript interfaces for the data structures
interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  distance: number;
  duration: string;
  priceAdult: number;
  priceChild: number;
}

interface Trip {
  id: string;
  date: Date;
  arrivalDate: Date | null;
  status: string;
  route: Route;
}

interface Passenger {
  id: string;
  fullName: string;
  type: string;
  seatNumber: number;
}

interface ScanResult {
  type: "success" | "error";
  reference?: string;
  error?: string;
  trip?: Trip;
  passengers?: Passenger[];
  totalPrice?: number;
  status?: string;
  paymentMethod?: string | null;
  paymentId?: string | null;
  createdAt?: Date;
  // Additional properties from booking will be included via spread operator
  [key: string]: unknown; // Safer alternative to any
}

export default function AdminScanPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const handleVerify = async (reference: string) => {
    try {
      const res = await fetch("/api/admin/verify-ticket", {
        method: "POST",
        body: JSON.stringify({ reference }),
      });
      const data = await res.json();

      if (res.ok) {
        setScanResult({ type: "success", ...data.booking });
        toast.success("Billet validé !");
      } else {
        setScanResult({ type: "error", error: data.error, ...data.booking });
        toast.error(data.error);
      }
    } catch (err) {
      console.error("Error fetching booking:", err);
      toast.error("Erreur de connexion au serveur");
    }
  };

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanError);

    async function onScanSuccess(decodedText: string) {
      // Le QR code contient l'URL ou juste la référence
      // On extrait la référence (ex: ODN-XXXX) avec sécurité regex
      let ref = decodedText.includes("success?ref=")
        ? decodedText.split("ref=")[1]
        : decodedText;

      // Sécurité: on ne garde que le code commençant par 'ODN-'
      const odnMatch = ref.match(/ODN-[A-Za-z0-9]+/);
      if (odnMatch) {
        ref = odnMatch[0];
      }

      scanner.pause(); // On arrête de scanner le temps de traiter
      setIsScanning(false);
      handleVerify(ref);
    }

    function onScanError(err: unknown) {
      console.warn("Scan error:", err);
      // On ignore les erreurs de lecture silencieuses
    }

    return () => {
      scanner.clear();
    };
  }, []);

  const resetScanner = () => {
    setIsScanning(true);
    setScanResult(null);
    window.location.reload(); // Moyen le plus simple de relancer la caméra proprement
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Scanner de Billets</h1>
        <p className="text-sm text-gray-500">Boarding Agent Mode</p>
      </div>

      {/* ZONE DE LECTURE CAMÉRA */}
      <div
        className={`overflow-hidden rounded-3xl border-4 ${
          !scanResult
            ? "border-primary"
            : scanResult.type === "success"
            ? "border-green-500"
            : "border-red-500 shadow-lg shadow-red-100"
        }`}
      >
        <div id="reader" className="w-full bg-black relative">
          {!isScanning && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <Camera className="w-12 h-12 mx-auto mb-2 opacity-70" />
                <p className="text-sm">Traitement en cours...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RÉSULTAT DU SCAN */}
      {scanResult && (
        <div className="animate-fade-in-up space-y-4">
          <div
            className={`p-6 rounded-3xl border ${
              scanResult.type === "success"
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              {scanResult.type === "success" ? (
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
              <h2
                className={`text-xl font-bold ${
                  scanResult.type === "success"
                    ? "text-green-800"
                    : "text-red-800"
                }`}
              >
                {scanResult.type === "success"
                  ? "Billet Valide"
                  : "Erreur Billet"}
              </h2>
            </div>

            {scanResult.reference && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Référence :</span>
                  <span className="font-bold font-mono">
                    {scanResult.reference}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> Trajet :
                  </span>
                  <span className="font-bold">
                    {scanResult.trip?.route.fromCity} ➔{" "}
                    {scanResult.trip?.route.toCity}
                  </span>
                </div>
                {scanResult.totalPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Prix total :</span>
                    <span className="font-bold">
                      {scanResult.totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                )}
                {scanResult.status && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Statut :</span>
                    <span
                      className={`font-bold ${
                        scanResult.status === "paid"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {scanResult.status === "paid"
                        ? "Payé"
                        : scanResult.status}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-dashed border-gray-200">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-2">
                    Passagers
                  </p>
                  {scanResult.passengers?.map((p: Passenger) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 text-sm font-bold text-gray-700"
                    >
                      <User className="w-3 h-3" /> {p.fullName} (Siège{" "}
                      {p.seatNumber})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={resetScanner}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all"
          >
            <RefreshCw className="w-5 h-5" /> Scanner le billet suivant
          </button>
        </div>
      )}

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3 text-xs text-gray-500">
        <AlertCircle className="w-4 h-4" />
        L&apos;agent doit vérifier l&apos;identité physique du passager.
      </div>
    </div>
  );
}
