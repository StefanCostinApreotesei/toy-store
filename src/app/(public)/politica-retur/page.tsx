import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Retur",
  description: "Informații despre returnarea produselor achiziționate de pe JucăriiShop",
};

export default function ReturnPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Politica de Retur" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Politica de Retur</h1>

      <div className="prose prose-sm max-w-none text-darkgray-light space-y-6">
        <div className="bg-green/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-green mb-2">30 de zile pentru retur gratuit</h2>
          <p className="text-sm text-darkgray mb-0">
            La JucăriiShop, ai 30 de zile calendaristice de la primirea coletului pentru a
            returna produsele, fără costuri suplimentare și fără a fi nevoie să oferi un motiv.
          </p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">1. Condiții de retur</h2>
          <p>Pentru a fi eligibil pentru retur, produsul trebuie:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Să fie returnat în termen de 30 de zile de la primire</li>
            <li>Să fie în starea originală, nefolosit și nedeterirat</li>
            <li>Să fie în ambalajul original, cu toate accesoriile și etichetele intacte</li>
            <li>Să fie însoțit de factura sau dovada achiziției</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">2. Produse nereturnabile</h2>
          <p>Nu pot fi returnate:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Produse personalizate sau confecționate la comandă</li>
            <li>Produse sigilate din motive de igienă care au fost desigilate după livrare</li>
            <li>Produse care au fost deteriorate din vina clientului</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">3. Cum returnezi un produs</h2>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
              <div>
                <p className="font-medium text-darkgray">Contactează-ne</p>
                <p>Trimite o cerere de retur prin pagina de <a href="/contact" className="text-coral hover:text-coral-dark underline">Contact</a> sau la adresa de email din contul tău, menționând numărul comenzii și motivul returului.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
              <div>
                <p className="font-medium text-darkgray">Primești confirmarea</p>
                <p>Vei primi un email cu instrucțiunile de returnare și eticheta de curierat.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
              <div>
                <p className="font-medium text-darkgray">Expediezi produsul</p>
                <p>Ambalează produsul sigur și predă coletul curierului. Costul transportului de retur este gratuit.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <span className="w-8 h-8 bg-coral text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
              <div>
                <p className="font-medium text-darkgray">Primești banii înapoi</p>
                <p>După verificarea produsului, rambursarea se face în maximum 14 zile prin aceeași metodă de plată utilizată la achiziție.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">4. Rambursarea</h2>
          <p>
            Rambursarea se efectuează în termen de maximum 14 zile lucrătoare de la primirea
            produsului returnat. Suma rambursată include prețul produsului și costul de livrare
            inițial (dacă a fost cazul). Costul de retur este suportat de JucăriiShop.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">5. Produse defecte sau greșite</h2>
          <p>
            Dacă ai primit un produs defect sau diferit de cel comandat, contactează-ne imediat.
            Vom prelua produsul pe cheltuiala noastră și îl vom înlocui sau vom emite o rambursare
            completă, la alegerea ta.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">6. Garanție</h2>
          <p>
            Toate produsele beneficiază de garanție legală de conformitate de 2 ani.
            În cazul în care un produs prezintă defecte de fabricație, ai dreptul la reparare,
            înlocuire sau rambursare conform legislației în vigoare.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">7. Contact</h2>
          <p>
            Pentru orice întrebare legată de retururi sau garanții, accesează pagina de{" "}
            <a href="/contact" className="text-coral hover:text-coral-dark underline">Contact</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
