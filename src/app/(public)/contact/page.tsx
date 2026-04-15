import Breadcrumbs from "@/components/public/Breadcrumbs";
import ContactForm from "@/components/public/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactează-ne pentru orice întrebare legată de produsele noastre",
};

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-darkgray mb-8">Contact</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <span className="text-2xl mb-2 block">📧</span>
            <h3 className="font-bold text-darkgray text-sm mb-1">Email</h3>
            <p className="text-darkgray-light text-xs">contact@jucariistore.ro</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <span className="text-2xl mb-2 block">📞</span>
            <h3 className="font-bold text-darkgray text-sm mb-1">Telefon</h3>
            <p className="text-darkgray-light text-xs">+40 721 234 567</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <span className="text-2xl mb-2 block">📍</span>
            <h3 className="font-bold text-darkgray text-sm mb-1">Adresă</h3>
            <p className="text-darkgray-light text-xs">Str. Jucăriilor nr. 1, București</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <span className="text-2xl mb-2 block">🕐</span>
            <h3 className="font-bold text-darkgray text-sm mb-1">Program</h3>
            <p className="text-darkgray-light text-xs">L-V: 9:00 - 18:00</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-darkgray mb-4">Trimite-ne un mesaj</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
