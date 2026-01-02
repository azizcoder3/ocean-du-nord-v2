import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod"; // Zod est souvent inclus avec Next.js, sinon npm i zod

// Schéma de validation
const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(4),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phone: { label: "Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // 1. Validation des données entrantes
          const { phone, password } = await loginSchema.parseAsync(credentials);

          // 2. Recherche de l'utilisateur dans la DB
          const user = await prisma.user.findUnique({
            where: { phone },
          });

          if (!user) {
            throw new Error("Numéro de téléphone inconnu.");
          }

          // 3. Vérification du mot de passe
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Mot de passe incorrect.");
          }

          // 4. Si tout est bon, on renvoie l'utilisateur
          return {
            id: user.id,
            name: user.fullName,
            email: user.phone, // Astuce: on met le tel dans email pour NextAuth par défaut
            role: user.role, // On pourra récupérer le rôle (Admin/User)
          };
        } catch (error) {
          console.error("Erreur Auth:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login", // Redirection si non connecté
  },
  callbacks: {
    async jwt({ token, user }) {
      // Lors de la connexion initiale
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
});
