import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Spotlight } from "@/components/ui/spotlight";
import { Card } from "@/components/ui/card";
import { AnimatedSection, StaggerContainer, StaggerItem, ParticleField, GlowCard, FloatingElement } from "@/components/AnimatedSection";
import { HeroCharacter } from "@/components/HeroCharacter";
import { Testimonials } from "@/components/Testimonials";
import { Palette, Box, Gamepad2, Monitor, ArrowRight, Star, Shield, Sparkles } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Inkoryx — Forge Your Digital Legacy" },
      { name: "description", content: "Elite custom character art, high-quality 3D models, UI design, and fluid animations." },
    ],
  }),
});

const services = [
  { icon: Palette, title: "Character & Lore", desc: "Custom digital illustrations, VTuber rigging, and original character concepts tailored to your exact ideas.", delay: 0 },
  { icon: Box, title: "Publishing & Branding", desc: "Professional book covers, logos, pitch decks, and brand identities designed to build trust and increase your sales.", delay: 1 },
  { icon: Gamepad2, title: "Games & Animation", desc: "3D environments, pixel art, and smooth animations ready to be plugged directly into your game or video project.", delay: 2 },
  { icon: Monitor, title: "UI & Digital Spaces", desc: "Sleek app interfaces and digital dashboards designed for a perfect user experience.", delay: 3 },
];

const stats = [
  { value: "100+", label: "Brands Forged", icon: Shield },
  { value: "5-Star", label: "Client Satisfaction", icon: Star },
  { value: "100%", label: "Original Designs", icon: Sparkles },
];

function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section with Spline 3D Robot */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-radial-glow opacity-30" />

        <Card className="w-full bg-transparent border-0 shadow-none">
          <div className="flex flex-col lg:flex-row items-center min-h-screen relative">
            <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="var(--neon)" />

            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex-1 p-8 md:p-16 z-10 relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neon-border text-xs font-medium text-neon mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-neon animate-pulse" />
                Now Accepting Commissions
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-heading font-black leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="block"
                >
                  Forge Your
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="block gradient-text text-glow"
                >
                  Digital Legacy
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-6 text-lg text-muted-foreground max-w-lg"
              >
                Elite custom character art, high-quality 3D models, UI design, and fluid animations. Step out of the background and become the icon.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon text-primary-foreground font-semibold hover-glow animate-pulse-glow transition-all"
                >
                  View Our Portfolio
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neon text-neon font-semibold hover-glow transition-all"
                >
                  Start Your Project
                </Link>
              </motion.div>

              {/* Trust Stats Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
              >
                <span className="font-heading font-semibold tracking-wide">
                  <span className="gradient-text text-glow-sm">100+</span>{" "}
                  <span className="text-muted-foreground font-medium">Brands Forged</span>
                </span>
                <span className="h-4 w-px bg-neon/40" />
                <span className="font-heading font-semibold tracking-wide">
                  <span className="gradient-text text-glow-sm">5-Star</span>{" "}
                  <span className="text-muted-foreground font-medium">Client Satisfaction</span>
                </span>
                <span className="h-4 w-px bg-neon/40" />
                <span className="font-heading font-semibold tracking-wide">
                  <span className="gradient-text text-glow-sm">100%</span>{" "}
                  <span className="text-muted-foreground font-medium">Original Designs</span>
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Hero Character with Forge Backlight */}
            <HeroCharacter />
          </div>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 border-y border-border bg-surface/50">
        <StaggerContainer className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-neon" />
                <div className="text-3xl font-heading font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* About Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-center">
              Stop Settling for <span className="gradient-text text-glow">Generic Art.</span>
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-8 text-lg text-muted-foreground text-center max-w-3xl mx-auto leading-relaxed">
              You are building a universe—your visuals should command attention. Inkoryx is a premium creative studio dedicated to bringing your ideas to life. From indie game pixel art to fully rigged VTuber avatars and corporate branding, we engineer designs that make your audience stop and stare. Everything we make is 100% custom and built for you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative py-24 bg-surface">
        <ParticleField />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold">
                Services: <span className="gradient-text text-glow">The Arsenal</span>
              </h2>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose your project type. We dedicate intense focus to every design to ensure premium quality.
              </p>
            </div>
          </AnimatedSection>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => (
              <StaggerItem key={svc.title}>
                <GlowCard className="h-full text-center">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="w-14 h-14 rounded-xl bg-neon/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <svc.icon className="w-7 h-7 text-neon" />
                  </motion.div>
                  <h3 className="font-heading text-lg font-semibold mb-2">{svc.title}</h3>
                  <p className="text-sm text-muted-foreground">{svc.desc}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.4} className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neon text-neon font-medium hover-glow transition-all"
            >
              View All Services
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Testimonials />

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <FloatingElement>
              <h2 className="text-4xl md:text-6xl font-heading font-black">
                Ready to <span className="gradient-text text-glow">Create?</span>
              </h2>
            </FloatingElement>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Commission slots are limited. Secure your spot and let&apos;s forge something legendary together.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.4}>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-lg bg-neon text-primary-foreground font-bold text-lg hover-glow animate-pulse-glow transition-all"
            >
              Get a Quote
              <ArrowRight size={20} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
