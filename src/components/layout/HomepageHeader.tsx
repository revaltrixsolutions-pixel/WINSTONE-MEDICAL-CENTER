import {
  ChevronDown,
  Clock3,
  Hospital,
  Menu,
  Phone,
  Stethoscope,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import logo from "../../assets/logo.png";

type DropdownName = "about" | "services" | "doctors" | null;

const dropdowns = {
  about: [
    { name: "About Winston Medical Centre", href: "#about" },
    { name: "Our Mission", href: "#mission" },
    { name: "Our Values", href: "#values" },
  ],
  services: [
    { name: "General Consultation", href: "#services" },
    { name: "Laboratory", href: "#services" },
    { name: "Pharmacy", href: "#services" },
    { name: "Maternity Care", href: "#services" },
    { name: "Pediatrics", href: "#services" },
  ],
  doctors: [
    { name: "Medical Team", href: "#doctors" },
    { name: "Our Specialists", href: "#doctors" },
    { name: "Book a Consultation", href: "#appointment" },
  ],
};

const navigation = [{ name: "Home", href: "#home" }];

function HomepageHeader() {
  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownName>(null);

  const headerRef = useRef<HTMLElement>(null);

  /* Close menus when clicking outside */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setActiveDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* Close menus with Escape */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setActiveDropdown(null);
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  /* Prevent background scrolling while mobile menu is open */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenus = () => {
    setOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown: DropdownName) => {
    setActiveDropdown((current) => (current === dropdown ? null : dropdown));
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-[100] border-b border-slate-200/60 bg-gradient-to-b from-white via-white to-slate-50/65 backdrop-blur-xl"
    >
      {/* Desktop glowing stars background */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block">
        <StarsDesktopBackground />
      </div>

      {/* =========================================================
          HEADER BAR
      ========================================================== */}
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        {/* =======================================================
            BRAND
        ======================================================== */}
        <a
          href="#home"
          onClick={closeMenus}
          className="group flex min-w-0 items-center gap-3"
        >
          {/* Animated Logo Ring */}
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center sm:h-14 sm:w-14">
            <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-md transition duration-500 group-hover:bg-blue-500/35" />
            <div className="absolute inset-0 animate-[spin_7s_linear_infinite] rounded-full border-2 border-transparent border-t-blue-500 border-r-cyan-400" />
            <div className="absolute inset-[4px] rounded-full border border-blue-300/60" />

            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg ring-1 ring-blue-100 sm:h-12 sm:w-12">
              <img
                src={logo}
                alt="Winston Medical Centre"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
          </div>

          {/* Brand Text */}
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold leading-tight tracking-tight text-slate-900 sm:text-lg">
              Winston Medical Centre
            </h1>
            <p className="hidden text-[11px] font-medium text-blue-600 sm:block">
              Quality Healthcare You Can Trust
            </p>
          </div>
        </a>

        {/* =======================================================
            DESKTOP NAVIGATION
        ======================================================== */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
              {item.name}
            </a>
          ))}

          {/* About Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("about")}
              className={`flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeDropdown === "about"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              aria-expanded={activeDropdown === "about"}
            >
              About Us
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  activeDropdown === "about" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "about" && (
              <DesktopDropdown items={dropdowns.about} />
            )}
          </div>

          {/* Services Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("services")}
              className={`flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeDropdown === "services"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              aria-expanded={activeDropdown === "services"}
            >
              Services
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  activeDropdown === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "services" && (
              <DesktopDropdown items={dropdowns.services} />
            )}
          </div>

          {/* Doctors Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown("doctors")}
              className={`flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                activeDropdown === "doctors"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
              }`}
              aria-expanded={activeDropdown === "doctors"}
            >
              Doctors
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${
                  activeDropdown === "doctors" ? "rotate-180" : ""
                }`}
              />
            </button>

            {activeDropdown === "doctors" && (
              <DesktopDropdown items={dropdowns.doctors} />
            )}
          </div>

          <a
            href="#contact"
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
          >
            Contact
          </a>
        </nav>

        {/* =======================================================
            DESKTOP ACTIONS
        ======================================================== */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+254700000000"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
          >
            <Phone size={16} />
            <span>Call Us</span>
          </a>

          <a
            href="#appointment"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-blue-600/30"
          >
            Book Appointment
          </a>
        </div>

        {/* =======================================================
            MOBILE MENU TOGGLE BUTTON
        ======================================================== */}
        <button
          type="button"
          onClick={() => {
            setOpen((prev) => !prev);
            setActiveDropdown(null);
          }}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition active:scale-95 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          <span
            className={`absolute transition-all duration-300 ${
              open ? "scale-0 opacity-0 rotate-90" : "scale-100 opacity-100 rotate-0"
            }`}
          >
            <Menu size={24} />
          </span>

          <span
            className={`absolute transition-all duration-300 ${
              open ? "scale-100 opacity-100 rotate-0" : "scale-0 opacity-0 -rotate-90"
            }`}
          >
            <X size={24} />
          </span>
        </button>
      </div>

      {/* =========================================================
          MOBILE MENU OVERLAY
      ========================================================= */}
      <div
        className={`fixed inset-x-0 top-[76px] bottom-0 z-[90] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl transition-all duration-300 lg:hidden sm:top-20 ${
          open
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        {/* Moving stars background */}
        <StarsBackground />

        {/* Dove flying down animation overlay */}
        <div className="pointer-events-none absolute inset-0">
          <DoveAnimation />
        </div>

        {/* Menu content */}
        <div className="relative mx-auto max-w-2xl px-4 pb-12 pt-6 sm:px-6">
          {/* Mobile menu heading */}
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                <Hospital size={21} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Winston Medical Centre
                </p>
                <p className="text-xs text-slate-400">
                  How can we help you today?
                </p>
              </div>
            </div>
          </div>

          {/* Home */}
          <MobileLink
            href="#home"
            label="Home"
            onClick={closeMenus}
          />

          {/* About */}
          <MobileDropdown
            label="About Us"
            icon={<Hospital size={18} />}
            open={activeDropdown === "about"}
            onClick={() => toggleDropdown("about")}
            items={dropdowns.about}
            onNavigate={closeMenus}
          />

          {/* Services */}
          <MobileDropdown
            label="Our Services"
            icon={<Stethoscope size={18} />}
            open={activeDropdown === "services"}
            onClick={() => toggleDropdown("services")}
            items={dropdowns.services}
            onNavigate={closeMenus}
          />

          {/* Doctors */}
          <MobileDropdown
            label="Our Doctors"
            icon={<Stethoscope size={18} />}
            open={activeDropdown === "doctors"}
            onClick={() => toggleDropdown("doctors")}
            items={dropdowns.doctors}
            onNavigate={closeMenus}
          />

          {/* Contact */}
          <MobileLink
            href="#contact"
            label="Contact Us"
            onClick={closeMenus}
          />

          {/* Action CTAs */}
          <div className="mt-6 space-y-3">
            <a
              href="#appointment"
              onClick={closeMenus}
              className="flex min-h-[52px] items-center justify-center rounded-2xl bg-blue-600 px-5 py-4 text-center text-base font-bold text-white shadow-xl shadow-blue-600/30 transition active:scale-[0.98] hover:bg-blue-500"
            >
              Book an Appointment
            </a>

            <a
              href="tel:+254700000000"
              onClick={closeMenus}
              className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.07] px-5 py-4 text-base font-semibold text-white backdrop-blur-xl transition active:scale-[0.98] hover:bg-white/10"
            >
              <Phone size={18} />
              Call Winston Medical Centre
            </a>
          </div>

          {/* Opening hours footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Clock3 size={15} />
            <span>Quality care when you need it</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ===============================================================
   DESKTOP DROPDOWN
================================================================ */
function DesktopDropdown({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <div className="absolute left-1/2 top-full mt-2 w-72 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 animate-in fade-in zoom-in-95 duration-150">
      <div className="mb-1 rounded-xl bg-slate-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Winston Medical Centre
        </p>
      </div>

      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
          {item.name}
        </a>
      ))}
    </div>
  );
}

/* ===============================================================
   MOBILE LINK
================================================================ */
function MobileLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="mb-2 flex min-h-[52px] items-center rounded-2xl border border-white/10 bg-white/[0.06] px-5 text-base font-semibold text-white backdrop-blur-xl transition active:scale-[0.99] hover:bg-white/10"
    >
      {label}
    </a>
  );
}

/* ===============================================================
   MOBILE DROPDOWN
================================================================ */
function MobileDropdown({
  label,
  icon,
  open,
  onClick,
  items,
  onNavigate,
}: {
  label: string;
  icon: React.ReactNode;
  open: boolean;
  onClick: () => void;
  items: { name: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onClick}
        className={`flex min-h-[52px] w-full items-center justify-between rounded-2xl border px-5 text-left text-base font-semibold text-white backdrop-blur-xl transition ${
          open
            ? "border-blue-400/30 bg-blue-500/15"
            : "border-white/10 bg-white/[0.06] hover:bg-white/10"
        }`}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="text-blue-300">{icon}</span>
          {label}
        </span>
        <ChevronDown
          size={19}
          className={`text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180 text-blue-300" : ""
          }`}
        />
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="ml-4 border-l border-blue-400/30 pl-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className="flex min-h-[44px] items-center rounded-xl px-4 text-sm font-medium text-slate-300 transition active:bg-white/10 hover:bg-white/10 hover:text-white"
              >
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)]" />
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
   ANIMATED STARS (MOBILE)
================================================================ */
function StarsBackground() {
  const stars = [
    { left: "7%", top: "8%", delay: "0s", size: 2 },
    { left: "18%", top: "25%", delay: "1.2s", size: 1 },
    { left: "31%", top: "12%", delay: "2.4s", size: 2 },
    { left: "44%", top: "31%", delay: "0.7s", size: 1 },
    { left: "57%", top: "10%", delay: "1.8s", size: 2 },
    { left: "69%", top: "23%", delay: "3s", size: 1 },
    { left: "82%", top: "7%", delay: "1.1s", size: 2 },
    { left: "93%", top: "34%", delay: "2.1s", size: 1 },
    { left: "12%", top: "47%", delay: "3.2s", size: 1 },
    { left: "27%", top: "61%", delay: "0.4s", size: 2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="absolute right-0 top-1/2 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-blue-200 shadow-[0_0_10px_rgba(147,197,253,0.9)] animate-[twinkle_3s_ease-in-out_infinite]"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ===============================================================
   DESKTOP STARS BACKGROUND
================================================================ */
function StarsDesktopBackground() {
  const stars = [
    { left: "5%", top: "20%", delay: "0s", size: 2 },
    { left: "15%", top: "60%", delay: "1.4s", size: 1 },
    { left: "25%", top: "30%", delay: "2.2s", size: 2 },
    { left: "65%", top: "40%", delay: "0.8s", size: 2 },
    { left: "85%", top: "70%", delay: "1.5s", size: 1 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Subtle gradient sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/50 to-transparent" />
      
      {/* Twinkling stars */}
      {stars.map((star, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-blue-400 shadow-[0_0_8px_rgba(147,197,253,0.9)] animate-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ===============================================================
   DOVE ANIMATION
================================================================ */
function DoveAnimation() {
  return (
    <div className="absolute inset-0">
      <div className="absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2">
        <div className="relative h-full w-full animate-[doveFly_1.2s_ease-out_forwards]">
          <div className="absolute left-0 top-1/2 h-3 w-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-300/60 to-blue-200/60 blur-sm" />
          <div className="absolute right-0 top-1/2 h-3 w-8 -translate-y-1/2 rounded-full bg-gradient-to-l from-blue-300/60 to-blue-200/60 blur-sm" />
          <div className="absolute left-1/2 top-1/2 h-4 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200/70 blur-[2px]" />
        </div>
      </div>
    </div>
  );
}

export default HomepageHeader;