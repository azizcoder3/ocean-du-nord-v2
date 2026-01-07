import Image from "next/image";
import {
  BusFront,
  Users,
  Sparkles,
  MapPin,
  Clock,
  Star,
  Calendar,
  Phone,
} from "lucide-react";

export default function LocationPage() {
  const testimonials = [
    {
      name: "Marie K.",
      event: "Mariage",
      rating: 5,
      comment:
        "Service impeccable pour notre mariage. Le chauffeur était ponctuel et très professionnel. Les invités ont adoré le confort du bus VIP !",
    },
    {
      name: "Jean-Pierre M.",
      event: "Excursion Entreprise",
      rating: 5,
      comment:
        "Parfait pour notre séminaire d'entreprise. Bus climatisé, WiFi fonctionnel. Je recommande vivement Océan du Nord.",
    },
    {
      name: "Fatou D.",
      event: "Voyage familial",
      rating: 5,
      comment:
        "Excellent rapport qualité-prix. Nous avons loué un bus pour une excursion familiale. Tout s'est déroulé parfaitement.",
    },
  ];

  const destinations = [
    {
      name: "Pointe-Noire ↔ Brazzaville",
      duration: "5-6h",
      price: "Sur devis",
    },
    { name: "Pointe-Noire ↔ Dolisie", duration: "3-4h", price: "Sur devis" },
    { name: "Circuits touristiques", duration: "Variable", price: "Sur devis" },
    { name: "Transferts aéroport", duration: "Flexible", price: "Sur devis" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero avec Image de fond */}
      <div className="relative h-[50vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
        {/* 1. L'IMAGE (En arrière-plan) */}
        <Image
          src="/images/bus-ocean.webp"
          alt="Service Courrier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block">
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
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 flex-shrink-0">
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
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
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
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tél
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type d&apos;événement
                </label>
                <select className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600">
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
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nbr Pers.
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600"
                  />
                </div>
              </div>
              <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4">
                Envoyer ma demande
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION: Destinations Populaires */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Destinations Populaires
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nos trajets les plus demandés pour vos voyages en groupe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">
                    {dest.name}
                  </h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{dest.duration}</span>
                  </div>
                  <div className="text-teal-700 font-bold text-lg">
                    {dest.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION: Comment ça marche */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">
              Un processus simple en 4 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  1
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  Faites votre demande
                </h3>
                <p className="text-gray-600">
                  Remplissez le formulaire avec vos besoins (date, nombre de
                  personnes, destination)
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-teal-300"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-amber-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  2
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  Recevez un devis
                </h3>
                <p className="text-gray-600">
                  Notre équipe vous contacte sous 24h avec une proposition
                  tarifaire adaptée
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-amber-300"></div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  3
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  Confirmez votre réservation
                </h3>
                <p className="text-gray-600">
                  Validez les détails et effectuez le paiement pour sécuriser
                  votre réservation
                </p>
              </div>
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-purple-300"></div>
              </div>
            </div>

            <div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  4
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  Voyagez en toute sérénité
                </h3>
                <p className="text-gray-600">
                  Le jour J, votre chauffeur vous attend à l&apos;heure pour un
                  voyage confortable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION: Témoignages clients */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-lg text-gray-600">
              Des centaines de groupes nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-lg">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Call-to-Action finale */}
      <div className="bg-gradient-to-br from-teal-700 to-teal-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à organiser votre voyage ?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Notre équipe est disponible 7j/7 pour répondre à vos questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="tel:+242060000000"
              className="bg-white text-teal-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              +242 06 000 0000
            </a>
            <button className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
