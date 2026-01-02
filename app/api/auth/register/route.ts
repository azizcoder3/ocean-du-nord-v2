import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phone, password } = body;

    // 1. Vérification des champs
    if (!phone || !password || !fullName) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // 2. Vérifier si le numéro existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Ce numéro est déjà utilisé" },
        { status: 409 }
      );
    }

    // 3. Hasher le mot de passe (Sécurité)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Créer l'utilisateur
    const newUser = await prisma.user.create({
      data: {
        fullName,
        phone,
        password: hashedPassword,
        role: "USER", // Par défaut, c'est un client
      },
    });

    // On retire le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({ success: true, user: userWithoutPassword });
  } catch (error: unknown) {
    console.error("Erreur inscription:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
