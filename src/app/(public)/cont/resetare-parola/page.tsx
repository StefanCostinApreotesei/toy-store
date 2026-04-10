"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    return <ResetForm token={token} />;
  }

  return <ForgotForm />;
}

function ForgotForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <span className="text-5xl block mb-4">📧</span>
        <h1 className="text-2xl font-bold text-darkgray mb-2">Verifică email-ul</h1>
        <p className="text-darkgray-light mb-6">
          Dacă adresa <strong>{email}</strong> este asociată unui cont, vei primi un email cu instrucțiuni de resetare.
        </p>
        <Link
          href="/cont"
          className="text-coral font-medium hover:text-coral-dark transition-colors"
        >
          Înapoi la autentificare
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-darkgray mb-2 text-center">Ai uitat parola?</h1>
      <p className="text-darkgray-light text-center mb-6">
        Introdu adresa de email și îți vom trimite un link de resetare.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            placeholder="email@exemplu.ro"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Se trimite..." : "Trimite link de resetare"}
        </button>
      </form>

      <p className="text-center mt-4">
        <Link href="/cont" className="text-sm text-coral font-medium hover:text-coral-dark transition-colors">
          Înapoi la autentificare
        </Link>
      </p>
    </div>
  );
}

function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la resetare");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/cont"), 3000);
    } catch {
      setError("Eroare de conexiune");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <span className="text-5xl block mb-4">✅</span>
        <h1 className="text-2xl font-bold text-darkgray mb-2">Parolă schimbată!</h1>
        <p className="text-darkgray-light">
          Vei fi redirecționat către pagina de autentificare...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-darkgray mb-2 text-center">Parolă nouă</h1>
      <p className="text-darkgray-light text-center mb-6">
        Alege o parolă nouă pentru contul tău.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">Parolă nouă</label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
          />
          <p className="text-xs text-darkgray-light mt-1">
            Minim 8 caractere, o literă mare, o literă mică, o cifră
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-darkgray mb-1">Confirmă parola</label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Se schimbă parola..." : "Schimbă parola"}
        </button>
      </form>
    </div>
  );
}
