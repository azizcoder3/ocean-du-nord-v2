import Image from "next/image";
import Link from "next/link";
import { Mail, Clock, ShieldCheck, MapPin } from "lucide-react";

export default function CourrierPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Service */}
      <div className="relative bg-primary py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {/* Pattern de fond optionnel */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute left-0 bottom-0 w-72 h-72 bg-secondary rounded-full mix-blend-overlay blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 text-white backdrop-blur-sm">
            <Mail className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Courrier Express
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Envoyez vos lettres et documents importants en toute sécurité entre
            nos différentes agences. Rapide, fiable et confidentiel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1579532536935-619928decd08?q=80&w=2070&auto=format&fit=crop" // Image enveloppes/courrier
              alt="Service Courrier"
              fill
              className="object-cover"
            />
          </div>

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
                    Rendez-vous dans l&apos;agence Océan du Nord la plus proche
                    de chez vous avec votre courrier.
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

            <Link
              href="/contact"
              className="inline-block bg-primary hover:bg-emerald-800 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
              Trouver une agence
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
