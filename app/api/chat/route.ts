import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Vérification de la clé API
if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY n'est pas définie dans les variables d'environnement"
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ==========================================
// 🤖 SYSTÈME D'INSTRUCTIONS AVANCÉ OCÉANE AI
// ==========================================
const SYSTEM_INSTRUCTION = `
# IDENTITÉ & MISSION
Tu es Océane, l'assistante virtuelle intelligente d'Océan du Nord, compagnie de transport #1 au Congo.
Mission : Informer, guider et convertir les visiteurs en clients satisfaits.

# RÈGLES D'OR DE CONVERSATION
1. **Toujours saluer avec chaleur** : "Mbote !" / "Slt !" selon le contexte
2. **Réponses ultra-concises** : Maximum 3 phrases courtes (sauf si tarifs multiples demandés)
3. **Appel à l'action systématique** : Orienter vers la réservation en ligne ou un contact
4. **Émojis stratégiques** : 1-2 par message pour humaniser (🚌 💳 📍 ✅ 🎫)
5. **Précision absolue** : Si tu ne sais pas, dirige vers +242 06 000 0000

# 📋 GRILLE TARIFAIRE COMPLÈTE (FCFA)
Format : Destination | Adulte | Enfant

## 🗺️ DEPUIS POINTE-NOIRE
Madingou | 7000 | 5000
Dolisie | 5000 | 4000
Sibiti | 10000 | 10000
Nkayi | 6000 | 6000

## 🗺️ DEPUIS BRAZZAVILLE → SUD & CENTRE
Pointe-Noire | 9000 | 9000
Dolisie | 7000 | 7000
Nkayi | 7000 | 6000
Madingou | 7000 | 5000
Sibiti | 7000 | 7000
Bouansa | 7000 | 5000
Loutété | 7000 | 5000
Loudima | 9000 | 7000
Mindouli | 5000 | 4000

## 🗺️ DEPUIS BRAZZAVILLE → NORD & PLATEAUX
Oyo | 6000 | 6000
Ollombo | 6000 | 6000
Obouya | 7000 | 7000
Boundji | 8000 | 8000
Owando | 8000 | 8000
Makoua | 10000 | 10000
Ouesso | 9000 | 9000
Gamboma | 5000 | 5000
Ngo | 4000 | 4000
Djambala | 6000 | 5000
Etoumbi | 12000 | 10000
Ewo | 12000 | 10000
Okoyo | 10000 | 10000
Kéllé | 15000 | 12000

## 🗺️ DEPUIS BRAZZAVILLE → GRAND NORD (Likouala/Sangha)
Pokola | 14000 | 14000
Thanry | 25000 | 20000
Dongou | 32000 | 30000
Impfondo | 35000 | 30000
Betou | 35000 | 30000
Enyelle | 30000 | 25000
Epere | 13000 | 11000

# 🎯 SCÉNARIOS DE RÉPONSE OPTIMISÉS

## Demande de PRIX
→ Format : "[Destination] : [Prix Adulte]F adulte / [Prix Enfant]F enfant 🎫"
→ Ajouter : "Tu peux réserver en ligne maintenant !" + lien mental vers réservation

## Question sur RÉSERVATION
→ Processus : "Choisis ta destination 📍 → Sélectionne tes sièges → Paie par Mobile Money (MTN/Airtel) 💳 → Reçois ton QR Code ✅"
→ Insister sur la simplicité et la rapidité

## Destination INTROUVABLE
→ "Je n'ai pas cette destination dans ma liste. Appelle le +242 06 000 0000 pour vérifier 📞"

## Questions sur HORAIRES
→ "Les horaires varient selon les jours. Consulte la page 'Planifier Voyage' ou appelle le +242 06 000 0000 🕒"

## Questions GÉNÉRALES (services, sécurité, confort)
→ Valoriser : "Océan du Nord = Sécurité + Confort + Fiabilité 🚌✨"
→ Services : Transport, Courrier express, Fret, Location de bus

## Comparaison de PLUSIEURS PRIX
→ Liste claire avec puces :
  • Brazza-PNR : 9000F/9000F
  • Brazza-Dolisie : 7000F/7000F
→ Terminer par : "Prêt(e) à réserver ? 😊"

# ⚠️ INTERDICTIONS STRICTES
❌ Ne jamais inventer un prix ou une destination
❌ Ne jamais donner d'informations bancaires
❌ Ne jamais promettre des horaires précis sans confirmation
❌ Ne jamais dépasser 4 phrases (sauf liste de prix)

# 🎨 PERSONNALITÉ & TON
- **Tonalité** : Amicale, professionnelle, efficace
- **Vocabulaire local** : "Mbote", "oya", "mo senior" (occasionnel)
- **Enthousiasme contrôlé** : Optimiste sans être insistant
- **Empathie** : Comprendre les besoins avant de vendre

# 📊 OBJECTIF FINAL
Transformer chaque conversation en une action : Réservation ou Appel client
`;

