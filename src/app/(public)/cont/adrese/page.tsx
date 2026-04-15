"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  county: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  county: "",
  postalCode: "",
  isDefault: false,
};

export default function AddressesPage() {
  const { status } = useSession();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/cont");
      return;
    }
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      email: addr.email,
      street: addr.street,
      city: addr.city,
      county: addr.county,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setShowForm(true);
    setError("");
  };

  const handleNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const url = editingId ? `/api/addresses/${editingId}` : "/api/addresses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        await fetchAddresses();
        handleCancel();
      } else {
        setError(data.error || "Eroare la salvare");
      }
    } catch {
      setError("Eroare de conexiune");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sigur vrei să ștergi această adresă?")) return;

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchAddresses();
      }
    } catch {
      // ignore
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-darkgray-light">Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/cont" className="text-coral hover:text-coral-dark text-sm">
          ← Contul meu
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">Adresele mele</h1>
        {!showForm && (
          <button
            onClick={handleNew}
            className="bg-coral text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-coral-dark transition-colors"
          >
            + Adresă nouă
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="font-bold text-darkgray mb-4">
            {editingId ? "Editează adresa" : "Adresă nouă"}
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Prenume *
                </label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Nume *
                </label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Telefon *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-darkgray mb-1">
                Adresă (stradă, număr, bloc, scara, ap.) *
              </label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Oraș *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
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
                  value={form.county}
                  onChange={(e) => setForm({ ...form, county: e.target.value })}
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
                  value={form.postalCode}
                  onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                className="w-4 h-4 text-coral border-gray-300 rounded focus:ring-coral"
              />
              <span className="text-sm text-darkgray">Setează ca adresă implicită</span>
            </label>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-coral text-white font-bold px-6 py-2.5 rounded-lg hover:bg-coral-dark transition-colors disabled:opacity-50"
              >
                {saving ? "Se salvează..." : editingId ? "Actualizează" : "Salvează"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-darkgray font-bold px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Anulează
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address list */}
      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <span className="text-5xl mb-4 block">📍</span>
          <p className="text-darkgray-light mb-4">
            Nu ai nicio adresă salvată.
          </p>
          <button
            onClick={handleNew}
            className="bg-coral text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-coral-dark transition-colors"
          >
            Adaugă prima adresă
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`bg-white rounded-xl border p-5 ${
                addr.isDefault ? "border-coral" : "border-gray-100"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-darkgray">
                    {addr.firstName} {addr.lastName}
                  </p>
                  {addr.isDefault && (
                    <span className="bg-coral/10 text-coral text-xs font-medium px-2 py-0.5 rounded">
                      Implicită
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-sm text-coral hover:text-coral-dark transition-colors"
                  >
                    Editează
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-sm text-red-500 hover:text-red-700 transition-colors"
                  >
                    Șterge
                  </button>
                </div>
              </div>
              <p className="text-sm text-darkgray-light">{addr.street}</p>
              <p className="text-sm text-darkgray-light">
                {addr.city}, {addr.county} {addr.postalCode}
              </p>
              <p className="text-sm text-darkgray-light mt-1">
                {addr.phone} · {addr.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
