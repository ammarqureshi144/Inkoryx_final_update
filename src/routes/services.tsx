import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AnimatedSection, StaggerContainer, StaggerItem, GlowCard, ParticleField } from "@/components/AnimatedSection";
import { Palette, Box, Gamepad2, Monitor, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services & Pricing — Inkoryx" },
      { name: "description", content: "Our specialized digital art divisions. Character art, 3D models, game assets, UI design and more." },
    ],
  }),
});

const divisions = [
  {
    icon: Palette,
    title: "Character & Lore",
    desc: "Custom digital illustrations, VTuber rigging, and original character concepts tailored to your exact ideas.",
    features: ["Custom Character Art", "VTuber Models & Rigging", "Original Character Concepts", "Fursonas & Anime Style"],
  },
  {
    icon: Box,
    title: "Publishing & Branding",
    desc: "Professional book covers, logos, pitch decks, and brand identities designed to build trust and increase your sales.",
    features: ["Book Covers", "Logo Design", "Pitch Decks", "Brand Guides & Identity"],
  },
  {
    icon: Gamepad2,
    title: "Games & Animation",
    desc: "3D environments, pixel art, and smooth animations ready to be plugged directly into your game or video project.",
    features: ["3D Environments", "Pixel Art", "2D/3D Animation", "Game Assets & Sprites"],
  },
  {
    icon: Monitor,
    title: "UI & Digital Spaces",
    desc: "Sleek app interfaces and digital dashboards designed for a perfect user experience.",
    features: ["App UI/UX Design", "Stream Overlays", "Icons & Graphics", "Dashboard Design"],
  },
];

const pricingTiers = [
  { tier: "Tier", art: "$200+", models: "$250+", anim: "$150+", range: "$100+", best: "Quick assets, icons, simple designs" },
  { tier: "Yoss", art: "$320+", models: "$425+", anim: "$300+", range: "$190+", best: "Detailed single pieces, full characters" },
  { tier: "Bull", art: "$500+", models: "$600+", anim: "$450+", range: "$300+", best: "Complex multi-view, rigged models" },
  { tier: "Budget", art: "$800+", models: "$1000+", anim: "$750+", range: "$500+", best: "Premium bundles, full projects" },
  { tier: "Full", art: "$1200+", models: "$1500+", anim: "$1000+", range: "$800+", best: "Large-scale, enterprise, series" },
];

function ServicesPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              The Arsenal: <span className="gradient-text text-glow">Specialized Digital Forging</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your project type. We dedicate intense focus to every design to ensure premium quality.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Divisions */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {divisions.map((div) => (
              <StaggerItem key={div.title}>
                <GlowCard className="h-full">
                  <div className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-14 h-14 rounded-xl bg-neon/10 flex items-center justify-center shrink-0"
                    >
                      <div.icon className="w-7 h-7 text-neon" />
                    </motion.div>
                    <div>
                      <h3 className="font-heading text-xl font-bold mb-2">{div.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{div.desc}</p>
                      <ul className="space-y-1">
                        {div.features.map((f) => (
                          <li key={f} className="text-sm text-foreground/80 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-neon shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlowCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-center mb-12">
              <span className="gradient-text text-glow">Pricing</span> Overview
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-neon/30">
                    {["Pricing", "Art", "3D Models", "Animation", "Budget Range", "Best For"].map((h) => (
                      <th key={h} className="text-left py-4 px-4 text-sm font-heading text-neon font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingTiers.map((row, i) => (
                    <motion.tr
                      key={row.tier}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="border-b border-border/50 hover:bg-neon/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-heading font-semibold text-sm">{row.tier}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.art}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.models}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.anim}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.range}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{row.best}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4} className="text-center mt-12">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon text-primary-foreground font-semibold hover-glow animate-pulse-glow transition-all"
            >
              Get a Custom Quote
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
