import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import heroCharacter from "@/assets/hero-character.png";

export function HeroCharacter() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  // Mouse-tracked motion values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth easing — soft return to center when cursor stops
  const springConfig = { stiffness: 70, damping: 20, mass: 0.5 };
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Subtle tilt (3–5° feel)
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  // Horizontal-dominant parallax shift (max ~25px)
  const translateX = useTransform(xSpring, [-0.5, 0.5], ["-25px", "25px"]);
  const translateY = useTransform(ySpring, [-0.5, 0.5], ["-6px", "6px"]);

  // Parallax shine highlight
  const shineX = useTransform(xSpring, [-0.5, 0.5], ["20%", "80%"]);
  const shineY = useTransform(ySpring, [-0.5, 0.5], ["20%", "80%"]);

  // Backlight follows cursor slightly
  const glowX = useTransform(xSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const glowY = useTransform(ySpring, [-0.5, 0.5], ["-12px", "12px"]);

  const shineBackground = useTransform(
    [shineX, shineY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, oklch(1 0 0 / 35%) 0%, transparent 45%)`
  );

  // Track cursor across the entire viewport so the character follows it everywhere
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect touch / coarse-pointer devices — skip cursor tracking, use idle float
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (coarse) {
      setIsTouch(true);
      return;
    }

    let rafId = 0;
    let nextX = 0;
    let nextY = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const handleMove = (e: globalThis.MouseEvent) => {
      nextX = e.clientX / window.innerWidth - 0.5;
      nextY = e.clientY / window.innerHeight - 0.5;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          mouseX.set(nextX);
          mouseY.set(nextY);
          rafId = 0;
        });
      }
      // Gently return to center when the cursor stops moving
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        mouseX.set(0);
        mouseY.set(0);
      }, 1800);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
      className="flex-1 h-[500px] lg:h-screen w-full relative flex items-center justify-center cursor-pointer"
      style={{ perspective: 1000 }}
    >
      {/* Animated backlight that follows cursor */}
      <motion.div
        className="character-backlight"
        style={{ x: glowX, y: glowY }}
        animate={{
          opacity: hovered ? 1 : 0.7,
          scale: hovered ? 1.15 : 1,
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Energy ring on hover */}
      <motion.div
        className="absolute z-[5] rounded-full border-2 border-neon pointer-events-none"
        style={{ width: 380, height: 380 }}
        animate={{
          opacity: hovered ? [0, 0.6, 0] : 0,
          scale: hovered ? [0.8, 1.4, 1.8] : 0.8,
        }}
        transition={{ duration: 1.5, repeat: hovered ? Infinity : 0, ease: "easeOut" }}
      />
      <motion.div
        className="absolute z-[5] rounded-full border border-accent pointer-events-none"
        style={{ width: 300, height: 300 }}
        animate={{
          opacity: hovered ? [0, 0.5, 0] : 0,
          scale: hovered ? [0.8, 1.6, 2] : 0.8,
        }}
        transition={{ duration: 1.5, repeat: hovered ? Infinity : 0, ease: "easeOut", delay: 0.4 }}
      />

      {/* Sparkle particles on hover */}
      {hovered && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute z-[6] w-1.5 h-1.5 rounded-full bg-neon pointer-events-none"
              style={{
                left: `${50 + Math.cos((i / 8) * Math.PI * 2) * 30}%`,
                top: `${50 + Math.sin((i / 8) * Math.PI * 2) * 30}%`,
                boxShadow: "0 0 12px var(--neon)",
              }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 1, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 80,
                y: Math.sin((i / 8) * Math.PI * 2) * 80,
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}

      {/* Tilting character with gentle float */}
      <motion.div
        className="relative z-10 max-h-[85%] w-auto"
        style={{
          rotateX: isTouch ? 0 : rotateX,
          rotateY: isTouch ? 0 : rotateY,
          x: isTouch ? 0 : translateX,
          y: isTouch ? 0 : translateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.06 }}
      >
        <motion.img
          src={heroCharacter}
          alt="Inkoryx flagship cyberpunk hero character"
          width={1024}
          height={1024}
          className="relative z-10 max-h-[85vh] w-auto object-contain"
          animate={{
            y: [0, -12, 0],
            filter: hovered
              ? "drop-shadow(0 0 60px var(--neon)) drop-shadow(0 0 100px var(--neon-glow)) brightness(1.1)"
              : "drop-shadow(0 0 40px var(--neon-glow))",
          }}
          transition={{
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            filter: { duration: 0.4 },
          }}
        />

        {/* Parallax shine overlay — masked to the character silhouette to avoid a visible rectangle */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
          style={{
            background: shineBackground,
            opacity: hovered ? 1 : 0,
            WebkitMaskImage: `url(${heroCharacter})`,
            maskImage: `url(${heroCharacter})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
          transition={{ opacity: { duration: 0.3 } }}
        />
      </motion.div>
    </motion.div>
  );
}


