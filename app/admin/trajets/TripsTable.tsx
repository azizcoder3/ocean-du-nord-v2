"use client";

import { useState } from "react";
import { Clock, ArrowRight, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { deleteTrip, updateTrip, updateTripStatus, TripStatus } from "./actions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditTripModal from "./EditTripModal";

interface TripData {
  id: string;
  date: Date;
  busId: string;
  status: string;
  route: {
    id: string;
    fromCity: string;
    toCity: string;
  };
  bus: {
    id: string;
    name: string;
    type: string;
    capacity: number;
  };
}

interface BusData {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

interface TripsTableProps {
  trips: TripData[];
  buses: BusData[];
}

const STATUS_OPTIONS: { value: TripStatus; label: string; color: string }[] = [
  { value: "SCHEDULED", label: "Programmé", color: "bg-blue-50 text-blue-600 border-blue-100" },
  { value: "BOARDING", label: "Embarquement", color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  { value: "ON_ROAD", label: "En route", color: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "COMPLETED", label: "Terminé", color: "bg-green-50 text-green-600 border-green-100" },
  { value: "CANCELLED", label: "Annulé", color: "bg-red-50 text-red-600 border-red-100" },
];

function getStatusStyle(status: string) {
  const option = STATUS_OPTIONS.find((s) => s.value === status);
  return option?.color || "bg-gray-50 text-gray-600 border-gray-100";
}

function getStatusLabel(status: string) {
  const option = STATUS_OPTIONS.find((s) => s.value === status);
  return option?.label || status;
}

export default function TripsTable({ trips: initialTrips, buses }: TripsTableProps) {
  const [trips, setTrips] = useState(initialTrips);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tripId: string | null }>({
    isOpen: false,
    tripId: null,
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; trip: TripData | null }>({
    isOpen: false,
    trip: null,
  });
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [isChangingStatus, setIsChangingStatus] = useState<Record<string, boolean>>({});

  const openDeleteModal = (tripId: string) => {
    setDeleteModal({ isOpen: true, tripId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, tripId: null });
  };

  const openEditModal = (trip: TripData) => {
    setEditModal({ isOpen: true, trip });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, trip: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.tripId) return;

    const tripId = deleteModal.tripId;
    setIsDeleting((prev) => ({ ...prev, [tripId]: true }));

    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((trip) => trip.id !== tripId));
      toast.success("Voyage supprimé avec succès", {
        description: "Le voyage a été supprimé définitivement du planning.",
      });
      closeDeleteModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Erreur lors de la suppression", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression du voyage.",
      });
    } finally {
      setIsDeleting((prev) => ({ ...prev, [tripId]: false }));
    }
  };

  const handleStatusChange = async (tripId: string, newStatus: TripStatus) => {
    setIsChangingStatus((prev) => ({ ...prev, [tripId]: true }));

    try {
      await updateTripStatus(tripId, newStatus);
      setTrips((prev) =>
        prev.map((trip) => (trip.id === tripId ? { ...trip, status: newStatus } : trip))
      );
      toast.success("Statut mis à jour", {
        description: `Le voyage est maintenant "${getStatusLabel(newStatus)}".`,
      });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
      toast.error("Erreur lors du changement de statut", {
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsChangingStatus((prev) => ({ ...prev, [tripId]: false }));
    }
  };

  const handleUpdate = async (id: string, data: { date: Date; busId: string }) => {
    try {
      await updateTrip(id, data);
      const updatedBus = buses.find((b) => b.id === data.busId);
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === id
            ? {
                ...trip,
                date: data.date,
                busId: data.busId,
                bus: updatedBus || trip.bus,
              }
            : trip
        )
      );
      toast.success("Voyage mis à jour avec succès", {
        description: "Les modifications ont été enregistrées.",
      });
      closeEditModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error("Erreur lors de la mise à jour", {
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la modification du voyage.",
      });
    }
  };

  // Check if a trip can be modified (bus hasn't departed yet)
  const canModifyTrip = (trip: TripData) => {
    return trip.status === "SCHEDULED" || trip.status === "BOARDING";
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Date / Heure</th>
              <th className="px-6 py-4 font-bold">Trajet</th>
              <th className="px-6 py-4 font-bold">Véhicule</th>
              <th className="px-6 py-4 font-bold">Statut</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {trips.map((trip) => (
              <tr
                key={trip.id}
                className={`transition-colors group ${
                  trip.status === "CANCELLED"
                    ? "bg-red-50/50 hover:bg-red-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`font-bold ${trip.status === "CANCELLED" ? "text-red-600" : "text-gray-900"}`}>
                      {new Date(trip.date).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${trip.status === "CANCELLED" ? "text-red-400" : "text-gray-500"}`}>
                      <Clock className="w-3 h-3" />{" "}
                      {new Date(trip.date).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`font-medium ${trip.status === "CANCELLED" ? "text-red-600" : "text-gray-700"}`}>
                      {trip.route.fromCity}
                    </span>
                    <ArrowRight className={`w-3 h-3 ${trip.status === "CANCELLED" ? "text-red-300" : "text-gray-400"}`} />
                    <span className={`font-medium ${trip.status === "CANCELLED" ? "text-red-600" : "text-gray-700"}`}>
                      {trip.route.toCity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${trip.status === "CANCELLED" ? "text-red-600" : "text-gray-900"}`}>
                      {trip.bus.name}
                    </span>
                    <span className={`text-[10px] uppercase font-bold ${trip.status === "CANCELLED" ? "text-red-400" : "text-primary"}`}>
                      {trip.bus.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <select
                    value={trip.status}
                    onChange={(e) => handleStatusChange(trip.id, e.target.value as TripStatus)}
                    disabled={isChangingStatus[trip.id]}
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase border cursor-pointer outline-none disabled:opacity-50 disabled:cursor-not-allowed ${getStatusStyle(trip.status)}`}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(trip)}
                      disabled={!canModifyTrip(trip)}
                      className={`p-2 rounded-lg transition-all ${
                        canModifyTrip(trip)
                          ? "text-gray-400 hover:text-primary hover:bg-primary/10"
                          : "text-gray-200 cursor-not-allowed"
                      }`}
                      title={canModifyTrip(trip) ? "Modifier le voyage" : "Modification impossible (voyage en cours ou terminé)"}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(trip.id)}
                      disabled={isDeleting[trip.id]}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer le voyage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {trips.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            Aucun voyage programmé. Utilisez le formulaire pour commencer.
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Supprimer le voyage"
        message="Êtes-vous sûr de vouloir supprimer ce voyage ? Cette action est irréversible et supprimera définitivement toutes les données associées à ce trajet."
        isLoading={deleteModal.tripId ? isDeleting[deleteModal.tripId] : false}
      />

      {/* Modal d'édition */}
      <EditTripModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        trip={editModal.trip}
        buses={buses}
        onSave={handleUpdate}
      />
    </>
  );
}
