import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Play } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — The Inkoryx Archives" },
      { name: "description", content: "A gallery of our past projects, living worlds, and broadcast-ready models." },
    ],
  }),
});

const TEAL = "#00E5CC";
const PER_PAGE = 6;

const filters = ["All", "2D Art", "3D Models", "Animations", "Pixel Art", "UI & Brands"] as const;
type Filter = typeof filters[number];
type Cat = Exclude<Filter, "All">;

type Item = { id: string; category: Cat; src: string; type: "image" | "video" };

const HEIGHTS = [260, 300, 340, 380, 420];
const heightFor = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return HEIGHTS[h % HEIGHTS.length];
};

const VIDEO_SRC = "https://www.w3schools.com/html/mov_bbb.mp4";

const buildItems = (): Item[] => {
  const out: Item[] = [];
  for (let i = 1; i <= 24; i++) {
    out.push({ id: `2dart-${i}`, category: "2D Art", type: "image", src: `https://picsum.photos/seed/2dart${i}/400/500` });
  }
  for (let i = 1; i <= 30; i++) {
    out.push({ id: `3dmodel-${i}`, category: "3D Models", type: "image", src: `https://picsum.photos/seed/3dmodel${i}/400/450` });
  }
  for (let i = 1; i <= 10; i++) {
    out.push({ id: `anim-${i}`, category: "Animations", type: "video", src: VIDEO_SRC });
  }
  for (let i = 1; i <= 4; i++) {
    out.push({ id: `pixelart-${i}`, category: "Pixel Art", type: "image", src: `https://picsum.photos/seed/pixelart${i}/400/400` });
  }
  for (let i = 1; i <= 23; i++) {
    out.push({ id: `uibrand-${i}`, category: "UI & Brands", type: "image", src: `https://picsum.photos/seed/uibrand${i}/400/500` });
  }
  return out;
};

const ALL_ITEMS = buildItems();

function PortfolioPage() {
  const [active, setActive] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const items = ALL_ITEMS;

  const filtered = useMemo(
    () =>
      items.filter((it) => {
        const matchCat = active === "All" || it.category === active;
        const matchSearch = !search || it.category.toLowerCase().includes(search.toLowerCase()) || it.id.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
      }),
    [items, active, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const setFilter = (f: Filter) => {
    setActive(f);
    setPage(1);
  };

  return (
    <div style={{ backgroundColor: "#0A0F1C" }} className="min-h-screen">
      <section className="pt-24 pb-12 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-white">
          The Inkoryx <span style={{ color: TEAL }}>Archives</span>
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          A gallery of our past projects, living worlds, and broadcast-ready models.
        </p>
      </section>
      <section style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Search */}
          <div className="relative w-full max-w-xl mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={'Search for "Pixel Art", "VTuber", "Logos"'}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-sm text-white placeholder:text-slate-400 focus:outline-none"
              style={{ backgroundColor: "#111827", border: "1px solid #1F2937" }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {filters.map((f) => {
              const isActive = active === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
                  style={
                    isActive
                      ? { backgroundColor: TEAL, color: "#0A0F1C", border: `1px solid ${TEAL}` }
                      : { backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid #1F2937" }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active + search + currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              style={{ gap: 16 }}
            >
              {paged.map((item) => {
                const h = heightFor(item.id);
                return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="overflow-hidden group cursor-pointer relative"
                  style={{ backgroundColor: "#111827", borderRadius: 12 }}
                >
                  {item.type === "video" ? (
                    <div className="relative">
                      <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ width: "100%", height: h, objectFit: "cover", display: "block" }}
                      />
                      <div
                        className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-semibold"
                        style={{ backgroundColor: TEAL, color: "#0A0F1C" }}
                      >
                        Animations
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.45)", border: `2px solid ${TEAL}` }}
                        >
                          <Play size={22} fill={TEAL} style={{ color: TEAL }} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.category}
                      loading="lazy"
                      style={{ width: "100%", height: h, objectFit: "cover", display: "block" }}
                    />
                  )}
                  <div className="p-4">
                    <div className="text-xs font-medium" style={{ color: TEAL }}>{item.category}</div>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20" style={{ color: "#94A3B8" }}>No results found.</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-40"
                style={{ backgroundColor: "#111827", color: "#FFFFFF", border: "1px solid #1F2937" }}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const isCurrent = n === currentPage;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className="w-10 h-10 rounded-lg text-sm font-semibold"
                    style={
                      isCurrent
                        ? { backgroundColor: TEAL, color: "#0A0F1C", border: `1px solid ${TEAL}` }
                        : { backgroundColor: "#111827", color: "#FFFFFF", border: "1px solid #1F2937" }
                    }
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg flex items-center justify-center disabled:opacity-40"
                style={{ backgroundColor: "#111827", color: "#FFFFFF", border: "1px solid #1F2937" }}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
