"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Te-ai abonat cu succes!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "A apărut o eroare.");
      }
    } catch {
      setStatus("error");
      setMessage("Eroare de conexiune. Încearcă din nou.");
    }
  };

  return (
    <section className="bg-gradient-to-r from-coral to-coral-dark py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
          Abonează-te la newsletter
        </h2>
        <p className="text-white/80 mb-6 max-w-lg mx-auto text-sm sm:text-base">
          Primește primele oferte, reduceri exclusive și noutăți direct în inbox-ul tău.
        </p>

        {status === "success" ? (
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto">
            <p className="text-white font-medium">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Adresa ta de email"
              className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-darkgray text-white font-bold px-6 py-3 rounded-lg hover:bg-darkgray-light transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              {status === "loading" ? "Se trimite..." : "Mă abonez"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-white/90 text-sm mt-2">{message}</p>
        )}

        <p className="text-white/60 text-xs mt-4">
          Poți să te dezabonezi oricând. Citește{" "}
          <a href="/politica-confidentialitate" className="underline hover:text-white">
            politica de confidențialitate
          </a>
          .
        </p>
      </div>
    </section>
  );
}
