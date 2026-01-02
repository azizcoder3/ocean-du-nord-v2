"use client";

import { useState } from "react";
import { Bus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { deleteBus, updateBus } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditBusModal from "./EditBusModal";

interface BusData {
  id: string;
  name: string;
  plateNumber: string;
  capacity: number;
  type: string;
  createdAt: Date;
}

interface BusTableProps {
  buses: BusData[];
}

export default function BusTable({ buses: initialBuses }: BusTableProps) {
  const [buses, setBuses] = useState(initialBuses);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; busId: string | null }>({
    isOpen: false,
    busId: null,
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; bus: BusData | null }>({
    isOpen: false,
    bus: null,
  });
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const openDeleteModal = (busId: string) => {
    setDeleteModal({ isOpen: true, busId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, busId: null });
  };

  const openEditModal = (bus: BusData) => {
    setEditModal({ isOpen: true, bus });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, bus: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.busId) return;

    const busId = deleteModal.busId;
    setIsDeleting((prev) => ({ ...prev, [busId]: true }));

    try {
      await deleteBus(busId);
      setBuses((prev) => prev.filter((bus) => bus.id !== busId));
      toast.success("Bus supprimé avec succès", {
        description: "Le bus a été supprimé définitivement de la flotte.",
      });
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du bus.",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [busId]: false }));
    }
  };

  const handleUpdate = async (id: string, data: { name: string; plateNumber: string; capacity: number; type: string }) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));
    try {
      await updateBus(id, data);
      setBuses((prev) =>
        prev.map((bus) => (bus.id === id ? { ...bus, ...data } : bus))
      );
      toast.success("Bus mis à jour avec succès", {
        description: `Les informations du bus "${data.name}" ont été modifiées.`,
      });
      closeEditModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la modification du bus.",
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
              <th className="px-6 py-4 font-bold">Bus</th>
              <th className="px-6 py-4 font-bold">Plaque</th>
              <th className="px-6 py-4 font-bold">Capacité</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {buses.map((bus) => (
              <tr
                key={bus.id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <Bus className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-gray-900">{bus.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-mono text-gray-500">
                  {bus.plateNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {bus.capacity} places
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      bus.type === "VIP"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {bus.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(bus)}
                      disabled={isUpdating[bus.id]}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Modifier le bus"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(bus.id)}
                      disabled={isDeleting[bus.id]}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer le bus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isDeleting[bus.id] && (
                      <span className="text-xs text-gray-400 self-center">Suppression...</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {buses.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Bus className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>Aucun bus enregistré pour le moment.</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer le bus"
        message="Êtes-vous sûr de vouloir supprimer ce bus ? Cette action est irréversible et supprimera définitivement toutes les données associées à ce véhicule."
        isLoading={deleteModal.busId ? isDeleting[deleteModal.busId] : false}
      />

      {/* Modal d'édition */}
      <EditBusModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        bus={editModal.bus}
        onSave={handleUpdate}
      />
    </>
  );
}

