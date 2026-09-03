import { Home, Lock } from "lucide-react"; 
import { Link } from "react-router-dom"; 
import HomepageHeader from "@/layout/HomepageHeader.tsx";
import HomepageFooter from "@/layout/HomepageFooter.tsx";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <HomepageHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md transition hover:bg-white/20"
            >
              <Home size={14} className="text-cyan-400" /> Home
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-xs font-bold text-cyan-300 uppercase tracking-widest backdrop-blur-md">
              <Lock size={14} className="text-cyan-400" /> Data Protection
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Policy</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Your health data privacy and confidentiality are of utmost importance to Winston Medical Centre.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
        
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-xl space-y-8 shadow-2xl">
          
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you book an appointment, visit our hospital, or interact with our digital platforms, we may collect personal and medical information including your full name, contact number, email address, date of birth, insurance details, and preliminary health symptoms necessary for appointment scheduling and clinical care.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              The data collected is utilized strictly for:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3 text-slate-300">
              <li>Scheduling and managing outpatient or inpatient appointments.</li>
              <li>Providing safe, accurate, and personalized medical diagnosis and treatment.</li>
              <li>Processing insurance claims with accredited providers such as SHA, GA Insurance, and Kenyan Alliance.</li>
              <li>Communicating important health updates, follow-up care instructions, and hospital notices.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Medical Confidentiality & Data Security</h2>
            <p>
              In accordance with medical ethics and regulatory standards set by the Medical Practitioners and Dentists Board, all patient medical records and personal details are treated with strict confidentiality. We implement robust physical, administrative, and technical security measures to safeguard your information against unauthorized access or disclosure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Sharing of Information</h2>
            <p>
              We do not sell, trade, or rent your personal information. Data is only shared with authorized medical staff directly involved in your healthcare, or with insurance companies upon your explicit request for claim processing.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Your Rights</h2>
            <p>
              You have the right to request access to your personal medical records, correct inaccurate information, or inquire about how your data is handled by contacting our administrative desk directly at Winston Medical Centre.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Last Updated: August 2026</span>
            <span>Winston Medical Centre Compliance Team</span>
          </div>

        </div>

      </main>

      <HomepageFooter />
    </div>
  );
}





