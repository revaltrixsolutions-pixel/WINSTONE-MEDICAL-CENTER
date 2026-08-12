import { Clock3, Mail, MapPin, Phone, Sparkles, ArrowUpRight } from "lucide-react";

export default function HomepageContact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-slate-950 py-24 sm:py-32 text-slate-100">
      {/* High-Tech Background Glow Orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute -right-40 bottom-10 h-[450px] w-[450px] rounded-full bg-fuchsia-500/10 blur-[150px] animate-pulse" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              Get in Touch
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            We Are Here to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Help You
            </span>
          </h2>

          <p className="mt-4 text-base leading-relaxed text-slate-300">
            Reach out to Winston Medical Centre through any of our channels or visit our facility for prompt, professional care.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Phone Card */}
          <a
            href="tel:+254708130100"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] flex flex-col justify-between"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-500/20 blur-2xl transition duration-500 group-hover:scale-150" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                  <Phone size={26} />
                </div>
                <ArrowUpRight size={20} className="text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Phone Support</h3>
              <p className="mt-2 text-sm text-slate-300 font-mono">+254 708 130 100</p>
            </div>

            <span className="mt-6 inline-block text-xs font-semibold text-cyan-400">Call Us Now →</span>
          </a>

          {/* Email Card */}
          <a
            href="mailto:info@winstonmedical.co.ke"
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-fuchsia-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(217,70,239,0.15)] flex flex-col justify-between"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-fuchsia-500/20 blur-2xl transition duration-500 group-hover:scale-150" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform">
                  <Mail size={26} />
                </div>
                <ArrowUpRight size={20} className="text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors">Email Address</h3>
              <p className="mt-2 text-sm text-slate-300 truncate">info@winstonmedical.co.ke</p>
            </div>

            <span className="mt-6 inline-block text-xs font-semibold text-fuchsia-400">Send a Message →</span>
          </a>

          {/* Location Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-500/20 blur-2xl transition duration-500 group-hover:scale-150" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
                  <MapPin size={26} />
                </div>
                <span className="font-mono text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">Nairobi</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Location</h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">Standard Drive Fedha Gate B, Nairobi, Kenya</p>
            </div>

            <span className="mt-6 inline-block text-xs font-semibold text-emerald-400">Visit Facility</span>
          </div>

          {/* Opening Hours Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] flex flex-col justify-between">
            <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl transition duration-500 group-hover:scale-150" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <Clock3 size={26} />
                </div>
                <span className="font-mono text-[10px] bg-blue-950/80 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">Open</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">Opening Hours</h3>
              <p className="mt-2 text-sm text-slate-300">Mon - Sat: 8:00 AM - 6:00 PM</p>
            </div>

            <span className="mt-6 inline-block text-xs font-semibold text-blue-400">Emergency 24/7 Available</span>
          </div>

        </div>
      </div>
    </section>
  );
}