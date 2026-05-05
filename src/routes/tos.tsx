import { createFileRoute } from "@tanstack/react-router";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";
import { Shield, RefreshCw, Truck, Copyright, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/tos")({
  component: TOSPage,
  head: () => ({
    meta: [
      { title: "Terms of Service & Refund Policy — Inkoryx" },
      { name: "description", content: "Inkoryx Terms of Service, payment terms, revision policy, and refund rules." },
    ],
  }),
});

const sections = [
  {
    icon: Shield,
    title: "1. Payment & Deposits",
    content: "All prices are in USD. A 50% non-refundable deposit is required to secure your slot and begin the sketch phase. The final 50% must be paid before the final high-resolution files are delivered to you.",
  },
  {
    icon: RefreshCw,
    title: "2. The Forge Process & Revisions",
    content: "Clients receive up to three (3) revision rounds during the sketch and planning phase. Once the sketch is approved and final coloring/rendering begins, major changes cannot be made without an additional hourly fee.",
  },
  {
    icon: Copyright,
    title: "3. Copyright & Usage Rights",
    content: "Commercial rights must be agreed upon prior to starting. Unless a non-disclosure agreement (NDA) is signed, Inkoryx retains the right to display the finished artwork in our public portfolio. Inkoryx artwork may not be used to train Artificial Intelligence programs.",
  },
  {
    icon: Truck,
    title: "4. Delivery & Refunds",
    content: "Inkoryx provides custom digital goods and services. Because of the custom labor involved, once the final rendering or animation phase has started, NO refunds will be issued under any circumstances.",
  },
  {
    icon: AlertTriangle,
    title: "5. Legal Standings",
    content: "All disputes shall be resolved through professional mediation. By engaging our services, clients agree to all terms stated herein. Inkoryx reserves the right to update these terms; clients will be notified of significant changes via email.",
  },
];

function TOSPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              Terms of Service <span className="gradient-text text-glow">(TOS)</span> & Refund Policy
            </h1>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {sections.map((sec, i) => (
            <AnimatedSection key={sec.title} delay={i * 0.1}>
              <div className="glass rounded-xl p-6 border border-border hover-glow transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon/10 flex items-center justify-center shrink-0">
                    <sec.icon className="w-6 h-6 text-neon" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold mb-3">{sec.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{sec.content}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* No AI Training Badge */}
          <AnimatedSection delay={0.6}>
            <div className="glass rounded-xl p-6 border border-destructive/30 text-center">
              <div className="text-3xl mb-3">🚫</div>
              <h4 className="font-heading font-bold text-lg mb-2">NO AI TRAINING</h4>
              <p className="text-sm text-muted-foreground">
                Inkoryx artwork may not be used to train Artificial Intelligence programs under any circumstances.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
