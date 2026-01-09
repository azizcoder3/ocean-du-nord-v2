//app/admin/actualites/AddArticleForm.tsx
"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { Plus, ImageIcon, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { createArticle } from "./actions";
import { supabase } from "@/lib/supabaseClient";

export default function AddArticleForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "Flotte",
    author: "Service Communication",
    image: "",
    content: "",
    isFeatured: false,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Format invalide", {
        description: "Veuillez sélectionner une image valide.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", {
        description: "La taille maximale est de 5 MB.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `actualites/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("odn-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("odn-media")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: urlData.publicUrl });
      setImagePreview(urlData.publicUrl);

      toast.success("Image uploadée avec succès");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Erreur lors de l'upload", {
        description: "Impossible de télécharger l'image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeImage = () => {
    setFormData({ ...formData, image: "" });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
            disabled={isLoading || isUploading}
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
            disabled={isLoading || isUploading}
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
            disabled={isLoading || isUploading}
          >
            <option value="Flotte">Flotte</option>
            <option value="Sécurité">Sécurité</option>
            <option value="Promo">Promo</option>
            <option value="International">International</option>
            <option value="Général">Général</option>
            <option value="Innovation / Digital">Innovation / Digital</option>
            <option value="Services / Confort">Services / Confort</option>
            <option value="Tourisme / Destination">
              Tourisme / Destination
            </option>
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
            disabled={isLoading || isUploading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image de l&apos;article
          </label>

          {!imagePreview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all ${
                isUploading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading || isLoading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-sm text-gray-500">Upload en cours...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Cliquez ou glissez une image ici
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, WEBP (max 5 MB)
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* --- CORRECTION ICI AUSSI --- */
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={imagePreview}
                alt="Aperçu"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={isLoading || isUploading}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
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
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary min-h-37.5"
            disabled={isLoading || isUploading}
            placeholder="Contenu de l'article..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Enregistrement..."
            : isUploading
            ? "Upload en cours..."
            : "Publier l'article"}
        </button>
      </form>
    </div>
  );
}
