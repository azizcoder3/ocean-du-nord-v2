// lib/sms.ts
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialisation du client (uniquement si les clés existent pour éviter les crashs en build)
const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface SendSMSParams {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SendSMSParams) {
  if (!client) {
    console.error("Twilio credentials manquant");
    return;
  }

  try {
    // 1. Nettoyage du numéro
    let formattedPhone = to.replace(/\s/g, "");

    // 2. Gestion du préfixe Congo (+242)
    // Si le numéro commence par 06, 05 ou 04 et n'a pas de préfixe
    if (!formattedPhone.startsWith("+")) {
      if (
        formattedPhone.startsWith("06") ||
        formattedPhone.startsWith("05") ||
        formattedPhone.startsWith("04")
      ) {
        formattedPhone = "+242" + formattedPhone;
      }
    }

    // 3. Envoi
    await client.messages.create({
      body: message,
      from: twilioNumber,
      to: formattedPhone,
    });

    console.log(`✅ SMS envoyé avec succès à ${formattedPhone}`);
  } catch (error) {
    // On log l'erreur mais on ne throw pas pour ne pas bloquer la réservation
    console.error("❌ Erreur envoi SMS Twilio:", error);
  }
}
