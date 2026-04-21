import { emailLayout } from "./base";

interface ContactMessageData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export function contactMessageEmail(data: ContactMessageData): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#5D5C61;font-size:22px;">Mesaj nou de contact</h1>
    <p style="margin:0 0 24px;color:#7A797E;font-size:15px;">
      Un vizitator a trimis un mesaj prin formularul de contact.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;border-radius:8px;padding:16px;">
      <tr>
        <td style="padding:8px 16px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Nume</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;font-weight:600;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Email</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;">
                <a href="mailto:${data.email}" style="color:#FF6F61;text-decoration:none;">${data.email}</a>
              </td>
            </tr>
            ${data.phone ? `
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Telefon</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;">${data.phone}</td>
            </tr>
            ` : ""}
            <tr>
              <td style="padding:6px 0;color:#7A797E;font-size:13px;">Subiect</td>
              <td style="padding:6px 0;color:#5D5C61;font-size:14px;text-align:right;font-weight:600;">${data.subject}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <div style="margin-top:24px;background:#ffffff;border:1px solid #eee;border-radius:8px;padding:16px;">
      <p style="margin:0 0 8px;color:#7A797E;font-size:12px;font-weight:600;text-transform:uppercase;">Mesaj</p>
      <p style="margin:0;color:#5D5C61;font-size:14px;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
    </div>
  `);
}
