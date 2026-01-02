"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addRoute(data: {
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number;
}) {
  try {
    await prisma.route.create({
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        priceAdult: data.priceAdult,
        priceChild: data.priceChild,
        duration: data.duration,
        distance: data.distance
      }
    });
    revalidatePath("/admin/routes");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ligne:", error);
    throw new Error("Impossible d'ajouter cette ligne.");
  }
}

export async function deleteRoute(id: string) {
  try {
    // Note : Prisma empêchera la suppression si des voyages (Trips) utilisent cette ligne
    await prisma.route.delete({ where: { id } });
    revalidatePath("/admin/routes");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la ligne:", error);
    throw new Error("Impossible de supprimer cette ligne car elle est liée à des voyages programmés.");
  }
}

export async function updateRoute(id: string, data: {
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number
}) {
  await prisma.route.update({
    where: { id },
    data
  });
  revalidatePath("/admin/routes");
  revalidatePath("/destinations");
  return { success: true };
}
