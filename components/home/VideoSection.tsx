// // components/home/VideoSection.tsx
// export default function VideoSection() {
//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="container mx-auto px-4">
//         {/* En-tête de la section */}
//         <div className="text-center mb-12">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             L&apos;expérience Océan du Nord
//           </h2>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Découvrez ce que nos voyageurs disent de nous.
//           </p>
//         </div>

//         {/* Conteneur de la vidéo */}
//         <div className="max-w-4xl mx-auto">
//           <div className="relative rounded-2xl shadow-xl overflow-hidden aspect-video bg-black">
//             <iframe
//               className="absolute inset-0 w-full h-full"
//               src="https://www.youtube.com/embed/ZEdxbjLCW7s"
//               title="L'expérience Océan du Nord - Témoignages"
//               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//               allowFullScreen
//             />
//           </div>
//         </div>

//         {/* Texte additionnel optionnel */}
//         <div className="text-center mt-10">
//           <p className="text-gray-600 max-w-3xl mx-auto">
//             Des milliers de voyageurs nous font confiance chaque année pour
//             leurs déplacements à travers le Congo. Rejoignez notre communauté de
//             voyageurs satisfaits.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

// components/home/VideoSection.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "dQw4w9WgXcQ";

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* En-tête de la section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            L&apos;expérience Océan du Nord
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos voyageurs disent de nous.
          </p>
        </div>

        {/* Conteneur de la vidéo */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl shadow-xl overflow-hidden aspect-video bg-black">
            {!isPlaying ? (
              // Thumbnail avec bouton play
              <div
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsPlaying(true)}
              >
                {/* Image de couverture */}
                <Image
                  src="/images/bus-04.webp"
                  alt="Témoignages Océan du Nord"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Overlay sombre au survol */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Bouton Play */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                    <svg
                      className="w-10 h-10 md:w-12 md:h-12 text-white ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Badge "Regarder la vidéo" */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 px-6 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-semibold text-gray-900">
                    Regarder la vidéo
                  </p>
                </div>
              </div>
            ) : (
              // Vidéo YouTube en lecture
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="L'expérience Océan du Nord - Témoignages"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>

        {/* Texte additionnel optionnel */}
        <div className="text-center mt-10">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Des milliers de voyageurs nous font confiance chaque année pour
            leurs déplacements à travers le Congo. Rejoignez notre communauté de
            voyageurs satisfaits.
          </p>
        </div>
      </div>
    </section>
  );
}
