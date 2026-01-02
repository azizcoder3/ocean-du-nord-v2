"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    subject: "Renseignement général",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormStatus("sent");
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setFormStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* 1. Header Contact */}
      <div className="bg-primary py-16 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Une question ? Un besoin ?
          </h1>
          <p className="text-primary-100 text-lg">
            Notre équipe est à votre écoute 7j/7 pour vous accompagner dans vos
            voyages.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* 2. Colonne Gauche : Infos Coordonnées */}
          <div className="lg:col-span-1 space-y-8">
            {/* Carte Siège Social */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" /> Direction Générale
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Avenue de la Paix, Poto-Poto
                  <br />
                  Brazzaville, République du Congo
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">+242 06 600 0000</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-medium">contact@oceandunord.com</span>
                </div>
              </div>
            </div>

            {/* Carte Agence Pointe-Noire */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-secondary" /> Agence
                Pointe-Noire
              </h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Grand Marché, Rond-point Lumumba
                  <br />
                  Pointe-Noire
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-medium">+242 05 500 0000</span>
                </div>
              </div>
            </div>

            {/* Horaires */}
            <div className="bg-secondary/10 p-6 rounded-2xl border border-secondary/20">
              <h3 className="font-bold text-secondary-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Horaires d&apos;ouverture
              </h3>
              <ul className="space-y-2 text-sm text-secondary-900">
                <li className="flex justify-between">
                  <span>Lundi - Samedi</span>
                  <span className="font-bold">06h00 - 18h00</span>
                </li>
                <li className="flex justify-between">
                  <span>Dimanche</span>
                  <span className="font-bold">07h00 - 15h00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 3. Colonne Droite : Formulaire */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>

              {formStatus === "sent" ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-green-700">
                    Merci de nous avoir contactés. Notre équipe vous répondra
                    sous 24h.
                  </p>
                  <button
                    onClick={() => {
                      setFormStatus("idle");
                      setFormData({
                        fullName: "",
                        phone: "",
                        email: "",
                        subject: "Renseignement général",
                        message: "",
                      });
                    }}
                    className="mt-6 text-sm font-bold text-green-800 underline"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : formStatus === "error" ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-8 text-center animate-fade-in">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 mb-2">
                    Erreur d&apos;envoi
                  </h3>
                  <p className="text-red-700">
                    Une erreur est survenue lors de l&apos;envoi du message.
                    Veuillez réessayer plus tard.
                  </p>
                  <button
                    onClick={() => setFormStatus("idle")}
                    className="mt-6 text-sm font-bold text-red-800 underline"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-secondary outline-none transition-colors"
                        placeholder="Votre nom"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        required
                        type="tel"
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-secondary outline-none transition-colors"
                        placeholder="+242..."
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email (Optionnel)
                    </label>
                    <input
                      type="email"
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-secondary outline-none transition-colors"
                      placeholder="exemple@mail.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet
                    </label>
                    <select
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-secondary outline-none transition-colors"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    >
                      <option>Renseignement général</option>
                      <option>Réclamation / Objet perdu</option>
                      <option>Partenariat / Entreprise</option>
                      <option>Problème technique site web</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-secondary outline-none transition-colors resize-none"
                      placeholder="Comment pouvons-nous vous aider ?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    ></textarea>
                  </div>

                  <button
                    disabled={formStatus === "sending"}
                    className="w-full py-4 bg-primary hover:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {formStatus === "sending" ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        <span>Envoyer le message</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
