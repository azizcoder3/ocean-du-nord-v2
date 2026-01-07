import React from "react";
import Image from "next/image";
import {
  Mail,
  Clock,
  ShieldCheck,
  MapPin,
  Package,
  DollarSign,
  Truck,
  CheckCircle,
  Phone,
  FileText,
} from "lucide-react";

export default function CourrierPage() {
  const tarifs = [
    {
      type: "Document simple",
      poids: "Jusqu'à 100g",
      prix: "500 FCFA",
      delai: "Même jour",
    },
    {
      type: "Enveloppe A4",
      poids: "Jusqu'à 250g",
      prix: "750 FCFA",
      delai: "Même jour",
    },
    {
      type: "Petit colis",
      poids: "Jusqu'à 1kg",
      prix: "1 500 FCFA",
      delai: "Même jour",
    },
    {
      type: "Colis moyen",
      poids: "Jusqu'à 5kg",
      prix: "3 000 FCFA",
      delai: "Même jour",
    },
  ];

  const avantages = [
    {
      icon: <Truck className="w-6 h-6" />,
      titre: "Réseau étendu",
      description: "Livraison entre toutes nos agences à travers le pays",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      titre: "Sécurité garantie",
      description: "Suivi et traçabilité de votre courrier à chaque étape",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      titre: "Rapidité",
      description: "Livraison le jour même selon les horaires de bus",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      titre: "Tarifs compétitifs",
      description: "Prix abordables pour tous types de documents",
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Banner */}
      <div className="relative h-[30vh] min-h-[500px]">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop"
          alt="Service Courrier"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Courrier Express
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Envoyez vos lettres et documents importants en toute sécurité entre
            nos différentes agences. Rapide, fiable et confidentiel.
          </p>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Comment ça marche ?
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  1. Déposez en agence
                </h3>
                <p className="text-gray-600">
                  Rendez-vous dans l&apos;agence Océan du Nord la plus proche de
                  chez vous avec votre courrier.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  2. Enregistrement Sécurisé
                </h3>
                <p className="text-gray-600">
                  Nous enregistrons votre courrier et vous remettons un numéro
                  de suivi.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">
                  3. Réception Express
                </h3>
                <p className="text-gray-600">
                  Le destinataire récupère le courrier dans l&apos;agence
                  d&apos;arrivée dès l&apos;arrivée du bus.
                </p>
              </div>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-block bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
          >
            Trouver une agence
          </a>
        </div>
      </div>

      {/* NOUVELLE SECTION 1: Tarifs et Options */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tarifs & Options d&apos;Envoi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des tarifs transparents et adaptés à vos besoins
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {tarifs.map((tarif, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-100"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mb-4">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {tarif.type}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{tarif.poids}</p>
                <div className="border-t pt-4">
                  <p className="text-3xl font-bold text-emerald-600 mb-2">
                    {tarif.prix}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {tarif.delai}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-50 rounded-xl p-8 border-2 border-emerald-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  Documents acceptés
                </h3>
                <p className="text-gray-700 mb-4">
                  Nous acceptons tous types de documents : lettres personnelles,
                  documents administratifs, contrats, factures, photos, cartes
                  d&apos;identité, et petits objets de valeur.
                </p>
                <ul className="grid md:grid-cols-2 gap-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Documents confidentiels
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Pièces d&apos;identité
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Contrats & factures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    Petits objets de valeur
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NOUVELLE SECTION 2: Avantages et FAQ */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Avantages */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Pourquoi choisir notre service courrier ?
              </h2>
              <div className="space-y-6">
                {avantages.map((avantage, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                      {avantage.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {avantage.titre}
                      </h3>
                      <p className="text-gray-600">{avantage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Questions Fréquentes
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Combien de temps prend la livraison ?
                  </h3>
                  <p className="text-gray-600">
                    Votre courrier arrive le jour même selon les horaires de
                    départ de nos bus. Le destinataire peut le récupérer dès
                    l&apos;arrivée du bus à l&apos;agence de destination.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Puis-je suivre mon courrier ?
                  </h3>
                  <p className="text-gray-600">
                    Oui, nous vous fournissons un numéro de suivi lors du dépôt.
                    Vous pouvez suivre votre courrier en temps réel ou appeler
                    notre service client.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    Quelles pièces sont nécessaires ?
                  </h3>
                  <p className="text-gray-600">
                    Pour l&apos;expéditeur et le destinataire, une pièce
                    d&apos;identité valide est requise lors du dépôt et du
                    retrait du courrier pour garantir la sécurité.
                  </p>
                </div>

                <div className="bg-emerald-700 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <Phone className="w-6 h-6" />
                    <h3 className="font-bold text-lg">Besoin d&apos;aide ?</h3>
                  </div>
                  <p className="mb-4">
                    Notre équipe est disponible pour répondre à toutes vos
                    questions
                  </p>
                  <a
                    href="/contact"
                    className="inline-block bg-white text-emerald-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
