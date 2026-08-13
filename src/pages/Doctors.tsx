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

export default function HomepageDoctorsGrid() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modal Interactive States ("profile" | "message" | "rate" | "book")
  const [activeModalTab, setActiveModalTab] = useState<"profile" | "message" | "rate" | "book">("profile");

  // Message Form State
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  // Rating State
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratedSuccess, setRatedSuccess] = useState(false);

  // Booking Form State
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    loadDoctors();
    window.addEventListener("storage", loadDoctors);
    return () => window.removeEventListener("storage", loadDoctors);
  }, []);

  const loadDoctors = () => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(DOCTORS_STORAGE_KEY);
    if (saved) {
      try {
        setDoctors(JSON.parse(saved));
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
        {
          id: "doc-2",
          name: "Dr. Brenda Mutua",
          specialization: "Pediatrics & Child Health",
          qualification: "MBChB, MMed (Paediatrics)",
          phone: "+254 708 130 100",
          email: "dr.brenda@winstonmedical.co.ke",
          bio: "Specializing in infant care, neonatal wellness, childhood immunizations, and adolescent preventive medicine.",
          imageUrls: [
            "https://images.unsplash.com/photo-1594824813578-832f913d81b4?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1527613426441-2da1747f7c2f?q=80&w=800&auto=format&fit=crop",
          ],
          active: true,
        },
        {
          id: "doc-3",
          name: "Dr. Kevin Kiprono",
          specialization: "Internal Medicine & Diagnostics",
          qualification: "MBChB, Internal Medicine Specialist",
          phone: "+254 708 130 100",
          email: "dr.kevin@winstonmedical.co.ke",
          bio: "Expert in managing chronic illnesses, metabolic disorders, cardiovascular screening, and advanced diagnostic care.",
          imageUrls: [
            "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=800&auto=format&fit=crop",
          ],
          active: true,
        },
      ];
      localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(initial));
      setDoctors(initial);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedDoctor) return;

    const newMessage: PatientMessage = {
      id: `msg-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      messageText: messageText.trim(),
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem(MESSAGES_STORAGE_KEY) || "[]");
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([newMessage, ...existing]));

    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setActiveModalTab("profile");
    }, 2200);
  };

  const handleRateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    const newRating: DoctorRating = {
      id: `rate-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      rating,
      date: new Date().toLocaleDateString(),
    };

    const existing = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || "[]");
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify([newRating, ...existing]));

    setRatedSuccess(true);
    setTimeout(() => {
      setRatedSuccess(false);
      setActiveModalTab("profile");
    }, 2000);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientPhone.trim() || !appointmentDate || !selectedDoctor) {
      alert("Please fill in all appointment booking fields.");
      return;
    }

    const newAppt: AppointmentRequest = {
      id: `appt-${Date.now()}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      appointmentDate,
      status: "Pending",
      date: new Date().toLocaleString(),
    };

    const existing = JSON.parse(localStorage.getItem(APPOINTMENTS_STORAGE_KEY) || "[]");
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify([newAppt, ...existing]));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setPatientName("");
      setPatientPhone("");
      setAppointmentDate("");
      setSelectedDoctor(null);
    }, 2500);
  };

  const activeDoctors = doctors.filter((d) => d.active);

  return (
    <section id="doctors" className="bg-slate-50 py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl text-center mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 border border-blue-200">
            <Sparkles size={14} /> Available Medical Specialists
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Meet Our Expert Healthcare Team
          </h2>

          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Browse through our available practitioners below. Click any card to inspect full profiles, send a message, rate, or book an appointment.
          </p>
        </div>

        {/* Doctor Grid Container */}
        {activeDoctors.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
            <Stethoscope size={48} className="mx-auto text-blue-600 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900">No specialist doctors available right now</h3>
            <p className="mt-1 text-sm text-slate-500">Please check back soon for our active practitioner listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeDoctors.map((doc) => {
              const docImages = doc.imageUrls?.length > 0 ? doc.imageUrls : ["https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"];

              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setActiveImageIndex(0);
                    setActiveModalTab("profile");
                    setMessageSent(false);
                    setRatedSuccess(false);
                    setBookingSuccess(false);
                  }}
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Doctor Image Preview */}
                    <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={docImages[0]}
                        alt={doc.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {docImages.length > 1 && (
                        <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono text-white flex items-center gap-1">
                          <Layers size={12} /> {docImages.length} photos
                        </span>
                      )}
                    </div>

                    {/* Doctor Details */}
                    <div className="p-6 text-center">
                      <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 mb-2 border border-blue-100">
                        {doc.specialization}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {doc.bio || "Dedicated hospital practitioner offering clinical excellence."}
                      </p>
                    </div>
                  </div>

                  {/* Card Action footer */}
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

      {/* Full Doctor Profile Detail Modal */}
      {selectedDoctor && (() => {
        const modalImages = selectedDoctor.imageUrls?.length > 0 ? selectedDoctor.imageUrls : ["https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800&auto=format&fit=crop"];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {selectedDoctor.specialization}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{selectedDoctor.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedDoctor.qualification}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Tabs inside modal */}
              <div className="flex items-center gap-2 border-b border-slate-100 py-3 shrink-0 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveModalTab("profile")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    activeModalTab === "profile" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Full Profile
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("message")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    activeModalTab === "message" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Message Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("rate")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    activeModalTab === "rate" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Rate Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("book")}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    activeModalTab === "book" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Book Appointment
                </button>
              </div>

              {/* Scrollable Modal Content */}
              <div className="mt-4 space-y-5 overflow-y-auto pr-1 flex-1">
                
                {/* 1. PROFILE TAB */}
                {activeModalTab === "profile" && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="w-full rounded-2xl border border-slate-200 bg-slate-950 overflow-hidden shadow-md flex items-center justify-center p-2">
                      <img
                        src={modalImages[activeImageIndex]}
                        alt={selectedDoctor.name}
                        className="w-full h-auto max-h-[40vh] object-contain rounded-xl"
                      />
                    </div>
                    {modalImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {modalImages.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImageIndex(i)}
                            className={`h-12 w-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                              activeImageIndex === i ? "border-blue-600 scale-105 shadow-sm" : "border-slate-200 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Biography & Background</h4>
                      <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        {selectedDoctor.bio || "No biography provided."}
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModalTab("book")}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-[1.02]"
                      >
                        <Calendar size={16} />
                        <span>Book Appointment</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveModalTab("message")}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
                      >
                        <MessageSquare size={16} className="text-blue-600" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. MESSAGE TAB */}
                {activeModalTab === "message" && (
                  <div className="space-y-4 animate-fadeIn">
                    {messageSent ? (
                      <div className="py-12 text-center space-y-3">
                        <CheckCircle2 size={42} className="mx-auto text-emerald-500 animate-bounce" />
                        <h4 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h4>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto">
                          Your confidential message has been securely routed to {selectedDoctor.name}. The clinical team will respond shortly.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Send a Message to {selectedDoctor.name}</h4>
                          <p className="text-xs text-slate-500">Ask a general inquiry or request follow-up assistance.</p>
                        </div>
                        <textarea
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your confidential medical inquiry or message here..."
                          rows={5}
                          className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                        >
                          <Send size={16} />
                          <span>Dispatch Secure Message</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 3. RATE TAB */}
                {activeModalTab === "rate" && (
                  <div className="space-y-4 animate-fadeIn text-center py-4">
                    {ratedSuccess ? (
                      <div className="space-y-3">
                        <CheckCircle2 size={42} className="mx-auto text-emerald-500 animate-bounce" />
                        <h4 className="text-lg font-bold text-slate-900">Thank You for Your Feedback!</h4>
                        <p className="text-xs text-slate-600">Your rating helps maintain exceptional clinical standards.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleRateDoctor} className="space-y-6">
                        <div>
                          <h4 className="text-base font-bold text-slate-900">Rate {selectedDoctor.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">Tap a star to submit your clinical satisfaction score.</p>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-transform hover:scale-125 focus:outline-none"
                            >
                              <Star
                                size={32}
                                className={`${
                                  (hoverRating || rating) >= star
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-slate-300"
                                } transition-colors`}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                        >
                          <Star size={16} className="fill-white" />
                          <span>Submit {rating}-Star Rating</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}

                {/* 4. BOOK APPOINTMENT TAB */}
                {activeModalTab === "book" && (
                  <div className="space-y-4 animate-fadeIn">
                    {bookingSuccess ? (
                      <div className="py-12 text-center space-y-3">
                        <CheckCircle2 size={42} className="mx-auto text-emerald-500 animate-bounce" />
                        <h4 className="text-lg font-bold text-slate-900">Appointment Requested Successfully!</h4>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto">
                          We have received your booking request with {selectedDoctor.name}. Our front desk will contact you via phone to confirm.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleBookAppointment} className="space-y-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Book Appointment with {selectedDoctor.name}</h4>
                          <p className="text-xs text-slate-500">Provide your client information below so our hospital team can coordinate your visit.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Your Full Name <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={patientName}
                            onChange={(e) => setPatientName(e.target.value)}
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Phone Number <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={patientPhone}
                            onChange={(e) => setPatientPhone(e.target.value)}
                            placeholder="+254 700 000 000"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                            Preferred Date <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={appointmentDate}
                            onChange={(e) => setAppointmentDate(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white"
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 mt-2"
                        >
                          <Calendar size={16} />
                          <span>Submit Appointment Request</span>
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("book")}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  <Calendar size={14} /> Book Now
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}