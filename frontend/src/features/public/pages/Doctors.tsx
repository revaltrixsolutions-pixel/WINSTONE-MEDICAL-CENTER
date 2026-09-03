import {
  Sparkles,
  Stethoscope,
  X,
  Layers,
  Calendar,
  MessageSquare,
  Star,
  Send,
  CheckCircle2,
  Loader2,
  Phone,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  getDoctors,
  type Doctor,
} from "@/api/doctors";

import {
  createAppointment,
  type Appointment,
} from "@/api/appointments";

/* =========================================================
   TYPES
   ========================================================= */



/* =========================================================
   COMPONENT
   ========================================================= */

export default function HomepageDoctorsGrid() {
  /* =======================================================
     DOCTORS
     ======================================================= */

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorError, setDoctorError] = useState("");

  /* =======================================================
     SELECTED DOCTOR
     ======================================================= */

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [activeModalTab, setActiveModalTab] = useState<
    "profile" | "message" | "rate" | "book"
  >("profile");

  /* =======================================================
     MESSAGE
     ======================================================= */

  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  /* =======================================================
     RATING
     ======================================================= */

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratedSuccess, setRatedSuccess] = useState(false);
  const [submittingRating, setSubmittingRating] = useState(false);

  /* =======================================================
     BOOKING
     ======================================================= */

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentReason, setAppointmentReason] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  /* =======================================================
     LOAD REAL DOCTORS FROM DATABASE
     ======================================================= */

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoadingDoctors(true);
      setDoctorError("");

      const result = await getDoctors();

      /*
       * Only doctors returned by the backend are displayed.
       * No fallback/placeholder doctors are created here.
       */

      setDoctors(result.filter((doctor) => doctor.active));
    } catch (error) {
      console.error("Failed to load doctors:", error);

      setDoctors([]);

      setDoctorError(
        error instanceof Error
          ? error.message
          : "Unable to load doctors from the database."
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  /* =======================================================
     OPEN DOCTOR
     ======================================================= */

  const openDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);

    setActiveImageIndex(0);
    setActiveModalTab("profile");

    setMessageText("");
    setMessageSent(false);

    setRating(5);
    setHoverRating(0);
    setRatedSuccess(false);

    resetBookingForm();
  };

  /* =======================================================
     RESET BOOKING FORM
     ======================================================= */

  const resetBookingForm = () => {
    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
    setAppointmentNotes("");

    setBookingSuccess(false);
    setBookingError("");
  };

  /* =======================================================
     CLOSE MODAL
     ======================================================= */

  const closeDoctorModal = () => {
    setSelectedDoctor(null);
    setActiveImageIndex(0);
    setActiveModalTab("profile");

    setMessageText("");
    setMessageSent(false);

    setRating(5);
    setHoverRating(0);
    setRatedSuccess(false);

    resetBookingForm();
  };

  /* =======================================================
     SEND MESSAGE
     ======================================================= */

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor) return;

    if (!messageText.trim()) {
      alert("Please enter your message.");
      return;
    }

    try {
      setSendingMessage(true);

      /*
       * This must point to your backend message endpoint.
       *
       * Nothing is stored in localStorage.
       */

      const response = await fetch("/api/doctors/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          messageText: messageText.trim(),
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to send message."
        );
      }

      setMessageSent(true);

      setTimeout(() => {
        setMessageText("");
        setMessageSent(false);
        setActiveModalTab("profile");
      }, 2200);
    } catch (error) {
      console.error("Failed to send doctor message:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to send message."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  /* =======================================================
     RATE DOCTOR
     ======================================================= */

  const handleRateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDoctor) return;

    try {
      setSubmittingRating(true);

      /*
       * Rating goes directly to backend/database.
       */

      const response = await fetch("/api/doctors/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          doctorName: selectedDoctor.name,
          rating,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to submit rating."
        );
      }

      setRatedSuccess(true);

      setTimeout(() => {
        setRatedSuccess(false);
        setActiveModalTab("profile");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit doctor rating:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit rating."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  /* =======================================================
     BOOK APPOINTMENT
     ======================================================= */

  const handleBookAppointment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedDoctor) return;

    setBookingError("");

    if (!patientName.trim()) {
      setBookingError("Please enter your full name.");
      return;
    }

    if (!patientPhone.trim()) {
      setBookingError("Please enter your phone number.");
      return;
    }

    if (!appointmentDate) {
      setBookingError("Please select your preferred appointment date.");
      return;
    }

    if (!appointmentTime) {
      setBookingError("Please select your preferred appointment time.");
      return;
    }

    if (!appointmentReason.trim()) {
      setBookingError(
        "Please tell us briefly why you want to see the doctor."
      );
      return;
    }

    try {
      setBookingLoading(true);

      /*
       * REAL DATABASE REQUEST
       *
       * POST /api/appointments
       *
       * The backend creates the appointment in PostgreSQL.
       */

      const appointment: Appointment = await createAppointment({
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim() || undefined,

        doctorId: selectedDoctor.id,

        appointmentDate,
        appointmentTime,

        reason: appointmentReason.trim(),

        notes: appointmentNotes.trim() || undefined,

        priority: "NORMAL",
      });

      console.log(
        "Appointment successfully created:",
        appointment
      );

      setBookingSuccess(true);

      /*
       * Clear form after successful database submission.
       */

      setPatientName("");
      setPatientPhone("");
      setPatientEmail("");
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentReason("");
      setAppointmentNotes("");

      /*
       * Keep success message visible briefly.
       */

      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDoctor(null);
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to create appointment:",
        error
      );

      setBookingError(
        error instanceof Error
          ? error.message
          : "Unable to submit appointment request."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  /* =======================================================
     IMAGES
     ======================================================= */

  const getDoctorImages = (doctor: Doctor): string[] => {
    if (!Array.isArray(doctor.imageUrls)) {
      return [];
    }

    return doctor.imageUrls.filter(
      (url) => typeof url === "string" && url.trim() !== ""
    );
  };

  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section
      id="doctors"
      className="bg-slate-50 py-24 sm:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="max-w-2xl text-center mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 border border-blue-200">
            <Sparkles size={14} />

            Available Medical Specialists
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Meet Our Expert Healthcare Team
          </h2>

          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Browse our available medical specialists. View their
            profiles, send a message, rate their service, or request
            an appointment directly.
          </p>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loadingDoctors && (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <Loader2
              size={42}
              className="mx-auto text-blue-600 animate-spin mb-4"
            />

            <h3 className="text-xl font-bold text-slate-900">
              Loading our medical specialists...
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Getting the latest doctor profiles from our database.
            </p>
          </div>
        )}

        {/* =================================================
            DATABASE ERROR
        ================================================= */}

        {!loadingDoctors && doctorError && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
            <Stethoscope
              size={42}
              className="mx-auto text-rose-500 mb-4"
            />

            <h3 className="text-xl font-bold text-rose-900">
              Unable to load doctors
            </h3>

            <p className="mt-2 text-sm text-rose-700">
              {doctorError}
            </p>

            <button
              type="button"
              onClick={loadDoctors}
              className="mt-5 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =================================================
            NO DOCTORS
        ================================================= */}

        {!loadingDoctors &&
          !doctorError &&
          doctors.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
              <Stethoscope
                size={48}
                className="mx-auto text-blue-600 mb-4"
              />

              <h3 className="text-xl font-bold text-slate-900">
                No specialist doctors available right now
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are currently no active doctors published
                by the hospital.
              </p>
            </div>
          )}

        {/* =================================================
            DOCTOR GRID
        ================================================= */}

        {!loadingDoctors &&
          !doctorError &&
          doctors.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => {
                const images = getDoctorImages(doctor);

                return (
                  <div
                    key={doctor.id}
                    onClick={() => openDoctor(doctor)}
                    className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* -----------------------------------
                          IMAGE
                      ----------------------------------- */}

                      <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                        {images.length > 0 ? (
                          <img
                            src={images[0]}
                            alt={doctor.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-slate-100">
                            <Stethoscope
                              size={60}
                              className="text-slate-300"
                            />
                          </div>
                        )}

                        {images.length > 1 && (
                          <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-white flex items-center gap-1">
                            <Layers size={12} />

                            {images.length} photos
                          </span>
                        )}
                      </div>

                      {/* -----------------------------------
                          DETAILS
                      ----------------------------------- */}

                      <div className="p-6 text-center">
                        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 mb-2 border border-blue-100">
                          {doctor.specialization}
                        </span>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {doctor.name}
                        </h3>

                        {doctor.qualification && (
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {doctor.qualification}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {doctor.bio ||
                            "Medical practitioner providing professional healthcare services."}
                        </p>
                      </div>
                    </div>

                    {/* -----------------------------------
                        ACTION
                    ----------------------------------- */}

                    <div className="px-6 pb-6 pt-0 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:underline">
                        View Full Profile & Options â†’
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* ===================================================
          DOCTOR MODAL
      =================================================== */}

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden my-auto max-h-[92vh] flex flex-col">

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="pr-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {selectedDoctor.specialization}
                </span>

                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {selectedDoctor.name}
                </h3>

                {selectedDoctor.qualification && (
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {selectedDoctor.qualification}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeDoctorModal}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className="flex items-center gap-2 border-b border-slate-100 py-3 shrink-0 overflow-x-auto">
              {[
                ["profile", "Full Profile"],
                ["message", "Message Doctor"],
                ["rate", "Rate Doctor"],
                ["book", "Book Appointment"],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() =>
                    setActiveModalTab(
                      tab as
                        | "profile"
                        | "message"
                        | "rate"
                        | "book"
                    )
                  }
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    activeModalTab === tab
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* =================================================
                MODAL CONTENT
            ================================================= */}

            <div className="mt-4 space-y-5 overflow-y-auto pr-1 flex-1">

              {/* =================================================
                  PROFILE
              ================================================= */}

              {activeModalTab === "profile" && (
                <div className="space-y-4">
                  {(() => {
                    const images = getDoctorImages(
                      selectedDoctor
                    );

                    return (
                      <>
                        {images.length > 0 && (
                          <>
                            <div className="w-full rounded-2xl border border-slate-200 bg-slate-950 overflow-hidden shadow-md flex items-center justify-center p-2">
                              <img
                                src={images[activeImageIndex]}
                                alt={selectedDoctor.name}
                                className="w-full h-auto max-h-[40vh] object-contain rounded-xl"
                              />
                            </div>

                            {images.length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((image, index) => (
                                  <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() =>
                                      setActiveImageIndex(index)
                                    }
                                    className={`h-12 w-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                                      activeImageIndex === index
                                        ? "border-blue-600 scale-105 shadow-sm"
                                        : "border-slate-200 opacity-60 hover:opacity-100"
                                    }`}
                                  >
                                    <img
                                      src={image}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </>
                    );
                  })()}

                  {/* CONTACT */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDoctor.phone && (
                      <a
                        href={`tel:${selectedDoctor.phone}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-blue-50 transition"
                      >
                        <Phone
                          size={18}
                          className="text-blue-600"
                        />

                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            Phone
                          </p>

                          <p className="text-sm font-semibold text-slate-700">
                            {selectedDoctor.phone}
                          </p>
                        </div>
                      </a>
                    )}

                    {selectedDoctor.email && (
                      <a
                        href={`mailto:${selectedDoctor.email}`}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 hover:bg-blue-50 transition"
                      >
                        <Mail
                          size={18}
                          className="text-blue-600"
                        />

                        <div className="min-w-0">
                          <p className="text-[10px] uppercase font-bold text-slate-400">
                            Email
                          </p>

                          <p className="text-sm font-semibold text-slate-700 truncate">
                            {selectedDoctor.email}
                          </p>
                        </div>
                      </a>
                    )}
                  </div>

                  {/* BIO */}

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Biography & Background
                    </h4>

                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      {selectedDoctor.bio ||
                        "No biography provided."}
                    </p>
                  </div>

                  {/* ACTIONS */}

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab("book")
                      }
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                    >
                      <Calendar size={16} />

                      Book Appointment
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab("message")
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
                    >
                      <MessageSquare
                        size={16}
                        className="text-blue-600"
                      />

                      Message
                    </button>
                  </div>
                </div>
              )}

              {/* =================================================
                  MESSAGE
              ================================================= */}

              {activeModalTab === "message" && (
                <div className="space-y-4">
                  {messageSent ? (
                    <div className="py-12 text-center space-y-3">
                      <CheckCircle2
                        size={42}
                        className="mx-auto text-emerald-500 animate-bounce"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Message Sent Successfully!
                      </h4>

                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        Your message has been securely submitted
                        to the hospital team.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSendMessage}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          Send a Message to{" "}
                          {selectedDoctor.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          Ask a general inquiry or request
                          follow-up assistance.
                        </p>
                      </div>

                      <textarea
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value)
                        }
                        placeholder="Type your message here..."
                        rows={6}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                        required
                      />

                      <button
                        type="submit"
                        disabled={sendingMessage}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {sendingMessage ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />

                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} />

                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* =================================================
                  RATING
              ================================================= */}

              {activeModalTab === "rate" && (
                <div className="space-y-4 text-center py-4">
                  {ratedSuccess ? (
                    <div className="space-y-3">
                      <CheckCircle2
                        size={42}
                        className="mx-auto text-emerald-500 animate-bounce"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Thank You for Your Feedback!
                      </h4>

                      <p className="text-xs text-slate-600">
                        Your rating has been submitted.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleRateDoctor}
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          Rate {selectedDoctor.name}
                        </h4>

                        <p className="text-xs text-slate-500 mt-1">
                          Select your rating.
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRating(star)
                              }
                              onMouseEnter={() =>
                                setHoverRating(star)
                              }
                              onMouseLeave={() =>
                                setHoverRating(0)
                              }
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                size={32}
                                className={`${
                                  (hoverRating ||
                                    rating) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                } transition-colors`}
                              />
                            </button>
                          )
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={submittingRating}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {submittingRating ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />

                            Submitting...
                          </>
                        ) : (
                          <>
                            <Star
                              size={16}
                              className="fill-white"
                            />

                            Submit {rating}-Star Rating
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* =================================================
                  BOOK APPOINTMENT
              ================================================= */}

              {activeModalTab === "book" && (
                <div className="space-y-4">
                  {bookingSuccess ? (
                    <div className="py-12 text-center space-y-3">
                      <CheckCircle2
                        size={48}
                        className="mx-auto text-emerald-500 animate-bounce"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Appointment Request Submitted!
                      </h4>

                      <p className="text-sm text-slate-600 max-w-sm mx-auto">
                        Your appointment request with{" "}
                        <strong>
                          {selectedDoctor.name}
                        </strong>{" "}
                        has been saved successfully. The
                        hospital team will contact you to
                        confirm the appointment.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleBookAppointment}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">
                          Book Appointment with{" "}
                          {selectedDoctor.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          Complete the information below.
                          Your request will be saved directly
                          to the hospital database.
                        </p>
                      </div>

                      {/* ERROR */}

                      {bookingError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                          {bookingError}
                        </div>
                      )}

                      {/* NAME */}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Full Name{" "}
                          <span className="text-rose-500">
                            *
                          </span>
                        </label>

                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) =>
                            setPatientName(e.target.value)
                          }
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* PHONE */}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Phone Number{" "}
                          <span className="text-rose-500">
                            *
                          </span>
                        </label>

                        <input
                          type="tel"
                          value={patientPhone}
                          onChange={(e) =>
                            setPatientPhone(e.target.value)
                          }
                          placeholder="+254 700 000 000"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* EMAIL */}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) =>
                            setPatientEmail(e.target.value)
                          }
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      {/* DATE + TIME */}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Preferred Date{" "}
                            <span className="text-rose-500">
                              *
                            </span>
                          </label>

                          <input
                            type="date"
                            value={appointmentDate}
                            min={
                              new Date()
                                .toISOString()
                                .split("T")[0]
                            }
                            onChange={(e) =>
                              setAppointmentDate(
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Preferred Time{" "}
                            <span className="text-rose-500">
                              *
                            </span>
                          </label>

                          <input
                            type="time"
                            value={appointmentTime}
                            onChange={(e) =>
                              setAppointmentTime(
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* =================================================
                          REASON FIELD
                      ================================================= */}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Reason for Appointment{" "}
                          <span className="text-rose-500">
                            *
                          </span>
                        </label>

                        <textarea
                          value={appointmentReason}
                          onChange={(e) =>
                            setAppointmentReason(
                              e.target.value
                            )
                          }
                          placeholder="Briefly tell us why you would like to see this doctor..."
                          rows={4}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* ADDITIONAL NOTES */}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Additional Notes
                        </label>

                        <textarea
                          value={appointmentNotes}
                          onChange={(e) =>
                            setAppointmentNotes(
                              e.target.value
                            )
                          }
                          placeholder="Anything else the hospital should know?"
                          rows={3}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      {/* SUBMIT */}

                      <button
                        type="submit"
                        disabled={bookingLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                      >
                        {bookingLoading ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />

                            Saving Appointment...
                          </>
                        ) : (
                          <>
                            <Calendar size={17} />

                            Submit Appointment Request
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={closeDoctorModal}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("book")
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
              >
                <Calendar size={14} />

                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}




