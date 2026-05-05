import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";
import { Search, ArrowRight } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Portfolio — The Inkoryx Archives" },
      { name: "description", content: "A gallery of our past projects, living worlds, and broadcast-ready models." },
    ],
  }),
});

const filters = ["All", "2D Art", "3D Models", "UI & Brands", "Animation"];

const items = [
  { src: portfolio1, title: "Inferno Knight", category: "2D Art" },
  { src: portfolio2, title: "Crystal Guardian", category: "3D Models" },
  { src: portfolio3, title: "Pixel Quest World", category: "Animation" },
  { src: portfolio4, title: "Dashboard UI Suite", category: "UI & Brands" },
  { src: portfolio5, title: "VTuber Avatar — Luna", category: "3D Models" },
  { src: portfolio6, title: "Action Sequence", category: "Animation" },
];

function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = items.filter((item) => {
    const matchCat = active === "All" || item.category === active;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              The Inkoryx <span className="gradient-text text-glow">Archives</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              A gallery of our past projects, living worlds, and broadcast-ready models.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder='Search for "Pixel Art", "VTuber", "Logos"...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {filters.map((f) => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActive(f)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      active === f
                        ? "bg-neon text-primary-foreground neon-border"
                        : "bg-surface-elevated text-muted-foreground hover:text-foreground border border-border"
                    }`}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group relative rounded-xl overflow-hidden border border-border card-hover"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    width={640}
                    height={640}
                    className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <span className="text-xs text-neon font-medium">{item.category}</span>
                      <h3 className="font-heading text-lg font-bold">{item.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">No results found.</div>
          )}

          <AnimatedSection delay={0.3} className="text-center mt-16">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon text-primary-foreground font-semibold hover-glow animate-pulse-glow transition-all"
            >
              Start Your Own Project
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
