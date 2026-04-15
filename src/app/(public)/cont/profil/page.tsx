"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/cont");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          setName(data.name || "");
          setPhone(data.phone || "");
          setEmail(data.email || "");
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Profilul a fost actualizat cu succes!");
        setName(data.name || "");
        setPhone(data.phone || "");
      } else {
        setError(data.error || "Eroare la actualizare");
      }
    } catch {
      setError("Eroare de conexiune");
    }
    setSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwMessage("");

    if (newPassword !== confirmPassword) {
      setPwError("Parolele nu se potrivesc");
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setPwMessage("Parola a fost schimbată cu succes!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwError(data.error || "Eroare la schimbarea parolei");
      }
    } catch {
      setPwError("Eroare de conexiune");
    }
    setPwSaving(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-darkgray-light">Se încarcă...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cont" className="text-coral hover:text-coral-dark text-sm">
          ← Contul meu
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-darkgray mb-6">Editare profil</h1>

      {/* Profile form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="font-bold text-darkgray mb-4">Informații personale</h2>

        {message && (
          <div className="bg-green/10 text-green text-sm p-3 rounded-lg mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-darkgray-light cursor-not-allowed"
            />
            <p className="text-xs text-darkgray-light mt-1">
              Adresa de email nu poate fi modificată.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Nume complet *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="07xx xxx xxx"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-coral text-white font-bold px-6 py-2.5 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Se salvează..." : "Salvează modificările"}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-darkgray mb-4">Schimbă parola</h2>

        {pwMessage && (
          <div className="bg-green/10 text-green text-sm p-3 rounded-lg mb-4">
            {pwMessage}
          </div>
        )}
        {pwError && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {pwError}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Parola curentă *
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Parola nouă *
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-darkgray mb-1">
              Confirmă parola nouă *
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="bg-darkgray text-white font-bold px-6 py-2.5 rounded-lg hover:bg-darkgray-light transition-colors disabled:opacity-50"
          >
            {pwSaving ? "Se schimbă..." : "Schimbă parola"}
          </button>
        </form>
      </div>
    </div>
  );
}
