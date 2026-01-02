"use client";

import { useState } from "react";
import { FileText, Trash2, Pencil, Star } from "lucide-react";
import { toast } from "sonner";
import { deleteArticle, updateArticle } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditArticleModal from "./EditArticleModal";

interface ArticleData {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  publishedAt: Date;
  image: string | null;
  content: string;
  isFeatured: boolean;
}

interface ArticleTableProps {
  articles: ArticleData[];
}

export default function ArticleTable({ articles: initialArticles }: ArticleTableProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; articleId: string | null }>({
    isOpen: false,
    articleId: null,
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; article: ArticleData | null }>({
    isOpen: false,
    article: null,
  });
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});

  const openDeleteModal = (articleId: string) => {
    setDeleteModal({ isOpen: true, articleId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, articleId: null });
  };

  const openEditModal = (article: ArticleData) => {
    setEditModal({ isOpen: true, article });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, article: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.articleId) return;

    const articleId = deleteModal.articleId;
    setIsDeleting((prev) => ({ ...prev, [articleId]: true }));

    try {
      await deleteArticle(articleId);
      setArticles((prev) => prev.filter((article) => article.id !== articleId));
      toast.success("Article supprimé avec succès", {
        description: "L'article a été supprimé définitivement.",
      });
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression de l'article.",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  const handleEdit = async (articleId: string, formData: FormData) => {
    setIsEditing((prev) => ({ ...prev, [articleId]: true }));

    try {
      await updateArticle(articleId, formData);

      // Mettre à jour l'article dans la liste locale
      setArticles((prev) =>
        prev.map((article) =>
          article.id === articleId
            ? {
                ...article,
                title: formData.get("title") as string,
                category: formData.get("category") as string,
                author: formData.get("author") as string,
                image: formData.get("image") as string,
                content: formData.get("content") as string,
              }
            : article
        )
      );

      toast.success("Article mis à jour avec succès", {
        description: "Les modifications ont été enregistrées.",
      });

      closeEditModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour de l'article.",
      });
    } finally {
      setIsEditing((prev) => ({ ...prev, [articleId]: false }));
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Titre</th>
              <th className="px-6 py-4 font-bold">Catégorie</th>
              <th className="px-6 py-4 font-bold">Auteur</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles.map((article) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">{article.title}</span>
                    {article.isFeatured && (
                      <div className="relative group">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Article en vedette
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-secondary/10 text-secondary">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {article.author}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(article.publishedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={isEditing[article.id]}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Éditer l'article"
                      onClick={() => openEditModal(article)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting[article.id]}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer l'article"
                      onClick={() => openDeleteModal(article.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isDeleting[article.id] && (
                      <span className="text-xs text-gray-400 self-center">Suppression...</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucun article enregistré pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer l'article"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible et supprimera définitivement toutes les données associées."
        isLoading={deleteModal.articleId ? isDeleting[deleteModal.articleId] : false}
      />

      {/* Modal d'édition d'article */}
      <EditArticleModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        article={editModal.article}
        onSave={handleEdit}
      />
    </>
  );
}
