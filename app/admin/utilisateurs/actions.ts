"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRole(userId: string, newRole: "USER" | "ADMIN" | "AGENT") {
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  });
  revalidatePath("/admin/utilisateurs");
}

export async function deleteUser(userId: string) {
  // Attention : en production, on préfère souvent désactiver plutôt que supprimer
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/utilisateurs");
}

