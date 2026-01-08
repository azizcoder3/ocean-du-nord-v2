//app/admin/routes/EditRouteModal.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { CONGO_CITIES } from "@/lib/constants"; // Importation de la liste

interface RouteDetails {
  about?: string;
  departureAgency?: {
    name?: string;
    phone?: string;
  };
  arrivalAgency?: {
    name?: string;
    phone?: string;
  };
  departureStops?: string[];
  arrivalStops?: string[];
  technicalDetails?: {
    busType?: string;
    allowedBaggage?: string;
    onboardServices?: string[];
    usualDepartureTime?: string;
  };
}

interface Route {
  id: string;
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number;
  image?: string | null;
  details?: RouteDetails | null;
}

interface EditRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
  onSave: (
    id: string,
    data: {
      fromCity: string;
      toCity: string;
      priceAdult: number;
      priceChild: number;
      duration: string;
      distance: number;
      image?: string;
      details?: RouteDetails;
    }
  ) => Promise<void>;
}

export default function EditRouteModal({
  isOpen,
  onClose,
  route,
  onSave,
}: EditRouteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // États pour les champs de base
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [priceAdult, setPriceAdult] = useState(0);
  const [priceChild, setPriceChild] = useState(0);
  const [duration, setDuration] = useState("");
  const [distance, setDistance] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // États pour les détails avancés
  const [about, setAbout] = useState("");
  const [departureAgencyName, setDepartureAgencyName] = useState("");
  const [departureAgencyPhone, setDepartureAgencyPhone] = useState("");
  const [arrivalAgencyName, setArrivalAgencyName] = useState("");
  const [arrivalAgencyPhone, setArrivalAgencyPhone] = useState("");
  const [departureStops, setDepartureStops] = useState("");
  const [arrivalStops, setArrivalStops] = useState("");
  const [busType, setBusType] = useState("");
  const [allowedBaggage, setAllowedBaggage] = useState("");
  const [onboardServices, setOnboardServices] = useState("");
  const [usualDepartureTime, setUsualDepartureTime] = useState("");

  useEffect(() => {
    if (route) {
      // Champs de base
      setFromCity(route.fromCity);
      setToCity(route.toCity);
      setPriceAdult(route.priceAdult);
      setPriceChild(route.priceChild);
      setDuration(route.duration);
      setDistance(route.distance);
      setImageUrl(route.image || "");

      // Parser les détails depuis le JSON
      const details = (route.details as RouteDetails) || {};

      setAbout(details.about || "");
      setDepartureAgencyName(details.departureAgency?.name || "");
      setDepartureAgencyPhone(details.departureAgency?.phone || "");
      setArrivalAgencyName(details.arrivalAgency?.name || "");
      setArrivalAgencyPhone(details.arrivalAgency?.phone || "");
      setDepartureStops(details.departureStops?.join(", ") || "");
      setArrivalStops(details.arrivalStops?.join(", ") || "");
      setBusType(details.technicalDetails?.busType || "");
      setAllowedBaggage(details.technicalDetails?.allowedBaggage || "");
      setOnboardServices(
        details.technicalDetails?.onboardServices?.join(", ") || ""
      );
      setUsualDepartureTime(details.technicalDetails?.usualDepartureTime || "");
    }
  }, [route]);

  if (!isOpen || !route) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `routes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("odn-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("odn-media")
        .getPublicUrl(filePath);

      setImageUrl(data.publicUrl);
    } catch (error) {
      console.error("Erreur upload:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Reconstruction de l'objet details
      const details: RouteDetails = {};

      if (about) {
        details.about = about;
      }

      if (departureAgencyName || departureAgencyPhone) {
        details.departureAgency = {};
        if (departureAgencyName) {
          details.departureAgency.name = departureAgencyName;
        }
        if (departureAgencyPhone) {
          details.departureAgency.phone = departureAgencyPhone;
        }
      }

      if (arrivalAgencyName || arrivalAgencyPhone) {
        details.arrivalAgency = {};
        if (arrivalAgencyName) {
          details.arrivalAgency.name = arrivalAgencyName;
        }
        if (arrivalAgencyPhone) {
          details.arrivalAgency.phone = arrivalAgencyPhone;
        }
      }

      if (departureStops) {
        details.departureStops = departureStops
          .split(",")
          .map((stop) => stop.trim())
          .filter((stop) => stop);
      }

      if (arrivalStops) {
        details.arrivalStops = arrivalStops
          .split(",")
          .map((stop) => stop.trim())
          .filter((stop) => stop);
      }

      if (busType || allowedBaggage || onboardServices || usualDepartureTime) {
        details.technicalDetails = {};

        if (busType) {
          details.technicalDetails.busType = busType;
        }
        if (allowedBaggage) {
          details.technicalDetails.allowedBaggage = allowedBaggage;
        }
        if (onboardServices) {
          details.technicalDetails.onboardServices = onboardServices
            .split(",")
            .map((service) => service.trim())
            .filter((service) => service);
        }
        if (usualDepartureTime) {
          details.technicalDetails.usualDepartureTime = usualDepartureTime;
        }
      }

      await onSave(route.id, {
        fromCity,
        toCity,
        priceAdult,
        priceChild,
        duration,
        distance,
        image: imageUrl,
        details: Object.keys(details).length > 0 ? details : undefined,
      });

      onClose();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden animate-scale-in">
        <div className="p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              Modifier la ligne
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Liste de suggestions */}
            <datalist id="cities-list-edit">
              {CONGO_CITIES.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>

            {/* Image */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image d&apos;illustration (Optionnel)
              </label>
              {imageUrl ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200 group">
                  <Image
                    src={imageUrl}
                    alt="Aperçu"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors border-gray-300 hover:bg-gray-50 hover:border-secondary">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-secondary animate-spin mb-2" />
                        <p className="text-sm text-gray-500">
                          Envoi en cours...
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">
                          <span className="font-bold">
                            Cliquez pour ajouter
                          </span>{" "}
                          une photo
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>

            {/* Champs de base */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville de départ
                </label>
                <input
                  type="text"
                  required
                  list="cities-list-edit"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville d&apos;arrivée
                </label>
                <input
                  type="text"
                  required
                  list="cities-list-edit"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Adulte (F)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={priceAdult}
                  onChange={(e) => setPriceAdult(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prix Enfant (F)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={priceChild}
                  onChange={(e) => setPriceChild(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée (ex: 8h 30m)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (km)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={distance}
                  onChange={(e) => setDistance(parseInt(e.target.value) || 0)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Détails avancés */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="font-bold text-lg mb-4 text-gray-800">
                Détails Avancés & Techniques
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  À propos du trajet
                </label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Description du trajet, informations utiles pour les voyageurs..."
                  className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary min-h-25"
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville de départ : Infos Agence
                  </label>
                  <div className="space-y-2">
                    <input
                      value={departureAgencyName}
                      onChange={(e) => setDepartureAgencyName(e.target.value)}
                      placeholder="Nom de l'agence"
                      className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
                      disabled={isLoading}
                    />
                    <input
                      value={departureAgencyPhone}
                      onChange={(e) => setDepartureAgencyPhone(e.target.value)}
                      placeholder="Téléphone"
                      className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville d&apos;arrivée : Infos Agence
                  </label>
                  <div className="space-y-2">
                    <input
                      value={arrivalAgencyName}
                      onChange={(e) => setArrivalAgencyName(e.target.value)}
                      placeholder="Nom de l'agence"
                      className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
                      disabled={isLoading}
                    />
                    <input
                      value={arrivalAgencyPhone}
                      onChange={(e) => setArrivalAgencyPhone(e.target.value)}
                      placeholder="Téléphone"
                      className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liste des arrêts (Départ)
                  </label>
                  <textarea
                    value={departureStops}
                    onChange={(e) => setDepartureStops(e.target.value)}
                    placeholder="Séparez par des virgules"
                    className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary min-h-20"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Liste des arrêts (Arrivée)
                  </label>
                  <textarea
                    value={arrivalStops}
                    onChange={(e) => setArrivalStops(e.target.value)}
                    placeholder="Séparez par des virgules"
                    className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary min-h-20"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-md mb-3 text-gray-800">
                  Détails Techniques
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={busType}
                    onChange={(e) => setBusType(e.target.value)}
                    placeholder="Type de bus (ex: YUTONG C12Pro)"
                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                  <input
                    value={allowedBaggage}
                    onChange={(e) => setAllowedBaggage(e.target.value)}
                    placeholder="Bagage autorisé"
                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                  <input
                    value={onboardServices}
                    onChange={(e) => setOnboardServices(e.target.value)}
                    placeholder="Services à bord (ex: Climatisation, Wifi)"
                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                  <input
                    value={usualDepartureTime}
                    onChange={(e) => setUsualDepartureTime(e.target.value)}
                    placeholder="Heure de départ habituelle"
                    className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
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
                disabled={isLoading || isUploading}
                className="px-6 py-2 bg-primary hover:bg-emerald-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
