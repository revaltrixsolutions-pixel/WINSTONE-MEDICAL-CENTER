import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Sparkles, Home } from "lucide-react";
import { Link } from "react-router-dom";
import HomepageHeader from "../components/layout/HomepageHeader";
import HomepageFooter from "../components/layout/HomepageFooter";

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  type: "image" | "video";
  url: string;
  isActive: boolean;
}

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("wmc_gallery");
    if (saved) {
      const parsed: GalleryItem[] = JSON.parse(saved);
      setItems(parsed.filter(i => i.isActive));
    } else {
      // Default fallback items if none exist
      setItems([
        { id: "1", title: "Winston Medical Centre Reception", description: "Our welcoming front desk and reception area.", type: "image", url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800", isActive: true },
        { id: "2", title: "Advanced Laboratory Services", description: "Fully equipped diagnostic laboratory.", type: "image", url: "https://images.unsplash.com/photo-1579165466941-8f1181813476?auto=format&fit=crop&q=80&w=800", isActive: true },
      ]);
    }
  }, []);

  const filteredItems = items.filter(item => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <HomepageHeader />

      {/* Hero Header */}
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
              <Sparkles size={14} className="text-cyan-400" /> Facility Showcase
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Our Hospital <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Gallery</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Take a visual tour of Winston Medical Centre, our state-of-the-art equipment, welcoming spaces, and dedicated medical team.
          </p>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${filter === "all" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`}
            >
              All Media ({items.length})
            </button>
            <button
              onClick={() => setFilter("image")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${filter === "image" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`}
            >
              Images
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${filter === "video" ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20" : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"}`}
            >
              Videos
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/[0.02]">
            <p className="text-slate-400 text-base">No active media items found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col group hover:border-cyan-400/50 transition duration-300"
              >
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                  <div className="absolute top-4 right-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-cyan-300 border border-white/10 flex items-center gap-1.5">
                    {item.type === "image" ? <ImageIcon size={14} /> : <Video size={14} />}
                    <span className="capitalize">{item.type}</span>
                  </div>
                </div>

                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">{item.description}</p>
                    )}
                  </div>
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Winston Medical Centre</span>
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <HomepageFooter />
    </div>
  );
}