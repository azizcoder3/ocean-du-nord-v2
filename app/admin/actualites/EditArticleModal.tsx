"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  image: string | null;
  content: string;
  isFeatured: boolean;
}

interface EditArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  onSave: (id: string, formData: FormData) => Promise<void>;
}

export default function EditArticleModal({ isOpen, onClose, article, onSave }: EditArticleModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Flotte",
    author: "",
    image: "" as string | null,
    content: "",
    isFeatured: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        category: article.category,
        author: article.author,
        image: article.image,
        content: article.content,
        isFeatured: article.isFeatured,
      });
    }
  }, [article]);

  if (!isOpen || !article) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("category", formData.category);
      formDataObj.append("author", formData.author);
      formDataObj.append("image", formData.image || "");
      formDataObj.append("content", formData.content);
      formDataObj.append("isFeatured", formData.isFeatured.toString());

      await onSave(article.id, formDataObj);
      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Modifier l&apos;article</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre de l&apos;article
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={isLoading}
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
                Mettre en avant (Flash Info)
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
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
                value={formData.image || ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary min-h-[200px]"
                disabled={isLoading}
                placeholder="Contenu de l'article..."
              />
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
