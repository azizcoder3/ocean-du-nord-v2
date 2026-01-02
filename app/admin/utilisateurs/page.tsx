import prisma from "@/lib/prisma";
import { Users } from "lucide-react";
import UsersTable from "./UsersTable";

export default async function AdminUsersPage() {
  // Récupération des utilisateurs
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { bookings: true } // On compte combien de fois ils ont voyagé
      }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-sm text-gray-500">Gérez les comptes clients et le personnel de la compagnie.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
          <Users className="w-4 h-4" /> {users.length} Inscrits
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  );
}