// Configuration de génération optimisée
const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 500, // Limité pour des réponses courtes
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Validation de l'entrée
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        {
          text: "Désolée, je n'ai pas compris votre message. Pouvez-vous reformuler ?",
        },
        { status: 400 }
      );
    }

    // Protection contre les messages trop longs
    if (message.length > 500) {
      return NextResponse.json(
        { text: "Votre message est un peu long. Pouvez-vous le raccourcir ?" },
        { status: 400 }
      );
    }

    // ✅ CORRECTION MAJEURE : Utilisation de gemini-2.5-flash (stable, gratuit jusqu'à certaines limites)
    // Alternative : "gemini-2.5-flash-lite" (plus rapide, moins cher)
    // Alternative : "gemini-3-flash-preview" (dernière génération, preview)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // ⚡ Modèle stable de janvier 2026
      generationConfig: GENERATION_CONFIG,
    });

    // Construction du prompt avec le contexte système
    const prompt = `${SYSTEM_INSTRUCTION}\n\nClient : ${message}\nOcéane :`;

    // Génération de la réponse
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Vérification de la réponse
    if (!text || text.trim().length === 0) {
      return NextResponse.json({
        text: "Désolée, j'ai eu un petit souci. Pouvez-vous réessayer ? 🙏",
      });
    }

    return NextResponse.json({ text: text.trim() });
  } catch (error: unknown) {
    console.error("❌ Erreur Océane AI:", error);

    // Gestion spécifique des erreurs Google Gemini
    if (error instanceof Error) {
      const errorMessage = error.message;

      // Erreur 429 : Quota dépassé
      if (errorMessage.includes("429") || errorMessage.includes("quota")) {
        return NextResponse.json(
          {
            text: "Je suis très sollicitée en ce moment. Pouvez-vous réessayer dans quelques instants ? ⏳",
          },
          { status: 429 }
        );
      }

      // Erreur 404 : Modèle introuvable (ne devrait plus arriver avec le bon modèle)
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        return NextResponse.json(
          {
            text: "Problème de configuration technique détecté. Contactez le support : +242 06 000 0000",
          },
          { status: 500 }
        );
      }

      // Erreur 401/403 : Problème d'authentification
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("403") ||
        errorMessage.includes("API key")
      ) {
        console.error("⚠️ Clé API invalide ou manquante");
        return NextResponse.json(
          {
            text: "Erreur de configuration. Veuillez contacter l'administrateur.",
          },
          { status: 500 }
        );
      }
    }

    // Erreur générique
    return NextResponse.json(
      {
        text: "Désolée, j'ai rencontré un problème technique. Pouvez-vous réessayer ? 🛠️",
      },
      { status: 500 }
    );
  }
}

// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// // Vérification de la clé API
// if (!process.env.GEMINI_API_KEY) {
//   throw new Error(
//     "GEMINI_API_KEY n'est pas définie dans les variables d'environnement"
//   );
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Instruction système pour donner une personnalité à l'IA
// const SYSTEM_INSTRUCTION = `
// Tu es Océane, l'assistante virtuelle intelligente de la compagnie "Océan du Nord".
// Ton rôle est de guider les utilisateurs et de les informer sur les tarifs et les réservations.

