"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBus(data: { name: string; plateNumber: string; capacity: number; type: string }) {
  try {
    await prisma.bus.create({
      data: {
        name: data.name,
        plateNumber: data.plateNumber,
        capacity: data.capacity,
        type: data.type,
        features: ["AC", "Wifi"], // Valeurs par défaut
      },
    });
    revalidatePath("/admin/bus");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout du bus:", error);
    throw new Error("Impossible d'ajouter ce bus. La plaque d'immatriculation existe peut-être déjà.");
  }
}

export async function deleteBus(id: string) {
  try {
    await prisma.bus.delete({ where: { id } });
    revalidatePath("/admin/bus");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du bus:", error);
    throw new Error("Impossible de supprimer ce bus (il est peut-être lié à des voyages).");
  }
}

export async function updateBus(id: string, data: { name: string; plateNumber: string; capacity: number; type: string }) {
  try {
    await prisma.bus.update({
      where: { id },
      data: {
        name: data.name,
        plateNumber: data.plateNumber,
        capacity: data.capacity,
        type: data.type
      }
    });
    revalidatePath("/admin/bus");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du bus:", error);
    throw new Error("Impossible de mettre à jour ce bus. La plaque d'immatriculation existe peut-être déjà.");
  }
}