import { emailLayout } from "./base";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    county: string;
    postalCode?: string;
    phone: string;
  };
  siteUrl: string;
}

export function orderConfirmationEmail(data: OrderConfirmationData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#5D5C61;font-size:14px;">
          ${item.name} &times; ${item.quantity}
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;color:#5D5C61;font-size:14px;text-align:right;font-weight:600;">
          ${(item.unitPrice * item.quantity).toFixed(2).replace(".", ",")} Lei
        </td>
      </tr>`
    )
    .join("");

  const addr = data.shippingAddress;

  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#5D5C61;font-size:22px;">Comandă confirmată!</h1>
    <p style="margin:0 0 24px;color:#7A797E;font-size:15px;">
      Salut ${data.customerName}, mulțumim pentru comanda ta.
    </p>

    <div style="background:#f9f9f9;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#7A797E;font-size:13px;">Număr comandă</p>
      <p style="margin:0;color:#FF6F61;font-size:18px;font-weight:bold;">${data.orderNumber}</p>
    </div>

    <h2 style="margin:0 0 12px;color:#5D5C61;font-size:16px;">Produse comandate</h2>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      ${itemsHtml}
      <tr>
        <td style="padding:12px 0 0;color:#5D5C61;font-size:16px;font-weight:bold;">Total</td>
        <td style="padding:12px 0 0;color:#5D5C61;font-size:16px;font-weight:bold;text-align:right;">
          ${data.totalAmount.toFixed(2).replace(".", ",")} Lei
        </td>
      </tr>
    </table>

    <h2 style="margin:0 0 12px;color:#5D5C61;font-size:16px;">Adresă de livrare</h2>
    <p style="margin:0 0 24px;color:#7A797E;font-size:14px;line-height:1.6;">
      ${addr.firstName} ${addr.lastName}<br>
      ${addr.street}<br>
      ${addr.city}, ${addr.county}${addr.postalCode ? ` ${addr.postalCode}` : ""}<br>
      Tel: ${addr.phone}
    </p>

    <div style="text-align:center;margin-top:24px;">
      <a href="${data.siteUrl}/cont/comenzi"
         style="display:inline-block;background:#FF6F61;color:#ffffff;font-weight:bold;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;">
        Vezi comanda
      </a>
    </div>
  `);
}
