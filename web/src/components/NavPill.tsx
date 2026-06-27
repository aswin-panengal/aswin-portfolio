"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useReducedMotion, AnimatePresence } from "framer-motion";
import { User, Briefcase, Mail, Code2, Clock } from "lucide-react";

export const TABS = [
  { id: "about",      label: "About",      icon: User },
  { id: "skills",     label: "Skills",     icon: Code2 },
  { id: "projects",   label: "Projects",   icon: Briefcase },
  { id: "experience", label: "Experience", icon: Clock },
  { id: "contact",    label: "Contact",    icon: Mail },
];

interface NavPillProps {
  activeTab: string;
  onTabClick: (id: string) => void;
}

export function NavPill({ activeTab, onTabClick }: NavPillProps) {
  const { scrollYProgress, scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (y) => setVisible(y > 80));
  }, [scrollY]);

  return (
    <>
      {/* Scroll progress bar — only visible after scrolling */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              scaleX: prefersReducedMotion ? 1 : scrollYProgress,
              transformOrigin: "left",
            }}
            className="fixed top-0 left-0 right-0 h-px bg-white/50 z-[200]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating pill nav — hidden on hero, fades in on scroll */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-label="Site navigation"
            className="fixed left-1/2 -translate-x-1/2 z-50 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 p-1.5 rounded-full flex gap-1 shadow-2xl shadow-black"
            style={{ top: "max(1.5rem, env(safe-area-inset-top))" }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? "page" : undefined}
                className={`relative px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-zinc-800 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon className="w-4 h-4" aria-hidden="true" />
                  {/* sr-only on small screens so label stays in the accessibility tree */}
                  <span className="sr-only xl:not-sr-only xl:inline">{tab.label}</span>
                </span>
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
