import { useEffect, useMemo, useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Home,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import HomepageHeader from "@/layout/HomepageHeader.tsx";
import HomepageFooter from "@/layout/HomepageFooter.tsx";
import { getGalleryItems, type GalleryItem } from "@/api/gallery";

export default function GalleryPage() {
  const [filter, setFilter] = useState<
    "all" | "image" | "video"
  >("all");

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD REAL GALLERY DATA FROM DATABASE
     ========================================================= */

  const loadGallery = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getGalleryItems(true);

      // Only active records returned from the database.
      setItems(
        data.filter(
          (item) => item.isActive === true,
        ),
      );
    } catch (err) {
      console.error(
        "Failed to load gallery:",
        err,
      );

      setItems([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load gallery from the database.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGallery();
  }, []);

  /* =========================================================
     FILTER DATABASE RESULTS
     ========================================================= */

  const filteredItems = useMemo(() => {
    if (filter === "all") {
      return items;
    }

    return items.filter(
      (item) => item.type === filter,
    );
  }, [items, filter]);

  const imageCount = items.filter(
    (item) => item.type === "image",
  ).length;

  const videoCount = items.filter(
    (item) => item.type === "video",
  ).length;

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <HomepageHeader />

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/10">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md transition hover:bg-white/20"
            >
              <Home
                size={14}
                className="text-cyan-400"
              />
              Home
            </Link>

            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-xs font-bold text-cyan-300 uppercase tracking-widest backdrop-blur-md">
              <Sparkles
                size={14}
                className="text-cyan-400"
              />
              Facility Showcase
            </div>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Our Hospital{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Gallery
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto">
            Take a visual tour of Winston Medical
            Centre, our facilities, equipment,
            welcoming spaces, and medical team.
          </p>

          {/* =================================================
              FILTER TABS
              ================================================= */}

          <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                filter === "all"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              All Media ({items.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("image")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                filter === "image"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              Images ({imageCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("video")}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition ${
                filter === "video"
                  ? "bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20"
                  : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10"
              }`}
            >
              Videos ({videoCount})
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          GALLERY
          ===================================================== */}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Loading */}
        {loading && (
          <div className="min-h-[350px] flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
            <Loader2
              size={42}
              className="text-cyan-400 animate-spin mb-4"
            />

            <p className="text-slate-300 font-semibold">
              Loading gallery...
            </p>

            <p className="text-slate-500 text-sm mt-1">
              Retrieving media from Winston Medical
              Centre.
            </p>
          </div>
        )}

        {/* Database/API Error */}
        {!loading && error && (
          <div className="min-h-[350px] flex flex-col items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/[0.03] px-6 text-center">
            <div className="h-14 w-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <AlertCircle
                size={28}
                className="text-red-400"
              />
            </div>

            <h2 className="text-lg font-bold text-white">
              Unable to load gallery
            </h2>

            <p className="text-sm text-slate-400 max-w-md mt-2">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadGallery()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty Database */}
        {!loading &&
          !error &&
          filteredItems.length === 0 && (
            <div className="text-center py-20 rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="h-16 w-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
                {filter === "video" ? (
                  <Video
                    size={28}
                    className="text-slate-500"
                  />
                ) : (
                  <ImageIcon
                    size={28}
                    className="text-slate-500"
                  />
                )}
              </div>

              <h2 className="text-lg font-bold text-white">
                No gallery media available
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                {items.length === 0
                  ? "There are currently no active gallery items."
                  : "No active media items found in this category."}
              </p>
            </div>
          )}

        {/* Real Database Gallery */}
        {!loading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col group hover:border-cyan-400/50 transition duration-300"
                >
                  {/* Media */}
                  <div className="relative h-64 overflow-hidden bg-slate-900">
                    {item.type === "image" ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    )}

                    {/* Media Type */}
                    <div className="absolute top-4 right-4 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-cyan-300 border border-white/10 flex items-center gap-1.5">
                      {item.type === "image" ? (
                        <ImageIcon size={14} />
                      ) : (
                        <Video size={14} />
                      )}

                      <span className="capitalize">
                        {item.type}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                        {item.title}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>
                        Winston Medical Centre
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Verified
                      </span>
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







