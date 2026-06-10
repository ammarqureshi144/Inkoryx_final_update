import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatedSection, StaggerContainer, StaggerItem, GlowCard, ParticleField, FloatingElement } from "@/components/AnimatedSection";
import { ArrowRight, Crown, Rocket, Briefcase } from "lucide-react";

export const Route = createFileRoute("/incubator")({
  component: IncubatorPage,
  head: () => ({
    meta: [
      { title: "Premium Incubator — Inkoryx" },
      { name: "description", content: "Inkoryx is a full-service partner for serious creators and businesses. From sketch to global marketing and shipping." },
    ],
  }),
});

const tiers = [
  {
    icon: Crown,
    name: "THE ELITE FORGE",
    desc: "For creators who want the absolute best commercial assets. Includes premium custom art, full commercial ownership rights, organized source files, and VIP communication.",
  },
  {
    icon: Rocket,
    name: "THE STUDIO LAUNCH",
    desc: "Everything in The Elite Forge, PLUS: We set up your social media branding, create a 30-day content calendar, and build your digital storefront.",
  },
  {
    icon: Briefcase,
    name: "THE EQUITY INCUBATOR (Full Service)",
    desc: "The ultimate hands-off experience. We create the art, run your monthly marketing campaigns, and handle the physical printing and global shipping of your products directly to your buyers.",
  },
];

function IncubatorPage() {
  return (
    <div className="relative">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              We Don't Just Create Art. <span className="gradient-text text-glow">We Launch Empires.</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-3xl mx-auto">
              Inkoryx is a full-service partner for serious creators and businesses. From the first sketch to global marketing and physical shipping, we build and manage your brand so you don't have to.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.35}>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-lg bg-neon text-primary-foreground font-bold text-lg hover-glow animate-pulse-glow transition-all"
            >
              Apply for a Partnership
              <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-center">
              Why Choose a <span className="gradient-text text-glow">Premium Package?</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-8 text-lg text-muted-foreground text-center leading-relaxed">
              Most artists hand you a picture and walk away. We act as your entire creative and marketing team. We build the art, secure your commercial rights, run your social media marketing, and can even print and ship physical merchandise or books directly to your customers.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.3}>
            <p className="mt-6 text-sm text-muted-foreground text-center italic max-w-2xl mx-auto">
              Because of the exclusive nature of our Incubator, we take on a strictly limited number of clients. Pricing is custom-quoted based on the scale of your vision after your application is reviewed.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((t) => (
              <StaggerItem key={t.name}>
                <GlowCard className="h-full">
                  <div className="w-14 h-14 rounded-xl bg-neon/10 flex items-center justify-center mb-4">
                    <t.icon className="w-7 h-7 text-neon" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-3">{t.name}</h3>
                  <p className="text-sm text-muted-foreground">{t.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AnimatedSection>
            <FloatingElement>
              <h2 className="text-3xl md:text-5xl font-heading font-black">
                Ready to <span className="gradient-text text-glow">Partner Up?</span>
              </h2>
            </FloatingElement>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-lg bg-neon text-primary-foreground font-bold text-lg hover-glow animate-pulse-glow transition-all"
            >
              Apply for a Partnership
              <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
