// lib/prisma.ts
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// 1. On crée un pool de connexions robuste
const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ 
  connectionString,
  max: 10, // Limite le nombre de connexions simultanées pour éviter de saturer Supabase
  idleTimeoutMillis: 30000, // Ferme les connexions inactives après 30s
  connectionTimeoutMillis: 5000, // Temps d'attente max pour une connexion
});

const prismaClientSingleton = () => {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: ['error', 'warn'], // On réduit les logs pour la performance
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}


// import { PrismaClient } from "@/app/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });

// const prismaClientSingleton = () => {
//   return new PrismaClient({
//     adapter,
//   });
// };
// declare const globalThis: {
//   prismaGlobal: ReturnType<typeof prismaClientSingleton>;
// } & typeof global;
// const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// export default prisma;
// if (process.env.NODE_ENV !== "production") {
//   globalThis.prismaGlobal = prisma;
// }
