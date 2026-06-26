"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      className="border-t border-zinc-800/50 py-6 px-6 relative z-10"
    >
      <div className="max-w-5xl mx-auto text-sm text-zinc-600 text-center sm:text-left">
        <span>© {new Date().getFullYear()} Aswin Panengal</span>
      </div>
    </motion.footer>
  );
}
