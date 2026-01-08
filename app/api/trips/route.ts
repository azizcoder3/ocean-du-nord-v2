// app/api/trips/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from")?.trim();
    const to = searchParams.get("to")?.trim();
    const dateStr = searchParams.get("date");

    // 1. Validation : Seule la date est vraiment obligatoire désormais
    if (!dateStr) {
      return NextResponse.json({ error: "Date requise" }, { status: 400 });
    }

    // 2. Gestion des Dates (Votre logique était bonne, on la garde)
    const searchDate = new Date(dateStr);
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(-1, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(22, 59, 59, 999);

    // 3. Construction dynamique du filtre "Route"
    // Si 'from' ou 'to' sont vides, on ne filtre pas dessus.
    const routeFilter: Prisma.RouteWhereInput = {};

    if (from) {
      routeFilter.fromCity = { equals: from, mode: "insensitive" };
    }
    if (to) {
      routeFilter.toCity = { equals: to, mode: "insensitive" };
    }

    // 4. Requête Prisma
    const trips = await prisma.trip.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        route: routeFilter, // Applique le filtre dynamique (vide = tous les trajets)
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

    // 5. Formatage des données (Identique à votre code existant)
    const formattedTrips = trips.map((trip) => {
      const seatsTaken = trip.bookings.reduce(
        (acc, booking) => acc + booking.passengers.length,
        0
      );
      const seatsAvailable = trip.bus.capacity - seatsTaken;

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
          timeZone: "Africa/Brazzaville",
        }),
        arrivalTime: arrivalDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Africa/Brazzaville",
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
