import { useEffect, useState } from "react";
import { Mail, Phone, ChevronDown, Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "@/assets/logo.jpeg";
import { COMPANY } from "@/config/company";
import PartnerTicker from "@/components/public/PartnerTicker";
import { footerSettingsAPI } from "@/utils/api";

const companyLinks = [
  { label: "About Us", to: "/company-overview/about" },
  { label: "Our Management", to: "/company-overview/management" },
  { label: "Our Family", to: "/company-overview/family" },
  { label: "Sister Concern", to: "/company-overview/sister-concern" },
];

const navigationLinks = [
  { label: "Home", to: "/" },
  { label: "Contact Point Verification", to: "/cpv" },
  { label: "Debt Collection", to: "/debt-collection" },
  { label: "We're Hiring", to: "/careers" },
  { label: "Contact", to: "/contact" },
];

const linkClassName = ({ isActive }) =>
  `px-3 py-2 font-heading text-[13px] font-700 uppercase tracking-[0.08em] transition-colors ${
    isActive ? "text-[#0066D6]" : "text-[#123B63] hover:text-[#0066D6]"
  }`;

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [footerSettings, setFooterSettings] = useState({
    phone: COMPANY.phone,
    phoneHref: COMPANY.phoneHref,
    email: COMPANY.email,
  });
  const location = useLocation();

  useEffect(() => {
    let active = true;

    footerSettingsAPI
      .get()
      .then((response) => {
        if (active && response?.data) {
          setFooterSettings((current) => ({ ...current, ...response.data }));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCompanyOpen(false);
  }, [location]);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="relative sticky top-0 z-40 bg-white">
      <PartnerTicker compact />
      <div className="bg-[#123B63] text-white">
        <div className="contact-ticker__viewport">
          <div className="contact-ticker__track">
            {[false, true].map((hidden) => (
              <div
                key={hidden ? "duplicate" : "visible"}
                className="contact-ticker__group"
                aria-hidden={hidden}
              >
                <a
                  className="contact-ticker__item transition-colors hover:text-[#0066D6]"
                  href={footerSettings.phoneHref}
                  tabIndex={hidden ? -1 : undefined}
                >
                  <Phone
                    className="h-3.5 w-3.5 text-[#0066D6]"
                    aria-hidden="true"
                  />
                  {footerSettings.phone}
                </a>
                <a
                  className="contact-ticker__item transition-colors hover:text-[#0066D6]"
                  href={`mailto:${footerSettings.email}`}
                  tabIndex={hidden ? -1 : undefined}
                >
                  <Mail
                    className="h-3.5 w-3.5 text-[#0066D6]"
                    aria-hidden="true"
                  />
                  {footerSettings.email}
                </a>
                <span className="contact-ticker__item font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
                  24/7 High Capacity Call Center
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-[#EFF6FF] shadow-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="Mars Financial & Legal Consultancy home"
          >
            <img
              src={logo}
              alt="Mars Financial & Legal Consultancy (MARS FLC)"
              className="h-11 w-11 object-contain"
            />
            <span className="leading-tight">
              <span className="block font-heading text-sm font-700 uppercase tracking-[0.15em] text-[#123B63]">
                {COMPANY.name}
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.3em] text-[#0066D6]">
                The Metric of Certainty
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Primary navigation"
          >
            <NavLink end to="/" className={linkClassName}>
              Home
            </NavLink>
            <div
              className="relative"
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button
                type="button"
                className={`flex items-center gap-1 ${linkClassName({
                  isActive: location.pathname === "/company-overview",
                })}`}
                aria-expanded={companyOpen}
                onClick={() => setCompanyOpen((open) => !open)}
                onMouseEnter={() => setCompanyOpen(true)}
              >
                Company Overview
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {companyOpen && (
                <div className="absolute left-0 top-full min-w-[220px] border border-[#EFF6FF] bg-white py-1 shadow-xl">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block border-l-2 border-transparent px-4 py-2.5 font-heading text-[13px] font-700 uppercase tracking-[0.05em] text-[#123B63] transition-colors hover:border-[#0066D6] hover:bg-[#EFF6FF] hover:text-[#0066D6]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navigationLinks.slice(1).map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClassName}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div
          className={`absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] md:hidden ${
            mobileOpen ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-hidden={!mobileOpen}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-[#06182A]/70 transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Close menu"
            tabIndex={mobileOpen ? 0 : -1}
            onClick={() => setMobileOpen(false)}
          />
          <nav
            className={`absolute right-0 top-0 flex h-full w-[min(86vw,360px)] flex-col overflow-y-auto bg-[#123B63] px-6 pb-8 text-white shadow-2xl transition-transform duration-300 ease-out ${
              mobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
            aria-label="Mobile navigation"
            aria-hidden={!mobileOpen}
          >
            <div className="flex flex-col gap-1">
              <NavLink
                end
                to="/"
                tabIndex={mobileOpen ? 0 : -1}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `border-b border-white/10 px-1 py-4 font-heading text-sm font-700 uppercase tracking-[0.1em] transition-colors ${
                    isActive
                      ? "text-[#6EC1FF]"
                      : "text-white hover:text-[#6EC1FF]"
                  }`
                }
              >
                Home
              </NavLink>
              <button
                type="button"
                className="flex w-full items-center justify-between border-b border-white/10 px-1 py-4 text-left font-heading text-sm font-700 uppercase tracking-[0.1em] text-white transition-colors hover:text-[#6EC1FF]"
                aria-expanded={companyOpen}
                onClick={() => setCompanyOpen((open) => !open)}
                tabIndex={mobileOpen ? 0 : -1}
              >
                Company Overview
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${companyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {companyOpen && (
                <div className="ml-2 border-l-2 border-[#6EC1FF] pl-4">
                  {companyLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      tabIndex={mobileOpen ? 0 : -1}
                      onClick={() => setMobileOpen(false)}
                      className="block py-3 font-heading text-xs font-700 uppercase tracking-[0.06em] text-white/75 transition-colors hover:text-[#6EC1FF]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
              {navigationLinks.slice(1).map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  tabIndex={mobileOpen ? 0 : -1}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `border-b border-white/10 px-1 py-4 font-heading text-sm font-700 uppercase tracking-[0.1em] transition-colors ${
                      isActive
                        ? "text-[#6EC1FF]"
                        : "text-white hover:text-[#6EC1FF]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
