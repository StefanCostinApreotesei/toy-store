import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "JucăriiShop - Magazin Online Jucării",
    template: "%s | JucăriiShop",
  },
  description:
    "Magazin online cu jucării pentru copii și animale de companie. Jucării educaționale, LEGO, jucării pentru câini, pisici și hamsteri.",
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "JucăriiShop",
    title: "JucăriiShop - Magazin Online Jucării",
    description:
      "Magazin online cu jucării pentru copii și animale de companie. Jucării educaționale, LEGO, jucării pentru câini, pisici și hamsteri.",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
