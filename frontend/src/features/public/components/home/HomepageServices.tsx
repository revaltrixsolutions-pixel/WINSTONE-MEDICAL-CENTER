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
  Layers,
} from "lucide-react"; 
import { useEffect, useRef, useState } from "react";

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

export default function HomepageServices() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // References and state for smooth touch & mouse manual scrolling / dragging
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  // Reset image view index when modal service changes
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedService]);

  // Duplicate services to build a seamless infinite loop track
  const displayServices = [...services, ...services];

  // Touch and Mouse Drag / Hover Scroll Handlers (Guarantees stop on mouse/touch interaction)
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsPaused(true);
    startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll multiplier speed
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
    }
    // Keep paused while mouse is hovering over the container
    setIsPaused(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    setIsPaused(true);
    startX.current = e.touches[0].pageX - (scrollContainerRef.current?.offsetLeft || 0);
    scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
    }
    setIsPaused(false);
  };

  return (
    <section
      id="services"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-24 sm:py-32"
    >
      {/* High-Tech Background Glow Orbs */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px] animate-pulse" />
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[300px] w-[600px] rounded-full bg-blue-600/10 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Modern Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              Excellence in Healthcare
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Smart & Compassionate{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Medical Services
            </span>
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-300">
            Hover over any service to instantly stop scrolling and inspect, or click explore care for complete details.
          </p>
        </div>

        {/* Interactive Carousel Track with Mouse Hover & Touch Stop Support */}
        {services.length > 0 && (
          <div
            ref={scrollContainerRef}
            className="relative mt-16 overflow-x-auto overflow-y-hidden w-full py-8 cursor-grab active:cursor-grabbing no-scrollbar select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={handleMouseUpOrLeave}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Seamless Glass Fade Vignettes */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-36 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div
              className="flex gap-6 w-max items-stretch px-4"
              style={{
                animation: `marquee 40s linear infinite`,
                animationPlayState: isPaused ? "paused" : "running",
              }}
            >
              {displayServices.map((service, index) => {
                const serviceImages = service.imageUrls?.length
                  ? service.imageUrls
                  : service.imageUrl
                  ? [service.imageUrl]
                  : [];

                return (
                  <article
                    key={`${service.id}-${index}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-2xl p-6 sm:p-8 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] w-[85vw] sm:w-[360px] flex-shrink-0"
                  >
                    {/* Glowing Corner Aura */}
                    <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 blur-2xl transition duration-500 group-hover:scale-150 group-hover:opacity-100 opacity-60" />

                    <div>
                      {/* Top row: Icon + Smart ID Badge */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:from-fuchsia-500 group-hover:to-purple-600">
                          <ServiceIcon icon={service.icon} />
                        </div>
                        <span className="font-mono text-[11px] tracking-wide text-cyan-300/80 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          #{service.id}
                        </span>
                      </div>

                      {/* Service Name */}
                      <h3 className="relative text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {service.name}
                      </h3>

                      {/* Short Description */}
                      <p className="relative mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-300/90 line-clamp-2">
                        {service.shortDescription || service.description}
                      </p>

                      {/* Gallery badge indicator if images exist */}
                      {serviceImages.length > 0 && (
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-cyan-400 font-medium">
                          <Layers size={13} />
                          <span>{serviceImages.length} image{serviceImages.length > 1 ? "s" : ""} available</span>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="relative mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="group/btn inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-cyan-400 transition-colors hover:text-fuchsia-400"
                      >
                        <span>Explore Care</span>
                        <ArrowRight size={15} className="transition-transform group-hover/btn:translate-x-1.5" />
                      </button>

                      <a
                        href="/appointment"
                        className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-105 hover:from-fuchsia-500 hover:to-purple-600"
                      >
                        Book Now
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {services.length === 0 && (
          <div className="mt-16 rounded-3xl border border-dashed border-white/20 bg-white/5 backdrop-blur-md p-12 text-center">
            <Stethoscope size={40} className="mx-auto text-cyan-400 animate-bounce" />
            <h3 className="mt-4 text-lg font-bold text-white">Healthcare services coming soon</h3>
            <p className="mt-1 text-sm text-slate-400">Our available services will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Comprehensive Interactive Detail Modal with Full Uncropped Image View */}
      {selectedService && (() => {
        const modalImages = selectedService.imageUrls?.length
          ? selectedService.imageUrls
          : selectedService.imageUrl
          ? [selectedService.imageUrl]
          : [];

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-fadeIn overflow-y-auto">
            <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-5 sm:p-8 shadow-2xl text-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col">
              {/* Ambient Modal Glow */}
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
                        className="w-full h-auto max-h-[60vh] object-contain rounded-xl transition-all duration-300"
                      />
                    </div>

                    {/* Image Counter Badge */}
                    <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                      <span>Showing full original proportions</span>
                      <span className="font-mono text-cyan-300">
                        {activeImageIndex + 1} of {modalImages.length}
                      </span>
                    </div>

                    {/* Thumbnail selector if multiple images exist */}
                    {modalImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {modalImages.map((img, i) => (
                          <button // Explicitly type img and i
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

      {/* Marquee Keyframe Performance Styles & Scrollbar Utilities */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}



