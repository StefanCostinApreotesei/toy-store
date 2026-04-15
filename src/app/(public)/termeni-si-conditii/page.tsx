import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții",
  description: "Termenii și condițiile de utilizare ale magazinului JucăriiShop",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Termeni și Condiții" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Termeni și Condiții</h1>

      <div className="prose prose-sm max-w-none text-darkgray-light space-y-6">
        <p className="text-sm text-darkgray-light">
          Ultima actualizare: 12 aprilie 2026
        </p>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">1. Informații generale</h2>
          <p>
            Prezentele Termeni și Condiții reglementează accesul și utilizarea site-ului
            www.jucariishop.ro (denumit în continuare &quot;Site-ul&quot;), operat de JucăriiShop SRL,
            cu sediul în România.
          </p>
          <p>
            Prin accesarea și utilizarea Site-ului, confirmați că ați citit, înțeles și acceptat
            acești Termeni și Condiții în integralitate.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">2. Definiții</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Client</strong> — orice persoană fizică sau juridică care accesează Site-ul și/sau plasează o comandă.</li>
            <li><strong>Comandă</strong> — o solicitare de achiziție a unuia sau mai multor produse de pe Site.</li>
            <li><strong>Produs</strong> — orice articol disponibil pentru vânzare pe Site.</li>
            <li><strong>Contract</strong> — acordul dintre JucăriiShop și Client, finalizat prin confirmarea comenzii.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">3. Înregistrarea contului</h2>
          <p>
            Plasarea unei comenzi se poate face cu sau fără cont de utilizator. Crearea unui cont
            oferă acces la istoricul comenzilor, lista de favorite și opțiunea de completare
            automată a datelor de livrare.
          </p>
          <p>
            Sunteți responsabil de confidențialitatea datelor de autentificare. Orice activitate
            derulată în contul dumneavoastră este responsabilitatea dumneavoastră.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">4. Plasarea comenzilor</h2>
          <p>
            Prin plasarea unei comenzi, confirmați că informațiile furnizate sunt corecte și
            complete. JucăriiShop își rezervă dreptul de a refuza sau anula comenzi în cazul
            în care produsele nu sunt disponibile sau informațiile furnizate sunt incorecte.
          </p>
          <p>
            După plasarea comenzii, veți primi un email de confirmare cu detaliile acesteia.
            Contractul de vânzare se consideră încheiat la momentul confirmării comenzii.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">5. Prețuri și plată</h2>
          <p>
            Toate prețurile afișate pe Site includ TVA și sunt exprimate în Lei (RON).
            Metodele de plată acceptate sunt: ramburs la livrare (numerar) și plata online
            cu cardul (prin procesatorul securizat Stripe).
          </p>
          <p>
            JucăriiShop își rezervă dreptul de a modifica prețurile în orice moment, fără
            notificare prealabilă. Prețul valabil este cel afișat la momentul plasării comenzii.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">6. Livrare</h2>
          <p>
            Livrarea se efectuează pe teritoriul României prin servicii de curierat.
            Costul de livrare este de 15 Lei, cu livrare gratuită pentru comenzi de peste 200 Lei.
            Termenul estimat de livrare este de 1-3 zile lucrătoare.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">7. Dreptul de retragere</h2>
          <p>
            Conform legislației în vigoare (OUG 34/2014), aveți dreptul de a returna produsele
            în termen de 14 zile calendaristice de la data primirii coletului, fără a fi necesar
            să oferiți un motiv. Termenul poate fi extins la 30 de zile conform politicii
            noastre de retur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">8. Proprietate intelectuală</h2>
          <p>
            Tot conținutul Site-ului (texte, imagini, grafică, logo-uri, software) este proprietatea
            JucăriiShop și este protejat de legislația privind drepturile de autor. Reproducerea,
            distribuirea sau utilizarea conținutului fără acordul prealabil scris este interzisă.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">9. Limitarea răspunderii</h2>
          <p>
            JucăriiShop depune toate eforturile pentru a furniza informații corecte pe Site.
            Cu toate acestea, nu garantăm că site-ul va funcționa neîntrerupt sau fără erori.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">10. Soluționarea litigiilor</h2>
          <p>
            Eventualele litigii se vor soluționa pe cale amiabilă. În cazul în care acest lucru
            nu este posibil, puteți apela la Autoritatea Națională pentru Protecția Consumatorilor (ANPC)
            sau la platforma europeană de soluționare online a litigiilor (SOL/ODR):
            {" "}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-coral-dark underline">
              https://ec.europa.eu/consumers/odr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">11. Contact</h2>
          <p>
            Pentru orice întrebări legate de acești Termeni și Condiții, ne puteți contacta la
            pagina de <a href="/contact" className="text-coral hover:text-coral-dark underline">Contact</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
