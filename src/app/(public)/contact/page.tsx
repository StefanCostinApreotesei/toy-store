import Breadcrumbs from "@/components/public/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează-ne pentru orice întrebare legată de produsele noastre",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-darkgray mb-8">Contact</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <span className="text-3xl mb-3 block">📧</span>
            <h3 className="font-bold text-darkgray mb-1">Email</h3>
            <p className="text-darkgray-light text-sm">contact@jucariistore.ro</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <span className="text-3xl mb-3 block">📞</span>
            <h3 className="font-bold text-darkgray mb-1">Telefon</h3>
            <p className="text-darkgray-light text-sm">+40 721 234 567</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <span className="text-3xl mb-3 block">📍</span>
            <h3 className="font-bold text-darkgray mb-1">Adresă</h3>
            <p className="text-darkgray-light text-sm">Str. Jucăriilor nr. 1, București</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <span className="text-3xl mb-3 block">🕐</span>
            <h3 className="font-bold text-darkgray mb-1">Program</h3>
            <p className="text-darkgray-light text-sm">Luni - Vineri: 9:00 - 18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
}
