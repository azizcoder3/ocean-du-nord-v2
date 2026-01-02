"use client";

import { useState } from "react";
import { PenLine, Star, User, X } from "lucide-react";

// 1. On définit proprement le type de nos données de formulaire
interface ReviewFormData {
  name: string;
  phone: string;
  email: string;
  title: string;
  comment: string;
  ratingLocation: number;
  ratingService: number;
  ratingComfort: number;
}

// 2. On définit le type pour une clé de notation (seulement les champs numériques)
type RatingKey = "ratingLocation" | "ratingService" | "ratingComfort";

interface Review {
  id: number;
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export default function ReviewsSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Jean-Paul M.",
      date: "Il y a 2 jours",
      rating: 4.5,
      comment:
        "Voyage très agréable, le bus était à l'heure et la climatisation fonctionnait parfaitement. Je recommande !",
    },
  ]);

  // On applique l'interface ReviewFormData ici
  const [formData, setFormData] = useState<ReviewFormData>({
    name: "",
    phone: "",
    email: "",
    title: "",
    comment: "",
    ratingLocation: 80,
    ratingService: 90,
    ratingComfort: 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const averageScore =
      (formData.ratingLocation +
        formData.ratingService +
        formData.ratingComfort) /
      3;
    const starRating = (averageScore / 100) * 5;

    const newReview: Review = {
      id: Date.now(),
      name: formData.name,
      date: "À l'instant",
      rating: parseFloat(starRating.toFixed(1)),
      comment: formData.comment,
    };

    setReviews([newReview, ...reviews]);

    setIsFormOpen(false);
    setFormData({
      name: "",
      phone: "",
      email: "",
      title: "",
      comment: "",
      ratingLocation: 80,
      ratingService: 90,
      ratingComfort: 80,
    });
  };

  // Liste des champs de notation typée strictement
  const ratingFields: { label: string; key: RatingKey }[] = [
    { label: "Emplacement / Ponctualité", key: "ratingLocation" },
    { label: "Services à bord", key: "ratingService" },
    { label: "Confort & Propreté", key: "ratingComfort" },
  ];

  return (
    <div
      className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-8"
      id="avis"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis clients</h2>

      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 text-secondary font-bold hover:text-amber-600 transition-colors mb-8"
        >
          <PenLine className="w-5 h-5" />
          <span className="underline decoration-2 underline-offset-4">
            Rédiger un avis
          </span>
        </button>
      )}

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fade-in-down"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Votre expérience</h3>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <textarea
                required
                placeholder="Partagez votre expérience détaillée ici..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary outline-none h-32 resize-none"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
              />
            </div>

            <div>
              <input
                type="text"
                required
                placeholder="Titre de votre avis"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-secondary outline-none"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Votre Nom *"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-secondary outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="tel"
                required
                placeholder="Votre Téléphone * (Obligatoire)"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-secondary outline-none"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Votre Email (Optionnel)"
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-secondary outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-200 mt-4">
              {ratingFields.map((item) => (
                <div key={item.key} className="flex items-center gap-4">
                  <span className="w-48 text-sm font-medium text-gray-600">
                    {item.label}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                    // Ici, plus besoin de @ts-ignore car item.key est typé correctement
                    value={formData[item.key]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [item.key]: parseInt(e.target.value),
                      })
                    }
                  />
                  <span className="w-12 text-right font-bold text-gray-500">
                    {/* Idem, TypeScript sait maintenant que c'est un nombre */}
                    {formData[item.key]}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-secondary hover:bg-amber-600 text-white font-bold rounded-lg transition-colors shadow-lg shadow-secondary/20"
              >
                Publier l&apos;avis
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.name}</p>
                  <p className="text-xs text-gray-400">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded text-green-700 font-bold text-sm">
                <span>{review.rating}</span>
                <Star className="w-3 h-3 fill-current" />
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mt-3 pl-14">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
