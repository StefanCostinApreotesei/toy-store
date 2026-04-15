import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Cookies",
  description: "Informații despre utilizarea cookie-urilor pe site-ul JucăriiShop",
};

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Politica de Cookies" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Politica de Cookies</h1>

      <div className="prose prose-sm max-w-none text-darkgray-light space-y-6">
        <p className="text-sm text-darkgray-light">
          Ultima actualizare: 12 aprilie 2026
        </p>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Ce sunt cookie-urile?</h2>
          <p>
            Cookie-urile sunt fișiere text de mici dimensiuni stocate pe dispozitivul
            dumneavoastră atunci când vizitați un site web. Acestea sunt utilizate pe scară
            largă pentru a face site-urile web să funcționeze eficient și pentru a furniza
            informații proprietarilor site-ului.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Cookie-uri utilizate</h2>

          <h3 className="text-lg font-bold text-darkgray mt-6 mb-2">Cookie-uri esențiale (obligatorii)</h3>
          <p>Necesare funcționării site-ului. Nu pot fi dezactivate.</p>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-lightgray">
                <tr>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Cookie</th>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Scop</th>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Durată</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">authjs.session-token</td>
                  <td className="px-4 py-2">Autentificarea utilizatorului</td>
                  <td className="px-4 py-2">Sesiune</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">authjs.csrf-token</td>
                  <td className="px-4 py-2">Protecție CSRF</td>
                  <td className="px-4 py-2">Sesiune</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">cookie-consent</td>
                  <td className="px-4 py-2">Stocarea preferinței cookie</td>
                  <td className="px-4 py-2">1 an</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-lg font-bold text-darkgray mt-6 mb-2">Cookie-uri funcționale</h3>
          <p>Utilizate pentru funcționalități suplimentare ale site-ului.</p>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <table className="w-full text-sm">
              <thead className="bg-lightgray">
                <tr>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Stocare</th>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Scop</th>
                  <th className="text-left px-4 py-2 font-bold text-darkgray">Tip</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">cart (localStorage)</td>
                  <td className="px-4 py-2">Coșul de cumpărături</td>
                  <td className="px-4 py-2">Local Storage</td>
                </tr>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-2 font-mono text-xs">wishlist (localStorage)</td>
                  <td className="px-4 py-2">Lista de favorite</td>
                  <td className="px-4 py-2">Local Storage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Gestionarea cookie-urilor</h2>
          <p>
            Puteți gestiona și/sau șterge cookie-urile după preferințele dumneavoastră.
            Majoritatea browserelor vă permit să refuzați cookie-urile sau să fiți notificat
            când un cookie este trimis. Rețineți că dezactivarea cookie-urilor poate afecta
            funcționalitatea site-ului.
          </p>
          <p>Instrucțiuni pentru browserele principale:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Chrome: Setări → Confidențialitate și securitate → Cookie-uri</li>
            <li>Firefox: Setări → Confidențialitate & securitate</li>
            <li>Safari: Preferințe → Confidențialitate</li>
            <li>Edge: Setări → Cookie-uri și permisiuni site</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Contact</h2>
          <p>
            Pentru întrebări legate de utilizarea cookie-urilor, contactați-ne prin pagina de{" "}
            <a href="/contact" className="text-coral hover:text-coral-dark underline">Contact</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
