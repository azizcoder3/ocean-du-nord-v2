import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Bus,
  Map,
  Ticket,
  Users,
  Home,
  Route,
  Newspaper,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // 1. PROTECTION : Si pas connecté ou pas ADMIN -> Redirection
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR ADMIN FIXE */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-800 text-center">
          <span className="text-xl font-black tracking-tighter">
            O<span className="text-secondary">N</span> ADMIN
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors bg-gray-800/50"
          >
            <LayoutDashboard className="w-5 h-5 text-secondary" /> Tableau de
            bord
          </Link>
          <Link
            href="/admin/routes"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Route className="w-5 h-5 text-gray-400" /> Gestion des Lignes
          </Link>
          <Link
            href="/admin/bus"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Bus className="w-5 h-5 text-gray-400" /> Gestion des Bus
          </Link>
          <Link
            href="/admin/trajets"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Map className="w-5 h-5 text-gray-400" /> Planifier Voyages
          </Link>
          <Link
            href="/admin/reservations"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Ticket className="w-5 h-5 text-gray-400" /> Ventes & Billets
          </Link>
          <Link
            href="/admin/utilisateurs"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Users className="w-5 h-5 text-gray-400" /> Clients
          </Link>
          <Link
            href="/admin/actualites"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Newspaper className="w-5 h-5 text-gray-400" /> Actualités
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <Home className="w-4 h-4" /> Retour au site
          </Link>
        </div>
      </aside>

      {/* ZONE DE CONTENU (Décalée de la largeur de la sidebar) */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