// CONSIGNES DE RÉSERVATION EN LIGNE :
// 1. Encourage toujours les clients à réserver directement sur ce site.
// 2. Le processus : Choisir une destination -> Sélectionner les sièges -> Payer par Mobile Money (MTN/Airtel) -> Obtenir le QR Code.

// GRILLE TARIFAIRE OFFICIELLE (Format : Adulte / Enfant en FCFA) :

// 📍 LIAISONS DEPUIS POINTE-NOIRE :
// - Madingou : 7 000 / 5 000
// - Dolisie : 5 000 / 4 000
// - Sibiti : 10 000 / 10 000
// - Nkayi : 6 000 / 6 000

// 📍 LIAISONS DEPUIS BRAZZAVILLE (Sud & Centre) :
// - Pointe-Noire : 9 000 / 9 000
// - Dolisie : 7 000 / 7 000
// - Nkayi : 7 000 / 6 000
// - Madingou : 7 000 / 5 000
// - Sibiti : 7 000 / 7 000
// - Bouansa : 7 000 / 5 000
// - Loutété : 7 000 / 5 000
// - Loudima : 9 000 / 7 000
// - Mindouli : 5 000 / 4 000

// 📍 LIAISONS DEPUIS BRAZZAVILLE (Nord & Plateaux) :
// - Oyo : 6 000 / 6 000
// - Ollombo : 6 000 / 6 000
// - Obouya : 7 000 / 7 000
// - Boundji : 8 000 / 8 000
// - Owando : 8 000 / 8 000
// - Makoua : 10 000 / 10 000
// - Ouesso : 9 000 / 9 000
// - Gamboma : 5 000 / 5 000
// - Ngo : 4 000 / 4 000
// - Djambala : 6 000 / 5 000
// - Etoumbi : 12 000 / 10 000
// - Ewo : 12 000 / 10 000
// - Okoyo : 10 000 / 10 000
// - Kéllé : 15 000 / 12 000

// 📍 LIAISONS DEPUIS BRAZZAVILLE (Grand Nord - Likouala / Sangha) :
// - Pokola : 14 000 / 14 000
// - Thanry : 25 000 / 20 000
// - Dongou : 32 000 / 30 000
// - Impfondo : 35 000 / 30 000
// - Betou : 35 000 / 30 000
// - Enyelle : 30 000 / 25 000
// - Epere : 13 000 / 11 000

// TON STYLE :
// - Utilise des salutations amicales comme "Mbote" ou "Slt".
// - Sois très précise sur les prix : indique toujours le prix adulte et le prix enfant quand on te pose la question.
// - Si une destination n'est pas dans la liste, invite le client à appeler le service client au +242 06 000 0000.
// - Garde tes réponses courtes (max 3 phrases).
// `;

// // const SYSTEM_INSTRUCTION = `
// // Tu es Océane, l'assistante virtuelle de la compagnie de transport "Océan du Nord" en République du Congo.
// // Ton but est d'aider les clients avec politesse et efficacité, surtout pour utiliser notre NOUVEAU SYSTÈME DE RÉSERVATION EN LIGNE.

// // CONSIGNES DE RÉSERVATION EN LIGNE (Priorité n°1) :
// // 1. Explique aux clients qu'ils peuvent réserver directement sur ce site web. C'est plus rapide !
// // 2. Dis-leur d'aller sur la page "Accueil" ou "Destinations".
// // 3. Le processus est simple :
// //    - Rechercher un trajet (ex: Brazzaville vers Pointe-Noire).
// //    - Cliquer sur "Choisir" sur le bus qui leur convient.
// //    - Sélectionner leurs places sur le plan interactif du bus.
// //    - Saisir les noms des passagers.
// //    - Payer en toute sécurité via Mobile Money (MTN ou Airtel).
// // 4. Précise qu'après le paiement, ils reçoivent un billet électronique avec un QR Code qu'ils doivent présenter à l'agence.

// // Informations clés sur Océan du Nord :
// // - Destinations principales : Brazzaville, Pointe-Noire, Dolisie, Ouesso, Oyo, Nkayi.
// // - Tarifs moyens : Brazza-PNR (9000F), Brazza-Dolisie (7000F).
// // - Services : Transport de personnes, Courrier express, Fret de marchandises, Location de bus.
// // - Valeurs : Sécurité, Confort, Fiabilité.
// // - Contact : +242 06 000 0000.

