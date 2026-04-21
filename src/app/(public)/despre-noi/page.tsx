import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Despre Noi",
  description: "Află mai multe despre JucăriiShop — magazinul online cu jucării pentru copii și animale de companie",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Despre Noi" }]} />

      <h1 className="text-3xl font-bold text-darkgray mb-8">Despre JucăriiShop</h1>

      <div className="bg-gradient-to-r from-coral/10 to-yellow/10 rounded-2xl p-8 mb-10">
        <p className="text-lg text-darkgray leading-relaxed">
          JucăriiShop este un magazin online dedicat bucuriei — aducem jucării de calitate
          pentru copii și animale de companie, direct la ușa ta. Credem că joaca este esențială
          pentru dezvoltarea celor mici și fericirea companionilor noștri blănoși.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="text-center p-6">
          <span className="text-4xl block mb-3">🎯</span>
          <h3 className="font-bold text-darkgray text-lg mb-2">Misiunea noastră</h3>
          <p className="text-sm text-darkgray-light">
            Oferim jucării sigure, educative și distractive la prețuri accesibile,
            cu o experiență de cumpărare simplă și plăcută.
          </p>
        </div>
        <div className="text-center p-6">
          <span className="text-4xl block mb-3">🛡️</span>
          <h3 className="font-bold text-darkgray text-lg mb-2">Calitate garantată</h3>
          <p className="text-sm text-darkgray-light">
            Toate produsele noastre respectă standardele europene de siguranță
            și sunt selectate cu atenție pentru calitatea materialelor.
          </p>
        </div>
        <div className="text-center p-6">
          <span className="text-4xl block mb-3">💝</span>
          <h3 className="font-bold text-darkgray text-lg mb-2">Pasiune reală</h3>
          <p className="text-sm text-darkgray-light">
            Suntem o echipă de părinți și iubitori de animale care înțeleg
            importanța alegerii jucăriei potrivite.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-bold text-darkgray mb-4">De ce JucăriiShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">🚚</span>
              <div>
                <p className="font-medium text-darkgray mb-1">Livrare rapidă</p>
                <p className="text-sm text-darkgray-light">1-3 zile lucrătoare, cu livrare gratuită pentru comenzi peste 200 Lei</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">↩️</span>
              <div>
                <p className="font-medium text-darkgray mb-1">Retur gratuit 30 zile</p>
                <p className="text-sm text-darkgray-light">Nu ești mulțumit? Returnezi fără costuri în 30 de zile</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">🔒</span>
              <div>
                <p className="font-medium text-darkgray mb-1">Plăți securizate</p>
                <p className="text-sm text-darkgray-light">Plată cu cardul prin Stripe sau ramburs la livrare</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 flex items-start gap-4">
              <span className="text-2xl flex-shrink-0">📞</span>
              <div>
                <p className="font-medium text-darkgray mb-1">Suport dedicat</p>
                <p className="text-sm text-darkgray-light">Echipa noastră te ajută prin email sau telefon, luni-vineri</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-darkgray mb-4">Ce oferim</h2>
          <div className="prose prose-sm max-w-none text-darkgray-light">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Jucării educative pentru copii</strong> — puzzle-uri, jocuri de construcție, seturi de știință și creativitate</li>
              <li><strong>Seturi LEGO</strong> — colecții pentru toate vârstele, de la Duplo la Technic</li>
              <li><strong>Jucării pentru câini</strong> — mingi, frânghii, jucării interactive și de mestecat</li>
              <li><strong>Jucării pentru pisici</strong> — undițe, bile, tuneluri și jucării cu catnip</li>
              <li><strong>Jucării pentru hamsteri</strong> — roți, tuneluri, hamace și accesorii pentru cușcă</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
