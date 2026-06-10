import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MESSAGES = [
  "Loading 3D Assets...",
  "Rendering Characters...",
  "Initializing Frameworks...",
  "INKORYX SYSTEM ONLINE.",
];

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 450);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1800; // ms

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setDone(true), 350);
      }
    };

    raf = requestAnimationFrame(tick);

    // lock scroll while loading
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    if (done) {
      document.body.style.overflow = "";
    }
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.17 0.02 240) 0%, oklch(0.10 0.02 240) 60%, oklch(0.08 0.02 240) 100%)",
          }}
        >
          {/* Grid backdrop */}
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />

          {/* Logo / Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 mb-10 text-center"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-[0.3em] gradient-text text-glow">
              INKORYX
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-3 text-xs md:text-sm uppercase tracking-[0.5em] text-muted-foreground"
            >
              Forging Digital Legacy
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <div className="relative z-10 w-[78%] max-w-[520px]">
            {/* Frame with corner accents */}
            <div className="relative">
              {/* Corner brackets */}
              <span className="absolute -left-2 -top-2 h-3 w-3 border-l-2 border-t-2 border-neon" />
              <span className="absolute -right-2 -top-2 h-3 w-3 border-r-2 border-t-2 border-neon" />
              <span className="absolute -left-2 -bottom-2 h-3 w-3 border-l-2 border-b-2 border-neon" />
              <span className="absolute -right-2 -bottom-2 h-3 w-3 border-r-2 border-b-2 border-neon" />

              <div className="relative h-2.5 w-full overflow-hidden rounded-sm border border-neon/40 bg-background/60 backdrop-blur-sm">
                {/* Track shimmer */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, var(--neon-glow) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}
                />
                {/* Fill */}
                <motion.div
                  className="relative h-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, var(--neon) 0%, var(--accent) 100%)",
                    boxShadow:
                      "0 0 12px var(--neon), 0 0 24px var(--neon-glow), inset 0 0 8px oklch(1 0 0 / 30%)",
                  }}
                >
                  {/* Leading edge spark */}
                  <span
                    className="absolute right-0 top-1/2 h-4 w-1 -translate-y-1/2"
                    style={{
                      background: "oklch(1 0 0 / 90%)",
                      boxShadow: "0 0 12px var(--neon), 0 0 20px var(--neon)",
                    }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Status row */}
            <div className="mt-4 flex items-center justify-between font-heading text-[10px] md:text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-neon animate-pulse" />
                {STATUS_MESSAGES[statusIdx]}
              </span>
              <span className="text-neon text-glow-sm tabular-nums">
                {progress.toString().padStart(3, "0")}%
              </span>
            </div>
          </div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-8 z-10 font-heading text-[10px] uppercase tracking-[0.5em] text-muted-foreground"
          >
            Press Start
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
