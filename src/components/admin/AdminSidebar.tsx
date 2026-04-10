"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "📊" },
  { label: "Produse", href: "/admin/produse", icon: "📦" },
  { label: "Categorii", href: "/admin/categorii", icon: "📂" },
  { label: "Comenzi", href: "/admin/comenzi", icon: "🛒" },
  { label: "Setări", href: "/admin/setari", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-darkgray min-h-screen flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin">
          <span className="text-xl font-bold">
            <span className="text-coral">Jucării</span>
            <span className="text-white">Shop</span>
          </span>
          <span className="block text-xs text-white/40 mt-1">Admin Panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-coral text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          ← Vezi magazinul
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 hover:text-coral transition-colors w-full text-left"
        >
          🚪 Deconectare
        </button>
      </div>
    </aside>
  );
}
