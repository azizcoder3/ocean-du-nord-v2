"use client";

import Link from "next/link";
import {
  Crown,
  Gift,
  Star,
  Check,
  UserPlus,
  CreditCard,
  ChevronRight,
} from "lucide-react";

export default function ONCPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* 1. HERO SECTION (Premium) */}
      <div className="relative bg-gray-900 py-24 overflow-hidden">
        {/* Fond abstrait doré/vert */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-secondary font-bold text-sm mb-6 border border-white/10 backdrop-blur-sm">
            <Crown className="w-4 h-4" /> Programme de Fidélité
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Le Club{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">
              ONC
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Parce que votre fidélité mérite d&apos;être récompensée. <br />
            Cumulez des points à chaque voyage et accédez à un monde
            d&apos;avantages exclusifs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-secondary hover:bg-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Rejoindre le Club
            </Link>
            <Link
              href="#avantages"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-colors flex items-center justify-center gap-2"
            >
              Voir les avantages
            </Link>
          </div>
        </div>
      </div>

      {/* 2. LES 3 CARTES (NIVEAUX) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Carte Standard */}
          <div className="bg-white rounded-3xl p-1 shadow-xl hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-gradient-to-br from-blue-900 to-blue-700 h-48 rounded-t-[20px] p-6 relative overflow-hidden flex flex-col justify-between text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start">
                <span className="font-bold tracking-widest text-sm opacity-80">
                  STANDARD
                </span>
                <CreditCard className="w-6 h-6 opacity-80" />
              </div>
              <div>
                <p className="text-2xl font-black mb-1">100 ONC</p>
                <p className="text-xs opacity-70">Points de bienvenue</p>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Accès aux offres flash</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Gestion des billets en ligne</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Carte Silver */}
          <div className="bg-white rounded-3xl p-1 shadow-xl hover:-translate-y-2 transition-transform duration-500 scale-105 z-10">
            <div className="bg-gradient-to-br from-gray-400 to-gray-600 h-48 rounded-t-[20px] p-6 relative overflow-hidden flex flex-col justify-between text-white shadow-inner">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start">
                <span className="font-bold tracking-widest text-sm opacity-90 text-gray-100">
                  SILVER
                </span>
                <Star className="w-6 h-6 text-gray-200 fill-current" />
              </div>
              <div>
                <p className="text-3xl font-black mb-1">1 000 ONC</p>
                <p className="text-xs opacity-80">Points cumulés</p>
              </div>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Le plus populaire
                </span>
              </div>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>
                    <strong>5% de réduction</strong> sur tous les trajets
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Bagage supplémentaire (10kg)</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <span>Modification de billet gratuite</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Carte Gold */}
          <div className="bg-white rounded-3xl p-1 shadow-xl hover:-translate-y-2 transition-transform duration-500">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 h-48 rounded-t-[20px] p-6 relative overflow-hidden flex flex-col justify-between text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <div className="flex justify-between items-start">
                <span className="font-bold tracking-widest text-sm opacity-90 text-yellow-100">
                  GOLD
                </span>
                <Crown className="w-6 h-6 text-yellow-100 fill-current" />
              </div>
              <div>
                <p className="text-2xl font-black mb-1">5 000 ONC</p>
                <p className="text-xs opacity-80">Points cumulés</p>
              </div>
            </div>
            <div className="p-8">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>
                    <strong>10% de réduction</strong> à vie
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Accès Salon VIP en gare</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Embarquement prioritaire</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span>Service client dédié 24/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 3. COMMENT GAGNER DES POINTS */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        id="avantages"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500">
            C&apos;est simple, automatique et gratuit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <UserPlus className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              1. Créez votre compte
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              L&apos;inscription est gratuite et vous donne immédiatement accès
              au statut Standard.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
              <CreditCard className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">2. Voyagez</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              À chaque achat de billet, présentez votre numéro ONC. <br />
              <strong className="text-primary">
                1 000 FCFA dépensés = 1 Point ONC.
              </strong>
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <Gift className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              3. Profitez
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dès que vous atteignez un palier, votre statut change
              automatiquement et vos avantages se débloquent.
            </p>
          </div>
        </div>
      </div>

      {/* 4. BANNIÈRE APP */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">
              Suivez vos points en temps réel
            </h2>
            <p className="text-primary-200">
              Connectez-vous à votre espace personnel pour voir votre solde.
            </p>
          </div>
          <Link
            href="/login"
            className="bg-white text-primary font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Mon Espace ONC <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
