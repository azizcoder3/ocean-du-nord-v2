// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  // 🔴 CORRECTION ICI : On passe de 5000 (5s) à 60000 (60s)
  connectionTimeoutMillis: 60000,
});

const prismaClientSingleton = () => {
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    // En développement, on garde les logs pour voir ce qui se passe
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn", "query"]
        : ["error"],
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
