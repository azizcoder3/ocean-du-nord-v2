//app/admin/routes/actions.ts
"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type RouteDetails = {
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
};

export async function addRoute(data: {
  fromCity: string;
  toCity: string;
  priceAdult: number;
  priceChild: number;
  duration: string;
  distance: number;
  image?: string;
  details?: RouteDetails;
}) {
  try {
    if (!data.fromCity || !data.toCity) {
      throw new Error("Les villes de départ et d'arrivée sont requises.");
    }

    if (isNaN(data.priceAdult) || data.priceAdult <= 0) {
      throw new Error(
        "Le prix adulte doit être un nombre valide supérieur à 0."
      );
    }

    if (isNaN(data.priceChild) || data.priceChild <= 0) {
      throw new Error(
        "Le prix enfant doit être un nombre valide supérieur à 0."
      );
    }

    if (isNaN(data.distance) || data.distance <= 0) {
      throw new Error("La distance doit être un nombre valide supérieur à 0.");
    }

    await prisma.route.create({
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        priceAdult: data.priceAdult,
        priceChild: data.priceChild,
        duration: data.duration,
        distance: data.distance,
        image: data.image,
        details: data.details,
      },
    });
    revalidatePath("/admin/routes");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de l'ajout de la ligne:", error);
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint failed")) {
        throw new Error("Une ligne avec ces villes existe déjà.");
      } else if (error.message.includes("Invalid")) {
        throw new Error(
          "Données invalides. Veuillez vérifier les informations saisies."
        );
      }
    }
    throw new Error(
      "Impossible d'ajouter cette ligne. Veuillez vérifier les informations et réessayer."
    );
  }
}

export async function deleteRoute(id: string) {
  try {
    await prisma.route.delete({ where: { id } });
    revalidatePath("/admin/routes");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la suppression de la ligne:", error);
    throw new Error(
      "Impossible de supprimer cette ligne car elle est liée à des voyages programmés."
    );
  }
}

export async function updateRoute(
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
) {
  try {
    await prisma.route.update({
      where: { id },
      data: {
        fromCity: data.fromCity,
        toCity: data.toCity,
        priceAdult: data.priceAdult,
        priceChild: data.priceChild,
        duration: data.duration,
        distance: data.distance,
        image: data.image,
        details: data.details,
      },
    });
    revalidatePath("/admin/routes");
    revalidatePath("/destinations");
    return { success: true };
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ligne:", error);
    throw new Error(
      "Impossible de mettre à jour cette ligne. Veuillez réessayer."
    );
  }
}

// //app/admin/routes/actions.ts
// "use server";

// import prisma from "@/lib/prisma";
// import { revalidatePath } from "next/cache";

// type RouteDetails = {
//   about?: string;
//   departureAgency?: {
//     name?: string;
//     phone?: string;
//   };
//   departureStops?: string[];
//   arrivalStops?: string[];
//   technicalDetails?: {
//     busType?: string;
//     allowedBaggage?: string;
//     onboardServices?: string[];
//     usualDepartureTime?: string;
//   };
// };

// export async function addRoute(data: {
//   fromCity: string;
//   toCity: string;
//   priceAdult: number;
//   priceChild: number;
//   duration: string;
//   distance: number;
//   image?: string;
//   details?: RouteDetails;
// }) {
//   try {
//     // Validate that required fields are not empty
//     if (!data.fromCity || !data.toCity) {
//       throw new Error("Les villes de départ et d'arrivée sont requises.");
//     }

//     // Validate numeric fields are not NaN and are greater than 0
//     if (isNaN(data.priceAdult) || data.priceAdult <= 0) {
//       throw new Error(
//         "Le prix adulte doit être un nombre valide supérieur à 0."
//       );
//     }

//     if (isNaN(data.priceChild) || data.priceChild <= 0) {
//       throw new Error(
//         "Le prix enfant doit être un nombre valide supérieur à 0."
//       );
//     }

//     if (isNaN(data.distance) || data.distance <= 0) {
//       throw new Error("La distance doit être un nombre valide supérieur à 0.");
//     }

//     await prisma.route.create({
//       data: {
//         fromCity: data.fromCity,
//         toCity: data.toCity,
//         priceAdult: data.priceAdult,
//         priceChild: data.priceChild,
//         duration: data.duration,
//         distance: data.distance,
//         image: data.image,
//         details: data.details,
//       },
//     });
//     revalidatePath("/admin/routes");
//     revalidatePath("/destinations");
//     return { success: true };
//   } catch (error) {
//     console.error("Erreur lors de l'ajout de la ligne:", error);
//     if (error instanceof Error) {
//       if (error.message.includes("Unique constraint failed")) {
//         throw new Error("Une ligne avec ces villes existe déjà.");
//       } else if (error.message.includes("Invalid")) {
//         throw new Error(
//           "Données invalides. Veuillez vérifier les informations saisies."
//         );
//       }
//     }
//     throw new Error(
//       "Impossible d'ajouter cette ligne. Veuillez vérifier les informations et réessayer."
//     );
//   }
// }

// export async function deleteRoute(id: string) {
//   try {
//     // Note : Prisma empêchera la suppression si des voyages (Trips) utilisent cette ligne
//     await prisma.route.delete({ where: { id } });
//     revalidatePath("/admin/routes");
//     revalidatePath("/destinations");
//     return { success: true };
//   } catch (error) {
//     console.error("Erreur lors de la suppression de la ligne:", error);
//     throw new Error(
//       "Impossible de supprimer cette ligne car elle est liée à des voyages programmés."
//     );
//   }
// }

// export async function updateRoute(
//   id: string,
//   data: {
//     fromCity: string;
//     toCity: string;
//     priceAdult: number;
//     priceChild: number;
//     duration: string;
//     distance: number;
//     image?: string;
//     details?: RouteDetails;
//   }
// ) {
//   await prisma.route.update({
//     where: { id },
//     data,
//   });
//   revalidatePath("/admin/routes");
//   revalidatePath("/destinations");
//   return { success: true };
// }
