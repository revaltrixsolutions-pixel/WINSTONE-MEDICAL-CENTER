import {
  Mail,
  Phone,
  Plus,
  Trash2,
  Edit,
  X,
  Sparkles,
  Stethoscope,
  Upload,
  MessageSquare,
  Star,
  Calendar,
  Layers,
  Loader2,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* =========================================================
   TYPES
   ========================================================= */

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  phone: string;
  email: string;
  bio: string;
  imageUrls: string[];
  active: boolean;
}

export interface PatientMessage {
  id: string;
  doctorId: string;
  doctorName: string;
  messageText: string;
  date: string;
}

export interface DoctorRating {
  id: string;
  doctorId: string;
  doctorName: string;
  rating: number;
  date: string;
}

export interface AppointmentRequest {
  id: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  patientPhone: string;
  appointmentDate: string;
  appointmentReason?: string;
  status: "Pending" | "Confirmed" | "Cancelled";
  date: string;
}

/* =========================================================
   API CONFIGURATION
   ========================================================= */

/*
 * IMPORTANT:
 *
 * Your frontend runs on:
 * http://localhost:5173
 *
 * Your backend runs on:
 * http://localhost:5000
 *
 * Therefore we must NOT use:
 *
 *   /api/admin/doctors
 *
 * because that sends the request to Vite/frontend.
 *
 * Recommended .env:
 *
 * VITE_API_URL=http://localhost:5000/api
 *
 * The code below also has a localhost fallback so development
 * works even if VITE_API_URL has not yet been created.
 */

const API_ROOT = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const API_BASE = `${API_ROOT}/admin/doctors`;

/* =========================================================
   SAFE JSON RESPONSE HELPER
   ========================================================= */

/*
 * This prevents the confusing:
 *
 * Unexpected token '<', "<!doctype "... is not valid JSON
 *
 * error.
 *
 * If the backend returns HTML, we report the real URL/status
 * instead of blindly calling response.json().
 */

