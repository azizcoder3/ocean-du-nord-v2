"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Lock,
  Phone,
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // États du formulaire
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // États de gestion (Chargement, Erreur, Succès)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Validation Frontend basique
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      setIsLoading(false);
      return;
    }

    try {
      // 2. Appel à l'API d'inscription
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Erreur renvoyée par l'API (ex: Numéro déjà utilisé)
        setError(data.error || "Une erreur est survenue.");
        setIsLoading(false);
      } else {
        // Succès !
        setSuccess(true);
        setIsLoading(false);
        // Redirection vers le login après 2 secondes
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err);
      setError("Erreur de connexion au serveur.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex bg-white">
      {/* 1. Colonne GAUCHE : Image (Masquée sur mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop" // Image différente pour varier
          alt="Inscription Océan du Nord"
          fill
          className="object-cover opacity-80 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/90 to-transparent flex flex-col justify-end p-16 text-white">
          <h2 className="text-4xl font-bold mb-4">Rejoignez le Club.</h2>
          <p className="text-lg text-primary-100 max-w-md">
            Inscrivez-vous dès maintenant pour bénéficier du programme de
            fidélité ONC et voyager l&apos;esprit tranquille.
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
          <div className="text-center mb-8">
            <span className="text-2xl font-black tracking-tighter text-primary">
              OCEAN<span className="text-secondary">DU</span>NORD
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
              Créer un compte
            </h1>
            <p className="text-gray-500">
              Remplissez le formulaire ci-dessous.
            </p>
          </div>

          {/* MESSAGE ERREUR */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 text-sm font-medium animate-pulse">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* MESSAGE SUCCÈS */}
          {success ? (
            <div className="p-8 bg-green-50 border border-green-100 rounded-2xl text-center animate-scale-in">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Compte créé !
              </h3>
              <p className="text-green-700 mb-4">
                Redirection vers la page de connexion...
              </p>
              <Loader2 className="w-6 h-6 text-green-600 animate-spin mx-auto" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nom Complet */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full pl-10 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-secondary focus:bg-white transition-all font-medium"
                    placeholder="Jean Malonga"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              {/* Téléphone */}
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

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-secondary focus:bg-white transition-all font-medium"
                    placeholder="Au moins 6 caractères"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Confirm Mot de passe */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-10 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-secondary focus:bg-white transition-all font-medium"
                    placeholder="Répétez le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                className="w-full bg-primary hover:bg-emerald-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 text-lg flex justify-center items-center gap-2 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-secondary font-bold hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
