// components/pdf/TicketPDF.tsx
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica.ttf",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica@1.0.4/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// Fonction pour formater le prix avec un espace (ex: 10 200)
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 15,
    fontFamily: "Helvetica",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#064e3b",
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  subHeaderText: {
    color: "#a7f3d0",
    fontSize: 7,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  body: {
    padding: 15,
    borderLeft: "1px solid #e5e7eb",
    borderRight: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    gap: 40,
    marginBottom: 12,
  },
  label: {
    fontSize: 7,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  value: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "bold",
  },
  busSection: {
    marginBottom: 12,
  },
  busValue: {
    fontSize: 10,
    color: "#111827",
    fontWeight: "bold",
    maxWidth: "100%",
    lineHeight: 1.3,
  },
  divider: {
    borderBottom: "1px dashed #e5e7eb",
    marginVertical: 10,
  },
  passengerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    borderBottom: "1px solid #f3f4f6",
    paddingBottom: 3,
  },
  footer: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 6,
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  qrSection: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 6,
  },
  qrImage: {
    width: 75,
    height: 75,
  },
  priceTag: {
    backgroundColor: "#f59e0b",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  priceText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 10,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 10,
  },
});

interface TicketPDFProps {
  booking: {
    reference: string;
    totalPrice: number;
    paymentMethod: string | null;
    trip: {
      date: string;
      bus: { name: string; type: string };
      route: { fromCity: string; toCity: string };
    };
    passengers: { fullName: string; seatNumber: number; type: string }[];
  };
  qrCodeDataUrl: string;
}

export const TicketPDF = ({ booking, qrCodeDataUrl }: TicketPDFProps) => {
  const formattedDate = new Date(booking.trip.date).toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const formattedTime = new Date(booking.trip.date).toLocaleTimeString(
    "fr-FR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        {/* EN-TÊTE */}
        <View style={styles.header}>
          <View>
            <Text style={styles.subHeaderText}>Billet Électronique</Text>
            <Text style={styles.headerText}>OCÉAN DU NORD</Text>
          </View>
        </View>

        {/* CORPS DU BILLET */}
        <View style={styles.body}>
          {/* Ligne 1 : Départ / Arrivée */}
          <View style={styles.row}>
            <View>
              <Text style={styles.label}>Départ</Text>
              <Text style={{ ...styles.value, fontSize: 16 }}>
                {booking.trip.route.fromCity}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}>Arrivée</Text>
              <Text style={{ ...styles.value, fontSize: 16 }}>
                {booking.trip.route.toCity}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Ligne 2 : Date et Heure */}
          <View style={styles.infoRow}>
            <View>
              <Text style={styles.label}>Date</Text>
              <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View>
              <Text style={styles.label}>Heure</Text>
              <Text style={styles.value}>{formattedTime}</Text>
            </View>
          </View>

          {/* Ligne 3 : Véhicule */}
          <View style={styles.busSection}>
            <Text style={styles.label}>Véhicule</Text>
            <Text style={styles.busValue}>{booking.trip.bus.name}</Text>
          </View>

          <View style={styles.divider} />

          {/* Ligne 4 : Passagers */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ ...styles.label, marginBottom: 6 }}>
              Passagers & Sièges
            </Text>
            {booking.passengers.map((p, i) => (
              <View key={i} style={styles.passengerRow}>
                <Text style={{ fontSize: 9, color: "#374151" }}>
                  {p.fullName} ({p.type})
                </Text>
                <Text style={{ fontSize: 9, fontWeight: "bold" }}>
                  Siège N° {p.seatNumber}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Ligne 5 : QR Code et Prix */}
          <View style={styles.bottomSection}>
            {/* QR Code à gauche */}
            <View style={styles.qrSection}>
              {qrCodeDataUrl && (
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={qrCodeDataUrl} style={styles.qrImage} />
              )}
              <Text
                style={{
                  fontSize: 8,
                  marginTop: 3,
                  color: "#6b7280",
                  fontWeight: "bold",
                }}
              >
                {booking.reference}
              </Text>
            </View>

            {/* Prix à droite */}
            <View style={{ alignItems: "flex-end", paddingBottom: 5 }}>
              <View style={styles.priceTag}>
                <Text style={styles.priceText}>
                  TOTAL : {formatPrice(booking.totalPrice)} FCFA
                </Text>
              </View>
              <Text style={{ fontSize: 6, color: "#9ca3af", marginTop: 3 }}>
                Payé via {booking.paymentMethod || "Mobile Money"}
              </Text>
            </View>
          </View>
        </View>

        {/* PIED DE PAGE */}
        <Text style={styles.footer}>
          Présentez ce billet à l&apos;agence 48h avant le départ pour
          validation.
        </Text>
      </Page>
    </Document>
  );
};
