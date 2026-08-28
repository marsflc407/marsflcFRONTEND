import { Outlet } from "react-router-dom";
import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import PartnerTicker from "@/components/public/PartnerTicker";

export { Header, Footer, WhatsAppButton };

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <PartnerTicker />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
