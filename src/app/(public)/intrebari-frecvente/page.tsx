import Breadcrumbs from "@/components/public/Breadcrumbs";
import FAQAccordion from "@/components/public/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Întrebări Frecvente",
  description: "Răspunsuri la cele mai frecvente întrebări despre comenzi, livrare, plăți și retururi pe JucăriiShop",
};

const faqs = [
  {
    category: "Comenzi",
    items: [
      {
        question: "Cum plasez o comandă?",
        answer: "Adaugă produsele dorite în coș, apoi accesează pagina de checkout. Completează datele de livrare, alege metoda de plată și confirmă comanda. Vei primi un email de confirmare.",
      },
      {
        question: "Pot modifica sau anula o comandă?",
        answer: "Dacă comanda nu a fost încă expediată, ne poți contacta prin formularul de contact sau email pentru a solicita modificarea sau anularea acesteia.",
      },
      {
        question: "Am nevoie de cont pentru a comanda?",
        answer: "Nu, poți comanda și ca vizitator. Cu toate acestea, un cont îți oferă acces la istoricul comenzilor, lista de favorite și completarea automată a datelor.",
      },
      {
        question: "Pot aplica un cupon de reducere?",
        answer: "Da! În pagina de checkout ai un câmp dedicat pentru codul cuponului. Introdu codul și apasă butonul Aplică pentru a beneficia de reducere.",
      },
    ],
  },
  {
    category: "Livrare",
    items: [
      {
        question: "Cât costă livrarea?",
        answer: "Livrarea costă 15 Lei pentru comenzi sub 200 Lei. Pentru comenzi de peste 200 Lei, livrarea este gratuită.",
      },
      {
        question: "În cât timp primesc comanda?",
        answer: "Termenul estimat este de 1-3 zile lucrătoare. Comenzile plasate până la ora 14:00 în zilele lucrătoare sunt procesate în aceeași zi.",
      },
      {
        question: "Livrați în toată România?",
        answer: "Da, livrăm prin curierat rapid pe întreg teritoriul României. Momentan nu oferim livrare internațională.",
      },
      {
        question: "Cum urmăresc coletul?",
        answer: "După expedierea comenzii, vei primi un email cu detalii. Poți verifica statusul oricând în secțiunea Comenzile mele din contul tău.",
      },
    ],
  },
  {
    category: "Plăți",
    items: [
      {
        question: "Ce metode de plată acceptați?",
        answer: "Acceptăm plata cu cardul online (Visa, Mastercard — procesare securizată prin Stripe) și ramburs la livrare (numerar la primirea coletului).",
      },
      {
        question: "Este sigură plata online?",
        answer: "Absolut. Plățile sunt procesate prin Stripe, unul dintre cei mai siguri procesatori de plăți din lume, cu criptare SSL și verificare 3D Secure.",
      },
      {
        question: "Când se debitează cardul?",
        answer: "Cardul este debitat imediat la plasarea comenzii. În cazul anulării, suma este returnată în 5-14 zile lucrătoare.",
      },
    ],
  },
  {
    category: "Retururi și Garanție",
    items: [
      {
        question: "Pot returna un produs?",
        answer: "Da, ai 30 de zile calendaristice de la primirea coletului pentru a returna produsele, fără costuri suplimentare. Produsul trebuie să fie în starea originală, cu ambalajul intact.",
      },
      {
        question: "Cine suportă costul returului?",
        answer: "Costul transportului de retur este suportat de JucăriiShop. Nu ai niciun cost suplimentar.",
      },
      {
        question: "În cât timp primesc banii înapoi?",
        answer: "Rambursarea se efectuează în maximum 14 zile lucrătoare de la primirea produsului returnat, prin aceeași metodă de plată.",
      },
      {
        question: "Ce garanție au produsele?",
        answer: "Toate produsele beneficiază de garanție legală de conformitate de 2 ani. Pentru produse defecte, contactează-ne pentru înlocuire sau rambursare.",
      },
    ],
  },
  {
    category: "Cont și date personale",
    items: [
      {
        question: "Cum îmi creez un cont?",
        answer: "Accesează pagina Contul meu, selectează Cont nou și completează formularul cu numele, email-ul și parola dorită.",
      },
      {
        question: "Am uitat parola. Ce fac?",
        answer: "Pe pagina de autentificare, apasă Am uitat parola. Vei primi un email cu un link de resetare a parolei.",
      },
      {
        question: "Cum sunt protejate datele mele?",
        answer: "Datele tale sunt protejate conform GDPR. Folosim criptare SSL, stocăm parolele criptat și nu partajăm datele cu terți neautorizați. Citește Politica de Confidențialitate pentru detalii.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Întrebări Frecvente" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-2">Întrebări Frecvente</h1>
      <p className="text-darkgray-light mb-8">
        Găsește răspunsuri rapide la cele mai frecvente întrebări.
      </p>

      <div className="space-y-8">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-darkgray mb-4 pb-2 border-b-2 border-coral">
              {section.category}
            </h2>
            <FAQAccordion items={section.items} />
          </div>
        ))}
      </div>

      <div className="mt-10 bg-lightgray rounded-xl p-6 text-center">
        <p className="text-darkgray mb-3">Nu ai găsit răspunsul pe care îl cauți?</p>
        <a
          href="/contact"
          className="inline-block bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Contactează-ne
        </a>
      </div>
    </div>
  );
}
