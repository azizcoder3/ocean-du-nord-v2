// components/pdf/DownloadTicketButton.tsx
"use client";

import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TicketPDF } from "./TicketPDF";
import QRCode from "qrcode";
import { Download, Loader2 } from "lucide-react";

interface Passenger {
  fullName: string;
  seatNumber: number;
  type: string;
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

interface DownloadTicketButtonProps {
  booking: BookingDetail;
}

// Fonction utilitaire pour le prix (si pas déjà présente)
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function DownloadTicketButton({
  booking,
}: DownloadTicketButtonProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // 1. ON CONSTRUIT LES DONNÉES COMPLÈTES ICI
    // On formate la date proprement
    const dateStr = new Date(booking.trip.date).toLocaleDateString("fr-FR");
    const timeStr = new Date(booking.trip.date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // On prend le nom du premier passager (ou principal)
    const mainPassenger = booking.passengers[0]?.fullName || "N/A";

    // 🔴 CORRECTION ICI : Utilisation d'un tableau + join('\n')
    // Cela force le QR Code à comprendre qu'il faut aller à la ligne
    const qrLines = [
      "BILLET OCÉAN DU NORD",
      "--------------------------", // J'ai allongé la ligne comme demandé
      `REF: ${booking.reference}`,
      `PASSAGER: ${mainPassenger}`,
      `TRAJET: ${booking.trip.route.fromCity} -> ${booking.trip.route.toCity}`,
      `DATE: ${dateStr} à ${timeStr}`,
      `BUS: ${booking.trip.bus.name}`, // Le scanner gérera le retour à la ligne automatique si le nom est long
      `SIÈGES: ${booking.passengers.map((p) => p.seatNumber).join(", ")}`,
      `STATUT: PAYÉ (${formatPrice(booking.totalPrice)} FCFA)`,
    ];

    const qrData = qrLines.join("\n"); // Force le saut de ligne réel

    QRCode.toDataURL(qrData)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Erreur QR Code", err));
  }, [booking]);

  if (!qrCodeUrl) {
    return (
      <button
        disabled
        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-white bg-gray-800 opacity-50 cursor-not-allowed"
      >
        <Loader2 className="w-5 h-5 animate-spin" /> Préparation...
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<TicketPDF booking={booking} qrCodeDataUrl={qrCodeUrl} />}
      fileName={`Billet-${booking.reference}.pdf`}
      className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-white shadow-xl hover:bg-gray-800 transition-all bg-gray-900"
    >
      {({ loading }) =>
        loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Génération...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" /> Télécharger en PDF
          </>
        )
      }
    </PDFDownloadLink>
  );
}
