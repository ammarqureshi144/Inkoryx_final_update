import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/updates")({
  component: UpdatesPage,
  head: () => ({
    meta: [
      { title: "Studio Updates — Inkoryx" },
      { name: "description", content: "Latest news, queue status, and announcements from the Inkoryx studio." },
    ],
  }),
});

function UpdatesPage() {
  return (
    <div className="relative">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              Studio <span className="gradient-text text-glow">Updates</span>
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          <AnimatedSection>
            <div className="glass rounded-2xl p-8 border border-neon/20">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-xs text-neon mb-4">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                NEW
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
                Inkoryx Commission Slots are <span className="gradient-text">OPEN</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The doors to the Inkoryx studio are officially open for new projects. We are accepting applications across all of our art and animation divisions. Because we dedicate so much time to each client, spots are strictly limited. Click "Get a Quote" to secure your place in line today.
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon text-primary-foreground font-semibold hover-glow animate-pulse-glow transition-all"
              >
                Get a Quote
                <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
