import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Colonne 1 : À propos */}
          <div>
            <Link href="/" className="inline-block mb-6">
              <span className="text-2xl font-bold tracking-tighter text-white">
                OCEAN<span className="text-secondary">DU</span>NORD
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-gray-400">
              Le leader du transport interurbain au Congo. Nous relions les
              villes, les familles et les affaires avec sécurité et confort
              depuis plus de 20 ans.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Liens Rapides */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Liens Rapides</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/about"
                  className="hover:text-secondary transition-colors"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="hover:text-secondary transition-colors"
                >
                  Nos Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-secondary transition-colors"
                >
                  Services & Courrier
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-secondary transition-colors"
                >
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-secondary transition-colors"
                >
                  Foire aux questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Nos Agences */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Nos Agences</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>
                  <strong className="text-white block">
                    Direction Générale
                  </strong>
                  Avenue de la Paix, Poto-Poto,
                  <br />
                  Brazzaville
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>
                  <strong className="text-white block">
                    Agence Pointe-Noire
                  </strong>
                  Grand Marché, Rond-point Lumumba
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>
                  <strong className="text-white block">Agence Dolisie</strong>
                  Centre-ville, face Gare CFCO
                </span>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">
              Service Client
            </h3>
            <div className="bg-gray-800 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="w-5 h-5 text-secondary" />
                <span className="text-xl font-bold text-white">
                  +242 06 000 0000
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-5 h-5 text-secondary" />
                <span className="text-sm">contact@oceandunord.com</span>
              </div>
              <button className="w-full bg-primary hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors">
                Nous écrire
              </button>
            </div>
          </div>
        </div>

        {/* Barre de copyright */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} Océan du Nord. Tous droits
            réservés.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white">
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
