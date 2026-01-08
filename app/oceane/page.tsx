//app/oceane/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MessageSquare,
  Clock,
  Map,
  Ticket,
  HelpCircle,
  Zap,
  CheckCircle,
  Globe,
  Sparkles,
  ChevronRight,
  Send,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import dynamic from "next/dynamic";

// ✅ Import dynamique du ChatWidget pour éviter les problèmes SSR
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), {
  ssr: false,
});

export default function OceanePage() {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Questions fréquentes avec réponses pré-définies
  const faqQuestions = [
    {
      id: 1,
      question: "Comment réserver mon billet ?",
      answer:
        "Vous pouvez réserver directement sur notre site en 3 clics : choisissez votre trajet, sélectionnez vos sièges et payez par Mobile Money.",
      icon: Ticket,
    },
    {
      id: 2,
      question: "Quels sont les horaires de départ ?",
      answer:
        "Nos bus partent tous les jours de 6h à 18h. Consultez la page réservation pour voir tous les horaires disponibles.",
      icon: Clock,
    },
    {
      id: 3,
      question: "Puis-je modifier ma réservation ?",
      answer:
        "Oui ! Contactez-nous au +242 06 000 0000 ou via le chat. Les modifications sont gratuites jusqu'à 24h avant le départ.",
      icon: HelpCircle,
    },
    {
      id: 4,
      question: "Où se trouvent vos agences ?",
      answer:
        "Nous avons 3 agences : Brazzaville (Direction Générale), Pointe-Noire et Dolisie. Consultez la section 'Nos Agences' pour plus de détails.",
      icon: MapPin,
    },
  ];

  // Simuler l'ouverture du widget de chat
  const handleChatOpen = () => {
    // Déclencher l'événement personnalisé pour ouvrir le chat
    window.dispatchEvent(new CustomEvent("openChatWidget"));
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-gray-50 to-white pt-20">
      {/* Hero Section Amélioré */}
      <div className="bg-linear-to-br from-green-50 via-white to-blue-50 border-b border-gray-100 relative overflow-hidden">
        {/* Décorations de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Colonne Gauche - Texte */}
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm border border-green-200 shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Disponible 24/7
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight">
                Bonjour, je suis{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-green-600 to-green-400">
                  Océane
                </span>
                👋
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Votre assistante virtuelle intelligente, alimentée par
                l&apos;IA.
                <br />
                Je réponds instantanément à toutes vos questions sur vos
                voyages.
              </p>

              {/* Stats rapides */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Réponse instantanée</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Toujours disponible</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">Multilingue</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6">
                <button
                  onClick={handleChatOpen}
                  className="group px-8 py-4 bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
                  Discuter maintenant
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#faq"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl shadow-md border-2 border-gray-200 transition-all flex items-center justify-center gap-2 hover:border-green-300"
                >
                  <HelpCircle className="w-5 h-5" />
                  Questions fréquentes
                </a>
              </div>
            </div>

            {/* Colonne Droite - Avatar + Chat Preview */}
            <div className="relative">
              <div className="relative w-full max-w-md mx-auto">
                {/* Avatar principal */}
                <div className="relative z-10">
                  <div className="absolute inset-0 bg-linear-to-br from-green-400/20 to-blue-400/20 rounded-full animate-pulse blur-2xl"></div>
                  <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-4 border-white">
                    <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-green-100">
                      <Image
                        src="https://img.freepik.com/free-vector/cute-girl-avatar-illustration_100456-1160.jpg"
                        alt="Océane Avatar"
                        width={256}
                        height={256}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Bulles de dialogue flottantes */}
                <div className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl animate-float border-2 border-green-100 z-20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-gray-800">
                      Slt! Comment puis-je vous aider?
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-4 -left-4 bg-linear-to-r from-green-500 to-green-400 text-white p-4 rounded-2xl shadow-xl animate-float-delayed z-20">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4" />
                    <span className="font-bold">
                      Quel est le prix du billet?
                    </span>
                  </div>
                </div>

                <div className="absolute top-1/2 -right-8 bg-white p-3 rounded-xl shadow-lg animate-bounce z-20 border border-blue-100">
                  <Clock className="w-5 h-5 text-blue-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Ce que je peux faire */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm mb-4">
            Mes Compétences
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            En quoi puis-je vous aider ?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Je suis formée pour répondre à toutes vos questions concernant vos
            voyages avec Océan du Nord.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Ticket,
              title: "Réservations",
              desc: "Trouvez un bus, réservez votre siège et modifiez votre billet.",
              color: "green",
              gradient: "from-green-50 to-green-100",
            },
            {
              icon: Clock,
              title: "Horaires",
              desc: "Consultez les heures de départ et d'arrivée en temps réel.",
              color: "blue",
              gradient: "from-blue-50 to-blue-100",
            },
            {
              icon: Map,
              title: "Agences",
              desc: "Localisez l'agence la plus proche et obtenez les directions.",
              color: "orange",
              gradient: "from-orange-50 to-orange-100",
            },
            {
              icon: HelpCircle,
              title: "Support",
              desc: "Réclamations, objets perdus, suggestions... Je transmets!",
              color: "purple",
              gradient: "from-purple-50 to-purple-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group bg-white p-8 rounded-2xl shadow-sm border-2 border-gray-100 hover:border-green-300 hover:shadow-xl transition-all cursor-pointer"
              onClick={handleChatOpen}
            >
              <div
                className={`w-16 h-16 bg-linear-to-br ${item.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-md`}
              >
                <item.icon className={`w-8 h-8 text-${item.color}-600`} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-500 text-sm text-center leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Questions Fréquentes */}
      <div id="faq" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm mb-4">
              FAQ
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-gray-600 text-lg">
              Cliquez sur une question pour voir ma réponse instantanée
            </p>
          </div>

          <div className="space-y-4">
            {faqQuestions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm border-2 border-gray-100 hover:border-green-300 transition-all cursor-pointer overflow-hidden"
                onClick={() =>
                  setSelectedQuestion(
                    selectedQuestion === item.question ? null : item.question
                  )
                }
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.question}
                    </h3>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 text-gray-400 transition-transform ${
                      selectedQuestion === item.question ? "rotate-90" : ""
                    }`}
                  />
                </div>

                {selectedQuestion === item.question && (
                  <div className="px-6 pb-6 border-t border-gray-100 pt-4 animate-fade-in">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleChatOpen}
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              Poser une autre question
            </button>
          </div>
        </div>
      </div>

      {/* Section: Comment ça marche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-bold text-sm mb-4">
            Simple & Rapide
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Cliquez sur le chat",
              desc: "Ouvrez la fenêtre de discussion en cliquant sur le bouton vert en bas à droite.",
              icon: MessageSquare,
            },
            {
              step: "2",
              title: "Posez votre question",
              desc: "Tapez votre question en langage naturel, comme si vous parliez à un humain.",
              icon: Send,
            },
            {
              step: "3",
              title: "Recevez une réponse",
              desc: "Je vous réponds instantanément avec des informations précises et utiles.",
              icon: Zap,
            },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-400 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-black text-2xl shadow-lg">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
              {idx < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-green-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Final */}
      <div className="bg-linear-to-r from-green-600 to-green-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            Discutez avec moi maintenant et obtenez des réponses instantanées à
            toutes vos questions sur vos voyages.
          </p>
          <button
            onClick={handleChatOpen}
            className="px-10 py-5 bg-white text-green-600 font-black rounded-xl shadow-2xl hover:scale-105 transition-transform text-lg inline-flex items-center gap-3"
          >
            <MessageSquare className="w-6 h-6" />
            Lancer la discussion
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Contacts alternatifs */}
          <div className="mt-12 pt-12 border-t border-green-400/30">
            <p className="text-green-50 mb-6">
              Vous préférez un contact humain ?
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="tel:+242060000000"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                <Phone className="w-5 h-5" />
                <span className="font-bold">+242 06 000 0000</span>
              </a>
              <a
                href="mailto:contact@oceandunord.com"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                <Mail className="w-5 h-5" />
                <span className="font-bold">contact@oceandunord.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1s;
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
