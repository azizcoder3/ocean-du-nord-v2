//app/admin/actualites/EditArticleModal.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

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

export default function EditArticleModal({
  isOpen,
  onClose,
  article,
  onSave,
}: EditArticleModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "Flotte",
    author: "",
    image: "" as string | null,
    content: "",
    isFeatured: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImagePreview(article.image);
    }
  }, [article]);

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Format invalide", {
        description: "Veuillez sélectionner une image valide.",
      });
      return;
    }

    // Limite de taille : 5 MB
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              Modifier l&apos;article
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading || isUploading}
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
                id="editIsFeatured"
                checked={formData.isFeatured || false}
                onChange={(e) =>
                  setFormData({ ...formData, isFeatured: e.target.checked })
                }
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                disabled={isLoading || isUploading}
              />
              <label
                htmlFor="editIsFeatured"
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
                      <p className="text-sm text-gray-500">
                        Upload en cours...
                      </p>
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
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover"
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
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary min-h-[200px]"
                disabled={isLoading || isUploading}
                placeholder="Contenu de l'article..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading || isUploading}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? "Enregistrement..."
                  : isUploading
                  ? "Upload en cours..."
                  : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import { X } from "lucide-react";

// interface Article {
//   id: string;
//   title: string;
//   category: string;
//   author: string;
//   image: string | null;
//   content: string;
//   isFeatured: boolean;
// }

// interface EditArticleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   article: Article | null;
//   onSave: (id: string, formData: FormData) => Promise<void>;
// }

// export default function EditArticleModal({ isOpen, onClose, article, onSave }: EditArticleModalProps) {
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "Flotte",
//     author: "",
//     image: "" as string | null,
//     content: "",
//     isFeatured: false,
//   });
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (article) {
//       setFormData({
//         title: article.title,
//         category: article.category,
//         author: article.author,
//         image: article.image,
//         content: article.content,
//         isFeatured: article.isFeatured,
//       });
//     }
//   }, [article]);

//   if (!isOpen || !article) return null;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formDataObj = new FormData();
//       formDataObj.append("title", formData.title);
//       formDataObj.append("category", formData.category);
//       formDataObj.append("author", formData.author);
//       formDataObj.append("image", formData.image || "");
//       formDataObj.append("content", formData.content);
//       formDataObj.append("isFeatured", formData.isFeatured.toString());

//       await onSave(article.id, formDataObj);
//       onClose();
//     } catch (error) {
//       console.error("Erreur lors de la sauvegarde:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-xl font-bold text-gray-900">Modifier l&apos;article</h3>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//               disabled={isLoading}
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Titre de l&apos;article
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.title}
//                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="flex items-center gap-3">
//               <input
//                 type="checkbox"
//                 id="isFeatured"
//                 checked={formData.isFeatured || false}
//                 onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
//                 className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
//                 disabled={isLoading}
//               />
//               <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">
//                 Mettre en avant (Flash Info)
//               </label>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Catégorie
//               </label>
//               <select
//                 value={formData.category}
//                 onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
//                 disabled={isLoading}
//               >
//                 <option value="Flotte">Flotte</option>
//                 <option value="Sécurité">Sécurité</option>
//                 <option value="Promo">Promo</option>
//                 <option value="International">International</option>
//                 <option value="Général">Général</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Auteur
//               </label>
//               <input
//                 type="text"
//                 required
//                 value={formData.author}
//                 onChange={(e) => setFormData({ ...formData, author: e.target.value })}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
//                 disabled={isLoading}
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 URL de l&apos;image
//               </label>
//               <input
//                 type="url"
//                 value={formData.image || ""}
//                 onChange={(e) => setFormData({ ...formData, image: e.target.value })}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
//                 disabled={isLoading}
//                 placeholder="https://example.com/image.jpg"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Contenu de l&apos;article
//               </label>
//               <textarea
//                 required
//                 value={formData.content}
//                 onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                 className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary min-h-[200px]"
//                 disabled={isLoading}
//                 placeholder="Contenu de l'article..."
//               />
//             </div>
//             <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={isLoading}
//                 className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 disabled:opacity-50"
//               >
//                 Annuler
//               </button>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }
