"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { NavPill } from "@/components/NavPill";
import { HeroSection } from "@/components/HeroSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

const SECTION_IDS = ["about", "skills", "projects", "experience", "contact"];

/**
 * Root page — thin orchestrator that composes all portfolio sections.
 *
 * Shared state:
 *   activeTab  — driven by scroll spy; passed to NavPill for the sliding active indicator
 *   isChatOpen — lifted here so ContactSection can open the chat widget without prop-drilling
 *                through intermediate components or reaching for a context/store
 *
 * `scrollToSection`, `handleCloseChat`, and `handleOpenChat` are stable `useCallback`
 * references so NavPill and ContactSection don't re-render on every activeTab change.
 */
export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("about");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // threshold: 0.4 — switches the active nav tab once 40% of a section is visible.
  // Lower values trip too early on fast scrolls; higher values fail on short sections
  // (e.g. Footer) that never reach 50% viewport coverage.
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const observer = new IntersectionObserver(
          ([entry]) => { if (entry.isIntersecting) setActiveTab(id); },
          { threshold: 0.4 }
        );
        observer.observe(el);
        observers.push(observer);
      }
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);
  const handleOpenChat  = useCallback(() => setIsChatOpen(true),  []);

  return (
    <div className="bg-black text-zinc-300 font-sans selection:bg-purple-500/30 overflow-x-hidden bg-dot-grid">

      {/* Blobs hidden on mobile — animating blur-3xl is too expensive for mobile GPUs */}
      {!prefersReducedMotion && (
        <div className="hidden md:block fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
            animate={{ x: [0, 40, -20, 30, 0], y: [0, -30, 40, -10, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            style={{ willChange: "transform" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.025] rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -50, 20, -30, 0], y: [0, 40, -20, 30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            style={{ willChange: "transform" }}
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 30, -40, 10, 0], y: [0, 20, -30, 40, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            style={{ willChange: "transform" }}
            className="absolute top-2/3 left-1/2 w-64 h-64 bg-white/[0.015] rounded-full blur-3xl"
          />
        </div>
      )}

      <NavPill activeTab={activeTab} onTabClick={scrollToSection} />

      <main className="relative z-10">
        <HeroSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection onOpenChat={handleOpenChat} />
      </main>

      <Footer />

      <ChatWidget isOpen={isChatOpen} onClose={handleCloseChat} onOpen={handleOpenChat} mountDelay={1.2} />
    </div>
  );
}
