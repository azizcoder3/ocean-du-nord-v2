import Link from "next/link";
import { ArrowLeft, Clapperboard, Construction } from "lucide-react";

export default function YebanaMultimediaPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center animate-fade-in-up">
        {/* Illustration Iconographique */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          {/* Cercles de fond */}
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 z-10">
            <Clapperboard className="w-12 h-12 text-primary" />
          </div>
          {/* Badge "En travaux" */}
          <div className="absolute -right-2 -bottom-2 bg-secondary text-white p-2 rounded-full shadow-lg z-20 border-4 border-gray-50">
            <Construction className="w-6 h-6" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Yebana <span className="text-primary">Multimédia</span>
        </h1>

        <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full mb-6"></div>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Nous préparons quelque chose de spécial pour vous. <br />
          Cette section dédiée aux reportages, vidéos et à la culture Océan du
          Nord sera bientôt disponible.
        </p>

        {/* Zone de notification (Fictive) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto mb-10">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">
            Statut du projet
          </p>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
            <div className="bg-primary h-2.5 rounded-full w-[70%] animate-pulse"></div>
          </div>
          <p className="text-xs text-right text-primary font-bold">
            70% - En développement
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:-translate-y-1 shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
