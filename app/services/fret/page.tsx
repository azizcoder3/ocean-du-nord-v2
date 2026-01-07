import React from "react";
import Image from "next/image";
import {
  Package,
  Truck,
  Scale,
  CheckCircle,
  Box,
  Shield,
  Clock,
  DollarSign,
  AlertCircle,
  Phone,
  FileText,
  Archive,
} from "lucide-react";

export default function FretPage() {
  const tarifs = [
    { poids: "0-5 kg", prix: "2 000 FCFA", description: "Petits colis" },
    { poids: "5-10 kg", prix: "3 500 FCFA", description: "Colis moyens" },
    { poids: "10-25 kg", prix: "6 000 FCFA", description: "Gros colis" },
    {
      poids: "25-50 kg",
      prix: "10 000 FCFA",
      description: "Bagages volumineux",
    },
    { poids: "+50 kg", prix: "Sur devis", description: "Marchandises lourdes" },
  ];

  const typesColis: {
    icon: React.ReactElement;
    titre: string;
    description: string;
    color: keyof typeof colorClasses;
  }[] = [
    {
      icon: <Box className="w-6 h-6" />,
      titre: "Colis commerciaux",
      description: "Marchandises pour commerce, stock, produits manufacturés",
      color: "blue",
    },
    {
      icon: <Archive className="w-6 h-6" />,
      titre: "Bagages & Déménagement",
      description: "Cartons, valises, meubles démontés, effets personnels",
      color: "emerald",
    },
    {
      icon: <Package className="w-6 h-6" />,
      titre: "Produits alimentaires",
      description: "Denrées non périssables, produits emballés, provisions",
      color: "orange",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      titre: "Documents volumineux",
      description: "Dossiers, archives, matériel de bureau en quantité",
      color: "purple",
    },
  ];

  const processus = [
    {
      etape: "1",
      titre: "Pesée & Emballage",
      description:
        "Nous pesons votre colis et vérifions l'emballage pour garantir la sécurité durant le transport.",
    },
    {
      etape: "2",
      titre: "Étiquetage & Enregistrement",
      description:
        "Votre colis reçoit un numéro de suivi unique et toutes les informations nécessaires.",
    },
    {
      etape: "3",
      titre: "Chargement & Transport",
      description:
        "Le colis est chargé dans la soute sécurisée de nos bus pour le trajet.",
    },
    {
      etape: "4",
      titre: "Livraison & Réception",
      description:
        "Le destinataire est notifié et récupère le colis à l'agence avec une pièce d'identité.",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Service */}
      <div className="relative bg-gray-900 py-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" // Image cartons/entrepôt
          alt="Fond Fret"
          fill
          className="object-cover opacity-30"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-orange-500 rounded-full mb-6 text-white shadow-lg">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Service Fret & Colis
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Expédiez vos marchandises, colis et bagages volumineux à travers
            tout le réseau Océan du Nord. Une solution logistique adaptée aux
            particuliers et professionnels.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tarifs / Avantages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <Scale className="w-10 h-10 text-emerald-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tarification au poids
            </h3>
            <p className="text-gray-600">
              Nos tarifs sont calculés de manière transparente en fonction du
              poids et du volume de vos colis.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <Truck className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Transport Quotidien
            </h3>
            <p className="text-gray-600">
              Vos colis partent avec nos bus réguliers. Pas d&apos;attente,
              expédition le jour même ou le lendemain.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <CheckCircle className="w-10 h-10 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Garantie Sécurité
            </h3>
            <p className="text-gray-600">
              Vos marchandises sont manipulées avec soin et stockées dans des
              soutes sécurisées.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-emerald-700 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden mb-20">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Vous avez un gros volume à expédier ?
            </h2>
            <p className="text-emerald-100 text-lg max-w-xl">
              Pour les déménagements ou les envois commerciaux réguliers,
              contactez notre service commercial pour un devis personnalisé.
            </p>
          </div>
          <a
            href="/contact"
            className="relative z-10 bg-white text-emerald-700 font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
          >
            Demander un devis
          </a>

          {/* Déco */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>

        {/* NOUVELLE SECTION 1: Grille Tarifaire Détaillée */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Grille Tarifaire
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des tarifs clairs et compétitifs selon le poids de vos envois
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-8">
            {tarifs.map((tarif, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-emerald-500 hover:shadow-lg transition-all text-center"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {index + 1}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {tarif.description}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {tarif.poids}
                </div>
                <div className="text-xl font-bold text-emerald-600">
                  {tarif.prix}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-100">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Informations importantes sur la tarification
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Le poids volumétrique peut s&apos;appliquer pour les colis
                      encombrants (longueur × largeur × hauteur ÷ 5000)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Emballage fragile disponible moyennant un supplément de
                      500 FCFA
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Assurance optionnelle disponible : 2% de la valeur
                      déclarée (minimum 500 FCFA)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>
                      Tarifs dégressifs pour les professionnels et envois
                      réguliers
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* NOUVELLE SECTION 2: Types de Colis & Processus */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Types de colis acceptés */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Types de Colis Acceptés
            </h2>
            <div className="space-y-4">
              {typesColis.map((type, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        colorClasses[type.color]
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {type.titre}
                      </h3>
                      <p className="text-gray-600">{type.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-red-50 rounded-xl p-6 border-2 border-red-100">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Articles interdits
                  </h3>
                  <p className="text-sm text-gray-700">
                    Matières dangereuses, produits inflammables, armes, drogues,
                    denrées périssables sans emballage approprié, animaux
                    vivants, objets de valeur excessive (bijoux, argent
                    liquide).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Processus d'expédition */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Comment Ça Fonctionne ?
            </h2>
            <div className="space-y-6">
              {processus.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {step.etape}
                      </div>
                      {index < processus.length - 1 && (
                        <div className="w-0.5 h-full bg-emerald-200 mt-2"></div>
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">
                        {step.titre}
                      </h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-emerald-700 rounded-xl p-6 text-white mt-8">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-6 h-6" />
                <h3 className="font-bold text-lg">Délai de livraison</h3>
              </div>
              <p className="mb-4">
                Vos colis arrivent généralement le jour même ou le lendemain
                selon l&apos;heure de dépôt et les horaires de départ des bus.
              </p>
              <div className="flex items-center gap-2 text-sm bg-white/10 rounded-lg p-3">
                <Phone className="w-5 h-5" />
                <span>
                  Notification par SMS dès l&apos;arrivée à destination
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Conseils d'emballage */}
        <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">
              Conseils pour un Envoi Réussi
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Package className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Emballage Soigné</h3>
                <p className="text-emerald-100 text-sm">
                  Utilisez des cartons solides et du papier bulle pour les
                  objets fragiles. Un bon emballage évite 90% des dommages.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <FileText className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Étiquetage Clair</h3>
                <p className="text-emerald-100 text-sm">
                  Indiquez lisiblement les coordonnées complètes de
                  l&apos;expéditeur et du destinataire avec les numéros de
                  téléphone.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <DollarSign className="w-8 h-8 mb-3" />
                <h3 className="font-bold text-lg mb-2">Déclarez la Valeur</h3>
                <p className="text-emerald-100 text-sm">
                  Pour les objets de valeur, pensez à souscrire à notre
                  assurance optionnelle pour une tranquillité totale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
