// app/loading.tsx
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-hidden bg-white">
      {/* 1. IMAGE D'ARRIÈRE-PLAN (Bus Flouté) */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bus-01.webp" // Assurez-vous que cette image existe (ou bus.webp)
          alt="Chargement Océan du Nord"
          fill
          className="object-cover blur-sm scale-105" // scale-105 évite les bords blancs dus au flou
          priority
        />
        {/* Calque blanc semi-transparent pour garder le spinner lisible */}
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      {/* 2. LE SPINNER (Au premier plan z-10) */}
      <div className="relative z-10 flex items-center justify-center flex-col">
        <div className="relative flex items-center justify-center">
          {/* Cercle extérieur */}
          <div className="w-24 h-24 rounded-full border-4 border-gray-200/50"></div>
          <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-secondary border-t-transparent border-l-transparent animate-spin"></div>

          {/* Effet visuel supplémentaire */}
          <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-primary/20 border-b-primary border-r-transparent animate-spin-slow"></div>

          {/* Logo Central */}
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-lg">
              <span className="font-black text-primary text-xl tracking-tighter">
                O<span className="text-secondary">N</span>
              </span>
            </div>
          </div>
        </div>

        {/* Texte */}
        <div className="mt-8 bg-white/90 px-4 py-1 rounded-full shadow-sm backdrop-blur-md">
          <p className="text-primary font-bold text-sm animate-pulse">
            Chargement...
          </p>
        </div>
      </div>
    </div>
  );
}

// // app/loading.tsx (ou le fichier loading correspondant)
// import { Bus } from "lucide-react";

// export default function Loading() {
//   return (
//     // CORRECTION ICI :
//     // 1. Remplacé 'bg-white/80' par 'bg-white' (Solid, opaque)
//     // 2. Supprimé 'backdrop-blur-sm' (Inutile si le fond est opaque)
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
//       <div className="relative flex items-center justify-center">
//         {/* 1. CERCLE EXTÉRIEUR (Tourne) */}
//         <div className="w-24 h-24 rounded-full border-4 border-gray-200"></div>
//         <div className="absolute top-0 left-0 w-24 h-24 rounded-full border-4 border-secondary border-t-transparent border-l-transparent animate-spin"></div>

//         {/* Effet visuel supplémentaire */}
//         <div className="absolute inset-2 w-20 h-20 rounded-full border-4 border-primary/20 border-b-primary border-r-transparent animate-spin-slow"></div>

//         {/* 2. ICÔNE/LOGO AU CENTRE (Fixe) */}
//         <div className="absolute inset-0 flex items-center justify-center flex-col">
//           <div className="flex items-center justify-center bg-white rounded-full w-12 h-12 shadow-sm">
//             <span className="font-black text-primary text-xl tracking-tighter">
//               O<span className="text-secondary">N</span>
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Petit texte en dessous */}
//       <div className="absolute mt-32 text-primary font-bold text-sm animate-pulse">
//         Chargement...
//       </div>
//     </div>
//   );
// }
