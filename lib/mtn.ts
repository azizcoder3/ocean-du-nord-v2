//lib/mtn.ts
import { v4 as uuidv4 } from "uuid";

// Configuration de base selon l'environnement
const IS_SANDBOX = process.env.MTN_MODE === "sandbox";
const BASE_URL = IS_SANDBOX
  ? "https://sandbox.momodeveloper.mtn.com/collection"
  : "https://proxy.momoapi.mtn.com/collection"; // URL Prod (à vérifier le jour J)

const CURRENCY = process.env.MTN_CURRENCY || "XAF";

// Interface pour la réponse du statut
export interface MtnStatusResponse {
  status: "SUCCESSFUL" | "PENDING" | "FAILED";
  reason?: string; // Ex: EXPIRED, REJECTED
  financialTransactionId?: string; // ID interne MTN
}

/**
 * 1. OBTENIR LE TOKEN (Bearer)
 * Génère un token valide 1h.
 */
async function getMtnToken(): Promise<string> {
  // Encodage Basic Auth : Base64(User:Key)
  const auth = Buffer.from(
    `${process.env.MTN_API_USER}:${process.env.MTN_API_KEY}`
  ).toString("base64");

  try {
    const response = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur Token MTN (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("❌ Erreur FATALE Token MTN:", error);
    throw error;
  }
}

/**
 * 2. DEMANDER LE PAIEMENT (RequestToPay) - POST
 * Envoie la notification "Payer X FCFA" sur le téléphone du client.
 */
export async function initMtnPayment(amount: number, phoneNumber: string) {
  const referenceId = uuidv4(); // Génération automatique de l'UUID (X-Reference-Id)

  try {
    const token = await getMtnToken();

    // Nettoyage du numéro
    // En Prod : on garde le 242. En Sandbox : on force le numéro magique si besoin.
    let partyId = phoneNumber.replace(/\s/g, "").replace("+", "");

    // LOGIQUE SPÉCIALE SANDBOX :
    // Si on est en sandbox, peu importe le numéro saisi par l'utilisateur,
    // on utilise le "Numéro Magique" pour que ça marche (sinon MTN rejette).
    if (IS_SANDBOX) {
      console.log("⚠️ MODE SANDBOX : Utilisation du numéro magique MTN");
      partyId = "46733123453";
    } else {
      // En PROD, on s'assure que le numéro commence par 242
      if (!partyId.startsWith("242")) {
        partyId = `242${partyId}`;
      }
    }

    const payload = {
      amount: String(amount),
      currency: CURRENCY,
      externalId: referenceId, // Notre référence interne
      payer: {
        partyIdType: "MSISDN",
        partyId: partyId,
      },
      payerMessage: "Paiement Billet Océan du Nord",
      payeeNote: "Merci de votre confiance",
    };

    console.log("📤 Envoi demande MTN:", payload);

    const response = await fetch(`${BASE_URL}/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": process.env.MTN_MODE || "sandbox",
        "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // 202 Accepted = Succès de l'envoi
    if (response.status === 202) {
      console.log("✅ Demande MTN acceptée. Ref:", referenceId);
      return {
        success: true,
        referenceId: referenceId, // On retourne l'UUID pour le suivi
      };
    } else {
      const errorText = await response.text();
      console.error("❌ Erreur MTN RequestToPay:", errorText);
      return { success: false, error: errorText };
    }
  } catch (error) {
    console.error("❌ Exception MTN:", error);
    return { success: false, error: "Erreur de connexion MTN" };
  }
}

/**
 * 3. VÉRIFIER LE STATUT (GetTransactionStatus) - GET
 * Appelé en boucle par le frontend pour savoir si le client a payé.
 */
// export async function checkMtnStatus(
//   referenceId: string
// ): Promise<MtnStatusResponse | null> {
//   try {
//     const token = await getMtnToken();

//     const response = await fetch(
//       `${BASE_URL}/v1_0/requesttopay/${referenceId}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "X-Target-Environment": process.env.MTN_MODE || "sandbox",
//           "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error("Erreur vérification statut");
//     }

//     const data = await response.json();
//     return {
//       status: data.status, // SUCCESSFUL, PENDING, FAILED
//       reason: data.reason, // EXPIRED, etc.
//       financialTransactionId: data.financialTransactionId,
//     };
//   } catch (error) {
//     console.error("❌ Erreur Check Status:", error);
//     return null;
//   }
// }

export async function checkMtnStatus(
  referenceId: string
): Promise<MtnStatusResponse | null> {
  // --- AJOUT POUR LE TEST LOCAL (SIMULATION) ---
  // Si on est en Sandbox, on force le succès pour voir la redirection
  if (IS_SANDBOX) {
    console.log("⚠️ SANDBOX: Simulation de validation PIN client...");
    return {
      status: "SUCCESSFUL",
      financialTransactionId: "123456789", // Faux ID de transaction
    };
  }
  // ---------------------------------------------

  try {
    const token = await getMtnToken();

    const response = await fetch(
      `${BASE_URL}/v1_0/requesttopay/${referenceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Target-Environment": process.env.MTN_MODE || "sandbox",
          "Ocp-Apim-Subscription-Key": process.env.MTN_SUBSCRIPTION_KEY!,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Erreur vérification statut");
    }

    const data = await response.json();
    return {
      status: data.status,
      reason: data.reason,
      financialTransactionId: data.financialTransactionId,
    };
  } catch (error) {
    console.error("❌ Erreur Check Status:", error);
    return null;
  }
}
