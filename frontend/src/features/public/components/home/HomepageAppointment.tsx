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
import { createAppointment } from "@/api/appointments";

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

  /*
   * Load active medical services
   */
  useEffect(() => {
    const loadServices = async () => {
      try {
        const activeServices = (await getServices()).filter(
          (service: MedicalService) => service.active
        );

        setServices(activeServices);

        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get("service");

        if (
          serviceParam &&
          activeServices.some(
            (service: MedicalService) => service.id === serviceParam
          )
        ) {
          setSelectedServiceId(serviceParam);
        } else if (activeServices.length > 0) {
          setSelectedServiceId(activeServices[0].id);
        }
      } catch (error) {
        console.error("Failed to load services:", error);
      }
    };

    loadServices();
  }, []);

  /*
   * Handle appointment hash navigation
   */
  useEffect(() => {
    const handleHashChange = () => {
      const hashService = window.location.hash.replace(
        "#appointment-",
        ""
      );

      if (
        hashService &&
        services.some((service) => service.id === hashService)
      ) {
        setSelectedServiceId(hashService);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [services]);

  /*
   * Submit appointment
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /*
     * Validate required fields
     */
    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !date ||
      !time ||
      !selectedServiceId
    ) {
      setStatusState({
        submitted: true,
        success: false,
        message:
          "Validation Error: Please fill in all required patient and scheduling fields.",
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const selectedServiceObj = services.find(
        (service) => service.id === selectedServiceId
      );

      /*
       * Create appointment using the centralized API.
       *
       * This replaces:
       * fetch("/api/appointments", ...)
       *
       * The request will now use the API URL
       * configured in src/api/axios.ts.
       */
      await createAppointment({
        patientName: fullName.trim(),
        patientPhone: phone.trim(),
        patientEmail: email.trim(),

        service: selectedServiceObj?.name || "General Medical Care",

        appointmentDate: date,
        appointmentTime: time,

        reason: notes.trim(),

        priority: "NORMAL",
      });

      /*
       * Success
       */
      setStatusState({
        submitted: true,
        success: true,
        message: `Appointment successfully booked for ${
          selectedServiceObj?.name || "General Medical Care"
        }. Our clinical coordinators will verify your slot shortly.`,
      });
    } catch (error: unknown) {
      console.error("Appointment submission failed:", error);

      let errorMessage =
        "Booking Failed: Unable to record appointment in the database. Please try again.";

      if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }

      setStatusState({
        submitted: true,
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedServiceObj = services.find(
    (service) => service.id === selectedServiceId
  );

  /*
   * Reset form
   */
  const resetForm = () => {
    setStatusState({
      submitted: false,
      success: false,
      message: "",
    });

    setFullName("");
    setEmail("");
    setPhone("");
    setDate("");
    setTime("");
    setNotes("");

    if (services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  };

  return (
    <section
      id="appointment"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-24 text-slate-100 sm:py-32"
    >
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 backdrop-blur-md">
              <Sparkles
                size={14}
                className="text-cyan-400"
              />

              Easy Online Booking
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Book Your Medical{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Appointment
            </span>
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
            Schedule your consultation with Winston Medical Centre.
            Your appointment request will be securely submitted to
            our administration system.
          </p>
        </div>

        {statusState.submitted ? (
          /*
           * STATUS FEEDBACK
           */
          <div
            className={`animate-fadeIn rounded-3xl border p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12 ${
              statusState.success
                ? "border-cyan-500/30 bg-gradient-to-b from-white/[0.08] to-white/[0.02]"
                : "border-rose-500/30 bg-gradient-to-b from-rose-950/20 to-slate-950"
            }`}
          >
            <div
              className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl text-white shadow-xl ${
                statusState.success
                  ? "bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-cyan-500/30"
                  : "bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30"
              }`}
            >
              {statusState.success ? (
                <CheckCircle2 size={40} />
              ) : (
                <AlertCircle size={40} />
              )}
            </div>

            <h3 className="text-2xl font-bold text-white sm:text-3xl">
              {statusState.success
                ? "Appointment Booked Successfully!"
                : "Booking Submission Failed"}
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">
              {statusState.message}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                onClick={resetForm}
                className={`rounded-2xl px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-105 ${
                  statusState.success
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 shadow-cyan-500/30"
                    : "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/30"
                }`}
              >
                {statusState.success
                  ? "Book Another Appointment"
                  : "Try Again"}
              </button>
            </div>
          </div>
        ) : (
          /*
           * APPOINTMENT FORM
           */
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-2xl backdrop-blur-2xl sm:p-10"
          >
            {/* Selected Service */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/40 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:p-5">
              <div className="flex items-center gap-4">
                {selectedServiceObj ? (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30">
                    <ServiceIcon icon={selectedServiceObj.icon} />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-cyan-400">
                    <Stethoscope size={24} />
                  </div>
                )}

                <div>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300">
                    Selected Care Program
                  </span>

                  <h4 className="text-base font-bold text-white sm:text-lg">
                    {selectedServiceObj
                      ? selectedServiceObj.name
                      : "Please select a service below"}
                  </h4>
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <label
                  htmlFor="service-select"
                  className="sr-only"
                >
                  Change Service
                </label>

                <select
                  id="service-select"
                  value={selectedServiceId}
                  onChange={(e) =>
                    setSelectedServiceId(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/20 bg-slate-900 px-4 py-2.5 text-xs font-bold text-cyan-300 outline-none transition focus:border-cyan-400 sm:w-auto"
                >
                  {services.map((service) => (
                    <option
                      key={service.id}
                      value={service.id}
                      className="bg-slate-900 text-white"
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Name{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <User size={18} />
                  </span>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Email Address{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Mail size={18} />
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Scheduling Information */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Phone Number{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Phone size={18} />
                  </span>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    placeholder="+254 700 000 000"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preferred Date{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Calendar size={18} />
                  </span>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      setDate(e.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 [color-scheme:dark]"
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Preferred Time{" "}
                  <span className="text-rose-400">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <Clock size={18} />
                  </span>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                      setTime(e.target.value)
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-300">
                Additional Notes / Symptoms{" "}
                <span className="font-normal text-slate-500">
                  (optional)
                </span>
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-3.5 text-slate-400">
                  <FileText size={18} />
                </span>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  placeholder="Describe any specific symptoms, concerns, or requests..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 py-3.5 pl-11 pr-4 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-fuchsia-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-cyan-500/20 transition-all hover:scale-[1.01] hover:shadow-fuchsia-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin text-white"
                    />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <>
                    <span>
                      Send Appointment Request
                    </span>

                    <Sparkles size={16} />
                  </>
                )}
              </button>
            </div>

            {/* Notice */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <AlertCircle
                size={14}
                className="shrink-0 text-cyan-400"
              />

              <span>
                Appointment requests are securely submitted
                to the Winston Medical Centre administration
                system.
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}



