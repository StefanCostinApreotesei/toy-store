"use client";

import { useEffect, useState } from "react";

interface Coupon {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        setCoupons(await res.json());
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue("");
    setMinOrderAmount("");
    setMaxUses("");
    setExpiresAt("");
    setError("");
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: parseFloat(discountValue),
          minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : undefined,
          maxUses: maxUses ? parseInt(maxUses) : undefined,
          expiresAt: expiresAt || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Eroare la creare");
        setSaving(false);
        return;
      }

      resetForm();
      setShowForm(false);
      await fetchCoupons();
    } catch {
      setError("Eroare de conexiune");
    }
    setSaving(false);
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !coupon.active }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) =>
            c.id === coupon.id ? { ...c, active: !c.active } : c
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi acest cupon?")) return;

    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-coral border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-darkgray">Cupoane</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-coral text-white font-bold px-4 py-2.5 rounded-lg text-sm hover:bg-coral-dark transition-colors"
        >
          {showForm ? "Anulează" : "+ Cupon nou"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-darkgray mb-4">Cupon nou</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Cod cupon *
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  required
                  placeholder="ex: VARA2026"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Tip reducere *
                </label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                >
                  <option value="PERCENTAGE">Procentual (%)</option>
                  <option value="FIXED">Sumă fixă (Lei)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Valoare reducere *
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder={discountType === "PERCENTAGE" ? "ex: 10" : "ex: 25.00"}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Comandă minimă (Lei)
                </label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="Opțional"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Nr. maxim utilizări
                </label>
                <input
                  type="number"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  min="1"
                  placeholder="Nelimitat"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Expiră la
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="bg-coral text-white font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-coral-dark transition-colors disabled:opacity-50"
            >
              {saving ? "Se salvează..." : "Creează cupon"}
            </button>
          </form>
        </div>
      )}

      {/* Coupons list */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <span className="text-4xl block mb-3">🎟️</span>
          <p className="text-darkgray-light">Niciun cupon creat încă.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-lightgray">
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    COD
                  </th>
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    REDUCERE
                  </th>
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    MIN. COMANDĂ
                  </th>
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    UTILIZĂRI
                  </th>
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    EXPIRĂ
                  </th>
                  <th className="text-left text-xs font-bold text-darkgray-light px-4 py-3">
                    STATUS
                  </th>
                  <th className="text-right text-xs font-bold text-darkgray-light px-4 py-3">
                    ACȚIUNI
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-sm text-darkgray">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-darkgray">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue.toFixed(2).replace(".", ",")} Lei`}
                    </td>
                    <td className="px-4 py-3 text-sm text-darkgray-light">
                      {coupon.minOrderAmount
                        ? `${coupon.minOrderAmount.toFixed(2).replace(".", ",")} Lei`
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-darkgray">
                      {coupon.usedCount}
                      {coupon.maxUses ? ` / ${coupon.maxUses}` : " / ∞"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {coupon.expiresAt ? (
                        <span className={isExpired(coupon.expiresAt) ? "text-red-500" : "text-darkgray-light"}>
                          {new Date(coupon.expiresAt).toLocaleDateString("ro-RO")}
                          {isExpired(coupon.expiresAt) && " (expirat)"}
                        </span>
                      ) : (
                        <span className="text-darkgray-light">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          coupon.active
                            ? "bg-green/10 text-green"
                            : "bg-red-50 text-red-500"
                        }`}
                      >
                        {coupon.active ? "Activ" : "Inactiv"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Șterge
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
