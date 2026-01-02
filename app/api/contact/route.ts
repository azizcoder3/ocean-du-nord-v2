import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { fullName, phone, email, subject, message } = await request.json();

    // 1. Mail pour la société (Notification de nouveau message)
    await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: `Nouveau message de ${fullName} - ${subject}`,
      html: `
        <h3>Nouveau message de contact</h3>
        <p><strong>Nom :</strong> ${fullName}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Email :</strong> ${email || "Non renseigné"}</p>
        <p><strong>Message :</strong></p>
        <p>${message}</p>
      `,
    });

    // 2. Mail automatique pour le client (Accusé de réception)
    if (email) {
      await sendEmail({
        to: email,
        subject: "Nous avons bien reçu votre message - Océan du Nord",
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2 style="color: #064e3b;">Bonjour ${fullName},</h2>
            <p>Merci d'avoir contacté Océan du Nord.</p>
            <p>Votre message concernant "<strong>${subject}</strong>" a bien été transmis à notre service client. Nous vous répondrons dans les plus brefs délais.</p>
            <br>
            <p>Cordialement,<br>L'équipe Océan du Nord</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur dans /api/contact:", error);
    return NextResponse.json({ error: "Erreur envoi" }, { status: 500 });
  }
}
