import Image from "next/image";
import { BusFront, Users, Sparkles } from "lucide-react";

export default function LocationPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero avec Image de fond */}
      <div className="relative h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white px-4">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" // Image bus
          alt="Location Bus"
          fill
          className="object-cover brightness-50"
        />
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="bg-secondary text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block">
            Service Premium
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Louez un Bus</h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Mariages, excursions, événements d&apos;entreprise... Voyagez en
            groupe avec tout le confort Océan du Nord.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">
              Pourquoi louer nos bus ?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ne vous souciez plus de la logistique. Nous mettons à votre
              disposition nos meilleurs véhicules avec des chauffeurs
              expérimentés pour vous emmener où vous voulez, quand vous voulez.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                  <BusFront className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Flotte Moderne
                  </h3>
                  <p className="text-gray-500">
                    Accès à nos bus VIP climatisés, équipés de WiFi et
                    d&apos;écrans.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary flex-shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Grande Capacité
                  </h3>
                  <p className="text-gray-500">
                    Solutions pour les groupes de 20 à 60 personnes par
                    véhicule.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    Service Sur-Mesure
                  </h3>
                  <p className="text-gray-500">
                    Itinéraire personnalisé et horaires flexibles selon vos
                    besoins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de demande rapide */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Demander un tarif
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tél
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d&apos;événement
                </label>
                <select className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary">
                  <option>Mariage</option>
                  <option>Funérailles</option>
                  <option>Tourisme / Excursion</option>
                  <option>Déplacement Professionnel</option>
                  <option>Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date départ
                  </label>
                  <input
                    type="date"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nbr Pers.
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary"
                  />
                </div>
              </div>
              <button className="w-full bg-secondary hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4">
                Envoyer ma demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
