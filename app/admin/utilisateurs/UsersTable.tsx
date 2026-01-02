"use client";

import { useState } from "react";
import { Shield, Trash2, Star, Check, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { updateRole, deleteUser } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface User {
  id: string;
  fullName: string | null;
  phone: string;
  role: "USER" | "ADMIN" | "AGENT";
  points: number;
  createdAt: Date;
  _count: {
    bookings: number;
  };
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users: initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null,
  });

  // Filtrage côté client
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.fullName?.toLowerCase().includes(searchLower) ||
      user.phone.includes(searchTerm) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const handleRoleChange = async (userId: string, newRole: "USER" | "ADMIN" | "AGENT") => {
    setIsUpdating((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
      );
      setSelectedRoles((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      toast.success("Rôle mis à jour avec succès", {
        description: `Le rôle de l'utilisateur a été modifié en ${newRole === "ADMIN" ? "Administrateur" : newRole === "AGENT" ? "Agent" : "Client"}.`,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
      toast.error("Erreur lors de la mise à jour", {
        description: "Une erreur est survenue lors de la modification du rôle. Veuillez réessayer.",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const openDeleteModal = (userId: string) => {
    setDeleteModal({ isOpen: true, userId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.userId) return;

    const userId = deleteModal.userId;
    setIsDeleting((prev) => ({ ...prev, [userId]: true }));
    
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      toast.success("Utilisateur supprimé avec succès", {
        description: "L'utilisateur a été supprimé définitivement de la base de données.",
      });
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression", {
        description: "Une erreur est survenue lors de la suppression de l'utilisateur. Veuillez réessayer.",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <>
      {/* Barre de recherche */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, téléphone ou rôle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
              <th className="px-6 py-4">Utilisateur</th>
              <th className="px-6 py-4">Téléphone</th>
              <th className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Rôle
                </div>
              </th>
              <th className="px-6 py-4">Fidélité (ONC)</th>
              <th className="px-6 py-4">Voyages</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => {
              const currentRole = selectedRoles[user.id] || user.role;
              const hasRoleChanged = currentRole !== user.role;
              
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group text-sm">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                        {user.fullName?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.fullName || "Sans nom"}</p>
                        <p className="text-[10px] text-gray-400">
                          Inscrit le {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-600">
                    (+242) {user.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={currentRole}
                        onChange={(e) => {
                          setSelectedRoles((prev) => ({ ...prev, [user.id]: e.target.value }));
                        }}
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded border outline-none
                          ${user.role === "ADMIN"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : user.role === "AGENT"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-green-50 text-green-600 border-green-100"}
                        `}
                      >
                        <option value="USER">Client</option>
                        <option value="AGENT">Agent</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      {hasRoleChanged && (
                        <button
                          type="button"
                          onClick={() => handleRoleChange(user.id, currentRole as "USER" | "ADMIN" | "AGENT")}
                          disabled={isUpdating[user.id]}
                          className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Confirmer le changement de rôle"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {isUpdating[user.id] && (
                        <span className="text-xs text-gray-400">Mise à jour...</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-secondary font-bold">
                      <Star className="w-4 h-4 fill-current" />
                      {user.points} pts
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">
                    {user._count.bookings} voyage(s)
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openDeleteModal(user.id)}
                        disabled={isDeleting[user.id]}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Supprimer le compte"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {isDeleting[user.id] && (
                        <span className="text-xs text-gray-400 self-center">Suppression...</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-20 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>
              {searchTerm ? "Aucun utilisateur trouvé pour cette recherche." : "Aucun utilisateur enregistré."}
            </p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera définitivement toutes les données associées à ce compte."
        isLoading={deleteModal.userId ? isDeleting[deleteModal.userId] : false}
      />
    </>
  );
}

