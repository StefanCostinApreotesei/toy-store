import { emailLayout } from "./base";

const statusLabels: Record<string, { label: string; color: string; message: string }> = {
  CONFIRMED: {
    label: "Confirmată",
    color: "#2196F3",
    message: "Comanda ta a fost confirmată și este în curs de pregătire.",
  },
  SHIPPED: {
    label: "Expediată",
    color: "#9C27B0",
    message: "Comanda ta a fost expediată! O vei primi în curând.",
  },
  DELIVERED: {
    label: "Livrată",
    color: "#4CAF50",
    message: "Comanda ta a fost livrată cu succes. Sperăm că ești mulțumit!",
  },
  CANCELLED: {
    label: "Anulată",
    color: "#F44336",
    message: "Din păcate, comanda ta a fost anulată. Dacă ai întrebări, contactează-ne.",
  },
};

interface OrderStatusEmailParams {
  orderNumber: string;
  customerName: string;
  status: string;
  siteUrl: string;
}

export function orderStatusEmail({
  orderNumber,
  customerName,
  status,
  siteUrl,
}: OrderStatusEmailParams): string {
  const info = statusLabels[status] || {
    label: status,
    color: "#666",
    message: "Statusul comenzii tale a fost actualizat.",
  };

  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#333;font-size:22px;">
      Salut, ${customerName}!
    </h1>
    <p style="margin:0 0 24px;color:#666;font-size:15px;">
      ${info.message}
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;padding:20px;margin-bottom:24px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;color:#999;font-size:13px;">Comandă</p>
          <p style="margin:0 0 16px;color:#333;font-size:18px;font-weight:bold;">${orderNumber}</p>
          <p style="margin:0 0 8px;color:#999;font-size:13px;">Status nou</p>
          <p style="margin:0;">
            <span style="background:${info.color};color:#fff;padding:6px 16px;border-radius:20px;font-size:14px;font-weight:bold;display:inline-block;">
              ${info.label}
            </span>
          </p>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          <a href="${siteUrl}/cont/comenzi" style="display:inline-block;background:#FF6F61;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-weight:bold;font-size:15px;">
            Vezi detalii comandă
          </a>
        </td>
      </tr>
    </table>
  `);
}
