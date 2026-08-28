import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import { Footer, Header, WhatsAppButton } from "@/components/Layout";
import PartnerTicker from "@/components/public/PartnerTicker";
import PageNotFound from "@/lib/PageNotFound";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Management from "@/pages/Management";
import Family from "@/pages/Family";
import SisterConcern from "@/pages/SisterConcern";
import CompanyOverview from "@/pages/CompanyOverview";
import CPV from "@/pages/CPV";
import DebtCollection from "@/pages/DebtCollection";
import Careers from "@/pages/Careers";
import Contact from "@/pages/Contact";
import AdminLogin from "@/components/admin/AdminLogin";
import Dashboard from "@/components/admin/Dashboard";
import ContentManager from "@/components/admin/ContentManager";
import ServiceManager from "@/components/admin/ServiceManager";
import ImageManager from "@/components/admin/ImageManager";
import SisterConcernManager from "@/components/admin/SisterConcernManager";
import PartnerCompanyManager from "@/components/admin/PartnerCompanyManager";
import ApplicationManager from "@/components/admin/ApplicationManager";
import HomeManager from "@/components/admin/HomeManager";
import HeroSlideManager from "@/components/admin/HeroSlideManager";
import ContactSettingsManager from "@/components/admin/ContactSettingsManager";
import CareerManager from "@/components/admin/CareerManager";
import MessageManager from "@/components/admin/MessageManager";

function PublicLayout() {
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

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#EFF6FF]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#123B63]/15 border-t-[#0066D6]" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin"
            element={<Navigate to="/admin/login" replace />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="home" element={<HomeManager />} />
            <Route path="hero-slides" element={<HeroSlideManager />} />
            <Route path="contact" element={<ContactSettingsManager />} />
            <Route path="content" element={<ContentManager />} />
            <Route path="services" element={<ServiceManager />} />
            <Route path="images" element={<ImageManager />} />
            <Route path="sister-concerns" element={<SisterConcernManager />} />
            <Route
              path="partner-companies"
              element={<PartnerCompanyManager />}
            />
            <Route path="applications" element={<ApplicationManager />} />
            <Route path="careers" element={<CareerManager />} />
            <Route path="messages" element={<MessageManager />} />
          </Route>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/management" element={<Management />} />
            <Route path="/family" element={<Family />} />
            <Route path="/sister-concern" element={<SisterConcern />} />
            <Route path="/company-overview" element={<CompanyOverview />} />
            <Route path="/cpv" element={<CPV />} />
            <Route path="/debt-collection" element={<DebtCollection />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/company-overview/about" element={<About />} />
            <Route
              path="/company-overview/management"
              element={<Management />}
            />
            <Route path="/company-overview/family" element={<Family />} />
            <Route
              path="/company-overview/services"
              element={<SisterConcern />}
            />
            <Route
              path="/company-overview/sister-concern"
              element={<SisterConcern />}
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
