import { Home, FileText } from "lucide-react";
import { Link } from "react-router-dom"
import HomepageHeader from "@/layout/HomepageHeader.tsx";
import HomepageFooter from "@/layout/HomepageFooter.tsx";

export default function TermsPage() {
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
              <FileText size={14} className="text-cyan-400" /> Legal Agreement
            </div>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Conditions</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            Please read these terms and conditions carefully before using services provided by Winston Medical Centre.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
        
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 backdrop-blur-xl space-y-8 shadow-2xl">
          
          <div>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              Winston Medical Centre is a registered private hospital administered and managed in accordance with the Medical Practitioners and Dentists Board. By accessing our website, booking appointments, or visiting our facility located at Standard Drive estate, Nyayo Gate B road (Fedha), you agree to comply with and be bound by these Terms & Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">2. Medical Disclaimer & Emergency Care</h2>
            <p>
              Information provided on our website or through digital platforms is for general informational purposes only and does not substitute professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider regarding any medical condition. In case of a severe medical emergency, please visit our Urgent Care Centre immediately or contact emergency services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">3. Appointments and Consultations</h2>
            <p>
              Online appointment booking requests submitted through our platform are subject to confirmation by our hospital administration desk. While we strive to honor scheduled timings, emergency cases may occasionally cause unavoidable delays in consultations. We appreciate your patience and cooperation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">4. Insurance and Payments</h2>
            <p>
              We accept recognized insurance partners including SHA (Social Health Authority), GA Insurance, and Kenyan Alliance Insurance, alongside cash and digital payments. Patients are responsible for verifying their policy coverage, co-pays, and pre-authorizations prior to receiving specialized treatments or procedures.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">5. Patient Conduct & Facility Rules</h2>
            <p>
              To maintain a safe, welcoming, and respectful healing environment for all patients, families, and staff, Winston Medical Centre enforces strict policies against disruptive behavior, unauthorized recording, and non-compliance with hospital safety protocols.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-3">6. Modifications to Terms</h2>
            <p>
              Winston Medical Centre reserves the right to modify or update these terms at any time without prior notice. Continued use of our website or medical facility following any changes constitutes acceptance of the revised terms.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Effective Date: August 2026</span>
            <span>Winston Medical Centre Legal Department</span>
          </div>

        </div>

      </main>

      <HomepageFooter />
    </div>
  );
}







