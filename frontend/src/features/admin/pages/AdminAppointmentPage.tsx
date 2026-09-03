import {
  AlertCircle,
  Calendar,
  Clock,
  FileText,
  LayoutDashboard,
  Loader2,
  Mail,
  Phone,
  Search,
  Settings,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api/axios";

/* =========================================================
   TYPES
========================================================= */

export interface Appointment {
  id: string;

  sourceType: "service" | "doctor";

  serviceId?: string;
  doctorId?: string;

  serviceName: string;

  doctorName?: string;
  specialization?: string;

  fullName: string;
  email: string;
  phone: string;

  date: string;
  time?: string;

  notes?: string;
  reason?: string;

  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";

  createdAt: string;
  updatedAt?: string;
}

/* =========================================================
   API RESPONSE TYPES
========================================================= */

interface AppointmentListResponse {
  success?: boolean;
  data?: Appointment[];
  appointments?: Appointment[];
  message?: string;
  error?: string;
}

interface AppointmentUpdateResponse {
  success?: boolean;
  data?: Appointment;
  appointment?: Appointment;
  message?: string;
  error?: string;
}

/* =========================================================
   HELPERS
========================================================= */

/**
 * Converts different possible backend status formats
 * into the format used by this admin page.
 */
const normalizeStatus = (
  status: unknown
): Appointment["status"] => {
  if (!status) return "Pending";

  const value = String(status).trim().toLowerCase();

  switch (value) {
    case "pending":
    case "draft":
    case "submitted":
    case "requested":
      return "Pending";

    case "confirmed":
    case "approved":
      return "Confirmed";

    case "completed":
    case "complete":
      return "Completed";

    case "cancelled":
    case "canceled":
      return "Cancelled";

    default:
      return "Pending";
  }
};

/**
 * Converts the database/backend appointment into the
 * structure expected by this page.
 *
 * This deliberately supports several possible field names
 * so the page can work with your current appointment API.
 */
const normalizeAppointment = (
  raw: any
): Appointment => {
  const doctor =
    raw?.doctor ||
    raw?.Doctor ||
    undefined;

  const service =
    raw?.service ||
    raw?.MedicalService ||
    undefined;

  const doctorId =
    raw?.doctorId ||
    raw?.doctorID ||
    doctor?.id ||
    undefined;

  const serviceId =
    raw?.serviceId ||
    raw?.medicalServiceId ||
    service?.id ||
    undefined;

  const doctorName =
    raw?.doctorName ||
    doctor?.name ||
    undefined;

  const serviceName =
    raw?.serviceName ||
    service?.name ||
    doctorName ||
    "General Appointment";

  const sourceType =
    raw?.sourceType === "doctor" ||
    doctorId
      ? "doctor"
      : "service";

  return {
    id: String(raw?.id || ""),

    sourceType,

    serviceId,
    doctorId,

    serviceName,

    doctorName,
    specialization:
      raw?.specialization ||
      doctor?.specialization ||
      undefined,

    fullName:
      raw?.fullName ||
      raw?.patientName ||
      raw?.name ||
      "Unnamed Patient",

    email:
      raw?.email ||
      raw?.patientEmail ||
      "",

    phone:
      raw?.phone ||
      raw?.patientPhone ||
      "",

    date:
      raw?.date ||
      raw?.appointmentDate ||
      "",

    time:
      raw?.time ||
      raw?.appointmentTime ||
      undefined,

    notes:
      raw?.notes ||
      raw?.reason ||
      raw?.message ||
      undefined,

    reason:
      raw?.reason ||
      raw?.notes ||
      undefined,

    status: normalizeStatus(raw?.status),

    createdAt:
      raw?.createdAt ||
      new Date().toISOString(),

    updatedAt:
      raw?.updatedAt ||
      undefined,
  };
};

/* =========================================================
   COMPONENT
========================================================= */

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<string>("All");

  const [sourceFilter, setSourceFilter] =
    useState<string>("All");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  /* =======================================================
     LOAD APPOINTMENTS FROM DATABASE
  ======================================================= */

  const loadAppointments = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log(
          "Loading appointments from hospital database..."
        );

        const response =
          await api.get<AppointmentListResponse>(
            "/api/appointments"
          );

        console.log(
          "Appointments API response:",
          response.data
        );

        const result = response.data;

        let appointmentList: any[] = [];

        /*
         * Supports:
         *
         * [
         *   appointment,
         *   appointment
         * ]
         *
         * OR
         *
         * {
         *   data: [...]
         * }
         *
         * OR
         *
         * {
         *   appointments: [...]
         * }
         */

        if (Array.isArray(result)) {
          appointmentList = result;
        } else if (
          Array.isArray(result?.data)
        ) {
          appointmentList = result.data;
        } else if (
          Array.isArray(result?.appointments)
        ) {
          appointmentList =
            result.appointments;
        }

        const normalized =
          appointmentList
            .map(normalizeAppointment)
            .filter(
              (appointment) =>
                Boolean(appointment.id)
            );

        console.log(
          `Loaded ${normalized.length} appointment(s) from database.`
        );

        setAppointments(normalized);
      } catch (err: unknown) {
        console.error(
          "Failed to load appointments:",
          err
        );

        let message =
          "Unable to load appointments from the hospital database.";

        if (err instanceof Error && err.message) {
          message = err.message;
        }

        setAppointments([]);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* =======================================================
     INITIAL DATABASE LOAD
  ======================================================= */

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  /* =======================================================
     REFRESH WHEN PAGE BECOMES VISIBLE
  ======================================================= */

  useEffect(() => {
    const handleFocus = () => {
      loadAppointments();
    };

    window.addEventListener(
      "focus",
      handleFocus
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );
    };
  }, [loadAppointments]);

  /* =======================================================
     UPDATE APPOINTMENT STATUS IN DATABASE
  ======================================================= */

  const updateStatus = async (
    id: string,
    newStatus: Appointment["status"]
  ) => {
    if (!id) {
      console.error(
        "Cannot update appointment without ID."
      );
      return;
    }

    const previousAppointments =
      appointments;

    /*
     * Optimistic UI update.
     * The database is still updated immediately after.
     */
    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status: newStatus,
            }
          : appointment
      )
    );

    setUpdatingId(id);
    setError(null);

    try {
      console.log(
        `Updating appointment ${id} to ${newStatus}...`
      );

      const response =
        await api.patch<AppointmentUpdateResponse>(
          `/appointments/${encodeURIComponent(id)}`,
          {
            status: newStatus,
          }
        );

      console.log(
        "Appointment status updated:",
        response.data
      );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data.message ||
            response.data.error ||
            "Failed to update appointment status."
        );
      }

      /*
       * If backend returns the updated appointment,
       * use it so the frontend matches the database.
       */
      const updatedFromServer =
        response.data?.data ||
        response.data?.appointment;

      if (updatedFromServer) {
        const normalized =
          normalizeAppointment(
            updatedFromServer
          );

        setAppointments((current) =>
          current.map((appointment) =>
            appointment.id === id
              ? normalized
              : appointment
          )
        );
      }
    } catch (err: unknown) {
      console.error(
        "Failed to update appointment status:",
        err
      );

      /*
       * Database update failed.
       * Restore previous UI state.
       */
      setAppointments(
        previousAppointments
      );

      const message =
        err instanceof Error
          ? err.message
          : "Failed to update appointment status.";

      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  /* =======================================================
     DELETE APPOINTMENT FROM DATABASE
  ======================================================= */

  const deleteAppointment = async (
    id: string
  ) => {
    if (!id) {
      console.error(
        "Cannot delete appointment without ID."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this appointment record from the hospital database?"
    );

    if (!confirmed) return;

    const previousAppointments =
      appointments;

    setDeletingId(id);
    setError(null);

    /*
     * Remove immediately from UI.
     * If API fails, restore it.
     */
    setAppointments((current) =>
      current.filter(
        (appointment) =>
          appointment.id !== id
      )
    );

    try {
      console.log(
        `Deleting appointment ${id} from database...`
      );

      const response =
        await api.delete<AppointmentUpdateResponse>(
          `/appointments/${encodeURIComponent(id)}`
        );

      console.log(
        "Appointment deletion response:",
        response.data
      );

      if (
        response.data?.success === false
      ) {
        throw new Error(
          response.data.message ||
            response.data.error ||
            "Failed to delete appointment."
        );
      }
    } catch (err: unknown) {
      console.error(
        "Failed to delete appointment:",
        err
      );

      /*
       * Restore appointment because database deletion failed.
       */
      setAppointments(
        previousAppointments
      );

      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete appointment.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  /* =======================================================
     FILTER APPOINTMENTS
  ======================================================= */

  const filteredAppointments =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return appointments.filter(
        (appt) => {
          const matchesSearch =
            !query ||
            (appt.fullName || "")
              .toLowerCase()
              .includes(query) ||
            (appt.email || "")
              .toLowerCase()
              .includes(query) ||
            (appt.serviceName || "")
              .toLowerCase()
              .includes(query) ||
            (appt.doctorName || "")
              .toLowerCase()
              .includes(query) ||
            (appt.specialization || "")
              .toLowerCase()
              .includes(query) ||
            (appt.phone || "")
              .includes(searchQuery);

          const matchesStatus =
            statusFilter === "All" ||
            appt.status ===
              statusFilter;

          const matchesSource =
            sourceFilter === "All" ||
            appt.sourceType ===
              sourceFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesSource
          );
        }
      );
    }, [
      appointments,
      searchQuery,
      statusFilter,
      sourceFilter,
    ]);

  /* =======================================================
     METRICS
  ======================================================= */

  const totalBookings =
    appointments.length;

  const pendingBookings =
    appointments.filter(
      (a) => a.status === "Pending"
    ).length;

  const confirmedBookings =
    appointments.filter(
      (a) => a.status === "Confirmed"
    ).length;

  const completedBookings =
    appointments.filter(
      (a) => a.status === "Completed"
    ).length;

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date: string
  ) => {
    if (!date) return "";

    try {
      const parsed =
        new Date(date);

      if (
        Number.isNaN(
          parsed.getTime()
        )
      ) {
        return date;
      }

      return parsed.toLocaleDateString(
        "en-KE",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

      {/* =================================================
          ADMIN APPOINTMENTS HEADER
      ================================================= */}

      <header className="border-b border-white/10 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <LayoutDashboard
                size={20}
              />
            </div>

            <div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase block">
                Admin Portal
              </span>

              <h1 className="text-lg font-bold text-white">
                Appointments Manager
              </h1>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <Link
              to="/admin/services"
              className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Settings
                size={16}
              />
              <span>
                Manage Services
              </span>
            </Link>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:scale-105"
            >
              <span>
                View Website
              </span>
            </Link>

          </div>
        </div>
      </header>

      {/* =================================================
          MAIN CONTENT DASHBOARD
      ================================================= */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* =================================================
            DATABASE ERROR
        ================================================= */}

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-300 flex items-start gap-3">
            <AlertCircle
              size={18}
              className="shrink-0 mt-0.5"
            />

            <div className="flex-1">
              <p className="font-bold">
                Database operation failed
              </p>

              <p className="mt-1 text-xs text-rose-300/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                loadAppointments();
              }}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20"
            >
              Retry
            </button>
          </div>
        )}

        {/* =================================================
            METRIC SUMMARY CARDS
        ================================================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-extrabold text-white">
              {totalBookings}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Pending Review
            </p>

            <p className="mt-2 text-3xl font-extrabold text-amber-300">
              {pendingBookings}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-extrabold text-cyan-300">
              {confirmedBookings}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-extrabold text-emerald-300">
              {completedBookings}
            </p>
          </div>

        </div>

        {/* =================================================
            TOOLBAR FILTER & SEARCH
        ================================================= */}

        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/10 rounded-3xl p-5 backdrop-blur-xl">

          <div className="relative w-full lg:w-80">

            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={16} />
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search patient, doctor, or service..."
              className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition focus:border-cyan-400"
            />

          </div>

          <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

            {/* SOURCE FILTER */}

            <div className="flex items-center gap-2">

              <span className="text-xs text-slate-400 font-medium">
                Source:
              </span>

              {[
                {
                  label: "All",
                  value: "All",
                },
                {
                  label: "Services",
                  value: "service",
                },
                {
                  label: "Doctors",
                  value: "doctor",
                },
              ].map((src) => (
                <button
                  key={src.value}
                  type="button"
                  onClick={() =>
                    setSourceFilter(
                      src.value
                    )
                  }
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                    sourceFilter ===
                    src.value
                      ? "bg-fuchsia-500 text-slate-950 shadow-lg shadow-fuchsia-500/20"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {src.label}
                </button>
              ))}

            </div>

            {/* STATUS FILTER */}

            <div className="flex items-center gap-2">

              <span className="text-xs text-slate-400 font-medium">
                Status:
              </span>

              {[
                "All",
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled",
              ].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        status
                      )
                    }
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                      statusFilter ===
                      status
                        ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                        : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}

            </div>

          </div>
        </div>

        {/* =================================================
            APPOINTMENTS TABLE / LIST
        ================================================= */}

        <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl overflow-hidden shadow-2xl">

          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">

            <h2 className="font-bold text-white flex items-center gap-2 text-sm sm:text-base">
              <Calendar
                size={18}
                className="text-cyan-400"
              />

              All Appointment Requests
            </h2>

            <div className="flex items-center gap-3">

              {isLoading && (
                <Loader2
                  size={16}
                  className="animate-spin text-cyan-400"
                />
              )}

              <span className="font-mono text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full">
                {filteredAppointments.length}{" "}
                Records Found
              </span>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {isLoading ? (
            <div className="p-16 text-center">

              <Loader2
                size={42}
                className="mx-auto text-cyan-400 animate-spin mb-4"
              />

              <p className="font-bold text-white">
                Loading appointments...
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Reading appointment records from
                the hospital database.
              </p>

            </div>
          ) : filteredAppointments.length ===
            0 ? (
            /* =================================================
               EMPTY
            ================================================= */

            <div className="p-16 text-center">

              <AlertCircle
                size={40}
                className="mx-auto text-cyan-400 mb-3 animate-bounce"
              />

              <p className="font-bold text-white">
                No appointment bookings found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Appointments booked from Medical
                Services or Individual Doctors will
                appear here.
              </p>

            </div>
          ) : (
            /* =================================================
               APPOINTMENT RECORDS
            ================================================= */

            <div className="divide-y divide-white/10">

              {filteredAppointments.map(
                (appt, idx) => (
                  <div
                    key={
                      appt.id ||
                      `appt-${idx}`
                    }
                    className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition hover:bg-white/[0.04]"
                  >

                    {/* =====================================
                        PATIENT & BOOKING DETAILS
                    ===================================== */}

                    <div className="space-y-2 min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <User
                            size={16}
                            className="text-cyan-400"
                          />

                          {appt.fullName ||
                            "Unnamed Patient"}
                        </h3>

                        {/* SOURCE BADGE */}

                        <span
                          className={`inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-full border ${
                            appt.sourceType ===
                            "doctor"
                              ? "text-cyan-300 bg-cyan-950/80 border-cyan-500/30"
                              : "text-fuchsia-300 bg-fuchsia-950/80 border-fuchsia-500/30"
                          }`}
                        >

                          {appt.sourceType ===
                          "doctor" ? (
                            <Stethoscope
                              size={12}
                            />
                          ) : (
                            <Calendar
                              size={12}
                            />
                          )}

                          {appt.sourceType ===
                          "doctor"
                            ? `Doctor: ${
                                appt.doctorName ||
                                appt.serviceName ||
                                "Specialist"
                              }`
                            : `Service: ${
                                appt.serviceName ||
                                "General"
                              }`}

                        </span>

                        {/* STATUS */}

                        <span
                          className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                            appt.status ===
                            "Pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : appt.status ===
                                "Confirmed"
                              ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                              : appt.status ===
                                "Completed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {appt.status ||
                            "Pending"}
                        </span>

                      </div>

                      {/* SPECIALIZATION */}

                      {appt.sourceType ===
                        "doctor" &&
                        appt.specialization && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Stethoscope
                              size={14}
                              className="text-cyan-400"
                            />

                            {
                              appt.specialization
                            }
                          </div>
                        )}

                      {/* CONTACT / DATE */}

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">

                        {appt.email && (
                          <span className="flex items-center gap-1.5">
                            <Mail
                              size={14}
                              className="text-slate-400"
                            />

                            {appt.email}
                          </span>
                        )}

                        {appt.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone
                              size={14}
                              className="text-slate-400"
                            />

                            {appt.phone}
                          </span>
                        )}

                        {appt.date && (
                          <span className="flex items-center gap-1.5">
                            <Calendar
                              size={14}
                              className="text-cyan-400"
                            />

                            {formatDate(
                              appt.date
                            )}
                          </span>
                        )}

                        {appt.time && (
                          <span className="flex items-center gap-1.5">
                            <Clock
                              size={14}
                              className="text-cyan-400"
                            />

                            {appt.time}
                          </span>
                        )}

                      </div>

                      {/* NOTES */}

                      {(appt.notes ||
                        appt.reason) && (
                        <p className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-xl p-3 mt-2 flex items-start gap-2">

                          <FileText
                            size={14}
                            className="text-fuchsia-400 shrink-0 mt-0.5"
                          />

                          <span>
                            {appt.notes ||
                              appt.reason}
                          </span>

                        </p>
                      )}

                      {/* CREATED DATE */}

                      {appt.createdAt && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Created:{" "}
                          {formatDate(
                            appt.createdAt
                          )}
                        </p>
                      )}

                    </div>

                    {/* =====================================
                        ACTIONS & STATUS CHANGER
                    ===================================== */}

                    <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">

                      <select
                        value={
                          appt.status ||
                          "Pending"
                        }
                        disabled={
                          updatingId ===
                            appt.id ||
                          deletingId ===
                            appt.id
                        }
                        onChange={(e) =>
                          updateStatus(
                            appt.id,
                            e.target
                              .value as Appointment["status"]
                          )
                        }
                        className="rounded-xl border border-white/20 bg-slate-900 px-3 py-2 text-xs font-bold text-white outline-none transition focus:border-cyan-400 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirm
                        </option>

                        <option value="Completed">
                          Complete
                        </option>

                        <option value="Cancelled">
                          Cancel
                        </option>
                      </select>

                      {updatingId ===
                        appt.id && (
                        <Loader2
                          size={16}
                          className="animate-spin text-cyan-400"
                        />
                      )}

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          appt.id
                        }
                        onClick={() =>
                          deleteAppointment(
                            appt.id
                          )
                        }
                        className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400 transition disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete appointment"
                      >
                        {deletingId ===
                        appt.id ? (
                          <Loader2
                            size={16}
                            className="animate-spin"
                          />
                        ) : (
                          <Trash2
                            size={16}
                          />
                        )}
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}






