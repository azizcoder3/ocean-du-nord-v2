import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 1. On essaie de créer un bus fictif
    const newBus = await prisma.bus.create({
      data: {
        name: "Bus Test V7",
        plateNumber: "TEST-" + Math.floor(Math.random() * 1000), // Plaque unique
        type: "VIP",
        capacity: 50,
      }
    });

    // 2. On essaie de lire la liste des bus
    const allBus = await prisma.bus.findMany();

    return NextResponse.json({ 
      status: "Succès ! La base de données est connectée.", 
      nouveauBus: newBus,
      totalBus: allBus.length 
    });

  } catch (error) {
    console.error("Erreur Prisma:", error);
    return NextResponse.json({ 
      status: "Erreur de connexion", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}