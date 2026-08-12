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
} from "lucide-react";
import { useEffect, useState } from "react";

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
  status: "Pending" | "Confirmed" | "Cancelled";
  date: string;
}

const DOCTORS_STORAGE_KEY = "winston_medical_doctors";
const MESSAGES_STORAGE_KEY = "winston_medical_doctor_messages";
const RATINGS_STORAGE_KEY = "winston_medical_doctor_ratings";
const APPOINTMENTS_STORAGE_KEY = "winston_medical_appointments";

export default function HospitalDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [ratings, setRatings] = useState<DoctorRating[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);

  // Admin View Sub-tabs: "doctors" | "messages" | "ratings" | "appointments"
  const [activeAdminTab, setActiveAdminTab] = useState<"doctors" | "messages" | "ratings" | "appointments">("doctors");

  // Admin Modal & Form States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [qualification, setQualification] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>(["", "", ""]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    loadAllData();
    window.addEventListener("storage", loadAllData);
    return () => window.removeEventListener("storage", loadAllData);
  }, []);

  const loadAllData = () => {
    if (typeof window === "undefined") return;

    // 1. Load Doctors
    const savedDocs = localStorage.getItem(DOCTORS_STORAGE_KEY);
    if (savedDocs) {
      try {
        setDoctors(JSON.parse(savedDocs));
      } catch {
        setDoctors([]);
      }
    } else {
      const initial: Doctor[] = [
        {
          id: "doc-1",
          name: "Dr. Winstone Ouma",
          specialization: "Chief Medical Officer & Surgeon",
          qualification: "MBChB, MMed (Surgery)",
          phone: "+254 708 130 100",
          email: "dr.winstone@winstonmedical.co.ke",
          bio: "Dr. Winstone has over 15 years of experience leading advanced surgical and clinical care programs with compassionate patient-centered values.",
          imageUrls: [
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=800&auto=format&fit=crop",
          ],
          active: true,
        },
      ];
      localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(initial));
      setDoctors(initial);
    }

    // 2. Load Patient Messages to Doctors
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        setMessages([]);
      }
    }

    // 3. Load Doctor Ratings
    const savedRatings = localStorage.getItem(RATINGS_STORAGE_KEY);
    if (savedRatings) {
      try {
        setRatings(JSON.parse(savedRatings));
      } catch {
        setRatings([]);
      }
    }

    // 4. Load Appointment Requests
    const savedAppts = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (savedAppts) {
      try {
        setAppointments(JSON.parse(savedAppts));
      } catch {
        setAppointments([]);
      }
    }
  };

  const saveDoctors = (updated: Doctor[]) => {
    setDoctors(updated);
    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const handleOpenAddModal = () => {
    setEditingDoctorId(null);
    setName("");
    setSpecialization("");
    setQualification("");
    setPhone("");
    setEmail("");
    setBio("");
    setImageUrls(["", "", ""]);
    setActive(true);
    setIsAdminOpen(true);
  };

  const handleOpenEditModal = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setName(doc.name);
    setSpecialization(doc.specialization);
    setQualification(doc.qualification);
    setPhone(doc.phone);
    setEmail(doc.email);
    setBio(doc.bio);
    const paddedImages = [...doc.imageUrls];
    while (paddedImages.length < 3) paddedImages.push("");
    setImageUrls(paddedImages);
    setActive(doc.active);
    setIsAdminOpen(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !specialization.trim() || !phone.trim() || !email.trim()) {
      alert("Please fill in all required doctor profile fields.");
      return;
    }

    const cleanedImages = imageUrls.filter((url) => url.trim() !== "");

    if (editingDoctorId) {
      const updated = doctors.map((d) =>
        d.id === editingDoctorId
          ? {
              ...d,
              name: name.trim(),
              specialization: specialization.trim(),
              qualification: qualification.trim(),
              phone: phone.trim(),
              email: email.trim(),
              bio: bio.trim(),
              imageUrls: cleanedImages,
              active,
            }
          : d
      );
      saveDoctors(updated);
    } else {
      const newDoc: Doctor = {
        id: `doc-${Date.now()}`,
        name: name.trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        phone: phone.trim(),
        email: email.trim(),
        bio: bio.trim(),
        imageUrls: cleanedImages,
        active,
      };
      saveDoctors([newDoc, ...doctors]);
    }

    setIsAdminOpen(false);
  };

  const handleDeleteDoctor = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this doctor profile?")) return;
    const updated = doctors.filter((d) => d.id !== id);
    saveDoctors(updated);
  };

  const toggleStatus = (id: string) => {
    const updated = doctors.map((d) => (d.id === id ? { ...d, active: !d.active } : d));
    saveDoctors(updated);
  };

  // Delete message handler
  const handleDeleteMessage = (id: string) => {
    if (!window.confirm("Delete this patient message?")) return;
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
  };

  // Update Appointment status handler
  const handleUpdateAppointmentStatus = (id: string, status: "Pending" | "Confirmed" | "Cancelled") => {
    const updated = appointments.map((a) => (a.id === id ? { ...a, status } : a));
    setAppointments(updated);
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <section id="admin-doctors" className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-indigo-950 py-24 sm:py-32 text-slate-100 min-h-screen">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-4 border border-cyan-500/30">
              <Sparkles size={14} /> Admin Management Console
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Hospital Doctors & Clinical Management
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Manage doctor profiles, view patient secure messages, check doctor ratings, and handle appointment requests.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105 shrink-0"
          >
            <Plus size={18} />
            <span>Add New Doctor</span>
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveAdminTab("doctors")}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === "doctors" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Stethoscope size={16} /> Doctors Directory ({doctors.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab("messages")}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === "messages" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <MessageSquare size={16} /> Patient Messages ({messages.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab("ratings")}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === "ratings" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Star size={16} /> Doctor Ratings ({ratings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveAdminTab("appointments")}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition flex items-center gap-2 ${
              activeAdminTab === "appointments" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30" : "bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Calendar size={16} /> Appointment Requests ({appointments.length})
          </button>
        </div>

        {/* TAB 1: DOCTORS DIRECTORY */}
        {activeAdminTab === "doctors" && (
          <div>
            {doctors.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">
                <Stethoscope size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">No doctors recorded in database</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.map((doc) => {
                  const docImages = doc.imageUrls?.length > 0 ? doc.imageUrls : ["https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"];

                  return (
                    <div
                      key={doc.id}
                      className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-52 w-full rounded-2xl overflow-hidden border border-white/10 bg-slate-950 mb-5">
                          <img src={docImages[0]} alt={doc.name} className="w-full h-full object-cover" />
                          <div className="absolute top-3 left-3 flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              doc.active ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                            }`}>
                              {doc.active ? "Active" : "Inactive"}
                            </span>
                            {docImages.length > 1 && (
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-slate-950/80 text-cyan-300 border border-white/10 flex items-center gap-1">
                                <Layers size={10} /> {docImages.length}
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white">{doc.name}</h3>
                        <p className="text-xs font-bold text-cyan-400 mt-0.5">{doc.specialization}</p>
                        <p className="text-xs text-slate-400 font-mono mt-1">{doc.qualification}</p>

                        <div className="mt-4 space-y-1 text-xs text-slate-300 font-mono">
                          <p>Phone: {doc.phone}</p>
                          <p className="truncate">Email: {doc.email}</p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                        <div className="flex gap-2">
                          <a
                            href={`tel:${doc.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-cyan-500/10 border border-cyan-500/30 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
                          >
                            <Phone size={14} /> Call
                          </a>
                          <a
                            href={`mailto:${doc.email}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 px-3 py-2 text-xs font-bold text-fuchsia-300 hover:bg-fuchsia-500/20"
                          >
                            <Mail size={14} /> Email
                          </a>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => toggleStatus(doc.id)}
                            className="text-xs font-semibold text-slate-400 hover:text-white"
                          >
                            Toggle Status
                          </button>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(doc)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300"
                              title="Edit"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDoctor(doc.id)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400"
                              title="Delete"
                            >
                              <Trash2 size={14} />
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

        {/* TAB 2: PATIENT MESSAGES */}
        {activeAdminTab === "messages" && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">
                <MessageSquare size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">No patient messages received yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full">
                          To: {msg.doctorName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{msg.date}</span>
                      </div>
                      <p className="text-sm text-slate-200 bg-white/5 border border-white/10 rounded-2xl p-4 leading-relaxed">
                        "{msg.messageText}"
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
                      >
                        <Trash2 size={13} /> Delete Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCTOR RATINGS */}
        {activeAdminTab === "ratings" && (
          <div className="space-y-4">
            {ratings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">
                <Star size={48} className="mx-auto text-amber-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">No ratings submitted yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ratings.map((rate) => (
                  <div key={rate.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full inline-block mb-3">
                        {rate.doctorName}
                      </span>
                      <div className="flex items-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={18}
                            className={s <= rate.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}
                          />
                        ))}
                        <span className="ml-2 font-mono text-sm font-bold text-amber-400">{rate.rating}.0</span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 text-right">
                      {rate.date}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: APPOINTMENT REQUESTS */}
        {activeAdminTab === "appointments" && (
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center">
                <Calendar size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-white">No appointment requests booked yet</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {appointments.map((appt) => (
                  <div key={appt.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-3 py-1 rounded-full">
                          {appt.doctorName}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          appt.status === "Confirmed" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                          appt.status === "Cancelled" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" :
                          "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}>
                          {appt.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 my-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <p><strong className="text-white">Patient:</strong> {appt.patientName}</p>
                        <p><strong className="text-white">Phone:</strong> {appt.patientPhone}</p>
                        <p><strong className="text-white">Preferred Date:</strong> {appt.appointmentDate}</p>
                        <p><strong className="text-white">Requested On:</strong> {appt.date}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateAppointmentStatus(appt.id, "Confirmed")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateAppointmentStatus(appt.id, "Cancelled")}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-bold transition"
                        >
                          Cancel
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">ID: {appt.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
            
            <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white">
                {editingDoctorId ? "Edit Doctor Profile" : "Add New Doctor"}
              </h3>
              <button onClick={() => setIsAdminOpen(false)} className="rounded-xl p-2 text-slate-400 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="mt-6 space-y-4 overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Specialization *</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Qualification</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <Upload size={14} /> Doctor Image URLs (At least 3 recommended)
                </label>
                <div className="space-y-2.5">
                  {imageUrls.map((url, idx) => (
                    <input
                      key={idx}
                      type="url"
                      value={url}
                      onChange={(e) => {
                        const newUrls = [...imageUrls];
                        newUrls[idx] = e.target.value;
                        setImageUrls(newUrls);
                      }}
                      placeholder={`Photo URL #${idx + 1}`}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-mono text-white outline-none focus:border-cyan-400"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">Biography</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="doc-active"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-slate-800 text-cyan-500"
                />
                <label htmlFor="doc-active" className="text-sm font-medium text-slate-200">
                  Active (Display publicly on website)
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/20"
                >
                  {editingDoctorId ? "Save Changes" : "Publish Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}