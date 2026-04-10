"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ORDER_STATUSES } from "@/lib/constants";

interface OrderStatusChangerProps {
  orderId: string;
  currentStatus: string;
}

export default function OrderStatusChanger({
  orderId,
  currentStatus,
}: OrderStatusChangerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch {
      // Ignore
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-darkgray">Status:</label>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg border border-gray-300 focus:border-coral focus:ring-2 focus:ring-coral/20 focus:outline-none text-sm disabled:opacity-50"
      >
        {Object.entries(ORDER_STATUSES).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      {loading && <span className="text-xs text-darkgray-light">Se salvează...</span>}
    </div>
  );
}
