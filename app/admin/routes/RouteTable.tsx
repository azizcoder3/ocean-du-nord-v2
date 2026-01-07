"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteRoute, updateRoute } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditRouteModal from "./EditRouteModal";

interface RouteData {
  id: string;
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number;
  image?: string | null;
}

interface RouteTableProps {
  routes: RouteData[];
}

export default function RouteTable({ routes: initialRoutes }: RouteTableProps) {
  const [routes, setRoutes] = useState(initialRoutes);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    routeId: string | null;
  }>({
    isOpen: false,
    routeId: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    route: RouteData | null;
  }>({
    isOpen: false,
    route: null,
  });
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const openDeleteModal = (routeId: string) => {
    setDeleteModal({ isOpen: true, routeId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, routeId: null });
  };

  const openEditModal = (route: RouteData) => {
    setEditModal({ isOpen: true, route });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, route: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.routeId) return;

    const routeId = deleteModal.routeId;
    setIsDeleting((prev) => ({ ...prev, [routeId]: true }));

    try {
      await deleteRoute(routeId);
      setRoutes((prev) => prev.filter((route) => route.id !== routeId));
      toast.success("Ligne supprimée avec succès", {
        description: "La ligne a été supprimée définitivement.",
      });
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la suppression de la ligne.",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [routeId]: false }));
    }
  };

  const handleUpdate = async (
    id: string,
    data: {
      fromCity: string;
      toCity: string;
      priceAdult: number;
      priceChild: number;
      duration: string;
      distance: number;
    }
  ) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await updateRoute(id, data);
      setRoutes((prev) =>
        prev.map((route) => (route.id === id ? { ...route, ...data } : route))
      );
      toast.success("Ligne mise à jour avec succès", {
        description: `La ligne ${data.fromCity} ➔ ${data.toCity} a été modifiée.`,
      });
      closeEditModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la modification de la ligne.",
      });
    } finally {
      setIsUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Trajet</th>
              <th className="px-6 py-4 font-bold">Prix Adulte</th>
              <th className="px-6 py-4 font-bold">Prix Enfant</th>
              <th className="px-6 py-4 font-bold">Durée</th>
              <th className="px-6 py-4 font-bold">Distance</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {routes.map((route) => (
              <tr
                key={route.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">
                      {route.fromCity} ➔ {route.toCity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-primary font-bold">
                  {route.priceAdult.toLocaleString()} F
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">
                  {route.priceChild.toLocaleString()} F
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {route.duration}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {route.distance} km
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(route)}
                      disabled={isUpdating[route.id]}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Modifier la ligne"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(route.id)}
                      disabled={isDeleting[route.id]}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer la ligne"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isDeleting[route.id] && (
                      <span className="text-xs text-gray-400 self-center">
                        Suppression...
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {routes.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucune ligne enregistrée pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer la ligne"
        message="Êtes-vous sûr de vouloir supprimer cette ligne ? Cette action est irréversible et supprimera définitivement toutes les données associées à cette ligne."
        isLoading={
          deleteModal.routeId ? isDeleting[deleteModal.routeId] : false
        }
      />

      {/* Modal d'édition */}
      <EditRouteModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        route={editModal.route}
        onSave={handleUpdate}
      />
    </>
  );
}
