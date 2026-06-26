"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  Brain,
  Play,
  GitBranch,
  ExternalLink,
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

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.6 },
    },
  };

  return (
    <>
      <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black">
        <div className="max-w-5xl w-full">
          {/* Heading */}
          <motion.div
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <div className="flex items-center gap-4 mb-4 justify-center">
              <div className="h-px flex-1 max-w-[80px] bg-zinc-800" />
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Featured Work</span>
              <div className="h-px flex-1 max-w-[80px] bg-zinc-800" />
            </div>
            <h2 className="text-3xl font-bold text-white">Projects</h2>
          </motion.div>

          {/* Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {PROJECTS.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                whileHover={{ y: prefersReducedMotion ? 0 : -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setSelectedProject(project)}
                className="relative group cursor-pointer"
              >
                {/* Gradient glow on hover */}
                <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-white/8 to-white/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />

                <div className="p-8 rounded-3xl border border-zinc-800/50 group-hover:border-white/20 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/80 transition-all flex flex-col h-full">
                  {/* Category chip */}
                  <span className="self-start text-[10px] font-semibold uppercase tracking-widest text-zinc-500 border border-zinc-800 rounded-full px-2.5 py-0.5 mb-4">
                    {project.category}
                  </span>

                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { rotate: 10, scale: 1.15 }}
                    transition={{ duration: 0.2 }}
                    className="w-fit mb-6"
                  >
                    <project.icon className={`w-8 h-8 ${project.color}`} />
                  </motion.div>

                  <h3 className="text-2xl text-white font-semibold mb-3">{project.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed flex-grow">{project.shortDesc}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-2 flex-wrap">
                      {project.stack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-3 py-1 bg-zinc-800/50 rounded-full text-zinc-300 border border-zinc-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.stack.length > 3 && (
                        <span className="text-xs px-3 py-1 bg-zinc-800/50 rounded-full text-zinc-500 border border-zinc-700/50">
                          +{project.stack.length - 3}
                        </span>
                      )}
                    </div>

                    {/* View details arrow */}
                    <span className="text-xs text-zinc-600 group-hover:text-white transition-colors flex items-center gap-1 shrink-0 ml-3">
                      <span className="overflow-hidden max-w-0 group-hover:max-w-[5rem] transition-all duration-300 whitespace-nowrap">
                        View details
                      </span>
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: "easeOut" }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <selectedProject.icon className={`w-12 h-12 ${selectedProject.color} mb-6`} />

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
                      <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                      <GitBranch className="w-4 h-4 group-hover:scale-110 transition-transform" />
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
                      <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
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

              <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={`${selectedProject.title} screenshot`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.parentElement!.innerHTML =
                        '<div class="aspect-video flex items-center justify-center text-zinc-600"><p>Screenshot coming soon!</p></div>';
                    }}
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-zinc-600">
                    <p>!</p>
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
