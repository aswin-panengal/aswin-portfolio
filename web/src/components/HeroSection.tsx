"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MagneticText } from "@/components/ui/morphing-cursor";

const PHOTO_DURATION = 1.2;
const TEXT_DELAY_BASE = 0.5;

interface HeroSectionProps {
  onScrollToProjects?: () => void;
  onScrollToContact?: () => void;
}

export function HeroSection({ onScrollToProjects, onScrollToContact }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, prefersReducedMotion ? 0 : -30]);

  const d = prefersReducedMotion ? 0 : 1;
  const ease = [0.16, 1, 0.3, 1] as const; // expo-out: fast start, long smooth tail

  return (
    <section id="about" className="relative min-h-screen flex flex-col lg:flex-row">

      {/* ── Photo side ───────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen overflow-hidden">
        {/* Fade + scale up: photo starts at 95% scale and opacity 0 */}
        <motion.div
          style={{ y: imageY }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: PHOTO_DURATION * d, ease, delay: 0.1 * d }}
          className="w-full h-[110%]"
        >
          <img src="/bg.jpg" alt="Aswin" className="w-full h-full object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-black/40 to-black" />
      </div>

      {/* ── Text side ────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-20 bg-black">

        {/* Line 1 — "Hi, I'm Aswin." */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0 * d, delay: TEXT_DELAY_BASE * d, ease }}
          className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6"
        >
          Hi, I&apos;m{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Aswin.
          </span>
        </motion.h1>

        {/* Line 2 — eyebrow label */}
        <motion.p
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 * d, delay: (TEXT_DELAY_BASE + 0.22) * d, ease }}
          className="text-zinc-500 text-sm uppercase tracking-widest mb-3 font-medium"
        >
          An MCA graduate &amp; —
        </motion.p>

        {/* Line 3 — MagneticText role */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 * d, delay: (TEXT_DELAY_BASE + 0.44) * d, ease }}
        >
          <MagneticText
            text="AI Systems Builder"
            hoverText="Freelance Web Developer"
            className="text-2xl md:text-3xl"
          />
        </motion.div>
      </div>

      {/* Scroll indicator — appears last */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (TEXT_DELAY_BASE + 0.7) * d, duration: 0.7 * d }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-600 z-20"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
