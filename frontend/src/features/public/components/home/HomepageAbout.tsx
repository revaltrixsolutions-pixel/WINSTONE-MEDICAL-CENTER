import { CheckCircle2, ArrowRight, ShieldCheck, HeartPulse, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import homeAboutImg from "@/assets/Homeabout.png";

const points = [
  "Registered private hospital administered under Medical Practitioners & Dentists Board",
  "Dedicated Urgent Care Centre, Local Injuries & Medical Assessment Unit",
  "Community-driven health programs & Tassia slum medical camps",
  "Welcoming, safe, affordable, and respectful patient-centered care",
];

export default function HomepageAbout() {
  return (
    <section id="about" className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-24 text-slate-100 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image & Scrollable Highlights Card */}
          <div className="relative space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />
              <img
                src={homeAboutImg}
                alt="Winston Medical Centre Facility"
                className="w-full h-[380px] sm:h-[420px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 z-20 rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur-xl px-5 py-3 shadow-2xl flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Est. 2016</p>
                  <p className="text-sm font-bold text-white">Eastlands, Nairobi</p>
                </div>
              </div>
            </div>

            {/* Scrollable Summary Box */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl max-h-48 overflow-y-auto space-y-3 shadow-inner custom-scrollbar">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles size={14} /> Quick Hospital Summary
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Winston Medical Centre opened its doors in 2016 along Nyayo Gate B road (400m from Fedha stage). We offer comprehensive inpatient and outpatient specialties including General Medicine, Minor Surgery, Gynecology, Pharmacy, Laboratory, and Maternal & Child Healthcare.
              </p>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Committed to social responsibility, we partner with WAYAAP NGO to care for orphans and regularly host free medical check-ups in Tassia.
              </p>
            </div>
          </div>

          {/* Content side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider shadow-lg backdrop-blur-md">
              <HeartPulse size={14} className="text-cyan-400" /> About Winston Medical Centre
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Healthcare Built Around <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">You & Your Family</span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Winston Medical Centre is fully registered and managed under the Medical Practitioners and Dentists Board. We provide welcoming, accessible, safe, affordable, and respectful medical services to our community.
            </p>

            <div className="space-y-3.5 pt-2">
              {points.map((point, index) => (
                <div key={index} className="flex items-start gap-3.5">
                  <div className="rounded-full bg-cyan-500/10 border border-cyan-500/30 p-1 text-cyan-400 mt-0.5 shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-medium text-sm sm:text-base text-slate-200">{point}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:scale-105"
              >
                <span>Read Full About Us</span>
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/appointment"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-sm font-bold text-slate-200 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
              >
                <span>Book Consultation</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}






