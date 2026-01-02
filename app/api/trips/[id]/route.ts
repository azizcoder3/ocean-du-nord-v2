import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        route: true,
        bus: true,
        // On récupère les réservations pour voir les sièges pris
        bookings: {
          where: { status: "PAID" },
          include: { passengers: { select: { seatNumber: true } } }
        }
      },
    });

    if (!trip) return NextResponse.json({ error: "Voyage non trouvé" }, { status: 404 });

    // On crée une liste simple des numéros de sièges occupés
    const occupiedSeats = trip.bookings.flatMap(b => b.passengers.map(p => p.seatNumber));

    // On renvoie l'objet trip enrichi de la liste occupiedSeats
    return NextResponse.json({ ...trip, occupiedSeats });
  } catch (error) {
    console.error("Erreur serveur API Trip:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}




























// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> } // On définit params comme une Promise
// ) {
//   try {
//     // 1. INDISPENSABLE : On attend que Next.js nous donne l'ID
//     const resolvedParams = await params;
//     const id = resolvedParams.id;

//     console.log("Recherche du voyage ID:", id); // Pour voir dans votre terminal

//     // 2. On cherche en base de données avec les relations
//     const trip = await prisma.trip.findUnique({
//       where: { id: id },
//       include: {
//         route: true,
//         bus: true,
//         bookings: {
//           where: { status: "PAID" },
//           include: { passengers: { select: { seatNumber: true } } }
//         }
//       },
//     });

//     // 3. Si le voyage n'existe pas dans la DB
//     if (!trip) {
//       console.log("Voyage non trouvé en base de données pour l'ID:", id);
//       return NextResponse.json({ error: "Voyage non trouvé" }, { status: 404 });
//     }

//     // Juste avant le return, calculez la liste simple :
//     const occupiedSeats = trip.bookings.flatMap(b => b.passengers.map(p => p.seatNumber));  

//     // 4. On renvoie le voyage trouvé
//     return NextResponse.json({...trip, occupiedSeats});
//   } catch (error: unknown) {
//     console.error("Erreur serveur API Trip:", error);
//     if (error instanceof Error) {
//       return NextResponse.json({ error: "Erreur serveur", details: error.message }, { status: 500 });
//     }
//     return NextResponse.json({ error: "Erreur serveur", details: "Une erreur inconnue est survenue" }, { status: 500 });
//   }
// }
