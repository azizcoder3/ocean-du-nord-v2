// app/api/services/location/route.ts
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/mail"; // ✅ On utilise votre helper

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, eventType, date, passengers } = body;

    // 1. Validation
    if (!name || !email || !phone || !date) {
      return NextResponse.json(
        { error: "Veuillez remplir les champs obligatoires." },
        { status: 400 }
      );
    }

    // 2. Préparation du Template HTML pour le CLIENT
    const clientHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Océan du Nord</h1>
          <p style="color: #fffbeb; margin: 5px 0 0;">Service Location de Bus</p>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #0f766e;">Bonjour ${name},</h2>
          <p>Nous confirmons la réception de votre demande pour :</p>
          <ul>
            <li><strong>Événement :</strong> ${eventType}</li>
            <li><strong>Date :</strong> ${new Date(date).toLocaleDateString(
              "fr-FR"
            )}</li>
            <li><strong>Passagers :</strong> ${passengers} personnes</li>
          </ul>
          <p>Notre équipe commerciale vous enverra un devis sous 24h.</p>
        </div>
      </div>
    `;

    // 3. Préparation du Template HTML pour l'ADMIN (Vous)
    const adminHtml = `
      <h2>🚌 Nouvelle Demande de Location (Site Web)</h2>
      <ul>
        <li><strong>Client :</strong> ${name}</li>
        <li><strong>Email :</strong> ${email}</li>
        <li><strong>Tél :</strong> ${phone}</li>
        <li><strong>Date :</strong> ${date}</li>
        <li><strong>Type :</strong> ${eventType}</li>
        <li><strong>Pax :</strong> ${passengers}</li>
      </ul>
    `;

    // 4. Envoi des deux emails via votre lib/mail.ts
    // Envoi au Client
    await sendEmail({
      to: email,
      subject: "Confirmation de votre demande - Océan du Nord",
      html: clientHtml,
    });

    // Envoi à l'Admin (Utilisez votre email défini dans .env ou un autre)
    await sendEmail({
      to: process.env.EMAIL_USER!, // Envoi à vous-même
      subject: `[LEAD] Location Bus - ${name}`,
      html: adminHtml,
    });

    return NextResponse.json({ success: true, message: "Emails envoyés" });
  } catch (error) {
    console.error("Erreur API Location:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'envoi." },
      { status: 500 }
    );
  }
}
