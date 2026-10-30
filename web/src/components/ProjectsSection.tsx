"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  FileText,
  TrendingUp,
  Brain,
  Play,
  GitBranch,
  ExternalLink,
  ArrowUpRight,
  X,
} from "lucide-react";

type Project = {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  stack: string[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  category: "AI / ML" | "Web Dev";
  github?: string;
  demo?: string;
  livelink?: string;
  image?: string;
};

const PROJECTS: Project[] = [
  {
    id: "resumelens",
    title: "ResumeLens",
    shortDesc:
      "An AI-powered placement platform for automated resume coaching and smart candidate matching",
    longDesc:
      "ResumeLens is an AI-powered recruitment platform that revolutionizes university placements using semantic vector matching and generative AI coaching. Built with Django, ChromaDB, and Google Gemini, it provides students with actionable resume feedback while equipping recruiters with a powerful 'Chat with Resume' RAG interface to instantly discover top talent.",
    stack: ["Python", "Django", "Gemini API", "RAG", "Sentence Transformers", "ChromaDB"],
    icon: FileText,
    color: "text-purple-400",
    category: "AI / ML",
    github: "https://github.com/aswin-panengal/ResumeLens",
    demo: "https://www.loom.com/share/edaf4624a1364f6f98a20c7f1ce7cb69",
    image: "/resumelens-screenshot.png",
  },
  {
    id: "cris",
    title: "CRIS",
    shortDesc: "Customer Retention Intelligence System for predicting churn.",
    longDesc:
      "An end-to-end predictive analytics engine that identifies at-risk customers using Random Forest classification. By implementing SMOTE to handle class imbalance and fine-tuning decision thresholds, the system delivers a 94% accuracy rate, allowing businesses to execute proactive retention strategies before churn occurs.",
    stack: ["Python", "Pandas", "Scikit-learn", "Random Forest", "SMOTE", "Streamlit"],
    icon: TrendingUp,
    color: "text-blue-400",
    category: "AI / ML",
    github: "https://github.com/aswin-panengal/Customer-Retention-Intelligence-System",
    image: "/cris-screenshot.png",
  },
  {
    id: "smartops",
    title: "SmartOps",
    shortDesc:
      "A multi-workspace AI platform using LangGraph state routing for deterministic CSV analysis and semantic PDF retrieval.",
    longDesc:
      "A unified, session-isolated workspace that intelligently orchestrates queries between a Pandas-driven calculation sandbox and an unstructured PDF semantic search pipeline. Features stateful multi-session memory to prevent data leakage, automatic token-safe summarization, and a containerized FastAPI backend deployed via Docker and Render, alongside a Next.js 14 frontend.",
    stack: ["FastAPI", "Next.js 14", "TypeScript", "LangGraph", "Qdrant", "Pandas", "Gemini API", "Docker"],
    icon: Brain,
    color: "text-emerald-400",
    category: "AI / ML",
    github: "https://github.com/aswin-panengal/SmartOps",
    livelink: "https://smart-ops-eight.vercel.app/",
    image: "/SmartOps logo.png",
  },
];

/**
 * Project list with an animated preview and the existing detail modal.
 *
 * Three concerns run concurrently:
 *   - List interactions: hover/focus highlight and a shared screenshot preview
 *   - Modal lifecycle: AnimatePresence mount/unmount, WCAG 2.1 focus trap, Escape-to-dismiss
 *   - Image resilience: imgError resets on project change so a failed image on one card
 *     doesn't suppress the screenshot in the next modal
 *
 * On modal close, focus returns to the card that triggered it (WCAG 2.4.3 Focus Order).
 */
export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState(PROJECTS[0]);
  const [imgError, setImgError] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const modalRef       = useRef<HTMLDivElement>(null);
  const triggerRef     = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedProject(null); };
    if (selectedProject) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject]);


  // WCAG 2.1 §2.4.3 — focus trap keeps keyboard navigation inside the modal and returns
  // focus to the originating card on close. rAF defers the initial focus call until after
  // AnimatePresence commits the modal to the DOM; querying focusable nodes before that
  // frame returns an empty NodeList.
  useEffect(() => {
    if (!selectedProject) {
      triggerRef.current?.focus();
      triggerRef.current = null;
      return;
    }
    if (!modalRef.current) return;
    const modal = modalRef.current;
    const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
    const nodes = Array.from(modal.querySelectorAll<HTMLElement>(FOCUSABLE));
    requestAnimationFrame(() => nodes[0]?.focus());

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const first = nodes[0];
      const last  = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [selectedProject]);

  const containerVariants = useMemo(() => ({
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 } },
  }), [prefersReducedMotion]);

  const rowVariants = useMemo(() => ({
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6 },
    },
  }), [prefersReducedMotion]);

  return (
    <>
      <section id="projects" className="min-h-[100dvh] flex flex-col items-center justify-center px-6 py-24 bg-black">
        <div className="max-w-6xl w-full">
          <motion.div
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
            className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-14"
          >
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Projects</h2>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-400">A selection of my work in AI and full-stack development.</p>
          </motion.div>

          <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="border-y border-zinc-800/80 divide-y divide-zinc-800/80"
            >
              {PROJECTS.map((project) => {
                const isActive = activeProject.id === project.id;
                return (
                <motion.button
                  key={project.id}
                  type="button"
                  variants={rowVariants}
                  onMouseEnter={() => setActiveProject(project)}
                  onFocus={() => setActiveProject(project)}
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setSelectedProject(project);
                    setImgError(false);
                  }}
                  aria-label={`View details for ${project.title}`}
                  aria-haspopup="dialog"
                  className="relative isolate block w-full cursor-pointer px-3 py-7 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-5 sm:py-8"
                >
                  {isActive && (
                    <motion.span
                      layoutId={prefersReducedMotion ? undefined : "project-highlight"}
                      transition={{ type: "spring", stiffness: 380, damping: 36 }}
                      className="absolute inset-0 -z-10 bg-white/4"
                      aria-hidden="true"
                    />
                  )}
                  <span className="flex items-start justify-between gap-5">
                    <span className="min-w-0">
                      <span className="mb-3 flex items-center gap-3">
                        <project.icon className={`h-5 w-5 shrink-0 ${project.color}`} aria-hidden="true" />
                        <span className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{project.title}</span>
                      </span>
                      <span className="block max-w-md text-sm leading-relaxed text-zinc-400">{project.shortDesc}</span>
                      <span className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                        {project.stack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs text-zinc-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="text-xs text-zinc-400">
                            +{project.stack.length - 3}
                          </span>
                        )}
                      </span>
                    </span>
                    <motion.span
                      animate={{
                        x: isActive && !prefersReducedMotion ? 2 : 0,
                        y: isActive && !prefersReducedMotion ? -2 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 26 }}
                      className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${isActive ? "border-white/30 bg-white text-black" : "border-zinc-700 text-zinc-400"}`}
                      aria-hidden="true"
                    >
                      <ArrowUpRight className="h-5 w-5" />
                    </motion.span>
                  </span>
                  <span className="mt-5 block text-xs font-medium text-zinc-300 lg:hidden">View project details</span>
                </motion.button>
                );
              })}
            </motion.div>

            {/* The preview has reserved dimensions; changing projects never shifts the list. */}
            <div className="sticky top-32 hidden min-w-0 lg:block" aria-hidden="true">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20, scale: prefersReducedMotion ? 1 : 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 flex flex-col justify-center p-7 xl:p-9"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-950">
                      {activeProject.image && (
                        <Image
                          src={activeProject.image}
                          alt=""
                          fill
                          sizes="(min-width: 1280px) 420px, 360px"
                          className="object-contain"
                        />
                      )}
                    </div>
                    <div className="mt-7 flex items-center justify-between gap-4">
                      <span className="text-lg font-medium text-white">{activeProject.title}</span>
                      <span className="text-xs text-zinc-400">{activeProject.category}</span>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-zinc-400">{activeProject.stack.join(" · ")}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
              <p className="mt-5 text-center text-xs text-zinc-400">Select a project to explore the details.</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
              tabIndex={-1}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                aria-label={`Close ${selectedProject.title} details`}
                className="absolute top-6 right-6 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>

              <selectedProject.icon className={`w-12 h-12 ${selectedProject.color} mb-6`} aria-hidden="true" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-4xl font-bold text-white">{selectedProject.title}</h2>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.demo && (
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-medium transition-colors w-fit group"
                    >
                      <Play className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      Watch Demo
                    </a>
                  )}
                  {selectedProject.github && (
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-medium transition-colors w-fit group"
                    >
                      <GitBranch className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      View Code
                    </a>
                  )}
                  {selectedProject.livelink && (
                    <a
                      href={selectedProject.livelink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-sm font-medium transition-colors w-fit group"
                    >
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" aria-hidden="true" />
                      Live Link
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mb-8">
                {selectedProject.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-sm px-4 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="text-lg text-zinc-300 leading-relaxed mb-10">{selectedProject.longDesc}</p>

              {/* aspect-video container prevents CLS while the image loads */}
              <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner">
                {selectedProject.image && !imgError ? (
                  <Image
                    src={selectedProject.image}
                    alt={`${selectedProject.title} — project screenshot`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-sm">
                    Screenshot coming soon!
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
