import {
  Baby,
  HeartPulse,
  Pill,
  Siren,
  Stethoscope,
  TestTube,
  Sparkles,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getServices, type MedicalService } from "@/data/services";

const iconMap = {
  Stethoscope,
  TestTube,
  Pill,
  Baby,
  HeartPulse,
  Siren,
};

function ServiceIcon({ icon }: { icon: string }) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? Stethoscope;
  return <Icon size={24} strokeWidth={2} />;
}

export default function AppointmentPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [statusState, setStatusState] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  }>({
    submitted: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    async function loadServices() {
      try {
        // Fallback to static services if API endpoint isn't ready
        const activeServices = getServices().filter((s: MedicalService) => s.active);
        setServices(activeServices);

        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get("service");

        if (serviceParam && activeServices.some((s: MedicalService) => s.id === serviceParam)) {
          setSelectedServiceId(serviceParam);
        } else if (activeServices.length > 0) {
          setSelectedServiceId(activeServices[0].id);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      }
    }

    loadServices();

    const handleHashChange = () => {
      const hashService = window.location.hash.replace("#appointment-", "");
      if (services.some((s: MedicalService) => s.id === hashService)) {
        setSelectedServiceId(hashService);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !date || !time || !selectedServiceId) {
      setStatusState({
        submitted: true,
        success: false,
        message: "Validation Error: Please fill in all required patient and scheduling fields.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedServiceObj = services.find((s) => s.id === selectedServiceId);

      const payload = {
        serviceId: selectedServiceId,
        serviceName: selectedServiceObj?.name || "General Medical Care",
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        date,
        time,
        notes: notes.trim(),
      };

      // POST request to backend API database endpoint
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit appointment to database.");
      }

      setStatusState({
        submitted: true,
        success: true,
        message: `Appointment successfully booked for ${payload.serviceName}. Our clinical coordinators will verify your slot shortly.`,
      });
    } catch (error: any) {
      setStatusState({
        submitted: true,
        success: false,
        message: error.message || "Booking Failed: Unable to record appointment in database. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = services.find((s) => s.id === selectedServiceId);

  return (
    <section id="appointment" className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-24 sm:py-32 min-h-screen text-slate-100">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              Easy Online Booking
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Book Your Medical{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Appointment
            </span>
          </h1>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-300">
            Schedule your consultation with Winston Medical Centre. Sent requests are instantly saved to our database.
          </p>
        </div>

        {statusState.submitted ? (
          /* STATUS FEEDBACK STATE */
          <div className={`rounded-3xl border backdrop-blur-2xl p-8 sm:p-12 text-center shadow-2xl animate-fadeIn ${
            statusState.success ? "border-cyan-500/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02]" : "border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-950"
          }`}>
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-xl mb-6 ${
              statusState.success ? "bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-cyan-500/30" : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30"
            }`}>
              {statusState.success ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {statusState.success ? "Appointment Booked Successfully!" : "Booking Submission Failed"}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
              {statusState.message}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setStatusState({ submitted: false, success: false, message: "" });
                  if (statusState.success) {
                    setFullName("");
                    setEmail("");
                    setPhone("");
                    setDate("");
                    setTime("");
                    setNotes("");
                  }
                }}
                className={`rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-105 ${
                  statusState.success ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30" : "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/30"
                }`}
              >
                {statusState.success ? "Book Another Appointment" : "Try Again"}
              </button>
            </div>
          </div>
        ) : (
          /* APPOINTMENT FORM */
          <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 sm:p-10 shadow-2xl space-y-6">
            
            {/* Selected Service Highlight Banner */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-4">
                {selectedServiceObj ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30 shrink-0">
                    <ServiceIcon icon={selectedServiceObj.icon} />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-cyan-400 shrink-0">
                    <Stethoscope size={24} />
                  </div>
                )}
                <div>
                  <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider">Selected Care Program</span>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {selectedServiceObj ? selectedServiceObj.name : "Please select a service below"}
                  </h4>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <label htmlFor="service-select" className="sr-only">Change Service</label>
                <select
                  id="service-select"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 text-xs font-bold text-cyan-300 outline-none transition focus:border-cyan-400"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <User size={18} />
                  </span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Phone Number */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Phone size={18} />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 700 000 000"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md"
                    required
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preferred Date <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Calendar size={18} />
                  </span>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              {/* Preferred Time */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preferred Time <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Clock size={18} />
                  </span>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Additional Medical Notes */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Additional Notes / Symptoms <span className="text-slate-500 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute top-3.5 left-4 pointer-events-none text-slate-400">
                  <FileText size={18} />
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe any specific symptoms, concerns, or requests..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md"
                />
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-fuchsia-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01] hover:shadow-fuchsia-500/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-white" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <span>Send Appointment Request</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
              <AlertCircle size={14} className="text-cyan-400 shrink-0" />
              <span>Real-time appointment requests sync directly to the Winston administration database.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}