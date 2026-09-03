import { useState, useEffect } from "react";

import {
  Trash2,
  Plus,
  Upload,
  Link as LinkIcon,
  Home,
  Loader2,
} from "lucide-react";

import { Link } from "react-router-dom";

interface GalleryItem {
  id: string;
  title: string;
  description?: string | null;
  type: "image" | "video" | "embed";
  url: string;
  isActive: boolean;
}

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Uses VITE_API_URL so the frontend talks directly to the Render backend
| in production instead of sending /api/gallery to Vercel.
|
| Local .env:
| VITE_API_URL=https://winstone-medical-center-1.onrender.com/api
|
| Vercel Environment Variable:
| VITE_API_URL=https://winstone-medical-center-1.onrender.com
|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.trim() ||
  "https://winstone-medical-center-1.onrender.com/api";

const GALLERY_API_URL = `${API_BASE_URL.replace(/\/+$/, "")}/gallery`;

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"image" | "video" | "embed">("image");
  const [url, setUrl] = useState("");

  // =========================================================
  // HELPER: SAFELY READ JSON
  // =========================================================

  const readResponse = async (res: Response): Promise<any> => {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return res.json().catch(() => null);
    }

    const text = await res.text().catch(() => "");

    if (
      text.toLowerCase().includes("<!doctype") ||
      text.toLowerCase().includes("<html")
    ) {
      throw new Error(
        `Gallery API returned HTML instead of JSON (${res.status}). ` +
          `Make sure VITE_API_URL points to the Render backend: ${API_BASE_URL}`,
      );
    }

    return null;
  };

  // =========================================================
  // 1. FETCH GALLERY ITEMS FROM DATABASE
  // =========================================================

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);

      const res = await fetch(GALLERY_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await readResponse(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to fetch gallery items: ${res.status}`,
        );
      }

      /*
       * Support:
       * [items]
       * { items: [...] }
       * { data: [...] }
       */

      const galleryItems = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setItems(galleryItems);
    } catch (err) {
      console.error("Error loading gallery items from DB:", err);

      setItems([]);

      alert(
        err instanceof Error
          ? err.message
          : "Unable to load gallery items from the database.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 2. HANDLE ADDING NEW MEDIA
  //    STORES RECORD THROUGH DATABASE API
  // =========================================================

  const handleAddMedia = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (submitting) return;

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    let processedUrl = url.trim();

    if (!cleanTitle) {
      alert("Please enter a title.");
      return;
    }

    if (!processedUrl) {
      alert("Please provide a media URL or upload a file.");
      return;
    }

    // =======================================================
    // Convert YouTube URLs to embed URLs
    // =======================================================

    if (type === "embed") {
      try {
        const parsedUrl = new URL(processedUrl);
        const hostname = parsedUrl.hostname.toLowerCase();

        // youtube.com/watch?v=VIDEO_ID
        if (
          (hostname === "youtube.com" ||
            hostname === "www.youtube.com" ||
            hostname === "m.youtube.com") &&
          parsedUrl.searchParams.get("v")
        ) {
          const videoId = parsedUrl.searchParams.get("v");

          if (videoId) {
            processedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }

        // youtu.be/VIDEO_ID
        else if (
          hostname === "youtu.be" ||
          hostname === "www.youtu.be"
        ) {
          const videoId = parsedUrl.pathname
            .replace(/^\/+/, "")
            .split("/")[0];

          if (videoId) {
            processedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }

        // youtube.com/shorts/VIDEO_ID
        else if (parsedUrl.pathname.includes("/shorts/")) {
          const videoId = parsedUrl.pathname
            .split("/shorts/")[1]
            ?.split("/")[0];

          if (videoId) {
            processedUrl = `https://www.youtube.com/embed/${videoId}`;
          }
        }

        // Already an embed URL
        else if (parsedUrl.pathname.startsWith("/embed/")) {
          processedUrl = parsedUrl.toString();
        }
      } catch {
        // Leave invalid URL untouched.
        // Backend can perform its own validation.
      }
    }

    const payload = {
      title: cleanTitle,
      description: cleanDescription || null,
      type,
      url: processedUrl,
      isActive: true,
    };

    try {
      setSubmitting(true);

      const res = await fetch(GALLERY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await readResponse(res);

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            `Failed to save media item: ${res.status}`,
        );
      }

      const newItem: GalleryItem =
        responseData?.item ||
        responseData?.data ||
        responseData;

      if (!newItem?.id) {
        throw new Error(
          "The server did not return the saved gallery item.",
        );
      }

      // Database is the source of truth.
      setItems((previousItems) => [
        newItem,
        ...previousItems,
      ]);

      // Clear form after successful database save.
      setTitle("");
      setDescription("");
      setUrl("");
      setType("image");

      // Reset file input.
      const fileInput = document.getElementById(
        "gallery-file-upload",
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      alert("Gallery media saved successfully.");
    } catch (err) {
      console.error("Failed to store media in DB:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Error saving item to database.";

      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // 3. HANDLE FILE UPLOAD
  //
  // The file is converted to Base64 and placed in the URL
  // field. The actual gallery record is NOT considered saved
  // until handleAddMedia sends it to the database.
  // =========================================================

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic validation
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
    ];

    const isImage = allowedImageTypes.includes(file.type);
    const isVideo = allowedVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      alert(
        "Please select a JPG, PNG, WEBP, GIF, MP4, WEBM, or OGG file.",
      );

      e.target.value = "";

      return;
    }

    // Prevent excessively large Base64 database payloads.
    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      alert(
        "The selected file is too large. Maximum size is 5 MB.",
      );

      e.target.value = "";

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        alert("Unable to read the selected file.");
        return;
      }

      setUrl(result);

      if (isVideo) {
        setType("video");
      } else {
        setType("image");
      }
    };

    reader.onerror = () => {
      console.error("Failed to read selected file.");

      alert("Unable to read the selected file.");
    };

    reader.readAsDataURL(file);
  };

  // =========================================================
  // 4. TOGGLE ACTIVE / HIDDEN STATUS
  //    PATCHES DATABASE
  // =========================================================

  const toggleActive = async (
    id: string,
    currentStatus: boolean,
  ) => {
    try {
      const newStatus = !currentStatus;

      const res = await fetch(
        `${GALLERY_API_URL}/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            isActive: newStatus,
          }),
        },
      );

      const responseData = await readResponse(res);

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            "Failed to update status.",
        );
      }

      // Only update UI after database update succeeds.
      setItems((previousItems) =>
        previousItems.map((item) =>
          item.id === id
            ? {
                ...item,
                isActive: newStatus,
              }
            : item,
        ),
      );
    } catch (err) {
      console.error("Failed to update item in DB:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to update gallery item.";

      alert(message);
    }
  };

  // =========================================================
  // 5. DELETE ITEM
  //    DELETES FROM DATABASE FIRST
  // =========================================================

  const deleteItem = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this media item?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${GALLERY_API_URL}/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const responseData = await readResponse(res);

      if (!res.ok) {
        throw new Error(
          responseData?.message ||
            responseData?.error ||
            "Failed to delete item.",
        );
      }

      // Only remove from UI after successful DB deletion.
      setItems((previousItems) =>
        previousItems.filter((item) => item.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete item from DB:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to delete gallery item.";

      alert(message);
    }
  };

  // =========================================================
  // 6. RENDER
  // =========================================================

  return (
    <div className="space-y-8">
      {/* Top Navigation */}

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admindashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            <Home size={15} />
            Admin Dashboard Home
          </Link>

          <span className="text-sm font-semibold text-slate-600 hidden sm:inline">
            | Gallery Manager
          </span>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Winston Medical Centre
        </span>
      </div>

      {/* Add Form */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="text-blue-600" size={20} />
          Add New Gallery Media
        </h2>

        <form
          onSubmit={handleAddMedia}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Title *
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pediatric Ward Tour"
              required
              disabled={submitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
            />
          </div>

          {/* Media Type */}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Media Source Type
            </label>

            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "image"
                    | "video"
                    | "embed",
                )
              }
              disabled={submitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none bg-white disabled:bg-slate-100"
            >
              <option value="image">
                Image / Direct Link
              </option>

              <option value="video">
                Direct Video Link (.mp4 / .webm)
              </option>

              <option value="embed">
                YouTube / External Video Embed Link
              </option>
            </select>
          </div>

          {/* File Upload */}

          <div className="md:col-span-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Upload size={20} />
              </div>

              <div>
                <p className="text-xs font-bold text-slate-800 uppercase">
                  Upload Local File from Device
                </p>

                <p className="text-xs text-slate-500">
                  Supports JPG, PNG, WEBP, GIF, MP4, WEBM up to
                  5 MB
                </p>
              </div>
            </div>

            <input
              id="gallery-file-upload"
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              disabled={submitting}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer disabled:opacity-50"
            />
          </div>

          {/* URL */}

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {type === "embed"
                ? "YouTube Embed / Watch Link *"
                : "Media Direct URL *"}
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <LinkIcon size={16} />
              </span>

              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  type === "embed"
                    ? "https://www.youtube.com/watch?v=..."
                    : "https://example.com/image.jpg or upload a local file"
                }
                required
                disabled={submitting}
                className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Description */}

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Description (Optional)
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this photo or video..."
              rows={2}
              disabled={submitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none disabled:bg-slate-100"
            />
          </div>

          {/* Save */}

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2
                    className="animate-spin"
                    size={18}
                  />
                  Saving to Database...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Save to Database
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Media Grid */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Manage Gallery Media ({items.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center p-12 text-slate-500 gap-2">
            <Loader2
              className="animate-spin"
              size={24}
            />
            Loading gallery items...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Upload
              size={36}
              className="mx-auto mb-3 opacity-40"
            />

            <p className="font-semibold">
              No gallery media found.
            </p>

            <p className="text-sm mt-1">
              Add your first photo or video above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                {/* Preview */}

                <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                    />
                  ) : (
                    <iframe
                      src={item.url}
                      title={item.title}
                      className="w-full h-full pointer-events-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {/* Status */}

                  <span
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                      item.isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-500 text-white"
                    }`}
                  >
                    {item.isActive ? "Active" : "Hidden"}
                  </span>

                  {/* Type */}

                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-slate-900/80 text-cyan-300 backdrop-blur-md">
                    {item.type}
                  </span>
                </div>

                {/* Information */}

                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {item.description ||
                        "No description provided."}
                    </p>
                  </div>

                  {/* Actions */}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() =>
                        toggleActive(
                          item.id,
                          item.isActive,
                        )
                      }
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                        item.isActive
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {item.isActive
                        ? "Hide from Client"
                        : "Show on Client"}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete"
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}








