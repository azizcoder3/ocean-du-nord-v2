// lib/airtel.ts

interface AirtelTokenResponse {
  access_token: string;
  expires_in: number;
}

interface AirtelPaymentResponse {
  data: {
    transaction: {
      id: string;
      status: string;
    };
  };
  status: {
    code: string;
    success: boolean;
    message: string;
  };
}

export const airtelMoneyProvider = {
  // 1. Obtenir le jeton d'accès OAuth2
  async getToken(): Promise<string> {
    const res = await fetch(`${process.env.AIRTEL_API_URL}/auth/oauth2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.AIRTEL_CLIENT_ID,
        client_secret: process.env.AIRTEL_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
    });

    if (!res.ok) throw new Error("Impossible de récupérer le token Airtel");
    const data: AirtelTokenResponse = await res.json();
    return data.access_token;
  },

  // 2. Initier la demande de paiement (Push STK)
  async initiatePayment(
    amount: number,
    phoneNumber: string,
    reference: string
  ) {
    const token = await this.getToken();

    // On s'assure que le numéro est au format international sans le + (ex: 24205...)
    const cleanPhone = phoneNumber.startsWith("05")
      ? `242${phoneNumber.substring(1)}`
      : phoneNumber;

    const payload = {
      subscriber: {
        msisdn: cleanPhone,
      },
      transaction: {
        amount: amount,
        id: reference,
        currency: "XAF", // Franc CFA
      },
      additional_info: [{ key: "company", value: "Ocean du Nord" }],
    };

    const res = await fetch(
      `${process.env.AIRTEL_API_URL}/standard/v1/payments/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Country": "CG", // Congo
          "X-Currency": "XAF",
        },
        body: JSON.stringify(payload),
      }
    );

    const data: AirtelPaymentResponse = await res.json();

    if (!data.status.success) {
      throw new Error(data.status.message || "Erreur Airtel Money");
    }

    return {
      airtelTransactionId: data.data.transaction.id,
      status: data.data.transaction.status,
    };
  },

  // 3. Vérifier le statut d'une transaction
  async checkStatus(airtelRef: string) {
    const token = await this.getToken();

    const res = await fetch(
      `${process.env.AIRTEL_API_URL}/standard/v1/payments/${airtelRef}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Country": "CG",
          "X-Currency": "XAF",
        },
      }
    );

    const data = await res.json();
    return data.data.transaction.status; // 'SUCCESS' | 'FAILURE' | 'PENDING'
  },
};
