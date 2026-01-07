// app/api/trips/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Récupérer les paramètres de l'URL
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.trim(); // ✅ Ajout de .trim()
    const to = searchParams.get("to")?.trim(); // ✅ Ajout de .trim()
    const dateStr = searchParams.get("date");

    console.log("🔍 Recherche reçue:", { from, to, dateStr });

    if (!from || !to || !dateStr) {
      return NextResponse.json(
        { error: "Paramètres manquants (from, to, date requis)" },
        { status: 400 }
      );
    }

    // 2. CORRECTION CRUCIALE : Calculer l'intervalle de toute la journée
    // ✅ Ne plus forcer UTC avec "Z", utiliser la date locale
    const searchDate = new Date(dateStr + "T00:00:00");

    // ✅ Créer startOfDay et endOfDay sans UTC
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log("📅 Plage de recherche:", {
      startOfDay: startOfDay.toISOString(),
      endOfDay: endOfDay.toISOString(),
      localStart: startOfDay.toLocaleString("fr-FR"),
      localEnd: endOfDay.toLocaleString("fr-FR"),
    });

    // 3. Requête Prisma avec filtres corrigés
    const trips = await prisma.trip.findMany({
      where: {
        // ✅ Filtre de date : trouve tous les voyages dans les 24h
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        // ✅ Filtre des villes (insensible à la casse)
        route: {
          fromCity: {
            equals: from,
            mode: "insensitive",
          },
          toCity: {
            equals: to,
            mode: "insensitive",
          },
        },
        // Seulement les voyages programmés
        status: "SCHEDULED",
      },
      include: {
        route: true,
        bus: true,
        bookings: {
          select: {
            passengers: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    console.log(`✅ ${trips.length} voyage(s) trouvé(s)`);

    // 4. Formater les données pour le Frontend
    const formattedTrips = trips.map((trip) => {
      // Calculer les places restantes
      const seatsTaken = trip.bookings.reduce(
        (acc, booking) => acc + booking.passengers.length,
        0
      );
      const seatsAvailable = trip.bus.capacity - seatsTaken;

      // Calculer l'heure d'arrivée approximative
      const departureDate = new Date(trip.date);
      const durationParts = trip.route.duration.match(/(\d+)h(\d+)?/);
      const arrivalDate = new Date(departureDate);

      if (durationParts) {
        const hours = parseInt(durationParts[1] || "0");
        const minutes = parseInt(durationParts[2] || "0");
        arrivalDate.setHours(arrivalDate.getHours() + hours);
        arrivalDate.setMinutes(arrivalDate.getMinutes() + minutes);
      }

      return {
        id: trip.id,
        departureTime: departureDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrivalTime: arrivalDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        from: trip.route.fromCity,
        to: trip.route.toCity,
        duration: trip.route.duration,
        prices: {
          adult: trip.route.priceAdult,
          child: trip.route.priceChild,
        },
        type: trip.bus.type,
        seatsAvailable: seatsAvailable,
        busName: trip.bus.name,
      };
    });

    return NextResponse.json(formattedTrips);
  } catch (error: unknown) {
    console.error("❌ Erreur recherche:", error);
    return NextResponse.json(
      {
        error: "Erreur serveur",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
