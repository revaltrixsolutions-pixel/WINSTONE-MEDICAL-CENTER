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

export type MedicalService = {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
  active: boolean;
};

type ServicePayload = {
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  imageUrls: string[];
};

const API_BASE_URL = "https://winstone-medical-center-1.onrender.com";
const API_URL = `${API_BASE_URL}/api/services`;

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

async function parseResponse<T>(response: Response): Promise<T> {
  const rawResponse = await response.text();

  let data: unknown = null;

  if (rawResponse.trim()) {
    try {
      data = JSON.parse(rawResponse);
    } catch {
      throw new Error(
        `Server returned an invalid response (${response.status}): ${rawResponse.slice(0, 250)}`,
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
        : `Request failed: ${response.status} ${response.statusText}`;

    throw new Error(message);
  }

  return data as T;
}

async function fetchServices(): Promise<MedicalService[]> {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  return parseResponse<MedicalService[]>(response);
}

async function createService(
  payload: ServicePayload,
): Promise<MedicalService> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<MedicalService>(response);
}

async function updateService(
  id: string,
  payload: ServicePayload,
): Promise<MedicalService> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<MedicalService>(response);
}

async function updateVisibility(
  id: string,
  active: boolean,
): Promise<MedicalService> {
  const response = await fetch(`${API_URL}/${id}/visibility`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ active }),
  });

  return parseResponse<MedicalService>(response);
}

async function removeService(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  await parseResponse<{ message: string }>(response);
}

function normalizeService(service: MedicalService): MedicalService {
  return {
    ...service,
    imageUrls: Array.isArray(service.imageUrls) ? service.imageUrls : [],
    active: Boolean(service.active),
  };
}

