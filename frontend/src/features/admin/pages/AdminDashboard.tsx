import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Users,
  Image as ImageIcon,
  ShoppingBag,
  Package,
  ChevronRight,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const location = useLocation();

  const isRootDashboard = location.pathname === "/admindashboard";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside className="w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/80 backdrop-blur-2xl p-4 sm:p-6 flex flex-col justify-between shrink-0 md:min-h-screen">
        <div>
          {/* BRAND */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/30 blur-lg" />

              <div className="relative h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-fuchsia-600 flex items-center justify-center text-white shadow-xl">
                <LayoutDashboard size={21} />
              </div>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-mono text-cyan-400 tracking-[0.2em] uppercase">
                Winston Admin
              </span>

              <h1 className="text-base sm:text-lg font-extrabold text-white truncate">
                Master Console
              </h1>
            </div>
          </div>

          {/* MOBILE / DESKTOP NAVIGATION */}
          <nav className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {/* DASHBOARD */}
            <Link
              to="/admindashboard"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isRootDashboard
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl ${
                  isRootDashboard
                    ? "bg-white/20"
                    : "bg-white/5 group-hover:bg-cyan-500/10"
                }`}
              >
                <LayoutDashboard size={18} />
              </span>

              <span className="hidden sm:inline md:inline">
                Dashboard Overview
              </span>

              {isRootDashboard && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>

            {/* APPOINTMENTS */}
            <Link
              to="/appointments"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive("/appointments")
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl ${
                  isActive("/appointments")
                    ? "bg-white/20"
                    : "bg-cyan-500/10"
                }`}
              >
                <Calendar size={18} />
              </span>

              <span>Appointments</span>

              {isActive("/appointments") && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>

            {/* SERVICES */}
            <Link
              to="/admin/services"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive("/admin/services")
                  ? "bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl ${
                  isActive("/admin/services")
                    ? "bg-white/20"
                    : "bg-fuchsia-500/10"
                }`}
              >
                <Stethoscope size={18} />
              </span>

              <span>Services</span>

              {isActive("/admin/services") && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>

            {/* DOCTORS */}
            <Link
              to="/admin/doctors"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive("/admin/doctors")
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl ${
                  isActive("/admin/doctors")
                    ? "bg-white/20"
                    : "bg-emerald-500/10"
                }`}
              >
                <Users size={18} />
              </span>

              <span>Doctors</span>

              {isActive("/admin/doctors") && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>

            {/* GALLERY */}
            <Link
              to="/admin/gallery"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive("/admin/gallery")
                  ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`flex items-center justify-center h-9 w-9 rounded-xl ${
                  isActive("/admin/gallery")
                    ? "bg-white/20"
                    : "bg-blue-500/10"
                }`}
              >
                <ImageIcon size={18} />
              </span>

              <span>Gallery</span>

              {isActive("/admin/gallery") && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>

            {/* SHOP */}
            <Link
              to="/admin/shop"
              className={`group relative flex items-center gap-3 px-3 sm:px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive("/admin/shop")
                  ? "bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 text-white shadow-lg shadow-pink-500/25"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`relative flex items-center justify-center h-9 w-9 rounded-xl ${
                  isActive("/admin/shop")
                    ? "bg-white/20"
                    : "bg-orange-500/10"
                }`}
              >
                <ShoppingBag size={18} />

                {!isActive("/admin/shop") && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-400 shadow-lg shadow-orange-400/50" />
                )}
              </span>

              <span>Shop & Orders</span>

              {isActive("/admin/shop") && (
                <ChevronRight
                  size={15}
                  className="ml-auto hidden md:block"
                />
              )}
            </Link>
          </nav>

          {/* SHOP HIGHLIGHT */}
          <Link
            to="/admin/shop"
            className="hidden md:block mt-7 group rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/10 via-pink-500/10 to-fuchsia-500/10 p-5 hover:border-orange-400/40 hover:bg-orange-500/15 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Package size={17} />
                </div>

                <span className="text-xs font-extrabold text-white">
                  Online Shop
                </span>
              </div>

              <ArrowRight
                size={15}
                className="text-orange-400 transition-transform group-hover:translate-x-1"
              />
            </div>

            <p className="text-[11px] leading-relaxed text-slate-400">
              Manage products, stock, customer orders, payments and delivery.
            </p>
          </Link>
        </div>

        {/* EXIT */}
        <div className="pt-5 md:pt-6 border-t border-white/10 mt-5 md:mt-6">
          <Link
            to="/"
            className="group flex items-center justify-center gap-2 w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-xs sm:text-sm font-bold text-slate-300 hover:bg-white/10 hover:text-white hover:border-cyan-400/30 transition-all"
          >
            <span>Exit to Website</span>

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </aside>

      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}
      <main className="relative flex-1 min-w-0 overflow-y-auto">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative p-4 sm:p-6 lg:p-10">
          {isRootDashboard ? (
            <div className="max-w-7xl mx-auto space-y-7 sm:space-y-9 animate-fadeIn">
              {/* =====================================================
                  HEADER
              ===================================================== */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 p-5 sm:p-8 lg:p-10 shadow-2xl">
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-400/10 px-3 py-1.5 text-[10px] sm:text-xs font-bold text-cyan-300 mb-4 border border-cyan-400/20">
                    <Sparkles size={13} />
                    Welcome back, Administrator
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
                    Winston Medical Management
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed">
                    Manage your hospital operations from one central console —
                    appointments, doctors, medical services, gallery content,
                    products, orders and deliveries.
                  </p>

                  {/* QUICK STATS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-7">
                    <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-4">
                      <Calendar
                        size={18}
                        className="text-cyan-400 mb-2"
                      />
                      <div className="text-xs text-slate-400">
                        Module
                      </div>
                      <div className="text-sm font-bold text-white">
                        Appointments
                      </div>
                    </div>

                    <div className="rounded-2xl border border-fuchsia-400/10 bg-fuchsia-400/5 p-4">
                      <Stethoscope
                        size={18}
                        className="text-fuchsia-400 mb-2"
                      />
                      <div className="text-xs text-slate-400">
                        Module
                      </div>
                      <div className="text-sm font-bold text-white">
                        Services
                      </div>
                    </div>

                    <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                      <Users
                        size={18}
                        className="text-emerald-400 mb-2"
                      />
                      <div className="text-xs text-slate-400">
                        Module
                      </div>
                      <div className="text-sm font-bold text-white">
                        Doctors
                      </div>
                    </div>

                    <div className="rounded-2xl border border-orange-400/10 bg-orange-400/5 p-4">
                      <ShoppingBag
                        size={18}
                        className="text-orange-400 mb-2"
                      />
                      <div className="text-xs text-slate-400">
                        Module
                      </div>
                      <div className="text-sm font-bold text-white">
                        Shop
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  MODULE GRID
              ===================================================== */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Administration Modules
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Select a module to continue.
                    </p>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    System Ready
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {/* APPOINTMENTS */}
                  <Link
                    to="/appointments"
                    className="group relative overflow-hidden rounded-3xl border border-cyan-400/10 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-6 sm:p-7 shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-400/40 transition-all duration-300"
                  >
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-400/10 blur-2xl group-hover:bg-cyan-400/20 transition" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                          <Calendar size={26} />
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-cyan-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                        Patient Appointments
                      </h3>

                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        View appointment bookings, update statuses and manage
                        patient schedules.
                      </p>

                      <div className="mt-6 text-xs font-bold text-cyan-400">
                        Open Appointments →
                      </div>
                    </div>
                  </Link>

                  {/* SERVICES */}
                  <Link
                    to="/admin/services"
                    className="group relative overflow-hidden rounded-3xl border border-fuchsia-400/10 bg-gradient-to-br from-fuchsia-500/10 via-purple-500/5 to-transparent p-6 sm:p-7 shadow-xl hover:shadow-fuchsia-500/10 hover:border-fuchsia-400/40 transition-all duration-300"
                  >
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-400/10 blur-2xl group-hover:bg-fuchsia-400/20 transition" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/20 group-hover:scale-110 transition-transform">
                          <Stethoscope size={26} />
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-fuchsia-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white group-hover:text-fuchsia-300 transition-colors">
                        Medical Services
                      </h3>

                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        Add treatments, update descriptions, upload images and
                        control active services.
                      </p>

                      <div className="mt-6 text-xs font-bold text-fuchsia-400">
                        Open Services →
                      </div>
                    </div>
                  </Link>

                  {/* DOCTORS */}
                  <Link
                    to="/admin/doctors"
                    className="group relative overflow-hidden rounded-3xl border border-emerald-400/10 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-7 shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-400/40 transition-all duration-300"
                  >
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl group-hover:bg-emerald-400/20 transition" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                          <Users size={26} />
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-emerald-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                        Hospital Doctors
                      </h3>

                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        Manage doctor profiles, bookings, patient messages and
                        professional information.
                      </p>

                      <div className="mt-6 text-xs font-bold text-emerald-400">
                        Open Doctors →
                      </div>
                    </div>
                  </Link>

                  {/* GALLERY */}
                  <Link
                    to="/admin/gallery"
                    className="group relative overflow-hidden rounded-3xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent p-6 sm:p-7 shadow-xl hover:shadow-blue-500/10 hover:border-blue-400/40 transition-all duration-300"
                  >
                    <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-400/10 blur-2xl group-hover:bg-blue-400/20 transition" />

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-600 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                          <ImageIcon size={26} />
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-blue-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                        Hospital Gallery
                      </h3>

                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        Upload facility photos, videos and manage media shown
                        on the public website.
                      </p>

                      <div className="mt-6 text-xs font-bold text-blue-400">
                        Open Gallery →
                      </div>
                    </div>
                  </Link>

                  {/* SHOP */}
                  <Link
                    to="/admin/shop"
                    className="group relative overflow-hidden rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/15 via-pink-500/10 to-fuchsia-500/5 p-6 sm:p-7 shadow-xl hover:shadow-orange-500/15 hover:border-orange-400/50 transition-all duration-300"
                  >
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-orange-400/15 blur-3xl group-hover:bg-orange-400/25 transition" />

                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-orange-300">
                        <Sparkles size={10} />
                        New
                      </span>
                    </div>

                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 via-pink-500 to-fuchsia-600 text-white shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                          <ShoppingBag size={26} />
                        </div>

                        <ArrowRight
                          size={19}
                          className="text-orange-400 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      <h3 className="mt-6 text-lg sm:text-xl font-extrabold text-white group-hover:text-orange-300 transition-colors">
                        Shop & Orders Management
                      </h3>

                      <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                        Manage products, stock, customer orders, payments,
                        delivery options and online shop activity.
                      </p>

                      <div className="mt-6 text-xs font-bold text-orange-400">
                        Open Shop Management →
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* FOOTER STATUS */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40 animate-pulse" />
                  Winston Medical Centre Administration System
                </div>

                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-600">
                  Secure Admin Console
                </div>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>
    </div>
  );
}
