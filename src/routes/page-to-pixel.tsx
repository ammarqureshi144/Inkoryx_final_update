import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection, StaggerContainer, StaggerItem, GlowCard, ParticleField } from "@/components/AnimatedSection";
import { ArrowRight, Film, BookOpen, Tv } from "lucide-react";

export const Route = createFileRoute("/page-to-pixel")({
  component: PageToPixelPage,
  head: () => ({
    meta: [
      { title: "Page to Pixel — Animate Your Book | Inkoryx" },
      { name: "description", content: "We adapt published novels and ebooks into high-quality animated series, trailers, and anime." },
    ],
  }),
});

const steps = [
  {
    num: "1",
    title: "Character Translation",
    desc: "We read your descriptions and draw accurate character sheets so your heroes look exactly as you imagined.",
  },
  {
    num: "2",
    title: "Storyboarding",
    desc: "We adapt your chapters into visual scripts. You approve every scene before we move forward.",
  },
  {
    num: "3",
    title: "Final Animation",
    desc: "We add fluid movement, lighting, and cinematic sound design to create a complete viewing experience.",
  },
];

const packages = [
  {
    icon: Film,
    title: "The Cinematic Book Trailer",
    price: "Est. $1,000 - $3,000+",
    desc: "A 30 to 60-second high-impact animation designed to market your book on YouTube, TikTok, and social media.",
  },
  {
    icon: BookOpen,
    title: "The Pilot Episode",
    price: "Est. $3,000 - $8,000+",
    desc: "A full 5 to 10-minute animated pilot. Perfect for pitching your story to networks or launching a Kickstarter.",
  },
  {
    icon: Tv,
    title: "The Full Web Series",
    price: "Est. $8,000 - $20,000+",
    desc: "A multi-episode season production, including custom opening sequences and full studio voice acting direction.",
  },
];

function PageToPixelPage() {
  return (
    <div className="relative">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              From Page to Screen. <span className="gradient-text text-glow">We Animate Your Book.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              You wrote the story. We bring the visuals to life. Inkoryx is an elite animation studio that adapts published novels and ebooks into high-quality animated series, trailers, and anime.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.35}>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-lg bg-neon text-primary-foreground font-bold text-lg hover-glow animate-pulse-glow transition-all"
            >
              Get an Animation Quote
              <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-12">
              The <span className="gradient-text text-glow">Adaptation Process</span>
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <StaggerItem key={s.num}>
                <GlowCard className="h-full text-center">
                  <div className="text-4xl font-heading font-black gradient-text mb-3">{s.num}</div>
                  <h3 className="font-heading text-lg font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((p) => (
              <StaggerItem key={p.title}>
                <GlowCard className="h-full">
                  <div className="w-14 h-14 rounded-xl bg-neon/10 flex items-center justify-center mb-4">
                    <p.icon className="w-7 h-7 text-neon" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-1">{p.title}</h3>
                  <div className="text-xs text-neon font-semibold mb-3">{p.price}</div>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </div>
  );
}
