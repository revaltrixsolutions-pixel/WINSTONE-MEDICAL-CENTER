import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  ArrowRight,
  Sparkles,
  Users,
  Image as ImageIcon,
} from "lucide-react"; // Keep this line
import { Link, Outlet, useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const location = useLocation();
  const isRootDashboard = location.pathname === "/admindashboard";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">Winston Admin</span>
              <h1 className="text-base font-bold text-white">Master Console</h1>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admindashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                isRootDashboard
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard Overview</span>
            </Link>

            <Link
              to="/api/appointments"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                location.pathname === "/api/appointments"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Calendar size={18} />
              <span>Manage Appointments</span>
            </Link>

            <Link
              to="/admin/services"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                location.pathname === "/admin/services"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Stethoscope size={18} />
              <span>Manage Services</span>
            </Link>

            <Link
              to="/api/admin/doctors"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                location.pathname === "/api/admin/doctors"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users size={18} />
              <span>Manage Doctors</span>
            </Link>

            <Link
              to="/admin/gallery"
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition ${
                location.pathname === "/admin/gallery"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <ImageIcon size={18} />
              <span>Manage Gallery</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            <span>Exit to Website</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </aside>

      {/* Main Content Area / Nested Sub-Views */}
      <main className="flex-1 min-w-0 p-6 sm:p-10 overflow-y-auto">
        {isRootDashboard ? (
          <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 mb-3 border border-cyan-500/30">
                <Sparkles size={13} /> Welcome back, Administrator
              </div>
              <h2 className="text-3xl font-extrabold text-white">Winston Medical Management</h2>
              <p className="mt-2 text-sm text-slate-300">
                Select an administration module below to manage patient appointments, schedules, doctors, gallery, and medical offerings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/api/appointments"
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl transition hover:border-cyan-400/50 hover:bg-white/[0.12] flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 mb-6 group-hover:scale-110 transition-transform">
                    <Calendar size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">Patient Appointments</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    View real-time appointment bookings from services and doctors, update status, and manage schedules.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span>Open Appointments Module</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>

              <Link
                to="/admin/services"
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl transition-all hover:border-fuchsia-400/50 hover:bg-white/[0.12] flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30 mb-6 group-hover:scale-110 transition-transform">
                    <Stethoscope size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors">Medical Services Catalog</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Add new medical treatments, upload care program images, update descriptions, and toggle active states.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-fuchsia-400">
                  <span>Open Services Module</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>

              <Link
                to="/api/admin/doctors"
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl transition-all hover:border-emerald-400/50 hover:bg-white/[0.12] flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 mb-6 group-hover:scale-110 transition-transform">
                    <Users size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">Hospital Doctors</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Manage doctor profiles, view incoming patient messages, check star ratings, and review bookings.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <span>Open Doctors Module</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>

              <Link
                to="/admin/gallery"
                className="group rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-8 shadow-2xl transition-all hover:border-cyan-400/50 hover:bg-white/[0.12] flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-lg shadow-cyan-500/30 mb-6 group-hover:scale-110 transition-transform">
                    <ImageIcon size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">Hospital Gallery</h3>
                  <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                    Upload facility photos, embed videos, and manage active media displayed on client side.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span>Open Gallery Module</span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5" />
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}







