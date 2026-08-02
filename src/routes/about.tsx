import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us — The Team Behind the Art | Inkoryx" },
      { name: "description", content: "Meet the passionate digital artists, 3D sculptors, and designers behind Inkoryx." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="relative">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              The Team Behind <span className="gradient-text text-glow">the Art.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-8 text-lg text-muted-foreground leading-relaxed">
              We built Inkoryx because we saw too many brilliant creators settling for generic, cheap, or AI-generated art. We are a team of passionate digital artists, 3D sculptors, and designers dedicated to taking the ideas in your head and turning them into professional reality. We believe in doing things right the first time. We treat your project with the respect it deserves, and we deliver excellence on every single order.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
