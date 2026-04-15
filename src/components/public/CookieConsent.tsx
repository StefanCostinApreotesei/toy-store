"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-darkgray leading-relaxed">
            Folosim cookie-uri pentru a-ți oferi cea mai bună experiență pe site-ul nostru.
            Cookie-urile ne ajută să analizăm traficul și să personalizăm conținutul.
            Citește{" "}
            <Link
              href="/politica-cookies"
              className="text-coral font-medium hover:text-coral-dark underline"
            >
              Politica de cookies
            </Link>{" "}
            pentru mai multe detalii.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-5 py-2.5 text-sm font-medium text-darkgray-light border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refuz
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2.5 text-sm font-bold text-white bg-coral rounded-lg hover:bg-coral-dark transition-colors"
          >
            Accept toate
          </button>
        </div>
      </div>
    </div>
  );
}