export default function ServiceManager() {
  const [services, setServices] = useState<MedicalService[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const databaseServices = await fetchServices();
      setServices(databaseServices.map(normalizeService));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to load services from the database.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    setImageUrlInput("");
    setImageInputMode("url");
    setErrorMessage(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files?.length) return;

    if (form.imageUrls.length >= 5) {
      alert("Maximum limit of 5 images reached.");
      return;
    }

    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert("Each image must be under 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result as string;

      setForm((previousForm) => {
        if (previousForm.imageUrls.length >= 5) return previousForm;

        return {
          ...previousForm,
          imageUrls: [...previousForm.imageUrls, imageData],
        };
      });
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();

    if (!url) return;

    if (form.imageUrls.length >= 5) {
      alert("Maximum limit of 5 images reached.");
      return;
    }

    setForm((previousForm) => ({
      ...previousForm,
      imageUrls: [...previousForm.imageUrls, url],
    }));

    setImageUrlInput("");
  };

  const removeImage = (index: number) => {
    setForm((previousForm) => ({
      ...previousForm,
      imageUrls: previousForm.imageUrls.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.shortDescription.trim() ||
      !form.description.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    const payload: ServicePayload = {
      name: form.name.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      icon: form.icon,
      imageUrls: form.imageUrls.slice(0, 5),
    };

    try {
      setIsSaving(true);
      setErrorMessage(null);

      if (editingId) {
        const updatedService = normalizeService(
          await updateService(editingId, payload),
        );

        setServices((currentServices) =>
          currentServices.map((service) =>
            service.id === editingId ? updatedService : service,
          ),
        );
      } else {
        const createdService = normalizeService(await createService(payload));

        setServices((currentServices) => [
          createdService,
          ...currentServices,
        ]);
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to save service to the database.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (service: MedicalService) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      shortDescription: service.shortDescription,
      description: service.description,
      icon: service.icon,
      imageUrls: service.imageUrls || [],
    });
    setShowForm(true);
    setErrorMessage(null);
  };

  const deleteService = async (id: string) => {
    const service = services.find((item) => item.id === id);

    if (!service) return;

    const confirmed = window.confirm(
      `Delete "${service.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setErrorMessage(null);
      await removeService(id);

      setServices((currentServices) =>
        currentServices.filter((serviceItem) => serviceItem.id !== id),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete service.",
      );
    }
  };

  const toggleService = async (id: string) => {
    const currentService = services.find((service) => service.id === id);

    if (!currentService) return;

    try {
      setErrorMessage(null);

      const updatedService = normalizeService(
        await updateVisibility(id, !currentService.active),
      );

      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === id ? updatedService : service,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to update service visibility.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl" />

        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-200">
              <Sparkles size={13} />
              Admin Portal
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              Medical Services Management
            </h2>

            <p className="mt-1 max-w-xl text-sm text-blue-100">
              Manage medical services stored directly in the database.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
              setErrorMessage(null);
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-600 shadow-lg transition hover:scale-105 hover:bg-cyan-50 active:scale-95"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-rose-700">
          <div>
            <p className="font-bold">Operation failed</p>
            <p className="mt-1 text-xs">{errorMessage}</p>
          </div>

          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="rounded-lg p-1 hover:bg-rose-100"
            aria-label="Dismiss error"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-b from-white to-slate-50 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {editingId ? "Edit Medical Service" : "Add New Medical Service"}
              </h3>

              <p className="mt-0.5 text-xs text-slate-500">
                {editingId
                  ? `Database ID: ${editingId}`
                  : "The database generates the service ID automatically."}
              </p>
            </div>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close form"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Service Name <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Advanced Pediatrics"
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lucide Icon Identifier
                </label>

                <select
                  value={form.icon}
                  onChange={(event) =>
                    setForm({ ...form, icon: event.target.value })
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Short Summary <span className="text-rose-500">*</span>
              </label>

              <input
                type="text"
                value={form.shortDescription}
                onChange={(event) =>
                  setForm({ ...form, shortDescription: event.target.value })
                }
                placeholder="Brief tagline or card summary..."
                required
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Overview <span className="text-rose-500">*</span>
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Provide comprehensive service details..."
                rows={4}
                required
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
              <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-900">
                    <Layers size={14} className="text-indigo-600" />
                    Image Gallery Manager
                  </h4>

                  <p className="text-xs text-slate-500">
                    Add a maximum of 5 images.
                  </p>
                </div>

                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  {form.imageUrls.length} / 5 Images
                </span>
              </div>

              <div className="mb-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputMode("url")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                    imageInputMode === "url"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Add via URL
                </button>

                <button
                  type="button"
                  onClick={() => setImageInputMode("upload")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold ${
                    imageInputMode === "upload"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {form.imageUrls.length < 5 && (
                <div className="flex gap-2">
                  {imageInputMode === "url" ? (
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                        <LinkIcon size={15} />
                      </span>

                      <input
                        type="url"
                        value={imageUrlInput}
                        onChange={(event) => setImageUrlInput(event.target.value)}
                        placeholder="https://example.com/photo.jpg"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full rounded-xl border border-slate-200 bg-white p-1 text-xs text-slate-500"
                    />
                  )}

                  {imageInputMode === "url" && (
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="shrink-0 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                    >
                      Add Image
                    </button>
                  )}
                </div>
              )}

              {form.imageUrls.length > 0 ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {form.imageUrls.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="group relative h-24 overflow-hidden rounded-xl border border-indigo-200 bg-white"
                    >
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 transition group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="rounded-lg bg-rose-600 p-1.5 text-white hover:bg-rose-700"
                          title="Remove image"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-indigo-200 bg-white/50 py-4 text-center text-xs text-slate-400">
                  No images added yet.
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Service"
                    : "Save Medical Service"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-4">
          <div>
            <h3 className="font-extrabold text-slate-900">
              Configured Medical Inventory
            </h3>

            <p className="text-xs text-slate-500">
              Services loaded from the database.
            </p>
          </div>

          <span className="rounded-full bg-indigo-100 px-3.5 py-1 text-xs font-extrabold text-indigo-700">
            {services.length} Total Services
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading services from database...
            </div>
          ) : services.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <ImageIcon size={24} />
              </div>

              <p className="font-bold text-slate-800">No services available</p>

              <p className="mt-1 text-xs text-slate-500">
                Click Add New Service to create a database record.
              </p>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50/80 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-4">
                  {service.imageUrls.length > 0 ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                      <img
                        src={service.imageUrls[0]}
                        alt={service.name}
                        className="h-full w-full object-cover"
                      />

                      {service.imageUrls.length > 1 && (
                        <span className="absolute bottom-0 right-0 rounded-tl-lg bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                          +{service.imageUrls.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white shadow-md">
                      <span className="font-mono text-xs font-bold">
                        {service.icon.slice(0, 3)}
                      </span>
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-bold text-slate-900">
                        {service.name}
                      </h4>

                      <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-indigo-600">
                        ID: #{service.id}
                      </span>

                      <span
                        className={`rounded-full px-3 py-0.5 text-[11px] font-bold ${
                          service.active
                            ? "border border-emerald-100 bg-emerald-50 text-emerald-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {service.active ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs font-medium text-slate-600">
                      {service.shortDescription}
                    </p>

                    <p className="mt-1.5 text-[11px] text-slate-400">
                      Gallery: {service.imageUrls.length} image(s) loaded
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => void toggleService(service.id)}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                    title={service.active ? "Hide service" : "Show service"}
                  >
                    {service.active ? <Eye size={17} /> : <EyeOff size={17} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => startEdit(service)}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                    title="Edit service"
                  >
                    <Edit3 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void deleteService(service.id)}
                    className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete service"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => void loadServices()}
          className="text-xs font-semibold text-slate-400 transition hover:text-indigo-600"
        >
          Reload services from database
        </button>
      </div>
    </div>
  );
}












