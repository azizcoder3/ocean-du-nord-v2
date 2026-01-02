"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Pour une belle notification
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Lock, Phone, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        phone: phone,
        password: password,
        redirect: false, // On gère nous-même la redirection
      });

      if (result?.error) {
        toast.error("Identifiants incorrects.");
        setIsLoading(false);
      } else {
        toast.success("Connexion réussie !");
        
        // --- LA MAGIE EST ICI ---
        // 1. On force Next.js à rafraîchir tous les composants (Header, etc.)
        router.refresh(); 

        // 2. On attend un tout petit peu que la session soit enregistrée
        setTimeout(async () => {
          // 3. On vérifie le rôle pour rediriger au bon endroit
          // On peut appeler une petite route API ou simplement rediriger vers 
          // une page intermédiaire. Le plus simple : rediriger vers "/" 
          // et laisser le bouton Admin du header apparaître.
          
          // Si tu veux rediriger l'ADMIN automatiquement vers /admin :
          // Il est préférable de rediriger vers l'accueil pour rafraîchir le Header
          router.push("/"); 
        }, 500);
      }
    } catch {
      toast.error("Une erreur est survenue.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* 1. Colonne GAUCHE : Image (Masquée sur mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
          alt="Voyage Océan du Nord"
          fill
          className="object-cover opacity-80 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex flex-col justify-end p-16 text-white">
          <h2 className="text-4xl font-bold mb-4">
            Voyagez plus, <br />
            payez moins.
          </h2>
          <p className="text-lg text-primary-100 max-w-md">
            Créez un compte pour gérer vos réservations, accumuler des points de
            fidélité et profiter d&apos;offres exclusives.
          </p>
        </div>
      </div>

      {/* 2. Colonne DROITE : Formulaire */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 relative">
        {/* Bouton retour */}
        <Link
          href="/"
          className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-gray-500 hover:text-primary"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Retour au site</span>
        </Link>

        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <span className="text-2xl font-black tracking-tighter text-primary">
              OCEAN<span className="text-secondary">DU</span>NORD
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
              Heureux de vous revoir !
            </h1>
            <p className="text-gray-500">
              Connectez-vous pour accéder à votre espace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ Téléphone */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="w-full pl-10 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-secondary focus:bg-white transition-all font-medium"
                  placeholder="+242 06..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Champ Mot de passe */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-gray-700">
                  Mot de passe
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-secondary hover:underline"
                >
                  Mot de passe oublié ?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-10 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-secondary focus:bg-white transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={isLoading}
              className="w-full bg-primary hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg flex justify-center items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{" "}
              <Link
                href="/register"
                className="text-secondary font-bold hover:underline"
              >
                Créer un compte
              </Link>
            </p>
          </div>

          {/* Séparateur */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 uppercase font-bold">
              Ou continuer avec
            </span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Google / Facebook (Visuel uniquement pour l'instant) */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700">
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                width={20}
                height={20}
                alt="Google"
              />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700">
              <Image
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                width={20}
                height={20}
                alt="Facebook"
              />
              Facebook
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}