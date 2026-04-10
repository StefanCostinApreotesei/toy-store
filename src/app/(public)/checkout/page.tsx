"use client";

import { useCart } from "@/context/CartContext";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("cancelled") === "1"
      ? "Plata a fost anulată. Poți încerca din nou."
      : ""
  );
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");

  const shippingCost = totalPrice >= 200 ? 0 : 15;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-4 block">🛒</span>
        <h1 className="text-2xl font-bold text-darkgray mb-2">
          Coșul tău este gol
        </h1>
        <Link
          href="/categorii"
          className="inline-block mt-4 bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Explorează produsele
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phone: formData.get("phone"),
            email: formData.get("email"),
            street: formData.get("street"),
            city: formData.get("city"),
            county: formData.get("county"),
            postalCode: formData.get("postalCode"),
          },
          notes: formData.get("notes"),
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la plasarea comenzii");
        setLoading(false);
        return;
      }

      clearCart();

      // If Stripe, redirect to payment
      if (paymentMethod === "STRIPE" && data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }

      router.push(`/checkout/confirmare/${data.orderId}`);
    } catch {
      setError("Eroare de conexiune");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
      <h1 className="text-2xl font-bold text-darkgray mb-6">
        Finalizare comandă
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-darkgray mb-4">
                Date de livrare
              </h2>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Prenume *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    defaultValue={session?.user?.name?.split(" ")[0] || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Nume *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    defaultValue={session?.user?.name?.split(" ").slice(1).join(" ") || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                    placeholder="07xx xxx xxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={session?.user?.email || ""}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Adresă (stradă, număr, bloc, scară, apartament) *
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Oraș *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Județ *
                  </label>
                  <input
                    type="text"
                    name="county"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Cod poștal *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                    placeholder="012345"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-darkgray mb-1">
                    Notă comandă (opțional)
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none resize-none"
                    placeholder="Instrucțiuni speciale de livrare..."
                  />
                </div>
              </div>

              {!session && (
                <p className="mt-4 text-sm text-darkgray-light">
                  Ai deja cont?{" "}
                  <Link href="/cont" className="text-coral font-medium hover:text-coral-dark">
                    Autentifică-te
                  </Link>{" "}
                  pentru a completa automat datele.
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-darkgray mb-4">
                Sumar comandă
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-darkgray-light line-clamp-1 flex-1 mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-darkgray font-medium flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2).replace(".", ",")} Lei
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-darkgray-light">Subtotal</span>
                  <span>{totalPrice.toFixed(2).replace(".", ",")} Lei</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-darkgray-light">Livrare</span>
                  <span className={shippingCost === 0 ? "text-green font-medium" : ""}>
                    {shippingCost === 0 ? "Gratuită" : `${shippingCost.toFixed(2).replace(".", ",")} Lei`}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-darkgray">Total</span>
                  <span className="font-bold text-darkgray text-xl">
                    {finalTotal.toFixed(2).replace(".", ",")} Lei
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-sm font-bold text-darkgray mb-3">
                  Metodă de plată
                </h3>
                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === "COD"
                        ? "border-coral bg-coral/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 text-coral focus:ring-coral"
                    />
                    <div>
                      <span className="text-sm font-medium text-darkgray">
                        Ramburs la livrare
                      </span>
                      <p className="text-xs text-darkgray-light">
                        Plătești când primești coletul
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      paymentMethod === "STRIPE"
                        ? "border-coral bg-coral/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="STRIPE"
                      checked={paymentMethod === "STRIPE"}
                      onChange={() => setPaymentMethod("STRIPE")}
                      className="w-4 h-4 text-coral focus:ring-coral"
                    />
                    <div>
                      <span className="text-sm font-medium text-darkgray">
                        Card online
                      </span>
                      <p className="text-xs text-darkgray-light">
                        Plată securizată prin Stripe
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50 shadow-lg"
              >
                {loading
                  ? "Se procesează..."
                  : paymentMethod === "STRIPE"
                  ? "Plătește cu cardul"
                  : "Plasează comanda"}
              </button>

              {paymentMethod === "STRIPE" && (
                <p className="text-xs text-darkgray-light mt-3 text-center">
                  Vei fi redirecționat către Stripe pentru plata securizată
                </p>
              )}
              {paymentMethod === "COD" && (
                <p className="text-xs text-darkgray-light mt-3 text-center">
                  Plata se face ramburs la livrare
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
