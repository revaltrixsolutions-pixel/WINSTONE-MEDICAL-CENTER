import { ArrowRight, Clock3, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero.png";

export default function HomepageHero() {
  const insurances = [
    { name: "SHA (Social Health Authority)", badge: "SHA" },
    { name: "GA Insurance", badge: "GA" },
    { name: "Kenyan Alliance Insurance", badge: "KAI" },
  ];

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-sky-400 via-sky-300 to-cyan-400 text-slate-900 overflow-hidden py-24 lg:py-32"
    >
      {/* Moving and Glowing Starlight Background Overlay (Yellow & White Starlights) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0,transparent_100%)]" />
        
        {/* 20+ Drifting Starlights in Glowing Yellow & White */}
        {[
          { top: "8%", left: "12%", delay: "0s", duration: "6s", size: "8px", color: "bg-white shadow-[0_0_18px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.8)]" },
          { top: "18%", left: "75%", delay: "1.2s", duration: "8s", size: "10px", color: "bg-amber-200 shadow-[0_0_20px_rgba(254,240,138,1),0_0_35px_rgba(253,224,71,0.9)]" },
          { top: "32%", left: "25%", delay: "0.5s", duration: "7s", size: "7px", color: "bg-yellow-100 shadow-[0_0_16px_rgba(254,252,232,1),0_0_25px_rgba(250,204,21,0.8)]" },
          { top: "48%", left: "88%", delay: "2.3s", duration: "9s", size: "9px", color: "bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.9)]" },
          { top: "62%", left: "15%", delay: "0.8s", duration: "6s", size: "8px", color: "bg-amber-300 shadow-[0_0_22px_rgba(252,211,77,1),0_0_35px_rgba(245,158,11,0.9)]" },
          { top: "78%", left: "68%", delay: "1.5s", duration: "10s", size: "11px", color: "bg-white shadow-[0_0_25px_rgba(255,255,255,1),0_0_40px_rgba(255,255,255,0.9)]" },
          { top: "12%", left: "45%", delay: "2.0s", duration: "7s", size: "7px", color: "bg-yellow-200 shadow-[0_0_18px_rgba(254,240,138,1),0_0_28px_rgba(234,179,8,0.8)]" },
          { top: "28%", left: "92%", delay: "0.3s", duration: "8s", size: "9px", color: "bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_32px_rgba(255,255,255,0.8)]" },
          { top: "42%", left: "40%", delay: "1.7s", duration: "9s", size: "8px", color: "bg-amber-100 shadow-[0_0_18px_rgba(254,243,199,1),0_0_30px_rgba(252,211,77,0.9)]" },
          { top: "58%", left: "60%", delay: "0.6s", duration: "7s", size: "10px", color: "bg-yellow-300 shadow-[0_0_22px_rgba(253,224,71,1),0_0_38px_rgba(234,179,8,0.9)]" },
          { top: "85%", left: "20%", delay: "2.1s", duration: "6s", size: "7px", color: "bg-white shadow-[0_0_16px_rgba(255,255,255,1),0_0_25px_rgba(255,255,255,0.8)]" },
          { top: "22%", left: "5%", delay: "1.0s", duration: "8s", size: "9px", color: "bg-amber-200 shadow-[0_0_20px_rgba(254,240,138,1),0_0_32px_rgba(250,204,21,0.9)]" },
          { top: "38%", left: "65%", delay: "0.4s", duration: "8s", size: "8px", color: "bg-white shadow-[0_0_18px_rgba(255,255,255,1),0_0_28px_rgba(255,255,255,0.8)]" },
          { top: "52%", left: "30%", delay: "1.9s", duration: "7s", size: "10px", color: "bg-yellow-200 shadow-[0_0_22px_rgba(254,240,138,1),0_0_35px_rgba(234,179,8,0.9)]" },
          { top: "72%", left: "80%", delay: "1.3s", duration: "10s", size: "7px", color: "bg-amber-100 shadow-[0_0_16px_rgba(254,243,199,1),0_0_25px_rgba(252,211,77,0.8)]" },
          { top: "90%", left: "50%", delay: "0.5s", duration: "6s", size: "9px", color: "bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_30px_rgba(255,255,255,0.9)]" },
          { top: "5%", left: "90%", delay: "2.4s", duration: "9s", size: "8px", color: "bg-yellow-300 shadow-[0_0_22px_rgba(253,224,71,1),0_0_38px_rgba(234,179,8,0.9)]" },
          { top: "15%", left: "28%", delay: "1.1s", duration: "7s", size: "10px", color: "bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_32px_rgba(255,255,255,0.8)]" },
          { top: "68%", left: "45%", delay: "0.7s", duration: "8s", size: "8px", color: "bg-amber-200 shadow-[0_0_18px_rgba(254,240,138,1),0_0_28px_rgba(250,204,21,0.9)]" },
          { top: "82%", left: "95%", delay: "1.6s", duration: "7s", size: "9px", color: "bg-white shadow-[0_0_20px_rgba(255,255,255,1),0_0_32px_rgba(255,255,255,0.8)]" },
        ].map((star, i) => (
          <span
            key={i}
            className={`absolute rounded-full animate-[twinkleAndFloat_7s_ease-in-out_infinite] ${star.color}`}
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDuration: star.duration,
              animationDelay: star.delay,
            }}
          />
        ))}

        {/* Floating Light Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-yellow-100/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Hero Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-md px-4 py-2 text-xs font-bold text-sky-800 shadow-lg border border-white/40">
              <Sparkles size={15} className="text-yellow-600 animate-spin" />
              <span>Trusted Healthcare • Standard Drive, Eastlands</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Quality Healthcare <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-sky-900 to-blue-950">
                You Can Trust
              </span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-800 font-medium">
              Winston Medical Centre provides compassionate, accessible, and professional healthcare services for individuals and families in Nairobi's Eastlands.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                to="/appointment"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:bg-slate-800 hover:scale-105"
              >
                <span>Book an Appointment</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md px-7 py-4 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-white/60 hover:border-white"
              >
                <span>Explore Services</span>
              </Link>
            </div>

            {/* Quick Feature Tickers */}
            <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-sky-400/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/60 shadow-sm text-sky-800">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Registered & Approved</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/60 shadow-sm text-sky-800">
                  <Clock3 size={20} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Urgent Care Ready</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-white/60 shadow-sm text-sky-800">
                  <Stethoscope size={20} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900">Expert Specialists</span>
              </div>
            </div>

          </div>

          {/* Right Hero Image Frame */}
          <div className="relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none rounded-3xl overflow-hidden border-4 border-white/60 shadow-2xl bg-gradient-to-br from-sky-500 to-blue-600 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent z-10" />
              
              <img
                src={heroImg}
                alt="Winston Medical Centre Healthcare Professional"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Banner inside Hero */}
              <div className="absolute bottom-6 left-6 right-6 z-20 rounded-2xl border border-white/20 bg-slate-950/70 backdrop-blur-xl p-5 shadow-2xl text-white">
                <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Accredited Facility</p>
                <p className="text-base font-bold mt-0.5">Medical Practitioners & Dentists Board</p>
                <p className="text-xs text-slate-300 mt-1">Standard Drive, Nyayo Gate B, Fedha</p>
              </div>
            </div>
          </div>

        </div>

        {/* Scrollable / Displayed Accepted Insurances at Base of Hero */}
        <div className="mt-20 pt-10 border-t border-sky-400/50">
          <p className="text-center text-xs font-mono uppercase tracking-widest text-slate-900 font-bold mb-6">
            Accepted Insurance & Healthcare Partners
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {insurances.map((ins, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl px-6 py-3.5 shadow-lg transition hover:bg-white/80 hover:scale-105"
              >
                <div className="h-9 w-9 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                  {ins.badge}
                </div>
                <span className="text-sm font-extrabold text-slate-900">{ins.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
