import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  LayoutDashboard,
  Mail,
  Phone,
  Search,
  Settings,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface Appointment {
  id: string;
  sourceType: "service" | "doctor";
  serviceId?: string;
  serviceName: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time?: string;
  notes?: string;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
  createdAt: string;
}

const APPOINTMENTS_STORAGE_KEY = "winston_medical_appointments";

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sourceFilter, setSourceFilter] = useState<string>("All");

  const loadAppointments = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setAppointments(Array.isArray(parsed) ? parsed : []);
      } else {
        setAppointments([]);
        localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify([]));
      }
    } catch (err) {
      console.error("Failed to parse appointments from localStorage:", err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    loadAppointments();

    const handleStorageChange = () => loadAppointments();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("appointments_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("appointments_updated", handleStorageChange);
    };
  }, []);

  const updateAppointments = (updated: Appointment[]) => {
    try {
      setAppointments(updated);
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("appointments_updated"));
    } catch (err) {
      console.error("Failed to save appointments:", err);
    }
  };

  const updateStatus = (id: string, newStatus: Appointment["status"]) => {
    const updated = appointments.map((appt) =>
      appt.id === id ? { ...appt, status: newStatus } : appt
    );
    updateAppointments(updated);
  };

  const deleteAppointment = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment record?")) return;
    const updated = appointments.filter((appt) => appt.id !== id);
    updateAppointments(updated);
  };

  const filteredAppointments = appointments.filter((appt) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (appt.fullName || "").toLowerCase().includes(query) ||
      (appt.email || "").toLowerCase().includes(query) ||
      (appt.serviceName || "").toLowerCase().includes(query) ||
      (appt.phone || "").includes(searchQuery);

    const matchesStatus = statusFilter === "All" || appt.status === statusFilter;
    const matchesSource = sourceFilter === "All" || appt.sourceType === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Admin Appointments Header */}
      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block">
                Admin Portal
              </span>
              <h1 className="text-lg font-bold text-white">Appointments Manager</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/services"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Settings size={16} />
              <span>Manage Services</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:scale-105"
            >
              <span>View Website</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</p>
            <p className="mt-2 text-3xl font-extrabold text-white">{appointments.length}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Review</p>
            <p className="mt-2 text-3xl font-extrabold text-amber-300">
              {appointments.filter((a) => a.status === "Pending").length}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">Confirmed</p>
            <p className="mt-2 text-3xl font-extrabold text-cyan-300">
              {appointments.filter((a) => a.status === "Confirmed").length}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Completed</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-300">
              {appointments.filter((a) => a.status === "Completed").length}
            </p>
          </div>
        </div>

        {/* Toolbar Filter & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 rounded-3xl p-5 backdrop-blur-xl">
          <div className="relative w-full lg:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, doctor, or service..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Source:</span>
              {[
                { label: "All", value: "All" },
                { label: "Services", value: "service" },
                { label: "Doctors", value: "doctor" },
              ].map((src) => (
                <button
                  key={src.value}
                  type="button"
                  onClick={() => setSourceFilter(src.value)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    sourceFilter === src.value
                      ? "bg-fuchsia-500 text-slate-950 shadow-lg shadow-fuchsia-500/20"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    statusFilter === status
                      ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Table / List */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <h2 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <Calendar size={18} className="text-cyan-400" />
              All Appointment Requests
            </h2>
            <span className="font-mono text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full">
              {filteredAppointments.length} Records Found
            </span>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="p-16 text-center">
              <AlertCircle size={40} className="mx-auto text-cyan-400 mb-3 animate-bounce" />
              <p className="font-bold text-white">No appointment bookings found</p>
              <p className="mt-1 text-xs text-slate-400">
                Appointments booked from Medical Services or Individual Doctors will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredAppointments.map((appt, idx) => (
                <div
                  key={appt.id || `appt-${idx}`}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition hover:bg-white/[0.04]"
                >
                  {/* Patient & Booking Details */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <User size={16} className="text-cyan-400" />
                        {appt.fullName || "Unnamed Patient"}
                      </h3>

                      {/* Source Badge */}
                      <span
                        className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full border ${
                          appt.sourceType === "doctor"
                            ? "text-cyan-300 bg-cyan-950/80 border-cyan-500/30"
                            : "text-fuchsia-300 bg-fuchsia-950/80 border-fuchsia-500/30"
                        }`}
                      >
                        {appt.sourceType === "doctor" ? <Stethoscope size={12} /> : <Calendar size={12} />}
                        {appt.sourceType === "doctor"
                          ? `Doctor: ${appt.serviceName || "Specialist"}`
                          : `Service: ${appt.serviceName || "General"}`}
                      </span>

                      <span
                        className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                          appt.status === "Pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            : appt.status === "Confirmed"
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : appt.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {appt.status || "Pending"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                      {appt.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-slate-400" /> {appt.email}
                        </span>
                      )}
                      {appt.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-slate-400" /> {appt.phone}
                        </span>
                      )}
                      {appt.date && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-cyan-400" /> {appt.date}
                        </span>
                      )}
                      {appt.time && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} className="text-cyan-400" /> {appt.time}
                        </span>
                      )}
                    </div>

                    {appt.notes && (
                      <p className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-xl p-3 mt-2 flex items-start gap-2">
                        <FileText size={14} className="text-fuchsia-400 shrink-0 mt-0.5" />
                        <span>{appt.notes}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions & Status Changer */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                    <select
                      value={appt.status || "Pending"}
                      onChange={(e) => updateStatus(appt.id, e.target.value as Appointment["status"])}
                      className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none transition focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirm</option>
                      <option value="Completed">Complete</option>
                      <option value="Cancelled">Cancel</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => deleteAppointment(appt.id)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400 transition"
                      title="Delete appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}