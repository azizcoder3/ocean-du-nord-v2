import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Récupérer les paramètres de l'URL (ex: ?from=Brazzaville&to=Pointe-Noire&date=2025-10-12)
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const dateStr = searchParams.get("date");

    if (!from || !to || !dateStr) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // 2. Calculer l'intervalle de date (Toute la journée demandée, de 00h00 à 23h59)
    const searchDate = new Date(dateStr);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Requête Prisma complexe (Jointure Trip -> Route + Bus)
    const trips = await prisma.trip.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        route: {
          fromCity: { equals: from, mode: "insensitive" }, // Insensible à la casse (brazza = Brazza)
          toCity: { equals: to, mode: "insensitive" },
        },
        status: "SCHEDULED", // Seulement les bus prévus
      },
      include: {
        route: true, // On veut les infos du trajet (prix, durée)
        bus: true, // On veut les infos du bus (VIP, places)
        bookings: {
          // On veut compter les places déjà prises
          select: {
            passengers: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // 4. Formater les données pour le Frontend
    const formattedTrips = trips.map((trip) => {
      // Calculer les places restantes
      const seatsTaken = trip.bookings.reduce(
        (acc, booking) => acc + booking.passengers.length,
        0
      );
      const seatsAvailable = trip.bus.capacity - seatsTaken;

      return {
        id: trip.id,
        departureTime: trip.date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        arrivalTime: "Calculé...", // On pourrait calculer ça avec la durée
        from: trip.route.fromCity,
        to: trip.route.toCity,
        duration: trip.route.duration,
        prices: {
          adult: trip.route.priceAdult,
          child: trip.route.priceChild,
        },
        type: trip.bus.type, // VIP ou Standard
        seatsAvailable: seatsAvailable,
        busName: trip.bus.name,
      };
    });

    return NextResponse.json(formattedTrips);
  } catch (error: unknown) {
    console.error("Erreur recherche:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
