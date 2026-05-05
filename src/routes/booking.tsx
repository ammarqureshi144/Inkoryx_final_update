import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatedSection, ParticleField } from "@/components/AnimatedSection";
import { Send } from "lucide-react";

export const Route = createFileRoute("/booking")({
  component: BookingPage,
  head: () => ({
    meta: [
      { title: "Get a Quote — Inkoryx" },
      { name: "description", content: "Start your project with Inkoryx. Fill out the form and we'll review your vision." },
    ],
  }),
});

const projectTypes = [
  "Custom Character Art / Fursona",
  "Fursuit Design & Blueprints",
  "3D Modeling / VTuber Rigging",
  "Animation / Motion Graphics",
  "Book Cover / Branding / UI",
  "Premium Incubator Package",
  "Other (Custom Design Request)",
];

const usageTypes = ["Personal Use", "Commercial/Selling it", "Streaming"];

const budgets = [
  "$300 - $600 (Standard Custom Art)",
  "$600 - $1,500 (Premium Detail)",
  "$1,500 - $5,000+ (High-End Rigging / Complex Animation)",
  "Custom Proposed Budget",
];

function BookingPage() {
  const [agreed, setAgreed] = useState(false);
  const [budget, setBudget] = useState("");

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <ParticleField />
        <div className="absolute inset-0 bg-grid opacity-15" />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <h1 className="text-4xl md:text-6xl font-heading font-black">
              Initiate Your <span className="gradient-text text-glow">Project</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Limited monthly availability. Submit this form to begin. Please fill out with as much detail as possible.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-surface">
        <div className="max-w-2xl mx-auto px-4">
          <AnimatedSection>
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 space-y-6"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                    placeholder="Full Name or Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Project Type *</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-neon/50">
                  <option value="">Select project type</option>
                  {projectTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">How will you use this?</label>
                <select className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-neon/50">
                  <option value="">Select usage</option>
                  {usageTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Budget Range *</label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option value="">Select budget</option>
                  {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {budget === "Custom Proposed Budget" && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                  <label className="block text-sm font-medium mb-2">Custom Amount</label>
                  <input
                    type="text"
                    placeholder="$___"
                    className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                  />
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Describe your vision *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us about your project in detail..."
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reference Images Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon/50"
                />
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 accent-neon"
                />
                <span className="text-sm text-muted-foreground">
                  I have read and agree to the Terms of Service. I understand that a 50% non-refundable deposit is required before any work begins.
                </span>
              </label>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!agreed}
                className="w-full py-3 rounded-lg bg-neon text-primary-foreground font-bold flex items-center justify-center gap-2 hover-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Submit Proposal
              </motion.button>

              <p className="text-xs text-center text-muted-foreground">
                Limited monthly availability notices.
              </p>
            </motion.form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
