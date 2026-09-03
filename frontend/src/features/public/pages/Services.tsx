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
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

type MedicalService = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
  active: boolean;
};

const API_BASE_URL = "https://winstone-medical-center-1.onrender.com";
const API_URL = `${API_BASE_URL}/api/services`;

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

async function parseResponse<T>(response: Response): Promise<T> {
  const rawResponse = await response.text();

  let data: unknown = null;

  if (rawResponse.trim()) {
    try {
      data = JSON.parse(rawResponse);
    } catch {
      throw new Error(
        `Invalid server response (${response.status}): ${rawResponse.slice(0, 200)}`,
      );
    }
  }

  if (!response.ok) {
    const message =
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : `Failed to load services: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return data as T;
}

async function getPublicServices(): Promise<MedicalService[]> {
  const response = await fetch(`${API_URL}?active=true`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return parseResponse<MedicalService[]>(response);
}

function normalizeService(service: MedicalService): MedicalService {
  return {
    ...service,
    active: Boolean(service.active),
    imageUrls: Array.isArray(service.imageUrls) ? service.imageUrls : [],
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "box">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] =
    useState<MedicalService | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const databaseServices = await getPublicServices();

      setServices(
        databaseServices
          .map(normalizeService)
          .filter((service) => service.active),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not load medical services from the database.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedService]);

  const filteredServices = services.filter((service) => {
    const search = searchQuery.trim().toLowerCase();

    return (
      service.name.toLowerCase().includes(search) ||
      service.shortDescription.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search)
    );
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 py-24 text-slate-100 sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 p-[1px] shadow-lg shadow-cyan-500/10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 bg-clip-text px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-transparent backdrop-blur-md">
              <Sparkles size={14} className="text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
                Complete Healthcare Directory
              </span>
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Our Comprehensive{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Medical Services
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            Explore our full range of professional medical treatments,
            diagnostics, and family care programs. Click any service to inspect
            complete protocols and book appointments.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <Search size={18} />
            </span>

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search medical services..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-400 outline-none backdrop-blur-md transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
            />
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              View Layout:
            </span>

            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <LayoutGrid size={16} />
              Grid View
            </button>

            <button
              type="button"
              onClick={() => setViewMode("box")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                viewMode === "box"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Rows3 size={16} />
              List Box
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-8 flex items-start justify-between gap-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-rose-200">
            <div>
              <p className="font-bold">Unable to load services</p>
              <p className="mt-1 text-sm text-rose-200/80">{errorMessage}</p>
            </div>

            <button
              type="button"
              onClick={() => void loadServices()}
              className="rounded-xl bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-100 transition hover:bg-rose-500/30"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mt-10">
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-md">
              <LoaderCircle
                size={42}
                className="mx-auto animate-spin text-cyan-400"
              />
              <h3 className="mt-4 text-xl font-bold text-white">
                Loading medical services
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Retrieving current services from the database...
              </p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-16 text-center backdrop-blur-md">
              <Stethoscope
                size={48}
                className="mx-auto mb-4 animate-bounce text-cyan-400"
              />
              <h3 className="text-xl font-bold text-white">
                No matching services found
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Try adjusting your search query to find what you&apos;re looking
                for.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="group relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 text-left shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_20px_50px_rgba(6,182,212,0.15)] sm:p-8"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 opacity-60 blur-2xl transition duration-500 group-hover:scale-150" />

                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:scale-110">
                        <ServiceIcon icon={service.icon} />
                      </div>

                      <span className="rounded-full border border-cyan-500/30 bg-cyan-950/60 px-3 py-1 font-mono text-[11px] tracking-wide text-cyan-300/80">
                        #{service.id}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-300">
                      {service.name}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300/90">
                      {service.shortDescription || service.description}
                    </p>

                    {service.imageUrls.length > 0 && (
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                        <Layers size={14} />
                        <span>
                          {service.imageUrls.length} image
                          {service.imageUrls.length > 1 ? "s" : ""} included
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 transition-colors group-hover:text-fuchsia-400">
                      View Full Details
                      <ArrowRight className="transition-transform group-hover:translate-x-1.5" size={16} />
                    </span>

                    <span className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-cyan-500/20">
                      Inspect
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="group relative flex w-full flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-white/[0.08] to-white/[0.02] p-6 text-left shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-cyan-400/50 hover:bg-white/[0.12] hover:shadow-[0_10px_30px_rgba(6,182,212,0.1)] sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="flex min-w-0 items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/30 transition-transform group-hover:scale-105">
                      <ServiceIcon icon={service.icon} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-cyan-300">
                          {service.name}
                        </h3>

                        <span className="rounded-full border border-cyan-500/30 bg-cyan-950/80 px-3 py-0.5 font-mono text-[11px] text-cyan-300">
                          #{service.id}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-slate-300/90">
                        {service.shortDescription || service.description}
                      </p>

                      {service.imageUrls.length > 0 && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-cyan-400">
                          <Layers size={13} />
                          <span>
                            {service.imageUrls.length} image
                            {service.imageUrls.length > 1 ? "s" : ""} available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-2 self-end rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition-all group-hover:from-fuchsia-500 group-hover:to-purple-600 sm:self-center">
                    Explore Care
                    <ArrowRight size={15} />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedService &&
        (() => {
          const modalImages = selectedService.imageUrls;
          const currentImage =
            modalImages[activeImageIndex] || modalImages[0];

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6">
              <div className="relative my-auto flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-b from-slate-900 to-slate-950 p-5 text-slate-100 shadow-2xl sm:p-8">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl" />

                <div className="relative z-10 flex shrink-0 items-start justify-between border-b border-white/10 pb-4">
                  <div className="flex min-w-0 items-center gap-3 pr-2 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white shadow-lg shadow-cyan-500/30 sm:h-16 sm:w-16">
                      <ServiceIcon icon={selectedService.icon} />
                    </div>

                    <div className="min-w-0">
                      <span className="inline-block rounded-full border border-cyan-500/30 bg-cyan-950/80 px-2.5 py-0.5 font-mono text-[10px] text-cyan-300 sm:text-xs">
                        ID: #{selectedService.id}
                      </span>

                      <h3 className="mt-1 truncate text-lg font-bold text-white sm:text-2xl">
                        {selectedService.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Close modal"
                  >
                    <X size={22} />
                  </button>
                </div>

                <div className="relative z-10 mt-4 flex-1 space-y-5 overflow-y-auto pr-1 sm:mt-6">
                  {modalImages.length > 0 && currentImage && (
                    <div className="space-y-3">
                      <div className="flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2 shadow-xl">
                        <img
                          src={currentImage}
                          alt={selectedService.name}
                          className="max-h-[50vh] h-auto w-full rounded-xl object-contain"
                        />
                      </div>

                      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
                        <span>Full uncropped image display</span>
                        <span className="font-mono text-cyan-300">
                          {activeImageIndex + 1} of {modalImages.length}
                        </span>
                      </div>

                      {modalImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {modalImages.map((image, index) => (
                            <button
                              key={`${image}-${index}`}
                              type="button"
                              onClick={() => setActiveImageIndex(index)}
                              className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-950 transition ${
                                activeImageIndex === index
                                  ? "scale-105 border-cyan-400 shadow-md shadow-cyan-500/30"
                                  : "border-white/10 opacity-60 hover:opacity-100"
                              }`}
                            >
                              <img
                                src={image}
                                alt={`${selectedService.name} ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fuchsia-400">
                      <Sparkles size={13} />
                      Quick Summary
                    </h4>

                    <p className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs font-medium text-slate-200 sm:p-4 sm:text-sm">
                      {selectedService.shortDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
                      <ShieldCheck size={14} />
                      Full Treatment & Care Protocol
                    </h4>

                    <p className="whitespace-pre-line rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs leading-relaxed text-slate-300 sm:p-4 sm:text-sm">
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex shrink-0 flex-col items-center justify-end gap-3 border-t border-white/10 pt-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setSelectedService(null)}
                    className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 sm:w-auto"
                  >
                    Close View
                  </button>

                  <a
                    href="/appointment"
                    onClick={() => setSelectedService(null)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02] hover:shadow-fuchsia-500/30 sm:w-auto"
                  >
                    Book This Appointment
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











