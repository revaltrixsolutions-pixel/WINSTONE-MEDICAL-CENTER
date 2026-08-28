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
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import { createAppointment } from "@/api/appointments";

/* =========================================================
   TYPES
========================================================= */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification?: string;
  phone?: string;
  email?: string;
  bio?: string;
  imageUrls?: string[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientMessage {
  id: string;
  doctorId: string;
  doctorName: string;
  messageText: string;
  date: string;
  createdAt?: string;
}

export interface DoctorRating {
  id: string;
  doctorId: string;
  doctorName: string;
  rating: number;
  date: string;
  createdAt?: string;
}

/* =========================================================
   API RESPONSE TYPES
========================================================= */

interface MessageResponse {
  success?: boolean;
  message?: string;
  data?: PatientMessage;
  error?: string;
}

interface RatingResponse {
  success?: boolean;
  message?: string;
  data?: DoctorRating;
  error?: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, "");

const DEFAULT_DOCTOR_IMAGE =
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop";

/* =========================================================
   HELPERS
========================================================= */

/**
 * Convert database image paths into browser-accessible URLs.
 *
 * Database example:
 * /uploads/doctors/image.jpg
 *
 * Browser URL:
 * http://localhost:5000/uploads/doctors/image.jpg
 *
 * Full external URLs and data URLs are returned unchanged.
 */
const getDoctorImageUrl = (imageUrl: string): string => {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:")
  ) {
    return imageUrl;
  }

  if (imageUrl.startsWith("/")) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}/${imageUrl}`;
};

/**
 * Safely extract a useful error message from an Axios/backend error.
 */
const getApiErrorMessage = (
  error: unknown,
  fallback: string
): string => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
    ).response;

    const backendMessage =
      response?.data?.message ||
      response?.data?.error;

    if (backendMessage) {
      return backendMessage;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

/* =========================================================
   COMPONENT
========================================================= */

export default function HomepageDoctors() {
  /* =======================================================
     DOCTORS STATE
  ======================================================= */

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] =
    useState(true);
  const [doctorsError, setDoctorsError] =
    useState<string | null>(null);

  /* =======================================================
     SELECTED DOCTOR / MODAL STATE
  ======================================================= */

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [activeImageIndex, setActiveImageIndex] =
    useState(0);

  const [activeModalTab, setActiveModalTab] = useState<
    "profile" | "message" | "rate" | "book"
  >("profile");

  /* =======================================================
     MESSAGE STATE
  ======================================================= */

  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [isSendingMessage, setIsSendingMessage] =
    useState(false);
  const [messageError, setMessageError] =
    useState<string | null>(null);

  /* =======================================================
     RATING STATE
  ======================================================= */

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratedSuccess, setRatedSuccess] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] =
    useState(false);
  const [ratingError, setRatingError] =
    useState<string | null>(null);

  /* =======================================================
     APPOINTMENT STATE
  ======================================================= */

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [appointmentDate, setAppointmentDate] =
    useState("");
  const [appointmentTime, setAppointmentTime] =
    useState("");
  const [appointmentReason, setAppointmentReason] =
    useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] =
    useState(false);
  const [bookingError, setBookingError] =
    useState<string | null>(null);

  /* =======================================================
     CAROUSEL
  ======================================================= */

  const scrollRef = useRef<HTMLDivElement>(null);

  /* =======================================================
     LOAD REAL DOCTORS FROM DATABASE
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const loadDoctors = async () => {
      if (!isMounted) {
        return;
      }

      setIsLoadingDoctors(true);
      setDoctorsError(null);

      try {
        console.log(
          "================================================="
        );
        console.log(
          "Loading doctors from PostgreSQL..."
        );
        console.log(
          "Doctors API:",
          `${API_BASE_URL}/doctors`
        );

        const response = await api.get("/doctors");

        const result = response.data;

        /*
         * Supported backend response formats:
         *
         * 1. Direct array:
         * [
         *   {
         *     id,
         *     name,
         *     specialization
         *   }
         * ]
         *
         * 2. Wrapped:
         * {
         *   data: [...]
         * }
         *
         * 3. Wrapped:
         * {
         *   doctors: [...]
         * }
         */

        let doctorList: Doctor[] = [];

        if (Array.isArray(result)) {
          doctorList = result;
        } else if (Array.isArray(result?.data)) {
          doctorList = result.data;
        } else if (
          Array.isArray(result?.doctors)
        ) {
          doctorList = result.doctors;
        }

        const normalizedDoctors: Doctor[] =
          doctorList.map((doctor) => ({
            ...doctor,
            imageUrls: Array.isArray(
              doctor.imageUrls
            )
              ? doctor.imageUrls
              : [],
            active: doctor.active !== false,
          }));

        console.log(
          `Loaded ${normalizedDoctors.length} doctor(s) from PostgreSQL.`
        );

        if (isMounted) {
          setDoctors(normalizedDoctors);
        }
      } catch (error: unknown) {
        console.error(
          "Failed to load doctors from PostgreSQL:",
          error
        );

        const message = getApiErrorMessage(
          error,
          "Unable to load doctors from the hospital database."
        );

        if (isMounted) {
          setDoctors([]);
          setDoctorsError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingDoctors(false);
        }
      }
    };

    loadDoctors();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =======================================================
     CAROUSEL SCROLL
  ======================================================= */

  const scroll = (
    direction: "left" | "right"
  ) => {
    if (!scrollRef.current) {
      return;
    }

    const {
      scrollLeft,
      clientWidth,
    } = scrollRef.current;

    const scrollAmount = clientWidth * 0.75;

    scrollRef.current.scrollTo({
      left:
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount,
      behavior: "smooth",
    });
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
    setMessageError(null);

    setRating(5);
    setHoverRating(0);
    setRatedSuccess(false);
    setRatingError(null);

    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
    setBookingSuccess(false);
    setBookingError(null);
  };

  /* =======================================================
     CLOSE DOCTOR MODAL
  ======================================================= */

  const closeDoctor = () => {
    if (
      isSubmitting ||
      isSendingMessage ||
      isSubmittingRating
    ) {
      return;
    }

    setSelectedDoctor(null);
    setActiveImageIndex(0);
    setActiveModalTab("profile");

    setMessageText("");
    setMessageSent(false);
    setMessageError(null);

    setRating(5);
    setHoverRating(0);
    setRatedSuccess(false);
    setRatingError(null);

    setPatientName("");
    setPatientPhone("");
    setPatientEmail("");
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentReason("");
    setBookingSuccess(false);
    setBookingError(null);
  };

  /* =======================================================
     SEND MESSAGE TO DATABASE
  ======================================================= */

  const handleSendMessage = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    const trimmedMessage =
      messageText.trim();

    if (!trimmedMessage) {
      setMessageError(
        "Please enter your message."
      );
      return;
    }

    setMessageError(null);
    setIsSendingMessage(true);

    try {
      console.log(
        "Sending doctor message to database..."
      );

      console.log(
        "Doctor ID:",
        selectedDoctor.id
      );

      /*
       * This sends the message to:
       *
       * POST /api/doctors/:doctorId/messages
       *
       * The backend must save this data using Prisma.
       */

      const response =
        await api.post<MessageResponse>(
          `/doctors/${encodeURIComponent(
            selectedDoctor.id
          )}/messages`,
          {
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            messageText: trimmedMessage,
            date: new Date().toISOString(),
          }
        );

      if (response.data.success === false) {
        throw new Error(
          response.data.message ||
            response.data.error ||
            "Failed to send message."
        );
      }

      console.log(
        "Doctor message successfully saved."
      );

      setMessageSent(true);

      window.setTimeout(() => {
        setMessageSent(false);
        setMessageText("");
        setActiveModalTab("profile");
      }, 2200);
    } catch (error: unknown) {
      console.error(
        "Send doctor message error:",
        error
      );

      setMessageError(
        getApiErrorMessage(
          error,
          "Failed to send your message."
        )
      );
    } finally {
      setIsSendingMessage(false);
    }
  };

  /* =======================================================
     RATE DOCTOR
  ======================================================= */

  const handleRateDoctor = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {
      setRatingError(
        "Please select a rating between 1 and 5 stars."
      );
      return;
    }

    setRatingError(null);
    setIsSubmittingRating(true);

    try {
      console.log(
        "Submitting doctor rating to database..."
      );

      console.log(
        "Doctor ID:",
        selectedDoctor.id
      );

      /*
       * This sends:
       *
       * POST /api/doctors/:doctorId/ratings
       *
       * The backend must save the rating to PostgreSQL.
       */

      const response =
        await api.post<RatingResponse>(
          `/doctors/${encodeURIComponent(
            selectedDoctor.id
          )}/ratings`,
          {
            doctorId: selectedDoctor.id,
            doctorName: selectedDoctor.name,
            rating,
            date: new Date().toISOString(),
          }
        );

      if (response.data.success === false) {
        throw new Error(
          response.data.message ||
            response.data.error ||
            "Failed to submit rating."
        );
      }

      console.log(
        "Doctor rating successfully saved."
      );

      setRatedSuccess(true);

      window.setTimeout(() => {
        setRatedSuccess(false);
        setActiveModalTab("profile");
      }, 2000);
    } catch (error: unknown) {
      console.error(
        "Rate doctor error:",
        error
      );

      setRatingError(
        getApiErrorMessage(
          error,
          "Failed to submit your rating."
        )
      );
    } finally {
      setIsSubmittingRating(false);
    }
  };

  /* =======================================================
     BOOK APPOINTMENT
  ======================================================= */

  const handleBookAppointment = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setBookingError(null);

    if (!selectedDoctor) {
      setBookingError(
        "Please select a doctor."
      );
      return;
    }

    if (!patientName.trim()) {
      setBookingError(
        "Please enter your full name."
      );
      return;
    }

    if (!patientPhone.trim()) {
      setBookingError(
        "Please enter your phone number."
      );
      return;
    }

    if (!appointmentDate) {
      setBookingError(
        "Please select your preferred appointment date."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(
        "================================================="
      );
      console.log(
        "Submitting appointment to database..."
      );

      console.log(
        "Doctor ID:",
        selectedDoctor.id
      );

      console.log(
        "Patient:",
        patientName.trim()
      );

      console.log(
        "Phone:",
        patientPhone.trim()
      );

      console.log(
        "Date:",
        appointmentDate
      );

      console.log(
        "Time:",
        appointmentTime || "Not specified"
      );

      /*
       * createAppointment() sends the appointment
       * to your backend appointment API.
       *
       * The backend must then create the record
       * in PostgreSQL through Prisma.
       */

      await createAppointment({
        doctorId: selectedDoctor.id,

        patientName:
          patientName.trim(),

        patientPhone:
          patientPhone.trim(),

        patientEmail:
          patientEmail.trim() || undefined,

        appointmentDate,

        appointmentTime:
          appointmentTime || undefined,

        reason:
          appointmentReason.trim() ||
          undefined,

        notes:
          appointmentReason.trim() ||
          undefined,

        priority: "NORMAL",
      });

      console.log(
        "Appointment successfully saved."
      );

      setBookingSuccess(true);

      window.setTimeout(() => {
        setBookingSuccess(false);

        setPatientName("");
        setPatientPhone("");
        setPatientEmail("");
        setAppointmentDate("");
        setAppointmentTime("");
        setAppointmentReason("");

        setSelectedDoctor(null);
        setActiveModalTab("profile");
      }, 2500);
    } catch (error: unknown) {
      console.error(
        "Create appointment error:",
        error
      );

      setBookingError(
        getApiErrorMessage(
          error,
          "Unable to submit your appointment request."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     ACTIVE DOCTORS
  ======================================================= */

  const activeDoctors =
    doctors.filter(
      (doctor) => doctor.active
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="doctors"
      className="overflow-hidden bg-slate-50 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="mx-auto max-w-2xl text-center md:mx-0 md:text-left">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600">
              <Sparkles size={14} />
              Available Medical Specialists
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meet Our Expert Healthcare Team
            </h2>

            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Browse our medical specialists, view their profiles,
              send a message, rate their service, or request an
              appointment directly.
            </p>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-100"
              title="Scroll Left"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:bg-slate-100"
              title="Scroll Right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoadingDoctors && (
          <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <Loader2
              size={42}
              className="mx-auto mb-4 animate-spin text-blue-600"
            />

            <h3 className="text-xl font-bold text-slate-900">
              Loading our doctors...
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Getting the latest doctor information from the
              hospital database.
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {!isLoadingDoctors &&
          doctorsError && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center">
              <Stethoscope
                size={42}
                className="mx-auto mb-4 text-rose-500"
              />

              <h3 className="text-xl font-bold text-slate-900">
                Unable to load doctors
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm text-rose-600">
                {doctorsError}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                Please make sure the backend is running and the
                doctors API is available.
              </p>
            </div>
          )}

        {/* =================================================
            NO DOCTORS
        ================================================= */}

        {!isLoadingDoctors &&
          !doctorsError &&
          activeDoctors.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
              <Stethoscope
                size={48}
                className="mx-auto mb-4 text-blue-600"
              />

              <h3 className="text-xl font-bold text-slate-900">
                No specialist doctors available right now
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Our doctor listings will appear here once they are
                added to the hospital database.
              </p>
            </div>
          )}

        {/* =================================================
            DOCTOR CARDS
        ================================================= */}

        {!isLoadingDoctors &&
          activeDoctors.length > 0 && (
            <div
              ref={scrollRef}
              className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {activeDoctors.map((doctor) => {
                const images =
                  doctor.imageUrls &&
                  doctor.imageUrls.length > 0
                    ? doctor.imageUrls.map(
                        getDoctorImageUrl
                      )
                    : [DEFAULT_DOCTOR_IMAGE];

                return (
                  <div
                    key={doctor.id}
                    onClick={() =>
                      openDoctor(doctor)
                    }
                    className="group flex w-80 flex-shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl sm:w-96"
                  >
                    <div>
                      <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                        <img
                          src={
                            images[0] ||
                            DEFAULT_DOCTOR_IMAGE
                          }
                          alt={doctor.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(event) => {
                            event.currentTarget.src =
                              DEFAULT_DOCTOR_IMAGE;
                          }}
                        />

                        {images.length > 1 && (
                          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-slate-900/80 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-md">
                            <Layers size={12} />
                            {images.length} photos
                          </span>
                        )}
                      </div>

                      <div className="p-6 text-center">
                        <span className="mb-2 inline-block rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                          {doctor.specialization}
                        </span>

                        <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                          {doctor.name}
                        </h3>

                        {doctor.qualification && (
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            {doctor.qualification}
                          </p>
                        )}

                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                          {doctor.bio ||
                            "Dedicated hospital practitioner offering clinical excellence."}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-0 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:underline">
                        View Full Profile & Options →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>

      {/* =====================================================
          DOCTOR MODAL
      ===================================================== */}

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-md sm:p-6">
          <div className="relative my-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white p-6 text-slate-900 shadow-2xl sm:p-8">

            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <div className="flex shrink-0 items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {selectedDoctor.specialization}
                </span>

                <h3 className="mt-0.5 text-2xl font-bold text-slate-900">
                  {selectedDoctor.name}
                </h3>

                {selectedDoctor.qualification && (
                  <p className="mt-0.5 text-xs font-mono text-slate-500">
                    {selectedDoctor.qualification}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={closeDoctor}
                disabled={
                  isSubmitting ||
                  isSendingMessage ||
                  isSubmittingRating
                }
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* =============================================
                TABS
            ============================================= */}

            <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-slate-100 py-3">
              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("profile")
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeModalTab === "profile"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Full Profile
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("message")
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeModalTab === "message"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Message Doctor
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("rate")
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeModalTab === "rate"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Rate Doctor
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("book")
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeModalTab === "book"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Book Appointment
              </button>
            </div>

            {/* =============================================
                MODAL CONTENT
            ============================================= */}

            <div className="mt-4 flex-1 space-y-5 overflow-y-auto pr-1">

              {/* ===========================================
                  PROFILE
              =========================================== */}

              {activeModalTab === "profile" && (
                <div className="space-y-4">
                  {(() => {
                    const images =
                      selectedDoctor.imageUrls &&
                      selectedDoctor.imageUrls.length > 0
                        ? selectedDoctor.imageUrls.map(
                            getDoctorImageUrl
                          )
                        : [DEFAULT_DOCTOR_IMAGE];

                    return (
                      <>
                        <div className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-2 shadow-md">
                          <img
                            src={
                              images[
                                Math.min(
                                  activeImageIndex,
                                  images.length - 1
                                )
                              ] ||
                              DEFAULT_DOCTOR_IMAGE
                            }
                            alt={selectedDoctor.name}
                            className="max-h-[40vh] w-full rounded-xl object-contain"
                            onError={(event) => {
                              event.currentTarget.src =
                                DEFAULT_DOCTOR_IMAGE;
                            }}
                          />
                        </div>

                        {images.length > 1 && (
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {images.map(
                              (
                                image,
                                index
                              ) => (
                                <button
                                  key={`${image}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    setActiveImageIndex(
                                      index
                                    )
                                  }
                                  className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                                    activeImageIndex ===
                                    index
                                      ? "scale-105 border-blue-600 shadow-sm"
                                      : "border-slate-200 opacity-60 hover:opacity-100"
                                  }`}
                                >
                                  <img
                                    src={
                                      image ||
                                      DEFAULT_DOCTOR_IMAGE
                                    }
                                    alt=""
                                    className="h-full w-full object-cover"
                                    onError={(
                                      event
                                    ) => {
                                      event.currentTarget.src =
                                        DEFAULT_DOCTOR_IMAGE;
                                    }}
                                  />
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}

                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                      Biography & Background
                    </h4>

                    <p className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                      {selectedDoctor.bio ||
                        "No biography provided."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab("book")
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:scale-[1.02]"
                    >
                      <Calendar size={16} />
                      Book Appointment
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setActiveModalTab("message")
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
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

              {/* ===========================================
                  MESSAGE
              =========================================== */}

              {activeModalTab === "message" && (
                <div className="space-y-4">
                  {messageSent ? (
                    <div className="space-y-3 py-12 text-center">
                      <CheckCircle2
                        size={42}
                        className="mx-auto animate-bounce text-emerald-500"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Message Sent Successfully!
                      </h4>

                      <p className="mx-auto max-w-xs text-xs text-slate-600">
                        Your message has been securely
                        submitted to{" "}
                        {selectedDoctor.name}.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={
                        handleSendMessage
                      }
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="mb-1 text-sm font-bold text-slate-900">
                          Send a Message to{" "}
                          {selectedDoctor.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          Send a general inquiry or request
                          follow-up assistance.
                        </p>
                      </div>

                      {messageError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                          {messageError}
                        </div>
                      )}

                      <textarea
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(
                            e.target.value
                          )
                        }
                        placeholder="Type your message here..."
                        rows={5}
                        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                        required
                      />

                      <button
                        type="submit"
                        disabled={
                          isSendingMessage
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSendingMessage ? (
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
                            Send Secure Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ===========================================
                  RATING
              =========================================== */}

              {activeModalTab === "rate" && (
                <div className="space-y-4 py-4 text-center">
                  {ratedSuccess ? (
                    <div className="space-y-3">
                      <CheckCircle2
                        size={42}
                        className="mx-auto animate-bounce text-emerald-500"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Thank You for Your Feedback!
                      </h4>

                      <p className="text-xs text-slate-600">
                        Your rating has been submitted
                        successfully.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={
                        handleRateDoctor
                      }
                      className="space-y-6"
                    >
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          Rate{" "}
                          {selectedDoctor.name}
                        </h4>

                        <p className="mt-1 text-xs text-slate-500">
                          Select your satisfaction rating.
                        </p>
                      </div>

                      {ratingError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                          {ratingError}
                        </div>
                      )}

                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setRating(
                                  star
                                )
                              }
                              onMouseEnter={() =>
                                setHoverRating(
                                  star
                                )
                              }
                              onMouseLeave={() =>
                                setHoverRating(
                                  0
                                )
                              }
                              className="p-1 transition-transform hover:scale-125"
                              aria-label={`Rate ${star} star${
                                star === 1
                                  ? ""
                                  : "s"
                              }`}
                            >
                              <Star
                                size={32}
                                className={`transition-colors ${
                                  (hoverRating ||
                                    rating) >=
                                  star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                }`}
                              />
                            </button>
                          )
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={
                          isSubmittingRating
                        }
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmittingRating ? (
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
                            Submit {rating}-Star
                            Rating
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* ===========================================
                  BOOK APPOINTMENT
              =========================================== */}

              {activeModalTab === "book" && (
                <div className="space-y-4">
                  {bookingSuccess ? (
                    <div className="space-y-3 py-12 text-center">
                      <CheckCircle2
                        size={42}
                        className="mx-auto animate-bounce text-emerald-500"
                      />

                      <h4 className="text-lg font-bold text-slate-900">
                        Appointment Request Submitted!
                      </h4>

                      <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-600">
                        Your appointment request with{" "}
                        <strong>
                          {selectedDoctor.name}
                        </strong>{" "}
                        has been saved to the hospital
                        database. Our front desk team will
                        contact you to confirm the appointment.
                      </p>
                    </div>
                  ) : (
                    <form
                      onSubmit={
                        handleBookAppointment
                      }
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="mb-1 text-sm font-bold text-slate-900">
                          Book Appointment with{" "}
                          {selectedDoctor.name}
                        </h4>

                        <p className="text-xs text-slate-500">
                          Your appointment request will be
                          stored securely in the hospital
                          database.
                        </p>
                      </div>

                      {bookingError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
                          {bookingError}
                        </div>
                      )}

                      {/* PATIENT NAME */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Full Name{" "}
                          <span className="text-rose-500">
                            *
                          </span>
                        </label>

                        <input
                          type="text"
                          value={patientName}
                          onChange={(e) =>
                            setPatientName(
                              e.target.value
                            )
                          }
                          placeholder="John Doe"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* PHONE */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Phone Number{" "}
                          <span className="text-rose-500">
                            *
                          </span>
                        </label>

                        <input
                          type="tel"
                          value={patientPhone}
                          onChange={(e) =>
                            setPatientPhone(
                              e.target.value
                            )
                          }
                          placeholder="+254 700 000 000"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* EMAIL */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Email Address
                        </label>

                        <input
                          type="email"
                          value={patientEmail}
                          onChange={(e) =>
                            setPatientEmail(
                              e.target.value
                            )
                          }
                          placeholder="john@example.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      {/* DATE */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
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
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                          required
                        />
                      </div>

                      {/* TIME */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Preferred Time
                        </label>

                        <input
                          type="time"
                          value={appointmentTime}
                          onChange={(e) =>
                            setAppointmentTime(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                        />
                      </div>

                      {/* REASON / MESSAGE */}

                      <div>
                        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Reason for Appointment /
                          Message
                        </label>

                        <textarea
                          value={appointmentReason}
                          onChange={(e) =>
                            setAppointmentReason(
                              e.target.value
                            )
                          }
                          placeholder={`Tell ${selectedDoctor.name} briefly why you would like the appointment...`}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
                        />

                        <p className="mt-1 text-[11px] text-slate-400">
                          Please do not include highly sensitive
                          medical information in this field.
                        </p>
                      </div>

                      {/* SELECTED DOCTOR */}

                      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                            <Stethoscope
                              size={18}
                            />
                          </div>

                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">
                              Selected Doctor
                            </p>

                            <p className="text-sm font-bold text-slate-900">
                              {selectedDoctor.name}
                            </p>

                            <p className="text-xs text-slate-500">
                              {
                                selectedDoctor.specialization
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SUBMIT */}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2
                              size={16}
                              className="animate-spin"
                            />
                            Saving Appointment...
                          </>
                        ) : (
                          <>
                            <Calendar
                              size={16}
                            />
                            Submit Appointment
                            Request
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* =============================================
                FOOTER
            ============================================= */}

            <div className="mt-6 flex shrink-0 items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={closeDoctor}
                disabled={
                  isSubmitting ||
                  isSendingMessage ||
                  isSubmittingRating
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveModalTab("book")
                }
                disabled={
                  isSubmitting ||
                  isSendingMessage ||
                  isSubmittingRating
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
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