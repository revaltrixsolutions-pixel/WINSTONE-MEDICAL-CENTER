import { 
  Building2, 
  Award, 
  Target, 
  Eye, 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Stethoscope, 
  MapPin, 
  Heart, 
  Activity, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom"; // Keep this line
import HomepageHeader from "@/layout/HomepageHeader.tsx";
import HomepageFooter from "@/layout/HomepageFooter.tsx";
import aboutHeroImg from "@/assets/aboutushero.png";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Header */}
      <HomepageHeader />

      {/* Hero Section with Background Image */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        {/* Background Image & Overlays */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={aboutHeroImg}
            alt="Winston Medical Centre Facility"
            className="w-full h-full object-cover object-center scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          {/* Multi-layered gradients for depth and premium medical aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          <div className="absolute inset-0 bg-blue-950/30 backdrop-blur-[2px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-xs font-bold text-cyan-300 uppercase tracking-widest shadow-xl backdrop-blur-md">
            <Sparkles size={14} className="text-cyan-400" /> Registered Private Hospital & Healthcare Leader
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white">
            Dedicated to Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500">Health & Well-being</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Established in 2016 in the expansive Eastlands area of Nairobi, delivering welcoming, accessible, safe, affordable, and respectful healthcare services to everyone.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/appointment"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:scale-105"
            >
              <span>Book a Consultation</span>
              <ArrowRight size={16} />
            </Link>
            <a
              href="#services-overview"
        
              className="inline-flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 px-7 py-4 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              <span>Explore Our Facility</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Facility Overview & History */}
        <section id="facility" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/30 px-3.5 py-1 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Building2 size={14} /> The Facility & History
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Quality Healthcare Rooted in Community Trust Since 2016
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Winston Medical Centre is a registered private hospital administered and managed in accordance with the Medical Practitioners and Dentist Board, with management approval granted in 2016. Located in the expansive Eastlands area at Standard Drive estate, along Nyayo Gate B road (400m from Fedha stage), we opened our doors with the core mission of giving quality and affordable healthcare to the community around us.
            </p>
            <p className="text-slate-300 leading-relaxed">
              The hospital features 2 dedicated beds with In-Patient specialties covering General Medicine, Minor Surgery, and Gynecology. We also feature an advanced Urgent Care Centre incorporating a Local Injuries Unit and Medical Assessment Unit.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="font-mono text-xs text-cyan-400">Location</p>
                <p className="text-sm font-bold text-white mt-1">Standard Drive, Nyayo Gate B, Fedha</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                <p className="font-mono text-xs text-cyan-400">Accreditation</p>
                <p className="text-sm font-bold text-white mt-1">Medical Practitioners & Dentists Board</p>
              </div>
            </div>
          </div>

          {/* Interactive Highlights Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
            
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Activity className="text-cyan-400" size={22} /> Patient-Centered Approach
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              We are dedicated to offering healthcare services that are welcoming, accessible, safe, affordable, and respectful to everyone. Winston Medical Centre engages patients, families, community representatives, and leaders as active partners to ensure their voices are included in every area of operations.
            </p>
            
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Behavioral Healthcare Partnership representation</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Active Hospital Operations & Executive teams</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Continuous quality improvement programs</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Mission, Vision & Core Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-cyan-400/50 transition">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Mission Statement</h3>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                To provide affordable, accessible, and quality healthcare services to all our patients and community members.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-cyan-400">
              WMC â€¢ CORE DIRECTIVE
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-blue-400/50 transition">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Vision Statement</h3>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                To be among the leading providers of accessible, quality, and innovative healthcare services in the country.
              </p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-blue-400">
              WMC â€¢ FUTURE OUTLOOK
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-fuchsia-400/50 transition">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6 group-hover:scale-110 transition-transform">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Core Values</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Professionalism</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Equality & Respect</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Integrity & Morals</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" /> Committed Service</li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-white/10 text-xs font-mono text-fuchsia-400">
              WMC â€¢ CODE OF CONDUCT
            </div>
          </div>
        </section>

        {/* Comprehensive Services List */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Stethoscope size={14} /> Medical Care Offerings
            </div>
            <h2 className="text-3xl font-extrabold text-white">Comprehensive Healthcare Services</h2>
            <p className="text-sm text-slate-300">
              Designed to cater to all primary, specialized, and preventative clinical needs under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              "General Outpatient Care",
              "Pharmacy Services",
              "Laboratory Services",
              "Ante-natal Clinic",
              "Well Baby Clinic",
              "Ultrasound Services",
              "Professional Counseling",
              "Maternal & Child Healthcare Clinic",
              "Physiotherapy",
              "ECG / ECHO Diagnostics",
              "Pediatric Clinic",
              "Safe Circumcision",
              "Family Planning Services"
            ].map((service, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-xl flex items-center gap-4 transition hover:bg-white/[0.05] hover:border-cyan-400/40"
              >
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold text-xs">
                  0{index + 1}
                </div>
                <span className="font-semibold text-sm text-slate-100">{service}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Goals & Strategy */}
        <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900/80 via-blue-950/40 to-slate-900/80 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-10">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <ShieldCheck size={14} /> Hospital Growth & Strategy
            </div>
            <h2 className="text-3xl font-extrabold text-white">Long-term Goals & Operational Excellence</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Our long-term goal is to thoroughly understand institutional organization to build an effective care continuum. We focus on enhancing chronic disease management, smooth transitions of care, and evidence-based medicine supported by continuous clinical monitoring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3 backdrop-blur-xl">
              <h4 className="text-base font-bold text-cyan-300 flex items-center gap-2">
                <CheckCircle2 size={18} /> Management Objectives
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To make available a well-equipped and efficient healthcare facility providing a much higher standard of patient care at appropriate costs with state-of-the-art medical practice.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-3 backdrop-blur-xl">
              <h4 className="text-base font-bold text-fuchsia-300 flex items-center gap-2">
                <CheckCircle2 size={18} /> Evidence-Based Medicine
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Cultivating a shared commitment to clinical guidelines, outcome tracking, continuous quality improvement, and comprehensive corporate healthcare solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Corporate Responsibility & Community Outreach */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 px-3.5 py-1 text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
              <HeartHandshake size={14} /> Community Impact
            </div>
            <h2 className="text-3xl font-extrabold text-white">Hospital Corporate Responsibility</h2>
            <p className="text-sm text-slate-300">
              Giving back to the community that trusts us through targeted outreach, subsidized healthcare, and dedicated partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                <Heart size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Subsidized Care for Needy Cases</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                As a way of appreciating our local community, we consistently offer subsidized costs across all our medical services for needy cases around our area.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">WAYAAP NGO Partnership</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                In partnership with WAYAAP (Women and Youth Against AIDS and Poverty) NGO, we actively serve and provide subsidized healthcare to orphans under their care.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl space-y-4 shadow-xl">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Tassia Slum Free Medical Camps</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We organize comprehensive free medical check-ups and distribute free medication to residents of the Tassia slum once every three months.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <HomepageFooter />
    </div>
  );
}





