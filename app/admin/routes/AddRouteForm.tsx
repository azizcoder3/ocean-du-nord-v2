//app/admin/routes/AddRouteForm.tsx
"use client";

import { useState } from "react";
import { Plus, Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { addRoute } from "./actions";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { CONGO_CITIES } from "@/lib/constants"; // Importation de la liste des villes

export default function AddRouteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

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
      toast.success("Image téléchargée avec succès");
    } catch (error) {
      console.error("Erreur upload:", error);
      toast.error("Erreur lors de l'envoi de l'image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const fromCity = formData.get("fromCity") as string;
      const toCity = formData.get("toCity") as string;
      const priceAdultStr = formData.get("priceAdult") as string;
      const priceChildStr = formData.get("priceChild") as string;
      const duration = formData.get("duration") as string;
      const distanceStr = formData.get("distance") as string;

      const priceAdult = parseInt(priceAdultStr);
      const priceChild = parseInt(priceChildStr);
      const distance = parseInt(distanceStr);

      if (isNaN(priceAdult) || priceAdult <= 0) {
        throw new Error("Le prix adulte doit être valide (> 0)");
      }
      if (isNaN(priceChild) || priceChild <= 0) {
        throw new Error("Le prix enfant doit être valide (> 0)");
      }
      if (isNaN(distance) || distance <= 0) {
        throw new Error("La distance doit être valide (> 0)");
      }

      const image = imageUrl || undefined;

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

      const data = {
        fromCity,
        toCity,
        priceAdult,
        priceChild,
        duration,
        distance,
        image,
        details: Object.keys(details).length > 0 ? details : undefined,
      };

      await addRoute(data);

      form.reset();
      setImageUrl("");
      setAbout("");
      setDepartureAgencyName("");
      setDepartureAgencyPhone("");
      setArrivalAgencyName("");
      setArrivalAgencyPhone("");
      setDepartureStops("");
      setArrivalStops("");
      setBusType("");
      setAllowedBaggage("");
      setOnboardServices("");
      setUsualDepartureTime("");

      toast.success("Ligne créée avec succès", {
        description: "La nouvelle ligne a été ajoutée.",
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de la ligne:", error);
      toast.error("Erreur lors de la création", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inconnue est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="font-bold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-secondary" /> Nouvelle Ligne
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Liste de suggestions réutilisable */}
        <datalist id="cities-list">
          {CONGO_CITIES.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>

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
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-bold text-sm">Image chargée</p>
              </div>
            </div>
          ) : (
            <label
              className={`
                    flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors
                    ${
                      isUploading
                        ? "bg-gray-50 border-gray-300"
                        : "border-gray-300 hover:bg-gray-50 hover:border-secondary"
                    }
                `}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <Loader2 className="w-8 h-8 text-secondary animate-spin mb-2" />
                    <p className="text-sm text-gray-500">Envoi en cours...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      <span className="font-bold">Cliquez pour ajouter</span>{" "}
                      une photo
                    </p>
                    <p className="text-xs text-gray-400">PNG, JPG (MAX. 2MB)</p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="fromCity"
            list="cities-list"
            placeholder="Ville de départ (ex: Brazzaville)"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
          <input
            name="toCity"
            list="cities-list"
            placeholder="Ville d'arrivée (ex: Cameroun)"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="priceAdult"
            type="number"
            placeholder="Prix Adulte"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
          <input
            name="priceChild"
            type="number"
            placeholder="Prix Enfant"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="duration"
            placeholder="Durée (ex: 8h 30m)"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
          />
          <input
            name="distance"
            type="number"
            placeholder="Distance (km)"
            className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
          />
        </div>

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
                />
                <input
                  value={departureAgencyPhone}
                  onChange={(e) => setDepartureAgencyPhone(e.target.value)}
                  placeholder="Téléphone"
                  className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
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
                />
                <input
                  value={arrivalAgencyPhone}
                  onChange={(e) => setArrivalAgencyPhone(e.target.value)}
                  placeholder="Téléphone"
                  className="w-full p-3 bg-white border rounded-xl outline-none focus:border-primary"
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
                placeholder="Type de bus (ex: YUTONG C12Pro | KING LONG)"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
              />
              <input
                value={allowedBaggage}
                onChange={(e) => setAllowedBaggage(e.target.value)}
                placeholder="Bagage autorisé (ex: Un (01) sac de voyage)"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
              />
              <input
                value={onboardServices}
                onChange={(e) => setOnboardServices(e.target.value)}
                placeholder="Services à bord (ex: Climatisation, Wifi)"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
              />
              <input
                value={usualDepartureTime}
                onChange={(e) => setUsualDepartureTime(e.target.value)}
                placeholder="Heure de départ habituelle (ex: Ref. billet)"
                className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || isUploading}
          className="w-full bg-primary text-white p-4 rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
        >
          {isLoading ? "Création en cours..." : "Créer la destination"}
        </button>
      </form>
    </div>
  );
}
