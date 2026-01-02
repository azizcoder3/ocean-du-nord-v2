import { Bus } from "lucide-react";

export default function Loading() {
  return (
    // Conteneur plein écran qui couvre tout (z-index très haut)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* 1. CERCLE EXTÉRIEUR (Tourne) */}
        {/* On crée un effet de double cercle : gris clair + l'arc coloré qui tourne */}
        <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>
        <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-secondary border-t-transparent border-l-transparent animate-spin"></div>

        {/* Effet visuel supplémentaire (Cercle interne inversé pour plus de style) */}
        <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-primary/20 border-b-primary border-r-transparent animate-spin-slow"></div>

        {/* 2. ICÔNE/LOGO AU CENTRE (Fixe) */}
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          {/* Simulation du Logo Océan du Nord (ON) */}
          <div className="flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-sm">
            <span className="font-black text-primary text-xl tracking-tighter">
              O<span className="text-secondary">N</span>
            </span>
          </div>
        </div>
      </div>

      {/* Petit texte en dessous (Optionnel) */}
      <div className="absolute mt-32 text-primary font-bold text-sm animate-pulse">
        Chargement...
      </div>
    </div>
  );
}
