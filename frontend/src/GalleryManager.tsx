import { useState, useEffect } from "react";
import { Trash2, Plus, Upload, Link as LinkIcon, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video" | "embed";
  url: string;
  isActive: boolean;
}

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem("wmc_gallery");
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Winston Medical Centre Reception", description: "Our welcoming front desk and reception area.", type: "image", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", isActive: true },
      { id: "2", title: "Advanced Laboratory Services", description: "Fully equipped diagnostic laboratory.", type: "image", url: "https://images.unsplash.com/photo-1579165466941-8f1181813476?auto=format&fit=crop&q=80&w=800", isActive: true },
    ];
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"image" | "video" | "embed">("image");
  const [url, setUrl] = useState("");

  useEffect(() => {
    localStorage.setItem("wmc_gallery", JSON.stringify(items));
  }, [items]);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;

    let processedUrl = url;
    // Auto-convert standard YouTube watch URLs to embed format if selected as embed
    if (type === "embed" && url.includes("watch?v=")) {
      processedUrl = url.replace("watch?v=", "embed/");
    } else if (type === "embed" && url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) processedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title,
      description,
      type,
      url: processedUrl,
      isActive: true,
    };

    setItems([newItem, ...items]);
    setTitle("");
    setDescription("");
    setUrl("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUrl(reader.result as string);
      if (file.type.startsWith("video/")) {
        setType("video");
      } else {
        setType("image");
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleActive = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Top Navigation / Home Button Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admindashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            <Home size={15} /> Admin Dashboard Home
          </Link>
          <span className="text-sm font-semibold text-slate-600 hidden sm:inline">| Gallery Manager</span>
        </div>
        <span className="text-xs font-mono text-slate-400">Winston Medical Centre</span>
      </div>

      {/* Upload / Add Form */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Upload className="text-blue-600" size={20} /> Add New Gallery Media (Upload File, Direct URL, or Embed)
        </h2>

        <form onSubmit={handleAddMedia} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Pediatric Ward Tour"
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Media Source Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "image" | "video" | "embed")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none bg-white"
            >
              <option value="image">Image / Video File Upload or Direct URL</option>
              <option value="video">Direct Video URL (.mp4 / .webm)</option>
              <option value="embed">YouTube / External Video Embed Link</option>
            </select>
          </div>

          {/* Local File Upload Option */}
          <div className="md:col-span-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Upload size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase">Upload Local File from Device</p>
                <p className="text-xs text-slate-500">Supports JPG, PNG, WEBP, MP4 files directly</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              {type === "embed" ? "YouTube Embed / Watch Link *" : "Media Direct URL *"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <LinkIcon size={16} />
              </span>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={type === "embed" ? "https://www.youtube.com/watch?v=... or embed link" : "https://example.com/image.jpg or uploaded base64 data"}
                required
                className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about this photo or video..."
              rows={2}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
            >
              <Plus size={18} /> Add to Gallery
            </button>
          </div>
        </form>
      </div>

      {/* Existing Gallery Management Table */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Manage Gallery Media ({items.length})</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                ) : item.type === "video" ? (
                  <video src={item.url} className="w-full h-full object-cover" controls />
                ) : (
                  <iframe src={item.url} title={item.title} className="w-full h-full pointer-events-none" />
                )}
                
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${item.isActive ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"}`}>
                  {item.isActive ? "Active" : "Hidden"}
                </span>

                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase bg-slate-900/80 text-cyan-300 backdrop-blur-md">
                  {item.type}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.description || "No description provided."}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => toggleActive(item.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${item.isActive ? "bg-amber-100 text-amber-700 hover:bg-amber-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
                  >
                    {item.isActive ? "Hide from Client" : "Show on Client"}
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteItem(item.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}






