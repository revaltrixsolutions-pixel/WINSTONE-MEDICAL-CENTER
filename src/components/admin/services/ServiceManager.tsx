import {
  Edit3,
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Link as LinkIcon,
  X,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  defaultServices,
  getServices,
  resetServices,
  saveServices,
  type MedicalService,
} from "../../../data/services";

const iconOptions = [
  "Stethoscope",
  "TestTube",
  "Pill",
  "Baby",
  "HeartPulse",
  "Siren",
];

const emptyForm = {
  name: "",
  shortDescription: "",
  description: "",
  icon: "Stethoscope",
  imageUrls: [] as string[],
};

export default function ServiceManager() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");

  useEffect(() => {
    setServices(getServices());
  }, []);

  const updateServices = (updated: MedicalService[]) => {
    setServices(updated);
    saveServices(updated);
  };

  // Helper to handle local file upload (converts to base64) with a max limit of 5
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (form.imageUrls.length >= 5) {
      alert("Maximum limit of 5 images reached.");
      return;
    }

    const file = files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert("Each image must be under 2MB for optimal performance.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (form.imageUrls.length < 5) {
        setForm((prev) => ({
          ...prev,
          imageUrls: [...prev.imageUrls, result],
        }));
      }
    };
    reader.readAsDataURL(file);
    event.target.value = ""; // Reset input
  };

  const addImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (form.imageUrls.length >= 5) {
      alert("Maximum limit of 5 images reached.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      imageUrls: [...prev.imageUrls, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.shortDescription.trim() || !form.description.trim()) {
      return;
    }

    if (editingId) {
      const updated = services.map((service) =>
        service.id === editingId
          ? {
              ...service,
              name: form.name.trim(),
              shortDescription: form.shortDescription.trim(),
              description: form.description.trim(),
              icon: form.icon,
              imageUrls: form.imageUrls,
              imageUrl: form.imageUrls[0] || "", // Keep backward compatibility fallback
            }
          : service,
      );

      updateServices(updated);
    } else {
      const autoId = `${Date.now()}-${form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}`;

      const newService: MedicalService = {
        id: autoId,
        name: form.name.trim(),
        shortDescription: form.shortDescription.trim(),
        description: form.description.trim(),
        icon: form.icon,
        imageUrls: form.imageUrls,
        imageUrl: form.imageUrls[0] || "",
        active: true,
      };

      updateServices([...services, newService]);
    }

    resetForm();
  };

  const startEdit = (service: MedicalService) => {
    setEditingId(service.id);

    // Normalize image array support (fallback to single imageUrl if imageUrls is undefined)
    const images = service.imageUrls?.length
      ? service.imageUrls
      : service.imageUrl
      ? [service.imageUrl]
      : [];

    setForm({
      name: service.name,
      shortDescription: service.shortDescription ?? service.description.slice(0, 100),
      description: service.description,
      icon: service.icon,
      imageUrls: images,
    });

    setShowForm(true);
  };

  const deleteService = (id: string) => {
    const service = services.find((item) => item.id === id);
    if (!service) return;

    const confirmed = window.confirm(`Delete "${service.name}"? This cannot be undone.`);
    if (!confirmed) return;

    updateServices(services.filter((item) => item.id !== id));
  };

  const toggleService = (id: string) => {
    updateServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service,
      ),
    );
  };

  const resetAllServices = () => {
    const confirmed = window.confirm(
      "Reset all services to the original Winston Medical Centre services?",
    );
    if (!confirmed) return;

    resetServices();
    setServices(defaultServices);
    resetForm();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImageUrlInput("");
    setImageInputMode("url");
  };

  return (
    <div className="space-y-6">
      {/* Colorful Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200 mb-2">
              <Sparkles size={13} /> Admin Portal
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical Services Management
            </h2>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Configure dynamic medical profiles with auto-generated IDs, multi-image galleries (up to 5 images), and vibrant displays.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600 shadow-lg shadow-black/10 transition hover:bg-cyan-50 hover:scale-105 active:scale-95"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>
      </div>

      {/* Colorful Form Modal / Dropdown */}
      {showForm && (
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-white to-slate-50 p-6 sm:p-8 shadow-2xl animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingId ? "Edit Medical Service" : "Add New Medical Service"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {editingId ? `Service ID: ${editingId}` : "ID will be automatically generated upon creation."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Close form"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Service Name */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="e.g. Advanced Pediatrics"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                  required
                />
              </div>

              {/* Icon selection */}
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lucide Icon Identifier
                </label>
                <select
                  value={form.icon}
                  onChange={(event) => setForm({ ...form, icon: event.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Short Summary <span className="text-rose-500">*</span>{" "}
                <span className="text-[11px] font-normal text-slate-400">(Appears on scrolling cards)</span>
              </label>
              <input
                type="text"
                value={form.shortDescription}
                onChange={(event) => setForm({ ...form, shortDescription: event.target.value })}
                placeholder="Brief tagline or card summary..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                required
              />
            </div>

            {/* Long Description */}
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Overview <span className="text-rose-500">*</span>{" "}
                <span className="text-[11px] font-normal text-slate-400">(Appears in modal popup)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Provide comprehensive details about treatments, care plans, and specialized diagnostics..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-sm"
                required
              />
            </div>

            {/* Multi-Image Gallery Manager (Max 5) */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900">
                    <Layers size={14} className="text-indigo-600" /> Image Gallery Manager
                  </h4>
                  <p className="text-xs text-slate-500">
                    Add up to <span className="font-bold text-indigo-600">5 images</span> for this service (carousel/modal displays).
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  form.imageUrls.length >= 5 ? "bg-rose-100 text-rose-700" : "bg-indigo-100 text-indigo-700"
                }`}>
                  {form.imageUrls.length} / 5 Images Added
                </span>
              </div>

              {/* Input Type Switcher */}
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setImageInputMode("url")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    imageInputMode === "url" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Add via URL
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode("upload")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    imageInputMode === "upload" ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20" : "bg-white text-slate-600 border border-slate-200"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {/* Add Input Field */}
              {form.imageUrls.length < 5 && (
                <div className="flex gap-2">
                  {imageInputMode === "url" ? (
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                        <LinkIcon size={15} />
                      </span>
                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-xs outline-none transition focus:border-indigo-500"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition border border-slate-200 bg-white rounded-xl p-1"
                    />
                  )}

                  {imageInputMode === "url" && (
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-indigo-700 shrink-0"
                    >
                      Add Image
                    </button>
                  )}
                </div>
              )}

              {/* Thumbnail Gallery Preview Stream */}
              {form.imageUrls.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                  {form.imageUrls.map((url, index) => (
                    <div key={index} className="relative group rounded-xl overflow-hidden border border-indigo-200 bg-white shadow-sm h-24">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-lg bg-rose-600 p-1.5 text-white hover:bg-rose-700 transition shadow"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-center py-4 border border-dashed border-indigo-200 rounded-xl bg-white/50 text-slate-400 text-xs">
                  No images added yet. Add up to 5 pictures to showcase this service.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row pt-2">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:from-blue-700 hover:to-indigo-700"
              >
                <Save size={18} />
                {editingId ? "Update Service" : "Save Medical Service"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Colorful Services Listing Table / Grid */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900">Configured Medical Inventory</h3>
            <p className="text-xs text-slate-500">Live active offerings visible on public client layouts.</p>
          </div>
          <span className="rounded-full bg-indigo-100 px-3.5 py-1 text-xs font-extrabold text-indigo-700 shadow-sm">
            {services.length} Total Services
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-3">
                <ImageIcon size={24} />
              </div>
              <p className="font-bold text-slate-800">No services available</p>
              <p className="mt-1 text-xs text-slate-500">
                Click "Add New Service" above to build your medical roster.
              </p>
            </div>
          ) : (
            services.map((service) => {
              const gallery = service.imageUrls?.length
                ? service.imageUrls
                : service.imageUrl
                ? [service.imageUrl]
                : [];

              return (
                <div
                  key={service.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between transition hover:bg-slate-50/80"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Primary Image Preview or Icon Box */}
                    {gallery.length > 0 ? (
                      <div className="relative h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 shadow-sm">
                        <img
                          src={gallery[0]}
                          alt={service.name}
                          className="h-full w-full object-cover"
                        />
                        {gallery.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-tl-lg">
                            +{gallery.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center text-white flex-shrink-0 shadow-md shadow-indigo-500/20">
                        <span className="font-mono text-xs font-bold">{service.icon.slice(0, 3)}</span>
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-base">{service.name}</h4>
                        <span className="font-mono text-[11px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-semibold">
                          ID: #{service.id}
                        </span>
                        <span
                          className={`rounded-full px-3 py-0.5 text-[11px] font-bold shadow-xs ${
                            service.active
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {service.active ? "Visible" : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-1 text-xs font-medium text-slate-600 line-clamp-1">
                        {service.shortDescription || service.description}
                      </p>
                      
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Gallery: {gallery.length} image(s) loaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 shadow-xs"
                      title={service.active ? "Hide service" : "Show service"}
                    >
                      {service.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(service)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 shadow-xs"
                      title="Edit service"
                    >
                      <Edit3 size={17} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 shadow-xs"
                      title="Delete service"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Reset Default Services */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={resetAllServices}
          className="text-xs font-semibold text-slate-400 transition hover:text-rose-500"
        >
          Reset default clinic services
        </button>
      </div>
    </div>
  );
}