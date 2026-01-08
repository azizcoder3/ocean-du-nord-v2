// app/services/location/page.tsx
"use client";

import { useState } from "react";
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
  Loader2,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner"; // Assurez-vous d'avoir installé sonner ou utilisez alert()

export default function LocationPage() {
  // --- ÉTATS DU FORMULAIRE ---
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "", // AJOUTÉ : Indispensable pour la réponse auto
    phone: "",
    eventType: "Mariage",
    date: "",
    passengers: "",
  });

  // Gestion des changements dans les inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/services/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        toast.success("Demande envoyée !", {
          description: "Vous recevrez un devis sous 24h.",
        });
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventType: "Mariage",
          date: "",
          passengers: "",
        });
      } else {
        toast.error("Erreur", { description: data.error });
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur réseau", {
        description: "Veuillez réessayer plus tard.",
      });
    } finally {
      setLoading(false);
    }
  };

  // --- DONNÉES STATIQUES ---
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
      <div className="relative h-[50vh] min-h-125 flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/images/bus-ocean.webp" // Assurez-vous que cette image existe
          alt="Service Courrier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <span className="bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-6 inline-block">
            Service Premium
          </span>
          <h1 className="text-4xl md:text-7xl font-bold mb-6">Louez un Bus</h1>
          <p className="text-lg md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Mariages, excursions, événements d&apos;entreprise... Voyagez en
            groupe avec tout le confort Océan du Nord.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
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
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 shrink-0">
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
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
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
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shrink-0">
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
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Demande Reçue !
                </h3>
                <p className="text-gray-600">
                  Merci {formData.name}, nous vous avons envoyé un email de
                  confirmation. Nous vous contacterons sous 24h avec votre
                  devis.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-teal-600 font-bold hover:underline"
                >
                  Envoyer une autre demande
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Demander un tarif
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="06 000 0000"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                    />
                  </div>
                </div>

                {/* CHAMP EMAIL AJOUTÉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse Email
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Pour vous envoyer le devis..."
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type d&apos;événement
                  </label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                  >
                    <option value="Mariage">Mariage</option>
                    <option value="Funérailles">Funérailles</option>
                    <option value="Tourisme / Excursion">
                      Tourisme / Excursion
                    </option>
                    <option value="Déplacement Professionnel">
                      Déplacement Professionnel
                    </option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date départ
                    </label>
                    <input
                      required
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nbr Pers.
                    </label>
                    <input
                      required
                      type="number"
                      name="passengers"
                      value={formData.passengers}
                      onChange={handleChange}
                      min="1"
                      placeholder="Ex: 50"
                      className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-teal-600 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Envoi...
                    </>
                  ) : (
                    "Envoyer ma demande"
                  )}
                </button>
                <p className="text-xs text-center text-gray-400 mt-2">
                  Réponse gratuite sous 24h. Sans engagement.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* RESTE DE LA PAGE (Destinations, etc.) - IDENTIQUE */}
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
                className="bg-linear-to-br from-teal-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center shrink-0">
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
                className="bg-linear-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
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
      <div className="bg-linear-to-br from-teal-700 to-teal-900 py-20">
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
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all shadow-lg flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Demander un devis
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
