import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem, GlowCard } from "@/components/AnimatedSection";

const reviews = [
  {
    name: "Kaito Mercer",
    role: "Indie Game Developer",
    avatar: "KM",
    quote:
      "Inkoryx delivered character sprites and environment art that completely elevated my game's identity. Players keep messaging me about the art direction. Worth every cent.",
  },
  {
    name: "Selene Vargas",
    role: "VTuber & Streamer",
    avatar: "SV",
    quote:
      "My rigged avatar feels alive. The expressions, the small movements, the personality — chat went absolutely feral on the debut stream. Inkoryx gets it.",
  },
  {
    name: "Marcus Chen",
    role: "Author, The Hollow Crown Series",
    avatar: "MC",
    quote:
      "Three book covers in, and my sales doubled after the rebrand. The team listens, iterates fast, and the final art is gallery-tier. Already booked them for book four.",
  },
  {
    name: "Aria Lindqvist",
    role: "Founder, Nyxhaven Studio",
    avatar: "AL",
    quote:
      "We needed a full brand identity in three weeks. Inkoryx delivered logo, pitch deck, and UI mockups that made our investor meeting effortless. Closed our seed round.",
  },
  {
    name: "Diego Ramos",
    role: "Animation Director",
    avatar: "DR",
    quote:
      "The motion work is buttery. Frame-perfect timing, expressive arcs, zero hand-holding required. They understood the brief better than half my in-house team.",
  },
  {
    name: "Yuki Tanaka",
    role: "Product Designer",
    avatar: "YT",
    quote:
      "Hired Inkoryx for a dashboard UI overhaul. The result felt like a flagship app from day one. Our user retention jumped within the first month of release.",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 overflow-hidden bg-surface/30">
      <div className="absolute inset-0 bg-grid opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold">
              What Clients <span className="gradient-text text-glow">Say</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Real words from creators, founders, and studios who trusted us with their vision.
            </p>
          </div>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <StaggerItem key={r.name}>
              <GlowCard className="h-full flex flex-col">
                <Quote className="w-8 h-8 text-neon/60 mb-4" />
                <p className="text-sm text-foreground/90 leading-relaxed flex-1">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center gap-1 mt-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Star className="w-4 h-4 fill-neon text-neon" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-neon/15 border border-neon/40 flex items-center justify-center font-heading font-bold text-neon text-sm">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.role}</div>
                  </div>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
