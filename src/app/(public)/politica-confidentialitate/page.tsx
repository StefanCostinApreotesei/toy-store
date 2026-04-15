import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate",
  description: "Politica de confidențialitate și protecția datelor personale — JucăriiShop",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Politica de Confidențialitate" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Politica de Confidențialitate</h1>

      <div className="prose prose-sm max-w-none text-darkgray-light space-y-6">
        <p className="text-sm text-darkgray-light">
          Ultima actualizare: 12 aprilie 2026
        </p>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">1. Introducere</h2>
          <p>
            JucăriiShop SRL (denumit în continuare &quot;Operatorul&quot;) se angajează să
            protejeze confidențialitatea datelor dumneavoastră personale în conformitate cu
            Regulamentul General privind Protecția Datelor (GDPR — Regulamentul UE 2016/679).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">2. Date personale colectate</h2>
          <p>Colectăm următoarele categorii de date personale:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Date de identificare:</strong> nume, prenume, adresă de email, număr de telefon</li>
            <li><strong>Date de livrare:</strong> adresă completă (stradă, oraș, județ, cod poștal)</li>
            <li><strong>Date de cont:</strong> adresă de email, parolă (stocată criptat)</li>
            <li><strong>Date tranzacționale:</strong> istoricul comenzilor, metode de plată utilizate</li>
            <li><strong>Date tehnice:</strong> adresă IP, tip browser, cookie-uri</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">3. Scopul prelucrării</h2>
          <p>Datele dumneavoastră sunt prelucrate pentru:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Procesarea și livrarea comenzilor</li>
            <li>Comunicarea privind statusul comenzilor</li>
            <li>Gestionarea contului de utilizator</li>
            <li>Răspunsuri la solicitări prin formularul de contact</li>
            <li>Îmbunătățirea serviciilor și a experienței de utilizare</li>
            <li>Conformarea cu obligațiile legale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">4. Temeiul legal</h2>
          <p>Prelucrarea datelor se bazează pe:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Executarea contractului</strong> — pentru procesarea comenzilor și gestionarea contului</li>
            <li><strong>Consimțământul</strong> — pentru trimiterea de comunicări comerciale și utilizarea cookie-urilor opționale</li>
            <li><strong>Interesul legitim</strong> — pentru prevenirea fraudelor și îmbunătățirea serviciilor</li>
            <li><strong>Obligația legală</strong> — pentru păstrarea documentelor fiscale</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">5. Destinatarii datelor</h2>
          <p>Datele pot fi transmise către:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Servicii de curierat — pentru livrarea comenzilor</li>
            <li>Procesatori de plăți (Stripe) — pentru tranzacții cu cardul</li>
            <li>Furnizori de servicii de email (Resend) — pentru comunicări tranzacționale</li>
            <li>Autorități publice — când legea impune acest lucru</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">6. Durata stocării</h2>
          <p>
            Datele personale sunt stocate pe perioada necesară îndeplinirii scopurilor pentru care
            au fost colectate. Datele tranzacționale sunt păstrate minimum 5 ani conform legislației
            fiscale. Datele contului de utilizator sunt păstrate până la ștergerea contului.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">7. Drepturile dumneavoastră</h2>
          <p>Conform GDPR, aveți dreptul la:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Acces</strong> — să solicitați informații despre datele prelucrate</li>
            <li><strong>Rectificare</strong> — să corectați datele inexacte</li>
            <li><strong>Ștergere</strong> — să solicitați ștergerea datelor (&quot;dreptul de a fi uitat&quot;)</li>
            <li><strong>Restricționare</strong> — să limitați prelucrarea datelor</li>
            <li><strong>Portabilitate</strong> — să primiți datele într-un format structurat</li>
            <li><strong>Opoziție</strong> — să vă opuneți prelucrării datelor</li>
          </ul>
          <p>
            Pentru exercitarea acestor drepturi, contactați-ne prin pagina de{" "}
            <a href="/contact" className="text-coral hover:text-coral-dark underline">Contact</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">8. Securitatea datelor</h2>
          <p>
            Implementăm măsuri tehnice și organizatorice adecvate pentru protejarea datelor
            personale: criptare SSL/TLS, stocarea criptată a parolelor, acces restricționat
            la bazele de date și monitorizare continuă.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">9. Autoritatea de supraveghere</h2>
          <p>
            Dacă considerați că prelucrarea datelor dumneavoastră încalcă legislația, aveți
            dreptul de a depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării
            Datelor cu Caracter Personal (ANSPDCP):
          </p>
          <p>
            <strong>ANSPDCP</strong><br />
            B-dul G-ral. Gheorghe Magheru 28-30, Sector 1, București<br />
            Email: anspdcp@dataprotection.ro<br />
            Website: <a href="https://www.dataprotection.ro" target="_blank" rel="noopener noreferrer" className="text-coral hover:text-coral-dark underline">www.dataprotection.ro</a>
          </p>
        </section>
      </div>
    </div>
  );
}
