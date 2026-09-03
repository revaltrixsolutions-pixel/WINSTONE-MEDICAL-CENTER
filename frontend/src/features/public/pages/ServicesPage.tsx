import {
  Baby,
  HeartPulse,
  Pill,
  Siren,
  Stethoscope,
  TestTube,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  LayoutGrid,
  Rows3,
  Layers,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react"; 
import { getServices, type MedicalService } from "@/data/services";

const iconMap = {
  Stethoscope,
  TestTube,
  Pill,
  Baby,
  HeartPulse,
  Siren,
};

function ServiceIcon({ icon }: { icon: string }) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? Stethoscope;
  return <Icon size={26} strokeWidth={2} />;
}

export default function ServicesPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "box">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const loadServices = async () => {
      setServices((await getServices()).filter((service: MedicalService) => service.active));
    };

    loadServices();
    window.addEventListener("storage", loadServices);
    return () => {
      window.removeEventListener("storage", loadServices);
    };
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedService]);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-24 sm:py-32 min-h-screen text-slate-100">
      {/* Background Decorative Glows */}
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              Complete Healthcare Directory
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Our Comprehensive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Medical Services
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
            Explore our full range of professional medical treatments, diagnostics, and family care programs. Click any service to inspect complete protocols and book appointments.
          </p>
        </div>

        {/* Controls Toolbar: Search & View Mode Switcher (Grid vs Box) */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medical services..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 backdrop-blur-md"
            />
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">View Layout:</span>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <LayoutGrid size={16} />
              <span>Grid View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("box")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-sm ${
                viewMode === "box"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Rows3 size={16} />
              <span>List Box</span>
            </button>
          </div>
        </div>

        {/* Services Directory Display (No Scroll, Full Static Grid or List Box) */}
        <div className="mt-10">
          {filteredServices.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 backdrop-blur-md p-16 text-center">
              <Stethoscope size={48} className="mx-auto text-cyan-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-bold text-white">No matching services found</h3>
              <p className="mt-1 text-sm text-slate-400">Try adjusting your search query to find what you're looking for.</p>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW LAYOUT */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredServices.map((service) => {
                const serviceImages = service.imageUrls?.length
                  ? service.imageUrls
                  : service.imageUrl
                  ? [service.imageUrl]
                  : [];

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] cursor-pointer"
                  >
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 blur-2xl transition duration-500 group-hover:scale-150 opacity-60" />

                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                          <ServiceIcon icon={service.icon} />
                        </div>
                        <span className="font-mono text-[11px] tracking-wide text-cyan-300/80 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                          #{service.id}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {service.name}
                      </h3>

                      <p className="mt-3 text-sm leading-relaxed text-slate-300/90 line-clamp-3">
                        {service.shortDescription || service.description}
                      </p>

                      {serviceImages.length > 0 && (
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                          <Layers size={14} />
                          <span>{serviceImages.length} image{serviceImages.length > 1 ? "s" : ""} included</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 group-hover:text-fuchsia-400 transition-colors">
                        <span>View Full Details</span>
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1.5" />
                      </span>

                      <span className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20">
                        Inspect
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* BOX / LIST VIEW LAYOUT */
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const serviceImages = service.imageUrls?.length
                  ? service.imageUrls
                  : service.imageUrl
                  ? [service.imageUrl]
                  : [];

                return (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="group relative flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] cursor-pointer gap-6"
                  >
                    <div className="flex items-start gap-5 min-w-0">
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 shrink-0 group-hover:scale-105 transition-transform">
                        <ServiceIcon icon={service.icon} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {service.name}
                          </h3>
                          <span className="font-mono text-[11px] text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-3 py-0.5 rounded-full">
                            #{service.id}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-300/90 line-clamp-2 max-w-3xl">
                          {service.shortDescription || service.description}
                        </p>

                        {serviceImages.length > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 text-xs text-cyan-400 font-medium">
                            <Layers size={13} />
                            <span>{serviceImages.length} image{serviceImages.length > 1 ? "s" : ""} available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-cyan-500/20 group-hover:from-fuchsia-500 group-hover:to-purple-600 transition-all">
                        <span>Explore Care</span>
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Full Information Modal Popup */}
      {selectedService && (() => {
        const modalImages = selectedService.imageUrls?.length
          ? selectedService.imageUrls
          : selectedService.imageUrl
          ? [selectedService.imageUrl]
          : [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-8 shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              
              {/* Modal Glow Accents */}
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
              <div className="absolute -left-20 -bottom-20 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10 shrink-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-2">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-lg shadow-cyan-500/30 shrink-0">
                    <ServiceIcon icon={selectedService.icon} />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-[10px] sm:text-xs text-cyan-300 bg-cyan-950/80 border border-cyan-500/30 px-2.5 py-0.5 rounded-full inline-block">
                      ID: #{selectedService.id}
                    </span>
                    <h3 className="mt-1 text-lg sm:text-2xl font-bold text-white truncate">{selectedService.name}</h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition shrink-0"
                  aria-label="Close modal"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Scrollable Modal Body Content */}
              <div className="mt-4 sm:mt-6 space-y-5 relative z-10 overflow-y-auto pr-1 flex-1">
                
                {/* Full Uncropped Image View Display */}
                {modalImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="w-full rounded-2xl border border-white/10 bg-slate-950 overflow-hidden shadow-xl flex items-center justify-center p-2">
                      <img
                        src={modalImages[activeImageIndex] || modalImages[0]}
                        alt={selectedService.name}
                        className="w-full h-auto max-h-[50vh] object-contain rounded-xl transition-all duration-300"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span>Full uncropped image display</span>
                      <span className="font-mono text-cyan-300">
                        {activeImageIndex + 1} of {modalImages.length}
                      </span>
                    </div>

                    {modalImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {modalImages.map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveImageIndex(i)}
                            className={`h-14 w-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition bg-slate-950 ${
                              activeImageIndex === i ? "border-cyan-400 scale-105 shadow-md shadow-cyan-500/30" : "border-white/10 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-1.5">
                    <Sparkles size={13} /> Quick Summary
                  </h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-200 bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4">
                    {selectedService.shortDescription || "Comprehensive medical care tailored to your wellness needs."}
                  </p>
                </div>

                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                    <ShieldCheck size={14} /> Full Treatment & Care Protocol
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-line bg-white/5 border border-white/10 rounded-2xl p-3.5 sm:p-4">
                    {selectedService.description}
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-end gap-3 relative z-10 shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 transition"
                >
                  Close View
                </button>
                <a
                  href="/appointment"
                  onClick={() => setSelectedService(null)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:shadow-fuchsia-500/30 hover:scale-[1.02] transition"
                >
                  <span>Book This Appointment</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}