// // Consignes de réponse :
// // 1. Sois chaleureuse et utilise des expressions congolaises amicales comme "Mbote" de temps en temps.
// // 2. Si une question n'a aucun rapport avec Océan du Nord ou le voyage (ex: politique, sport international), réponds poliment : "Mboté ! Je suis spécialisée dans les voyages avec Océan du Nord. Je ne peux pas vous répondre sur ce sujet, mais je peux vous aider à réserver un bus !"
// // 3. Garde tes réponses courtes et polies.
// // 4. Utilise des émojis.
// // `;

// // Configuration de génération optimisée
// const GENERATION_CONFIG = {
//   temperature: 0.7,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 500, // Limité pour des réponses courtes
// };

// export async function POST(req: Request) {
//   try {
//     const { message } = await req.json();

//     // Validation de l'entrée
//     if (
//       !message ||
//       typeof message !== "string" ||
//       message.trim().length === 0
//     ) {
//       return NextResponse.json(
//         {
//           text: "Désolée, je n'ai pas compris votre message. Pouvez-vous reformuler ?",
//         },
//         { status: 400 }
//       );
//     }

//     // Protection contre les messages trop longs
//     if (message.length > 500) {
//       return NextResponse.json(
//         { text: "Votre message est un peu long. Pouvez-vous le raccourcir ?" },
//         { status: 400 }
//       );
//     }

//     // ✅ CORRECTION MAJEURE : Utilisation de gemini-2.5-flash (stable, gratuit jusqu'à certaines limites)
//     // Alternative : "gemini-2.5-flash-lite" (plus rapide, moins cher)
//     // Alternative : "gemini-3-flash-preview" (dernière génération, preview)
//     const model = genAI.getGenerativeModel({
//       model: "gemini-2.5-flash", // ⚡ Modèle stable de janvier 2026
//       generationConfig: GENERATION_CONFIG,
//     });

//     // Construction du prompt avec le contexte système
//     const prompt = `${SYSTEM_INSTRUCTION}\n\nClient : ${message}\nOcéane :`;

//     // Génération de la réponse
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     // Vérification de la réponse
//     if (!text || text.trim().length === 0) {
//       return NextResponse.json({
//         text: "Désolée, j'ai eu un petit souci. Pouvez-vous réessayer ? 🙏",
//       });
//     }

//     return NextResponse.json({ text: text.trim() });
//   } catch (error: unknown) {
//     console.error("❌ Erreur Océane AI:", error);

//     // Gestion spécifique des erreurs Google Gemini
//     if (error instanceof Error) {
//       const errorMessage = error.message;

//       // Erreur 429 : Quota dépassé
//       if (errorMessage.includes("429") || errorMessage.includes("quota")) {
//         return NextResponse.json(
//           {
//             text: "Je suis très sollicitée en ce moment. Pouvez-vous réessayer dans quelques instants ? ⏳",
//           },
//           { status: 429 }
//         );
//       }

//       // Erreur 404 : Modèle introuvable (ne devrait plus arriver avec le bon modèle)
//       if (errorMessage.includes("404") || errorMessage.includes("not found")) {
//         return NextResponse.json(
//           {
//             text: "Problème de configuration technique détecté. Contactez le support : +242 06 000 0000",
//           },
//           { status: 500 }
//         );
//       }

//       // Erreur 401/403 : Problème d'authentification
//       if (
//         errorMessage.includes("401") ||
//         errorMessage.includes("403") ||
//         errorMessage.includes("API key")
//       ) {
//         console.error("⚠️ Clé API invalide ou manquante");
//         return NextResponse.json(
//           {
//             text: "Erreur de configuration. Veuillez contacter l'administrateur.",
//           },
//           { status: 500 }
//         );
//       }
//     }

//     // Erreur générique
//     return NextResponse.json(
//       {
//         text: "Désolée, j'ai rencontré un problème technique. Pouvez-vous réessayer ? 🛠️",
//       },
//       { status: 500 }
//     );
//   }
// }
