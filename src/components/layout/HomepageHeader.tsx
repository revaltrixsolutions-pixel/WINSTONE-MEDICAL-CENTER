import {
  Calendar,
  FileText,
  Hospital,
  Menu,
  Phone,
  Shield,
  Sparkles,
  Stethoscope,
  UserCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/logo.png";

type MenuItem = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navigation: MenuItem[] = [
  { name: "Home", href: "/", icon: Hospital },
  { name: "Services", href: "/services", icon: Stethoscope },
  { name: "Gallery", href: "/gallery", icon: Sparkles },
  { name: "About", href: "/about", icon: Hospital },
  { name: "Doctors", href: "/doctors", icon: UserCheck },
  { name: "Terms", href: "/terms", icon: FileText },
  { name: "Privacy", href: "/privacy", icon: Shield },
];

function HomepageHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const closeMenu = () => setMobileOpen(false);

  const isActive = (href: string) => {
    const clean = href.split("#")[0];
    if (clean === "/") return location.pathname === "/";
    return location.pathname.startsWith(clean);
  };

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2.5"
        >
          <div className="relative flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
            <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-2 border-transparent border-r-cyan-400 border-t-blue-600" />
            <div className="absolute inset-1 rounded-full border border-blue-200/70" />
            <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white shadow ring-1 ring-blue-100 sm:h-9 sm:w-9">
              <img src={logo} alt="Winston Medical Centre" className="h-full w-full object-contain p-1" />
            </div>
          </div>

          <div className="min-w-0">
            <span className="block truncate text-sm font-bold text-blue-700 sm:text-base">
              Winston Medical Centre
            </span>
            <span className="mt-0.5 block truncate font-mono text-[9px] uppercase tracking-wider text-slate-500 sm:text-[10px]">
              Quality Healthcare You Can Trust
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-700"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <a
            href="tel:+254708130100"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            <Phone size={14} className="text-blue-600" />
            <span>+254 708 130 100</span>
          </a>

          <Link
            to="/appointment"
            onClick={closeMenu}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-blue-700"
          >
            Book Appointment
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu - full width below header */}
      {mobileOpen && (
        <div className="fixed left-0 right-0 top-[57px] z-40 border-b border-slate-200 bg-white px-4 pb-4 pt-2 shadow-lg lg:hidden">
          <nav className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 gap-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMenu}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon size={18} className="shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/appointment"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white"
              >
                <Calendar size={16} />
                <span>Book</span>
              </Link>

              <a
                href="tel:+254708130100"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-bold text-slate-700"
              >
                <Phone size={16} className="text-blue-600" />
                <span>Call</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default HomepageHeader;