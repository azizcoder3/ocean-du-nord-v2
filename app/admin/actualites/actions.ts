"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string; // Plus tard on gérera l'upload réel
  const isFeatured = formData.get("isFeatured") === "on";

  // Génération automatique du slug à partir du titre
  const slug = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  await prisma.article.create({
    data: { title, slug, category, content, author, image, isFeatured }
  });

  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
}

export async function deleteArticle(id: string) {
  await prisma.article.delete({ where: { id } });
  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
}

export async function updateArticle(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const author = formData.get("author") as string;
  const image = formData.get("image") as string;
  const isFeatured = formData.get("isFeatured") === "on";

  // Génération automatique du slug à partir du titre
  const slug = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  await prisma.article.update({
    where: { id },
    data: { title, slug, category, content, author, image, isFeatured }
  });

  revalidatePath("/actualites");
  revalidatePath("/admin/actualites");
}
