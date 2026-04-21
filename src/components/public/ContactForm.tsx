"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la trimitere");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Eroare de conexiune");
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center py-8">
        <span className="text-5xl block mb-4">✅</span>
        <h3 className="text-lg font-bold text-darkgray mb-2">Mesaj trimis!</h3>
        <p className="text-darkgray-light text-sm">
          Mulțumim pentru mesaj. Te vom contacta în cel mai scurt timp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">
            Nume *
          </label>
          <input
            type="text"
            name="name"
            required
            minLength={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
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
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">
            Telefon (opțional)
          </label>
          <input
            type="tel"
            name="phone"
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">
            Subiect *
          </label>
          <input
            type="text"
            name="subject"
            required
            minLength={3}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-darkgray mb-1">
          Mesaj *
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none resize-y"
          placeholder="Scrie mesajul tău aici..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
      >
        {loading ? "Se trimite..." : "Trimite mesajul"}
      </button>
    </form>
  );
}
