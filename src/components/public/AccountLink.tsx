"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AccountLink() {
  const { data: session } = useSession();

  const firstName = session?.user?.name?.split(" ")[0];

  return (
    <Link
      href="/cont"
      className="flex items-center gap-1.5 text-darkgray hover:text-coral transition-colors"
    >
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span className="text-sm font-medium hidden lg:block">
        {firstName || "Cont"}
      </span>
    </Link>
  );
}
