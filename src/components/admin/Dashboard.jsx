import React, { createElement, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  Contact,
  FileText,
  ImagePlus,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings2,
  Shield,
  Users,
  X,
} from "lucide-react";
import {
  contentAPI,
  serviceAPI,
  sisterConcernAPI,
  applicationAPI,
  partnerCompanyAPI,
} from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Home", to: "/admin/home", icon: House },
  { label: "Contact", to: "/admin/contact", icon: Contact },
  { label: "Content", to: "/admin/content", icon: FileText },
  { label: "Services", to: "/admin/services", icon: BriefcaseBusiness },
  { label: "Images", to: "/admin/images", icon: ImagePlus },
  {
    label: "Partner Companies",
    to: "/admin/partner-companies",
    icon: Building2,
  },
  { label: "Applications", to: "/admin/applications", icon: Users },
  { label: "We Are Hiring", to: "/admin/careers", icon: CalendarDays },
];

const STAT_CONFIG = [
  { key: "content", label: "Total Content", icon: FileText },
  { key: "services", label: "Services", icon: BriefcaseBusiness },
  { key: "sisterConcerns", label: "Sister Concerns", icon: Shield },
  { key: "partnerCompanies", label: "Partner Companies", icon: Building2 },
  { key: "applications", label: "Applications", icon: Users },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stats, setStats] = useState({
    content: 0,
    services: 0,
    sisterConcerns: 0,
    partnerCompanies: 0,
    applications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const responses = await Promise.all([
          contentAPI.getByPage("home"),
          serviceAPI.getAll(),
          sisterConcernAPI.getAll(),
          partnerCompanyAPI.getAll(),
          applicationAPI.getAll(),
        ]);
        setStats({
          content: responses[0]?.data?.length || 0,
          services: responses[1]?.data?.length || 0,
          sisterConcerns: responses[2]?.data?.length || 0,
          partnerCompanies: responses[3]?.data?.length || 0,
          applications: responses[4]?.data?.length || 0,
        });
      } catch (loadError) {
        setError(
          loadError?.response?.data?.message ||
            "Unable to load dashboard statistics.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-600 transition-colors ${isActive ? "bg-[#0066D6] text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-[#EFF6FF] text-[#123B63]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 bg-[#123B63] px-5 py-6 transition-transform lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            to="/admin/dashboard"
            className="font-heading text-xl font-700 tracking-[0.04em] text-white"
          >
            MARS <span className="text-[#0066D6]">FLC ADMIN</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="text-white/60 lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8 space-y-2" aria-label="Admin navigation">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={navLinkClass}
              onClick={() => setMobileNavOpen(false)}
            >
              {createElement(Icon, {
                className: "h-4 w-4",
                "aria-hidden": true,
              })}{" "}
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-auto flex w-full items-center gap-3 px-4 py-3 text-sm font-600 text-white/65 transition-colors hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
        </button>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-[#123B63]/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <div className="lg:pl-72">
        <header className="flex items-center justify-between border-b border-[#123B63]/10 bg-white px-5 py-4 md:px-8">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="text-[#123B63] lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-[#123B63]/60 sm:block">
              {user?.name || user?.email || "Administrator"}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-600 text-[#0066D6] hover:text-[#123B63]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
              Control Center
            </p>
            <h1 className="mt-3 font-heading text-3xl font-700 md:text-4xl">
              Welcome back, {user?.name || "Administrator"}
            </h1>
            <p className="mt-2 text-[#123B63]/65">
              Here is the current shape of your MARS FLC workspace.
            </p>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-8 border-l-2 border-[#0066D6] bg-white px-4 py-3 text-sm text-[#0066D6]"
            >
              {error}
            </p>
          )}
          <div className="mt-10 grid gap-px bg-[#123B63]/10 sm:grid-cols-2 xl:grid-cols-4">
            {STAT_CONFIG.map(({ key, label, icon: Icon }) => (
              <div key={key} className="bg-white p-6">
                <div className="flex items-center justify-between">
                  {createElement(Icon, {
                    className: "h-5 w-5 text-[#0066D6]",
                    "aria-hidden": true,
                  })}
                  <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#123B63]/40">
                    Live
                  </span>
                </div>
                <div className="mt-8 font-mono text-4xl font-700 text-[#123B63]">
                  {loading ? "--" : stats[key]}
                </div>
                <div className="mt-2 text-sm text-[#123B63]/60">{label}</div>
              </div>
            ))}
          </div>

          <section className="mt-12">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#0066D6]">
                  Quick Actions
                </p>
                <h2 className="mt-2 font-heading text-2xl font-700">
                  Keep the system moving
                </h2>
              </div>
              <Settings2
                className="h-6 w-6 text-[#0066D6]"
                aria-hidden="true"
              />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {NAV_ITEMS.slice(1).map(({ label, to, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex items-center justify-between border border-[#123B63]/10 bg-white p-5 transition-colors hover:border-[#0066D6]"
                >
                  <span className="flex items-center gap-3 text-sm font-600">
                    {createElement(Icon, {
                      className: "h-5 w-5 text-[#0066D6]",
                      "aria-hidden": true,
                    })}{" "}
                    Manage {label}
                  </span>
                  <span className="text-[#123B63]/30 transition-colors group-hover:text-[#0066D6]">
                    -&gt;
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
