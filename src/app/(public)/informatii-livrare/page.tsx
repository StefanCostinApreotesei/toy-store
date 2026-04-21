import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informații Livrare",
  description: "Detalii despre livrarea produselor de pe JucăriiShop — costuri, termene și zone de livrare",
};

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Informații Livrare" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Informații Livrare</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-coral/5 rounded-xl p-6 text-center">
          <span className="text-3xl block mb-2">🚚</span>
          <p className="font-bold text-darkgray text-lg">Livrare gratuită</p>
          <p className="text-sm text-darkgray-light">pentru comenzi peste 200 Lei</p>
        </div>
        <div className="bg-coral/5 rounded-xl p-6 text-center">
          <span className="text-3xl block mb-2">📦</span>
          <p className="font-bold text-darkgray text-lg">1-3 zile lucrătoare</p>
          <p className="text-sm text-darkgray-light">termen estimat de livrare</p>
        </div>
        <div className="bg-coral/5 rounded-xl p-6 text-center">
          <span className="text-3xl block mb-2">🇷🇴</span>
          <p className="font-bold text-darkgray text-lg">Toată România</p>
          <p className="text-sm text-darkgray-light">livrare la adresă în toată țara</p>
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-darkgray-light space-y-6">
        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Costuri de livrare</h2>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-lightgray">
                <tr>
                  <th className="text-left px-4 py-3 font-bold text-darkgray">Valoare comandă</th>
                  <th className="text-right px-4 py-3 font-bold text-darkgray">Cost livrare</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100">
                  <td className="px-4 py-3">Sub 200 Lei</td>
                  <td className="px-4 py-3 text-right font-medium">15,00 Lei</td>
                </tr>
                <tr className="border-t border-gray-100 bg-green/5">
                  <td className="px-4 py-3">Peste 200 Lei</td>
                  <td className="px-4 py-3 text-right font-bold text-green">GRATUIT</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Termene de livrare</h2>
          <p>
            Comenzile plasate în zilele lucrătoare (luni-vineri) până la ora 14:00 sunt procesate
            în aceeași zi. Comenzile plasate după ora 14:00, în weekend sau sărbători legale
            sunt procesate în următoarea zi lucrătoare.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>București și Ilfov:</strong> 1 zi lucrătoare</li>
            <li><strong>Orașe reședință de județ:</strong> 1-2 zile lucrătoare</li>
            <li><strong>Alte localități:</strong> 2-3 zile lucrătoare</li>
          </ul>
          <p className="text-xs text-darkgray-light">
            * Termenele sunt estimative și pot varia în funcție de condițiile meteorologice
            sau de volumul de comenzi în perioadele de vârf (sărbători, Black Friday).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Metode de plată</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-darkgray mb-2">Ramburs la livrare</h3>
              <p className="text-sm">
                Plătești în numerar la primirea coletului. Verifici produsele și apoi achizi.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-darkgray mb-2">Card online (Stripe)</h3>
              <p className="text-sm">
                Plată securizată cu Visa, Mastercard sau alte carduri. Tranzacție criptată SSL.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Urmărirea coletului</h2>
          <p>
            După expedierea comenzii, vei primi un email cu detaliile de livrare.
            Poți urmări statusul comenzii oricând din secțiunea{" "}
            <a href="/cont/comenzi" className="text-coral hover:text-coral-dark underline">Comenzile mele</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mt-8 mb-3">Întrebări frecvente</h2>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-darkgray">Pot schimba adresa de livrare?</p>
              <p>Da, dacă comanda nu a fost încă expediată. Contactează-ne cât mai repede.</p>
            </div>
            <div>
              <p className="font-medium text-darkgray">Ce se întâmplă dacă nu sunt acasă?</p>
              <p>Curierul va încerca livrarea de două ori. Poți reprograma livrarea contactându-l direct.</p>
            </div>
            <div>
              <p className="font-medium text-darkgray">Livrați internațional?</p>
              <p>Momentan livrăm doar pe teritoriul României.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