async function parseJsonResponse<T = any>(
  response: Response,
  requestUrl: string
): Promise<T | null> {
  const contentType =
    response.headers.get("content-type") || "";

  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  /*
   * HTML response means the request probably went to the
   * frontend/Vite instead of the Express backend.
   */

  if (
    contentType.includes("text/html") ||
    text.trimStart().startsWith("<!doctype") ||
    text.trimStart().startsWith("<html")
  ) {
    throw new Error(
      `The server returned HTML instead of JSON.\n\n` +
        `Request: ${requestUrl}\n` +
        `Status: ${response.status}\n\n` +
        `Make sure the frontend is calling the backend at ` +
        `${API_ROOT} and that the backend is running on port 5000.`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch (error) {
    console.error(
      "Invalid JSON response:",
      text.substring(0, 500)
    );

    throw new Error(
      `The server returned an invalid JSON response.\n\n` +
        `Request: ${requestUrl}\n` +
        `Status: ${response.status}`
    );
  }
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function HospitalDoctors() {
  /* -------------------------------------------------------
     DATABASE DATA
  ------------------------------------------------------- */

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [ratings, setRatings] = useState<DoctorRating[]>([]);
  const [appointments, setAppointments] = useState<
    AppointmentRequest[]
  >([]);

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  const [activeAdminTab, setActiveAdminTab] = useState<
    "doctors" | "messages" | "ratings" | "appointments"
  >("doctors");

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingDoctor, setSavingDoctor] = useState(false);
  const [uploadingImage, setUploadingImage] =
    useState(false);

  const [pageError, setPageError] =
    useState<string | null>(null);

  const [formError, setFormError] =
    useState<string | null>(null);

  const [formSuccess, setFormSuccess] =
    useState<string | null>(null);

  /* -------------------------------------------------------
     DOCTOR FORM
  ------------------------------------------------------- */

  const [name, setName] = useState("");
  const [specialization, setSpecialization] =
    useState("");
  const [qualification, setQualification] =
    useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrls, setImageUrls] =
    useState<string[]>([""]);
  const [active, setActive] = useState(true);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =========================================================
     LOAD EVERYTHING FROM DATABASE
  ========================================================= */

  useEffect(() => {
    void loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    setPageError(null);

    try {
      /*
       * Load each resource independently.
       *
       * This is safer than Promise.all() because a problem
       * with messages/ratings/appointments should not prevent
       * doctors from loading.
       */

      const doctorsUrl = API_BASE;
      const messagesUrl = `${API_BASE}/messages`;
      const ratingsUrl = `${API_BASE}/ratings`;
      const appointmentsUrl = `${API_BASE}/appointments`;

      const [
        doctorsResponse,
        messagesResponse,
        ratingsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        fetch(doctorsUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),

        fetch(messagesUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),

        fetch(ratingsUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),

        fetch(appointmentsUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }),
      ]);

      /* =====================================================
         DOCTORS
      ===================================================== */

      if (!doctorsResponse.ok) {
        const data = await parseJsonResponse(
          doctorsResponse,
          doctorsUrl
        );

        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to load doctors (${doctorsResponse.status})`
        );
      }

      const doctorsData =
        await parseJsonResponse<any>(
          doctorsResponse,
          doctorsUrl
        );

      let loadedDoctors: Doctor[] = [];

      if (Array.isArray(doctorsData)) {
        loadedDoctors = doctorsData;
      } else if (
        Array.isArray(doctorsData?.doctors)
      ) {
        loadedDoctors = doctorsData.doctors;
      } else if (
        Array.isArray(doctorsData?.data)
      ) {
        loadedDoctors = doctorsData.data;
      } else if (
        Array.isArray(doctorsData?.data?.doctors)
      ) {
        loadedDoctors = doctorsData.data.doctors;
      }

      setDoctors(loadedDoctors);

      /* =====================================================
         MESSAGES
      ===================================================== */

      if (messagesResponse.ok) {
        try {
          const data =
            await parseJsonResponse<any>(
              messagesResponse,
              messagesUrl
            );

          if (Array.isArray(data)) {
            setMessages(data);
          } else if (
            Array.isArray(data?.messages)
          ) {
            setMessages(data.messages);
          } else if (
            Array.isArray(data?.data)
          ) {
            setMessages(data.data);
          } else if (
            Array.isArray(data?.data?.messages)
          ) {
            setMessages(data.data.messages);
          } else {
            setMessages([]);
          }
        } catch (error) {
          console.error(
            "Messages loading error:",
            error
          );

          setMessages([]);
        }
      } else {
        console.warn(
          `Messages endpoint returned ${messagesResponse.status}`
        );

        setMessages([]);
      }

      /* =====================================================
         RATINGS
      ===================================================== */

      if (ratingsResponse.ok) {
        try {
          const data =
            await parseJsonResponse<any>(
              ratingsResponse,
              ratingsUrl
            );

          if (Array.isArray(data)) {
            setRatings(data);
          } else if (
            Array.isArray(data?.ratings)
          ) {
            setRatings(data.ratings);
          } else if (
            Array.isArray(data?.data)
          ) {
            setRatings(data.data);
          } else if (
            Array.isArray(data?.data?.ratings)
          ) {
            setRatings(data.data.ratings);
          } else {
            setRatings([]);
          }
        } catch (error) {
          console.error(
            "Ratings loading error:",
            error
          );

          setRatings([]);
        }
      } else {
        console.warn(
          `Ratings endpoint returned ${ratingsResponse.status}`
        );

        setRatings([]);
      }

      /* =====================================================
         APPOINTMENTS
      ===================================================== */

      if (appointmentsResponse.ok) {
        try {
          const data =
            await parseJsonResponse<any>(
              appointmentsResponse,
              appointmentsUrl
            );

          if (Array.isArray(data)) {
            setAppointments(data);
          } else if (
            Array.isArray(data?.appointments)
          ) {
            setAppointments(data.appointments);
          } else if (
            Array.isArray(data?.data)
          ) {
            setAppointments(data.data);
          } else if (
            Array.isArray(data?.data?.appointments)
          ) {
            setAppointments(data.data.appointments);
          } else {
            setAppointments([]);
          }
        } catch (error) {
          console.error(
            "Appointments loading error:",
            error
          );

          setAppointments([]);
        }
      } else {
        console.warn(
          `Appointments endpoint returned ${appointmentsResponse.status}`
        );

        setAppointments([]);
      }
    } catch (error) {
      console.error(
        "Database loading error:",
        error
      );

      setPageError(
        error instanceof Error
          ? error.message
          : "Unable to load hospital data from the database."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetDoctorForm = () => {
    setEditingDoctorId(null);
    setName("");
    setSpecialization("");
    setQualification("");
    setPhone("");
    setEmail("");
    setBio("");
    setImageUrls([""]);
    setActive(true);
    setFormError(null);
    setFormSuccess(null);
  };

  /* =========================================================
     OPEN ADD
  ========================================================= */

  const handleOpenAddModal = () => {
    resetDoctorForm();
    setIsAdminOpen(true);
  };

  /* =========================================================
     OPEN EDIT
  ========================================================= */

  const handleOpenEditModal = (
    doc: Doctor
  ) => {
    setEditingDoctorId(doc.id);

    setName(doc.name || "");
    setSpecialization(
      doc.specialization || ""
    );
    setQualification(
      doc.qualification || ""
    );
    setPhone(doc.phone || "");
    setEmail(doc.email || "");
    setBio(doc.bio || "");

    setImageUrls(
      doc.imageUrls &&
        doc.imageUrls.length > 0
        ? [...doc.imageUrls]
        : [""]
    );

    setActive(doc.active);

    setFormError(null);
    setFormSuccess(null);

    setIsAdminOpen(true);
  };

  /* =========================================================
     IMAGE URL MANAGEMENT
  ========================================================= */

  const addImageUrlField = () => {
    setImageUrls((current) => [
      ...current,
      "",
    ]);
  };

  const removeImageUrlField = (
    index: number
  ) => {
    setImageUrls((current) => {
      const updated = current.filter(
        (_, i) => i !== index
      );

      return updated.length > 0
        ? updated
        : [""];
    });
  };

  const updateImageUrl = (
    index: number,
    value: string
  ) => {
    setImageUrls((current) => {
      const updated = [...current];

      updated[index] = value;

      return updated;
    });
  };

  /* =========================================================
     IMAGE UPLOAD

     Expected backend:

     POST /api/admin/doctors/upload-image

     multipart/form-data
     field name: image

     Expected response:
     {
       "url": "https://..."
     }

     or:
     {
       "imageUrl": "https://..."
     }
  ========================================================= */

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /* Basic client-side validation */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFormError(
        "Please upload a JPG, PNG, JPEG, or WebP image."
      );

      event.target.value = "";

      return;
    }

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFormError(
        "Image must be smaller than 5MB."
      );

      event.target.value = "";

      return;
    }

    setUploadingImage(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        file
      );

      const uploadUrl =
        `${API_BASE}/upload-image`;

      const response =
        await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          headers: {
            Accept:
              "application/json",
          },
        });

      const data =
        await parseJsonResponse<any>(
          response,
          uploadUrl
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Image upload failed."
        );
      }

      const uploadedUrl =
        data?.url ||
        data?.imageUrl ||
        data?.data?.url ||
        data?.data?.imageUrl;

      if (!uploadedUrl) {
        throw new Error(
          "The server uploaded the image but did not return an image URL."
        );
      }

      setImageUrls(
        (current) => {
          const cleaned =
            current.filter(
              (url) =>
                url.trim() !== ""
            );

          return [
            ...cleaned,
            uploadedUrl,
          ];
        }
      );

      setFormSuccess(
        "Image uploaded successfully."
      );
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setFormError(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploadingImage(false);

      event.target.value = "";
    }
  };

  /* =========================================================
     SAVE DOCTOR TO DATABASE
  ========================================================= */

  const handleSaveDoctor = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setFormError(null);
    setFormSuccess(null);

    if (!name.trim()) {
      setFormError(
        "Doctor name is required."
      );

      return;
    }

    if (!specialization.trim()) {
      setFormError(
        "Specialization is required."
      );

      return;
    }

    if (!phone.trim()) {
      setFormError(
        "Phone number is required."
      );

      return;
    }

    if (!email.trim()) {
      setFormError(
        "Email address is required."
      );

      return;
    }

    const cleanedImages =
      imageUrls
        .map((url) => url.trim())
        .filter(Boolean);

    const payload = {
      name: name.trim(),
      specialization:
        specialization.trim(),
      qualification:
        qualification.trim(),
      phone: phone.trim(),
      email: email.trim(),
      bio: bio.trim(),
      imageUrls:
        cleanedImages,
      active,
    };

    setSavingDoctor(true);

    try {
      const url =
        editingDoctorId
          ? `${API_BASE}/${editingDoctorId}`
          : API_BASE;

      const method =
        editingDoctorId
          ? "PUT"
          : "POST";

      const response =
        await fetch(url, {
          method,
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        });

      const data =
        await parseJsonResponse<any>(
          response,
          url
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to ${
              editingDoctorId
                ? "update"
                : "create"
            } doctor.`
        );
      }

      setFormSuccess(
        editingDoctorId
          ? "Doctor profile updated successfully."
          : "Doctor profile saved to the database successfully."
      );

      /*
       * Reload from database instead of modifying local state.
       * This guarantees the UI reflects the actual DB record.
       */

      await loadAllData();

      setTimeout(() => {
        setIsAdminOpen(false);
        resetDoctorForm();
      }, 700);
    } catch (error) {
      console.error(
        "Doctor save error:",
        error
      );

      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to save doctor."
      );
    } finally {
      setSavingDoctor(false);
    }
  };

  /* =========================================================
     DELETE DOCTOR
  ========================================================= */

  const handleDeleteDoctor = async (
    id: string
  ) => {
    const doctor =
      doctors.find(
        (item) => item.id === id
      );

    if (!doctor) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete ${doctor.name} permanently from the database?\n\nThis action cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    try {
      const url =
        `${API_BASE}/${id}`;

      const response =
        await fetch(url, {
          method: "DELETE",
          headers: {
            Accept:
              "application/json",
          },
        });

      const data =
        await parseJsonResponse<any>(
          response,
          url
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to delete doctor."
        );
      }

      await loadAllData();
    } catch (error) {
      console.error(
        "Delete doctor error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error deleting doctor."
      );
    }
  };

  /* =========================================================
     TOGGLE DOCTOR STATUS
  ========================================================= */

  const toggleStatus = async (
    doctor: Doctor
  ) => {
    try {
      const url =
        `${API_BASE}/${doctor.id}`;

      const response =
        await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Accept:
              "application/json",
          },
          body: JSON.stringify({
            active:
              !doctor.active,
          }),
        });

      const data =
        await parseJsonResponse<any>(
          response,
          url
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update doctor status."
        );
      }

      await loadAllData();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Error updating doctor status."
      );
    }
  };

  /* =========================================================
     DELETE MESSAGE
  ========================================================= */

  const handleDeleteMessage =
    async (id: string) => {
      if (
        !window.confirm(
          "Delete this patient message?"
        )
      ) {
        return;
      }

      try {
        const url =
          `${API_BASE}/messages/${id}`;

        const response =
          await fetch(url, {
            method: "DELETE",
            headers: {
              Accept:
                "application/json",
            },
          });

        const data =
          await parseJsonResponse<any>(
            response,
            url
          );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to delete message."
          );
        }

        await loadAllData();
      } catch (error) {
        console.error(
          "Delete message error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Error deleting message."
        );
      }
    };

  /* =========================================================
     APPOINTMENT STATUS
  ========================================================= */

  const handleUpdateAppointmentStatus =
    async (
      id: string,
      status:
        | "Pending"
        | "Confirmed"
        | "Cancelled"
    ) => {
      try {
        const url =
          `${API_BASE}/appointments/${id}/status`;

        const response =
          await fetch(url, {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              status,
            }),
          });

        const data =
          await parseJsonResponse<any>(
            response,
            url
          );

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to update appointment."
          );
        }

        await loadAllData();
      } catch (error) {
        console.error(
          "Appointment status error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Error updating appointment."
        );
      }
    };

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 flex items-center justify-center text-white">
        <div className="text-center">
          <Loader2
            size={42}
            className="mx-auto animate-spin text-cyan-400"
          />

          <p className="mt-4 text-sm font-semibold text-slate-300">
            Loading doctors and clinical data from database...
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Connecting to {API_BASE}
          </p>
        </div>
      </section>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <section
      id="admin-doctors"
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 py-24 text-slate-100 sm:py-32"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div className="max-w-3xl">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
              <Sparkles size={14} />

              Admin Management Console
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hospital Doctors & Clinical Management
            </h2>

            <p className="mt-3 text-base leading-relaxed text-slate-300">
              Manage doctors directly from the hospital database.
              Doctor profiles published here are the same records
              displayed on the public website.
            </p>

          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
          >
            <Plus size={18} />

            Add New Doctor
          </button>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {pageError && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0">

              <p className="font-bold">
                Database connection error
              </p>

              <p className="mt-1 whitespace-pre-line break-words">
                {pageError}
              </p>

              <p className="mt-3 rounded-lg bg-black/20 p-3 font-mono text-[11px] text-rose-200/80">
                API: {API_BASE}
              </p>

              <button
                type="button"
                onClick={() => void loadAllData()}
                className="mt-3 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-bold hover:bg-rose-500/30"
              >
                Retry
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">

          <button
            type="button"
            onClick={() =>
              setActiveAdminTab("doctors")
            }
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeAdminTab === "doctors"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Stethoscope size={16} />

            Doctors Directory ({doctors.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAdminTab("messages")
            }
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeAdminTab === "messages"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <MessageSquare size={16} />

            Patient Messages ({messages.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAdminTab("ratings")
            }
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeAdminTab === "ratings"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Star size={16} />

            Doctor Ratings ({ratings.length})
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveAdminTab(
                "appointments"
              )
            }
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              activeAdminTab === "appointments"
                ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Calendar size={16} />

            Appointment Requests (
              {appointments.length}
            )
          </button>

        </div>

        {/* =================================================
            DOCTORS TAB
        ================================================= */}

        {activeAdminTab === "doctors" && (
          <div>

            {doctors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">

                <Stethoscope
                  size={48}
                  className="mx-auto mb-4 text-cyan-400"
                />

                <h3 className="text-xl font-bold text-white">
                  No doctors in the database
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Add your first doctor to make them available
                  on the public website.
                </p>

                <button
                  type="button"
                  onClick={
                    handleOpenAddModal
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950"
                >
                  <Plus size={16} />

                  Add Doctor
                </button>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

                {doctors.map((doc) => {

                  const docImages =
                    doc.imageUrls?.filter(
                      Boolean
                    ) || [];

                  return (
                    <div
                      key={doc.id}
                      className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl"
                    >

                      <div>

                        {/* IMAGE */}

                        <div className="relative mb-5 h-52 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-950">

                          {docImages.length > 0 ? (
                            <img
                              src={
                                docImages[0]
                              }
                              alt={doc.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-600">
                              <Stethoscope
                                size={48}
                              />
                            </div>
                          )}

                          <div className="absolute left-3 top-3 flex items-center gap-1.5">

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
                                doc.active
                                  ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                                  : "border-rose-500/30 bg-rose-500/20 text-rose-300"
                              }`}
                            >
                              {doc.active
                                ? "Active"
                                : "Inactive"}
                            </span>

                            {docImages.length >
                              0 && (
                              <span className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/80 px-2.5 py-1 text-[10px] font-mono text-cyan-300">
                                <Layers
                                  size={10}
                                />

                                {
                                  docImages.length
                                }
                              </span>
                            )}

                          </div>

                        </div>

                        {/* DETAILS */}

                        <h3 className="text-lg font-bold text-white">
                          {doc.name}
                        </h3>

                        <p className="mt-0.5 text-xs font-bold text-cyan-400">
                          {
                            doc.specialization
                          }
                        </p>

                        {doc.qualification && (
                          <p className="mt-1 text-xs font-mono text-slate-400">
                            {
                              doc.qualification
                            }
                          </p>
                        )}

                        <div className="mt-4 space-y-1 text-xs font-mono text-slate-300">

                          <p>
                            Phone:{" "}
                            {doc.phone}
                          </p>

                          <p className="truncate">
                            Email:{" "}
                            {doc.email}
                          </p>

                        </div>

                        {doc.bio && (
                          <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-slate-400">
                            {doc.bio}
                          </p>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="mt-6 space-y-3 border-t border-white/10 pt-4">

                        <div className="flex gap-2">

                          <a
                            href={`tel:${doc.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
                          >
                            <Phone
                              size={14}
                            />

                            Call
                          </a>

                          <a
                            href={`mailto:${doc.email}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/10 px-3 py-2 text-xs font-bold text-fuchsia-300 hover:bg-fuchsia-500/20"
                          >
                            <Mail
                              size={14}
                            />

                            Email
                          </a>

                        </div>

                        <div className="flex items-center justify-between pt-1">

                          <button
                            type="button"
                            onClick={() =>
                              void toggleStatus(
                                doc
                              )
                            }
                            className="text-xs font-semibold text-slate-400 hover:text-white"
                          >
                            {doc.active
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <div className="flex gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenEditModal(
                                  doc
                                )
                              }
                              className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-white/10"
                              title="Edit"
                            >
                              <Edit
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                void handleDeleteDoctor(
                                  doc.id
                                )
                              }
                              className="rounded-lg bg-white/5 p-2 text-slate-300 hover:bg-rose-500/20 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        )}

        {/* =================================================
            MESSAGES
        ================================================= */}

        {activeAdminTab === "messages" && (
          <div>

            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">

                <MessageSquare
                  size={48}
                  className="mx-auto mb-4 text-cyan-400"
                />

                <h3 className="text-xl font-bold text-white">
                  No patient messages
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Patient messages will appear here when
                  submitted from the public website.
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
                  >

                    <div>

                      <div className="mb-3 flex items-center justify-between gap-3">

                        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-bold text-cyan-400">
                          To:{" "}
                          {msg.doctorName}
                        </span>

                        <span className="text-[11px] font-mono text-slate-400">
                          {msg.date}
                        </span>

                      </div>

                      <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-slate-200">
                        "{msg.messageText}"
                      </p>

                    </div>

                    <div className="mt-4 flex justify-end border-t border-white/10 pt-3">

                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteMessage(
                            msg.id
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                      >
                        <Trash2
                          size={13}
                        />

                        Delete Message
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* =================================================
            RATINGS
        ================================================= */}

        {activeAdminTab === "ratings" && (
          <div>

            {ratings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">

                <Star
                  size={48}
                  className="mx-auto mb-4 text-amber-400"
                />

                <h3 className="text-xl font-bold text-white">
                  No doctor ratings
                </h3>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {ratings.map((rate) => (
                  <div
                    key={rate.id}
                    className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
                  >

                    <div>

                      <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-bold text-cyan-400">
                        {
                          rate.doctorName
                        }
                      </span>

                      <div className="my-2 flex items-center gap-1">

                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={18}
                              className={
                                star <=
                                rate.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-600"
                              }
                            />
                          )
                        )}

                        <span className="ml-2 font-mono text-sm font-bold text-amber-400">
                          {rate.rating}.0
                        </span>

                      </div>

                    </div>

                    <div className="mt-4 border-t border-white/10 pt-3 text-right text-[11px] font-mono text-slate-400">
                      {rate.date}
                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>
        )}

        {/* =================================================
            APPOINTMENTS
        ================================================= */}

        {activeAdminTab ===
          "appointments" && (
          <div>

            {appointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">

                <Calendar
                  size={48}
                  className="mx-auto mb-4 text-cyan-400"
                />

                <h3 className="text-xl font-bold text-white">
                  No appointment requests
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Appointment requests submitted by patients
                  will appear here.
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                {appointments.map(
                  (appt) => (
                    <div
                      key={appt.id}
                      className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl"
                    >

                      <div>

                        <div className="mb-3 flex items-center justify-between gap-3">

                          <span className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-1 text-xs font-bold text-cyan-400">
                            {
                              appt.doctorName
                            }
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
                              appt.status ===
                              "Confirmed"
                                ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                                : appt.status ===
                                  "Cancelled"
                                ? "border-rose-500/30 bg-rose-500/20 text-rose-300"
                                : "border-amber-500/30 bg-amber-500/20 text-amber-300"
                            }`}
                          >
                            {
                              appt.status
                            }
                          </span>

                        </div>

                        <div className="my-4 space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">

                          <p>
                            <strong className="text-white">
                              Patient:
                            </strong>{" "}
                            {
                              appt.patientName
                            }
                          </p>

                          <p>
                            <strong className="text-white">
                              Phone:
                            </strong>{" "}
                            {
                              appt.patientPhone
                            }
                          </p>

                          <p>
                            <strong className="text-white">
                              Preferred Date:
                            </strong>{" "}
                            {
                              appt.appointmentDate
                            }
                          </p>

                          {appt.appointmentReason && (
                            <p>
                              <strong className="text-white">
                                Reason:
                              </strong>{" "}
                              {
                                appt.appointmentReason
                              }
                            </p>
                          )}

                          <p>
                            <strong className="text-white">
                              Requested:
                            </strong>{" "}
                            {appt.date}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-3">

                        <div className="flex gap-1.5">

                          <button
                            type="button"
                            onClick={() =>
                              void handleUpdateAppointmentStatus(
                                appt.id,
                                "Confirmed"
                              )
                            }
                            disabled={
                              appt.status ===
                              "Confirmed"
                            }
                            className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Confirm
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              void handleUpdateAppointmentStatus(
                                appt.id,
                                "Cancelled"
                              )
                            }
                            disabled={
                              appt.status ===
                              "Cancelled"
                            }
                            className="rounded-xl bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Cancel
                          </button>

                        </div>

                        <span className="max-w-[130px] truncate text-[10px] font-mono text-slate-500">
                          ID:{" "}
                          {appt.id}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          ADD / EDIT DOCTOR MODAL
      ===================================================== */}

      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6">

          <div className="relative my-auto flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 text-slate-100 shadow-2xl sm:p-8">

            {/* HEADER */}

            <div className="flex shrink-0 items-start justify-between border-b border-white/10 pb-4">

              <div>

                <div className="mb-1 flex items-center gap-2">

                  <Stethoscope
                    size={18}
                    className="text-cyan-400"
                  />

                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Database Doctor Profile
                  </span>

                </div>

                <h3 className="text-xl font-bold text-white">

                  {editingDoctorId
                    ? "Edit Doctor Profile"
                    : "Add New Doctor"}

                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  All information entered here will be stored
                  in the hospital database.
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setIsAdminOpen(
                    false
                  );

                  resetDoctorForm();
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSaveDoctor
              }
              className="mt-6 flex-1 space-y-5 overflow-y-auto pr-1"
            >

              {/* ERRORS */}

              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">

                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span className="whitespace-pre-line">
                    {formError}
                  </span>

                </div>
              )}

              {formSuccess && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs font-semibold text-emerald-300">

                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    {formSuccess}
                  </span>

                </div>
              )}

              {/* BASIC INFORMATION */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Doctor Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Dr. John Doe"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Specialization *
                  </label>

                  <input
                    type="text"
                    value={
                      specialization
                    }
                    onChange={(e) =>
                      setSpecialization(
                        e.target.value
                      )
                    }
                    placeholder="Cardiologist"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                    required
                  />
                </div>

              </div>

              {/* PROFESSIONAL */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Qualification
                  </label>

                  <input
                    type="text"
                    value={
                      qualification
                    }
                    onChange={(e) =>
                      setQualification(
                        e.target.value
                      )
                    }
                    placeholder="MBChB, MMed"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Phone *
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    placeholder="+254 700 000 000"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    placeholder="doctor@hospital.com"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                    required
                  />
                </div>

              </div>

              {/* BIO */}

              <div>

                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Biography
                </label>

                <textarea
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Write the doctor's professional biography..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

              </div>

              {/* =================================================
                  IMAGES
              ================================================= */}

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">

                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                  <div>

                    <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
                      <ImagePlus
                        size={15}
                      />

                      Doctor Images
                    </label>

                    <p className="mt-1 text-[11px] text-slate-400">
                      Upload images or paste image URLs.
                      Images are saved with the doctor profile.
                    </p>

                  </div>

                  {/* UPLOAD */}

                  <div>

                    <input
                      ref={
                        fileInputRef
                      }
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={
                        handleImageUpload
                      }
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                      disabled={
                        uploadingImage
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2
                            size={15}
                            className="animate-spin"
                          />

                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload
                            size={15}
                          />

                          Upload Image
                        </>
                      )}
                    </button>

                  </div>

                </div>

                {/* URL FIELDS */}

                <div className="space-y-3">

                  {imageUrls.map(
                    (url, index) => (
                      <div
                        key={index}
                        className="flex gap-2"
                      >

                        <div className="relative flex-1">

                          <input
                            type="url"
                            value={url}
                            onChange={(e) =>
                              updateImageUrl(
                                index,
                                e.target.value
                              )
                            }
                            placeholder={`Image URL #${
                              index + 1
                            }`}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 pr-12 text-xs font-mono text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                          />

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeImageUrlField(
                              index
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/5 px-3 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                          title="Remove image"
                        >
                          <Trash2
                            size={15}
                          />
                        </button>

                      </div>
                    )
                  )}

                </div>

                {/* ADD URL */}

                <button
                  type="button"
                  onClick={
                    addImageUrlField
                  }
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300"
                >
                  <Plus size={14} />

                  Add another image URL
                </button>

                {/* IMAGE PREVIEW */}

                {imageUrls.some(
                  (url) =>
                    url.trim() !== ""
                ) && (
                  <div className="mt-5">

                    <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Preview
                    </p>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                      {imageUrls
                        .filter(
                          (url) =>
                            url.trim() !== ""
                        )
                        .map(
                          (
                            url,
                            index
                          ) => (
                            <div
                              key={`${url}-${index}`}
                              className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                            >

                              <img
                                src={url}
                                alt={`Doctor preview ${
                                  index +
                                  1
                                }`}
                                className="h-full w-full object-cover"
                                onError={(
                                  e
                                ) => {
                                  e.currentTarget.style.opacity =
                                    "0.25";
                                }}
                              />

                              <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1.5 text-center text-[9px] text-slate-300">
                                Image{" "}
                                {index +
                                  1}
                              </div>

                            </div>
                          )
                        )}

                    </div>

                  </div>
                )}

              </div>

              {/* ACTIVE */}

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">

                <input
                  type="checkbox"
                  id="doc-active"
                  checked={active}
                  onChange={(e) =>
                    setActive(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-500"
                />

                <div>

                  <label
                    htmlFor="doc-active"
                    className="text-sm font-bold text-white"
                  >
                    Active Doctor
                  </label>

                  <p className="text-[11px] text-slate-400">
                    Active doctors are displayed on the
                    public website.
                  </p>

                </div>

              </div>

              {/* FOOTER */}

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-white/10 pt-5">

                <button
                  type="button"
                  onClick={() => {
                    setIsAdminOpen(
                      false
                    );

                    resetDoctorForm();
                  }}
                  disabled={
                    savingDoctor
                  }
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    savingDoctor ||
                    uploadingImage
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  {savingDoctor ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />

                      Saving to Database...
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        size={16}
                      />

                      {editingDoctorId
                        ? "Save Changes"
                        : "Publish Doctor"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}






