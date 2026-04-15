import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import CookieConsent from "@/components/public/CookieConsent";
import BackToTop from "@/components/public/BackToTop";
import { ToastProvider } from "@/context/ToastContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <ToastProvider>
        <main className="flex-1">{children}</main>
      </ToastProvider>
      <Footer />
      <BackToTop />
      <CookieConsent />
    </>
  );
}
