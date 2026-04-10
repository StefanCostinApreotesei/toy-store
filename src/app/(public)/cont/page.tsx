"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If logged in, show account overview
  if (status === "authenticated" && session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-darkgray mb-6">Contul meu</h1>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-coral/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="font-bold text-darkgray">{session.user.name || "Client"}</p>
              <p className="text-sm text-darkgray-light">{session.user.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <Link
              href="/cont/comenzi"
              className="flex items-center justify-between p-4 bg-lightgray rounded-lg hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📦</span>
                <span className="font-medium text-darkgray">Comenzile mele</span>
              </div>
              <span className="text-darkgray-light">→</span>
            </Link>
          </div>

          <button
            onClick={() => signIn(undefined, { callbackUrl: "/" })}
            className="mt-6 text-sm text-coral hover:text-coral-dark transition-colors"
          >
            Deconectare
          </button>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError("Email sau parolă incorectă");
    } else {
      router.push("/cont");
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la înregistrare");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      await signIn("credentials", {
        email: formData.get("email") as string,
        password,
        redirect: false,
      });

      router.push("/cont");
      router.refresh();
    } catch {
      setError("Eroare la înregistrare");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-darkgray mb-6 text-center">
        Contul meu
      </h1>

      {/* Tabs */}
      <div className="flex mb-6 bg-lightgray rounded-lg p-1">
        <button
          onClick={() => { setActiveTab("login"); setError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "login"
              ? "bg-white text-darkgray shadow-sm"
              : "text-darkgray-light"
          }`}
        >
          Autentificare
        </button>
        <button
          onClick={() => { setActiveTab("register"); setError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === "register"
              ? "bg-white text-darkgray shadow-sm"
              : "text-darkgray-light"
          }`}
        >
          Cont nou
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {activeTab === "login" ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Parolă
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Se autentifică..." : "Autentificare"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Nume complet
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
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
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
              Parolă
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Confirmă parola
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-coral text-white font-bold py-3 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>
      )}
    </div>
  );
}
