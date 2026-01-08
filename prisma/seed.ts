// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg"; // Nécessaire pour l'adaptateur
import "dotenv/config";

// const connectionString = process.env.DATABASE_URL!;
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// --- CORRECTION ICI ---
// On utilise DIRECT_URL (Port 5432) au lieu de DATABASE_URL pour le seed
// Cela garantit une connexion stable pour les opérations administratives
const connectionString = process.env.DIRECT_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Démarrage du remplissage avancé...");

  // 1. Nettoyage (On supprime tout pour repartir propre)
  // L'ordre est important à cause des clés étrangères
  await prisma.passenger.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.route.deleteMany();
  console.log("🧹 Base de données nettoyée.");

  // 2. Création des Bus
  const buses = await Promise.all([
    prisma.bus.create({
      data: {
        name: "Yutong F1",
        plateNumber: "BZ-450-AA",
        type: "VIP",
        capacity: 50,
        features: ["AC", "Wifi", "TV"],
      },
    }),
    prisma.bus.create({
      data: {
        name: "Yutong F2",
        plateNumber: "BZ-451-AA",
        type: "VIP",
        capacity: 50,
        features: ["AC", "Wifi", "TV"],
      },
    }),
    prisma.bus.create({
      data: {
        name: "Coaster C1",
        plateNumber: "PN-202-BB",
        type: "Standard",
        capacity: 30,
        features: ["AC"],
      },
    }),
    prisma.bus.create({
      data: {
        name: "King Long K1",
        plateNumber: "BZ-999-CC",
        type: "VIP",
        capacity: 60,
        features: ["AC", "Toilette"],
      },
    }),
  ]);
  console.log(`🚌 ${buses.length} Bus créés.`);

  // 3. Création des Routes (Lignes)
  const routesData = [
    {
      fromCity: "Brazzaville",
      toCity: "Pointe-Noire",
      distance: 510,
      duration: "8h 30m",
      priceAdult: 9000,
      priceChild: 9000,
    },
    {
      fromCity: "Pointe-Noire",
      toCity: "Brazzaville",
      distance: 510,
      duration: "8h 30m",
      priceAdult: 9000,
      priceChild: 9000,
    }, // Retour
    {
      fromCity: "Brazzaville",
      toCity: "Dolisie",
      distance: 350,
      duration: "6h 00m",
      priceAdult: 7000,
      priceChild: 7000,
    },
    {
      fromCity: "Brazzaville",
      toCity: "Ouesso",
      distance: 800,
      duration: "14h 00m",
      priceAdult: 15000,
      priceChild: 15000,
    },
    {
      fromCity: "Brazzaville",
      toCity: "Oyo",
      distance: 400,
      duration: "6h 00m",
      priceAdult: 6000,
      priceChild: 6000,
    },
  ];

  const createdRoutes = [];
  for (const rData of routesData) {
    const route = await prisma.route.create({ data: rData });
    createdRoutes.push(route);
  }
  console.log(`Rx ${createdRoutes.length} Routes créées.`);

  // 4. Génération des Voyages (Trips) pour les 30 prochains jours
  let tripCount = 0;
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const tripDate = new Date(today);
    tripDate.setDate(today.getDate() + i); // Date du jour + i

    // Pour chaque route, on crée 2 départs par jour
    for (const route of createdRoutes) {
      // Départ Matin (07:00)
      const dateMatin = new Date(tripDate);
      dateMatin.setHours(7, 0, 0, 0);

      await prisma.trip.create({
        data: {
          date: dateMatin,
          status: "SCHEDULED",
          routeId: route.id,
          busId: buses[Math.floor(Math.random() * buses.length)].id, // Bus aléatoire
        },
      });
      tripCount++;

      // Départ Après-midi (14:00) - Sauf pour les longs trajets comme Ouesso
      if (route.toCity !== "Ouesso") {
        const dateAprem = new Date(tripDate);
        dateAprem.setHours(14, 0, 0, 0);

        await prisma.trip.create({
          data: {
            date: dateAprem,
            status: "SCHEDULED",
            routeId: route.id,
            busId: buses[Math.floor(Math.random() * buses.length)].id,
          },
        });
        tripCount++;
      }
    }
  }

  console.log(`📅 ${tripCount} Voyages programmés sur 30 jours.`);
  console.log("✨ Seeding terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
