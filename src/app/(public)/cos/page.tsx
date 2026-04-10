"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import PriceDisplay from "@/components/public/PriceDisplay";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl mb-4 block">🛒</span>
        <h1 className="text-2xl font-bold text-darkgray mb-2">
          Coșul tău este gol
        </h1>
        <p className="text-darkgray-light mb-6">
          Adaugă produse în coș pentru a continua
        </p>
        <Link
          href="/categorii"
          className="inline-block bg-coral text-white font-bold px-6 py-3 rounded-lg hover:bg-coral-dark transition-colors"
        >
          Explorează produsele
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-12">
      <h1 className="text-2xl font-bold text-darkgray mb-6">
        Coșul de cumpărături ({totalItems} {totalItems === 1 ? "produs" : "produse"})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white rounded-xl border border-gray-100 p-4 flex gap-4"
            >
              {/* Image placeholder */}
              <div className="w-20 h-20 bg-lightgray rounded-lg flex-shrink-0 flex items-center justify-center">
                <span className="text-3xl">🧸</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/produs/${item.slug}`}
                  className="font-medium text-darkgray hover:text-coral transition-colors line-clamp-1"
                >
                  {item.name}
                </Link>

                <div className="mt-2">
                  <PriceDisplay price={item.price} size="sm" />
                </div>

                <div className="flex items-center gap-3 mt-3">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-gray-200 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center text-darkgray hover:bg-lightgray rounded-l-lg transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-medium text-darkgray">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.maxStock}
                      className="w-8 h-8 flex items-center justify-center text-darkgray hover:bg-lightgray rounded-r-lg transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <span className="text-sm font-bold text-darkgray ml-auto">
                    {(item.price * item.quantity).toFixed(2).replace(".", ",")} Lei
                  </span>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-darkgray-light hover:text-coral transition-colors"
                    title="Șterge"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-darkgray mb-4">
              Sumar comandă
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-darkgray-light">Subtotal</span>
                <span className="text-darkgray font-medium">
                  {totalPrice.toFixed(2).replace(".", ",")} Lei
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-darkgray-light">Livrare</span>
                <span className="text-green font-medium">
                  {totalPrice >= 200 ? "Gratuită" : "15,00 Lei"}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-bold text-darkgray">Total</span>
                <span className="font-bold text-darkgray text-xl">
                  {(totalPrice + (totalPrice >= 200 ? 0 : 15))
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  Lei
                </span>
              </div>
              {totalPrice < 200 && (
                <p className="text-xs text-darkgray-light mt-1">
                  Mai adaugă{" "}
                  <span className="text-coral font-medium">
                    {(200 - totalPrice).toFixed(2).replace(".", ",")} Lei
                  </span>{" "}
                  pentru livrare gratuită
                </p>
              )}
            </div>

            <Link
              href="/checkout"
              className="block w-full text-center bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors shadow-lg"
            >
              Finalizează comanda
            </Link>

            <Link
              href="/categorii"
              className="block w-full text-center text-coral font-medium py-2 mt-2 hover:text-coral-dark transition-colors"
            >
              ← Continuă cumpărăturile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
