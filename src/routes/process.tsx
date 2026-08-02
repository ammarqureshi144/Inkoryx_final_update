import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem, ParticleField, FloatingElement } from "@/components/AnimatedSection";
import { PenTool, Palette, Sparkles, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: "Our Process — How We Build at Inkoryx" },
      { name: "description", content: "Total transparency. Uncompromising quality. Our simple 3-step process to forge your vision." },
    ],
  }),
});

const steps = [
  {
    num: "01",
    icon: PenTool,
    title: "The Blueprint",
    subtitle: "Sketching",
    desc: "We start with rough sketches or block-outs. We lock in the layout, pose, and general idea with you first to make sure we are on the right track.",
    color: "from-neon to-accent",
  },
  {
    num: "02",
    icon: Palette,
    title: "The Foundation",
    subtitle: "Colors & Details",
    desc: "We establish the color palettes, build the base 3D models, and clean up the lines. You get to review the progress.",
    color: "from-accent to-neon",
  },
  {
    num: "03",
    icon: Sparkles,
    title: "The Final Polish",
    subtitle: "Rendering",
    desc: "We apply lighting, high-definition textures, and final animations. You receive your finished, ready-to-use files.",
    color: "from-neon to-accent",
  },
];

function ProcessPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              How We Build <span className="gradient-text text-glow">Your Vision</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Total transparency. Uncompromising quality. Here is our simple 3-step process.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon via-accent to-neon" />

            {steps.map((step, i) => (
              <AnimatedSection
                key={step.num}
                delay={i * 0.2}
                direction={i % 2 === 0 ? "left" : "right"}
                className="mb-20 last:mb-0"
              >
                <div className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className="flex-1 text-center md:text-left">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} mb-4`}
                    >
                      <step.icon className="w-10 h-10 text-primary-foreground" />
                    </motion.div>
                    <div className="text-sm text-neon font-heading font-bold mb-1">Step {step.num}</div>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-1">{step.title}</h3>
                    <div className="text-sm text-muted-foreground font-medium mb-3">{step.subtitle}</div>
                    <p className="text-muted-foreground max-w-md">{step.desc}</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-6 h-6 rounded-full bg-neon neon-border"
                    />
                  </div>
                  <div className="flex-1" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <FloatingElement>
              <h2 className="text-3xl md:text-5xl font-heading font-black">
                Ready to <span className="gradient-text text-glow">Start the Process?</span>
              </h2>
            </FloatingElement>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-lg bg-neon text-primary-foreground font-bold text-lg hover-glow animate-pulse-glow transition-all"
            >
              Submit Your Project
              <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
