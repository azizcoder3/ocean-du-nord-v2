// components/home/Hero.tsx
"use client";

import Image from "next/image";
import { MapPin, Calendar, Search } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { useRouter } from "next/navigation";
import { useState } from "react";

import "swiper/css";
import "swiper/css/effect-fade";

// ✅ Fonction utilitaire pour obtenir la date locale au format YYYY-MM-DD
function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const SLIDES = [
  {
    id: 1,
    image: "/images/bus-01.webp",
    alt: "Route du Nord Congo",
    title: "Découvrez le Congo",
    subtitle: "en toute sécurité",
    position: "object-[center_5%]",
  },
  {
    id: 2,
    image: "/images/bus-02.webp",
    alt: "Voyage en bus confort",
    title: "Le confort absolu",
    subtitle: "à petit prix",
  },
  {
    id: 3,
    image: "/images/bg-ocean.webp",
    alt: "Destination Nature",
    title: "Plus de 20 destinations",
    subtitle: "à travers le pays",
    position: "object-[center_60%]",
  },
];

export default function Hero() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  // ✅ CORRECTION: Initialiser avec la date du jour en local
  const [date, setDate] = useState(getLocalDateString());

  const handleSearch = () => {
    // ✅ CORRECTION: Validation améliorée avec vérification de la date
    if (!from || !to) {
      alert("Veuillez remplir les villes de départ et d'arrivée");
      return;
    }

    // ✅ Si la date est vide (ne devrait pas arriver), utiliser la date du jour
    const searchDate = date || getLocalDateString();

    console.log("🔍 Recherche depuis Hero:", { from, to, date: searchDate });

    // Redirection vers /booking avec les paramètres de recherche
    router.push(
      `/booking?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&date=${searchDate}`
    );
  };

  return (
    <section className="relative h-[75vh] min-h-150 flex flex-col justify-center items-center overflow-hidden">
      {/* 1. SLIDER D'ARRIÈRE-PLAN */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full w-full"
        >
          {SLIDES.map((slide) => (
            <SwiperSlide key={slide.id} className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                className={`object-cover ${slide.position || "object-center"}`}
                priority={slide.id === 1}
              />
              <div className="absolute inset-0 bg-black/20 bg-linear-to-b from-black/50 via-transparent to-black/20" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 2. CONTENU TEXTE */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-12 animate-fade-in-up">
        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-4 shadow-sm">
          👋 Mbote ! Bienvenue sur Océan du Nord
        </span>

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          Voyagez à travers le Congo <br />
          <span className="text-secondary">en toute confiance.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto drop-shadow-md">
          Réservez vos billets de bus en quelques clics. Confort premium,
          départs ponctuels et tarifs transparents.
        </p>
      </div>

      {/* 3. BARRE DE RECHERCHE FLOTTANTE */}
      <div className="relative z-20 w-full max-w-5xl px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center ring-1 ring-gray-100">
          {/* Input: Ville de départ */}
          <div className="md:col-span-3 relative group">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-primary/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <MapPin className="text-gray-400 group-focus-within:text-primary w-5 h-5" />
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Départ
                </label>
                <input
                  type="text"
                  placeholder="Ex: Brazzaville"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-300 text-sm w-full p-0"
                />
              </div>
            </div>
          </div>

          {/* Input: Ville d'arrivée */}
          <div className="md:col-span-3 relative group">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-primary/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <MapPin className="text-gray-400 group-focus-within:text-secondary w-5 h-5" />
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Arrivée
                </label>
                <input
                  type="text"
                  placeholder="Ex: Pointe-Noire"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 font-bold placeholder-gray-300 text-sm w-full p-0"
                />
              </div>
            </div>
          </div>

          {/* Input: Date */}
          <div className="md:col-span-3 relative group">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus-within:border-primary/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
              <Calendar className="text-gray-400 group-focus-within:text-primary w-5 h-5" />
              <div className="flex flex-col flex-1">
                <label className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-gray-900 font-bold text-sm w-full p-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bouton Rechercher */}
          <div className="md:col-span-3 h-full">
            <button
              onClick={handleSearch}
              className="w-full h-full min-h-14 bg-secondary hover:bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-secondary/30 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95 text-lg"
            >
              <Search className="w-5 h-5" />
              <span>Rechercher</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
