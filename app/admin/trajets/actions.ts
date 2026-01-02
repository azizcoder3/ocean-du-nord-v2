"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type TripStatus = "SCHEDULED" | "BOARDING" | "ON_ROAD" | "COMPLETED" | "CANCELLED";

export async function deleteTrip(id: string) {
  try {
    await prisma.trip.delete({ where: { id } });
    revalidatePath("/admin/trajets");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression du voyage:", error);
    throw new Error("Ce voyage ne peut pas être supprimé car il contient des réservations payées.");
  }
}

export async function updateTripStatus(id: string, status: TripStatus) {
  try {
    await prisma.trip.update({
      where: { id },
      data: { status }
    });
    revalidatePath("/admin/trajets");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors du changement de statut:", error);
    throw new Error("Impossible de changer le statut de ce voyage.");
  }
}

export async function updateTrip(id: string, data: { date: Date; busId: string }) {
  try {
    await prisma.trip.update({
      where: { id },
      data: {
        date: data.date,
        busId: data.busId
      }
    });
    revalidatePath("/admin/trajets");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du voyage:", error);
    throw new Error("Impossible de mettre à jour ce voyage.");
  }
}
