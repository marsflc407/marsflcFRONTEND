import React, { createElement, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  CalendarDays,
  Building2,
  Contact,
  ExternalLink,
  Mail,
  FileText,
  Footprints,
  ImagePlus,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Home", to: "/admin/home", icon: House },
  {
    label: "Partner Companies",
    to: "/admin/partner-companies",
    icon: Building2,
  },
  { label: "Company Overview", to: "/admin/company-overview", icon: Building2 },
  { label: "Services", to: "/admin/services", icon: BriefcaseBusiness },
  {
    label: "Debt Collection",
    to: "/admin/debt-collection",
    icon: BriefcaseBusiness,
  },
  { label: "Contact", to: "/admin/contact", icon: Contact },
  { label: "Messages", to: "/admin/messages", icon: Mail },
  { label: "Applications", to: "/admin/applications", icon: Users },
  { label: "Careers", to: "/admin/careers", icon: CalendarDays },
  { label: "Content Management", to: "/admin/content", icon: FileText },
  { label: "Media Library", to: "/admin/images", icon: ImagePlus },
  { label: "Footer", to: "/admin/footer", icon: Footprints },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-600 transition-colors ${isActive ? "bg-[#0066D6] text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="min-h-screen bg-[#EFF6FF] text-[#123B63]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col bg-[#123B63] px-5 py-6 transition-transform md:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 pb-6">
          <Link
            to="/admin/dashboard"
            className="font-heading text-2xl font-700 tracking-[0.04em] text-white"
          >
            MARS <span className="text-[#0066D6]">FLC ADMIN</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="text-white/60 md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav
          className="min-h-0 flex-1 overflow-y-auto py-6 pr-1"
          aria-label="Admin navigation"
        >
          <div className="space-y-2">
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
          </div>
        </nav>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 flex shrink-0 w-full items-center gap-3 border-t border-white/10 px-4 pt-5 text-sm font-600 text-white/65 transition-colors hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" /> Log out
        </button>
      </aside>

      {mobileNavOpen && (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-[#123B63]/50 md:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <div className="md:pl-72">
        <header className="flex items-center justify-between border-b border-[#123B63]/10 bg-white px-5 py-4 md:px-8">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="text-[#123B63] md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-[#123B63]/60 sm:block">
              {user?.name || user?.email || "Administrator"}
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#0066D6] px-3 py-2 text-xs font-600 text-[#0066D6] transition-colors hover:bg-[#0066D6] hover:text-white"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Go to public site</span>
              <span className="sm:hidden">Public site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm font-600 text-[#0066D6] hover:text-[#123B63]"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
