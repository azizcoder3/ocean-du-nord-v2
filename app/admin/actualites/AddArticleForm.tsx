"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createArticle } from "./actions";

export default function AddArticleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Flotte",
    author: "Service Communication",
    image: "",
    content: "",
    isFeatured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("category", formData.category);
      formDataObj.append("author", formData.author);
      formDataObj.append("image", formData.image);
      formDataObj.append("content", formData.content);
      formDataObj.append("isFeatured", formData.isFeatured.toString());

      await createArticle(formDataObj);

      toast.success("Article ajouté avec succès", {
        description: `L'article "${formData.title}" a été ajouté.`,
      });

      // Réinitialiser le formulaire
      setFormData({
        title: "",
        category: "Flotte",
        author: "Service Communication",
        image: "",
        content: "",
        isFeatured: false,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      toast.error("Erreur lors de l'ajout", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'ajout de l'article.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
      <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-secondary" /> Ajouter un nouvel article
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre de l&apos;article
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) =>
              setFormData({ ...formData, isFeatured: e.target.checked })
            }
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            disabled={isLoading}
          />
          <label
            htmlFor="isFeatured"
            className="text-sm font-medium text-gray-700"
          >
            Mettre en avant (Flash Info)
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            disabled={isLoading}
          >
            <option value="Flotte">Flotte</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Promo">Promo</option>
            <option value="International">International</option>
            <option value="Général">Général</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Auteur
          </label>
          <input
            type="text"
            required
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            disabled={isLoading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL de l&apos;image
          </label>
          <input
            type="url"
            value={formData.image}
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.value })
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
            disabled={isLoading}
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenu de l&apos;article
          </label>
          <textarea
            required
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary min-h-[150px]"
            disabled={isLoading}
            placeholder="Contenu de l'article..."
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Enregistrement..." : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}
