import Image from "next/image";
import Link from "next/link";
import { Package, Truck, Scale, CheckCircle } from "lucide-react";

export default function FretPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Service */}
      <div className="relative bg-gray-900 py-20 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" // Image cartons/entrepôt
          alt="Fond Fret"
          fill
          className="object-cover opacity-20"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-secondary rounded-full mb-6 text-white shadow-lg shadow-secondary/30">
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
            <Scale className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tarification au poids
            </h3>
            <p className="text-gray-600">
              Nos tarifs sont calculés de manière transparente en fonction du
              poids et du volume de vos colis.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <Truck className="w-10 h-10 text-secondary mb-4" />
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
        <div className="bg-primary rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Vous avez un gros volume à expédier ?
            </h2>
            <p className="text-primary-100 text-lg max-w-xl">
              Pour les déménagements ou les envois commerciaux réguliers,
              contactez notre service commercial pour un devis personnalisé.
            </p>
          </div>
          <Link
            href="/contact"
            className="relative z-10 bg-white text-primary font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors shadow-lg whitespace-nowrap"
          >
            Demander un devis
          </Link>

          {/* Déco */}
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full -mb-16 -mr-16"></div>
        </div>
      </div>
    </main>
  );
}
