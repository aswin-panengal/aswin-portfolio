"use client";

import { motion, useReducedMotion } from "framer-motion";

const TIMELINE = [
  {
    role: "Freelance Web Developer",
    description:
      "Building landing pages, portfolios, SaaS UIs, and AI-powered web applications for clients. End-to-end delivery from design to deployment.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion", "shadcn/ui", "TypeScript"],
    color: "bg-white",
    glow: "shadow-[0_0_10px_rgba(255,255,255,0.35)]",
  },
  {
    role: "Applied AI Engineering",
    description:
      "Independently designed and shipped production-grade AI systems — a RAG recruitment platform, a churn prediction engine, and a multi-agent LLM workspace.",
    stack: ["Python", "LangGraph", "Qdrant", "Gemini AI", "FastAPI", "Docker"],
    color: "bg-zinc-400",
    glow: "shadow-[0_0_10px_rgba(255,255,255,0.20)]",
  },
];

export function ExperienceSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="experience" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black">
      <div className="max-w-3xl w-full">
        {/* Heading */}
        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-3">Experience</h2>
          <p className="text-zinc-500 text-sm">What I&apos;ve been building</p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-10">
          {/* Animated vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            style={{ originY: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1, ease: "easeOut" }}
            className="absolute left-3.5 top-2 bottom-2 w-px bg-gradient-to-b from-white/40 via-white/15 to-transparent"
          />

          <div className="space-y-12">
            {TIMELINE.map((entry, i) => (
              <div key={entry.role} className="relative">
                {/* Connector dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.3 + i * 0.15,
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                  }}
                  className={`absolute -left-[26px] top-1.5 w-3 h-3 rounded-full ${entry.color} ${entry.glow}`}
                />

                {/* Entry card */}
                <motion.div
                  initial={{ opacity: prefersReducedMotion ? 1 : 0, x: prefersReducedMotion ? 0 : -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: prefersReducedMotion ? 0 : 0.2 + i * 0.15,
                    duration: prefersReducedMotion ? 0 : 0.5,
                  }}
                  className="p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-sm"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">{entry.role}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">{entry.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-3 py-1 bg-zinc-800/50 rounded-full text-zinc-300 border border-zinc-700/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
