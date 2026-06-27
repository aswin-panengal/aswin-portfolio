"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { MagneticText } from "@/components/ui/morphing-cursor";

const PHOTO_DURATION = 1.2;

interface HeroSectionProps {
  onScrollToProjects?: () => void;
  onScrollToContact?: () => void;
}

export function HeroSection({ onScrollToProjects, onScrollToContact }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, prefersReducedMotion ? 0 : -30]);

  const d = prefersReducedMotion ? 0 : 1;
  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="about" className="relative min-h-screen flex flex-col lg:flex-row">

      {/* ── Photo side ───────────────────────────────────────────────────── */}
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen overflow-hidden">
        {/* Outer: jump-in y+opacity. Inner: parallax+scale. Kept separate to avoid MotionValue conflict. */}
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: PHOTO_DURATION * d, ease, delay: 0.1 * d }}
          className="w-full h-[110%]"
        >
          <motion.div
            style={{ y: imageY }}
            initial={{ scale: prefersReducedMotion ? 1 : 1.04 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: PHOTO_DURATION * d, ease }}
            className="relative w-full h-full"
          >
            <Image
              src="/bg.jpg"
              alt="Aswin"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABwYIBf/EACIQAAAGAgMBAQAAAAAAAAAAAAECAwQFBhESITFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCz7pWp3Gu3q2VXs96teoXHi7sW4bC4R9jlX5GWYV8F3oHDnJj6Z7pnHFkknDz3g5VlxnGceVVHOckBrwAB/9k="
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-black/40 to-black" />
      </div>

      {/* ── Text side — perspective: 900px establishes the 3D field ─────── */}
      <div
        className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-20 bg-black"
        style={{ perspective: "900px" }}
      >
        {/* "Hi, I'm Aswin." — 3D depth entry: rises from below + rotates into view */}
        <motion.h1
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 60,
            rotateX: prefersReducedMotion ? 0 : 22,
            filter: prefersReducedMotion ? "blur(0px)" : "blur(6px)",
            scale: prefersReducedMotion ? 1 : 0.92,
          }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.0 * d, delay: 0.3 * d, ease }}
          className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6"
        >
          Hi, I&apos;m{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
            Aswin.
          </span>
        </motion.h1>

        {/* Eyebrow — fades in, flanking lines grow outward from centre */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7 * d, delay: 0.5 * d }}
          className="flex items-center gap-3 mb-6"
        >
          {/* Left line — originX: right edge → grows right-to-left */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 * d, delay: 0.5 * d, ease }}
            style={{ originX: 1 }}
            className="block h-px w-12 bg-zinc-700 flex-shrink-0"
          />
          <span className="text-zinc-500 text-xs uppercase tracking-widest font-medium whitespace-nowrap">
            An MCA graduate
          </span>
          {/* Right line — originX: left edge → grows left-to-right */}
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7 * d, delay: 0.5 * d, ease }}
            style={{ originX: 0 }}
            className="block h-px w-12 bg-zinc-700 flex-shrink-0"
          />
        </motion.div>

        {/* Role — second 3D depth entry, 0.14s offset, slightly more dramatic */}
        <motion.div
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 80,
            rotateX: prefersReducedMotion ? 0 : 28,
            filter: prefersReducedMotion ? "blur(0px)" : "blur(8px)",
            scale: prefersReducedMotion ? 1 : 0.9,
          }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", scale: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 1.05 * d, delay: 0.64 * d, ease }}
        >
          <MagneticText
            text="AI Systems Builder"
            hoverText="Freelance Web Developer"
            className="text-2xl md:text-3xl"
          />
        </motion.div>
      </div>

      {/* Scroll indicator — appears after all text has settled */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ delay: 1.2 * d, duration: 0.7 * d }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-600 z-20"
        aria-hidden="true"
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
