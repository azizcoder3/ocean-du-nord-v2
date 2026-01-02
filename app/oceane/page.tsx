"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Clock, Map, Ticket, HelpCircle } from "lucide-react";

export default function OceanePage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Toujours en ligne
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              Bonjour, je suis <span className="text-[#00a651]">Océane</span>.
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Je suis votre assistante virtuelle intelligente. <br />
              Disponible 24h/24 et 7j/7 pour répondre à toutes vos questions sur
              vos voyages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* Ce bouton simule un clic sur le widget (via un petit script ou juste une ancre) */}
              <button className="px-8 py-4 bg-[#00a651] hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discuter maintenant
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 bg-[#00a651]/10 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-white rounded-full shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white">
                <Image
                  src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg" // Avatar Océane
                  alt="Océane Avatar"
                  width={300}
                  height={300}
                  className="object-cover"
                />
              </div>
              {/* Bulles flottantes */}
              <div className="absolute -top-4 -right-4 bg-white p-4 rounded-xl shadow-lg animate-bounce delay-700">
                👋 Slt!
              </div>
              <div className="absolute bottom-8 -left-8 bg-white p-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
                <Ticket className="w-4 h-4 text-secondary" /> Prix du billet ?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ce que je peux faire */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
          En quoi puis-je vous aider ?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors text-center group">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Réservations</h3>
            <p className="text-gray-500 text-sm">
              Aidez-moi à trouver un bus ou à modifier votre billet.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors text-center group">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Horaires</h3>
            <p className="text-gray-500 text-sm">
              Consultez les heures de départ et d&apos;arrivée en temps réel.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors text-center group">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600 group-hover:scale-110 transition-transform">
              <Map className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Agences</h3>
            <p className="text-gray-500 text-sm">
              Localisez l&apos;agence la plus proche de votre position.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors text-center group">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Réclamations</h3>
            <p className="text-gray-500 text-sm">
              Un objet perdu ? Une suggestion ? Je transmets l&apos;info.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
