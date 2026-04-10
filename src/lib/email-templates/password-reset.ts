import { emailLayout } from "./base";

interface PasswordResetData {
  name: string;
  resetUrl: string;
}

export function passwordResetEmail(data: PasswordResetData): string {
  return emailLayout(`
    <h1 style="margin:0 0 8px;color:#5D5C61;font-size:22px;">Resetare parolă</h1>
    <p style="margin:0 0 24px;color:#7A797E;font-size:15px;">
      Salut ${data.name}, ai solicitat resetarea parolei contului tău JucăriiShop.
    </p>

    <p style="margin:0 0 24px;color:#7A797E;font-size:14px;">
      Apasă butonul de mai jos pentru a seta o parolă nouă. Link-ul expiră în 1 oră.
    </p>

    <div style="text-align:center;margin:32px 0;">
      <a href="${data.resetUrl}"
         style="display:inline-block;background:#FF6F61;color:#ffffff;font-weight:bold;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:15px;">
        Resetează parola
      </a>
    </div>

    <p style="margin:0;color:#999;font-size:12px;">
      Dacă nu ai solicitat această resetare, poți ignora acest email. Parola ta nu va fi schimbată.
    </p>
  `);
}
