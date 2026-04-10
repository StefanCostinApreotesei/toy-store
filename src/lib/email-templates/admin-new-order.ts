import { emailLayout } from "./base";

interface AdminNewOrderData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
  siteUrl: string;
}

export function adminNewOrderEmail(data: AdminNewOrderData): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#5D5C61;font-size:22px;">Comandă nouă!</h1>
    <p style="margin:0 0 24px;color:#7A797E;font-size:15px;">
      O comandă nouă a fost plasată pe JucăriiShop.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;padding:16px;">
      <tr>
        <td style="padding:8px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Comandă</td>
              <td style="padding:6px 0;color:#FF6F61;font-size:15px;font-weight:bold;text-align:right;">${data.orderNumber}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Client</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;">${data.customerName}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Email</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;">${data.customerEmail}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Produse</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;">${data.itemCount} articole</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Total</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:18px;font-weight:bold;text-align:right;">
                ${data.totalAmount.toFixed(2).replace(".", ",")} Lei
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="text-align:center;margin-top:24px;">
      <a href="${data.siteUrl}/admin/comenzi"
         style="display:inline-block;background:#FF6F61;color:#ffffff;font-weight:bold;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;">
        Vezi în admin
      </a>
    </div>
  `);
}
