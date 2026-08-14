"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SKILL_GROUPS = [
  {
    label: "AI & Machine Learning",
    skills: [
      "LLMs",
      "RAG",
      "Agentic Workflows",
      "LangGraph",
      "Prompt Engineering",
      "Gemini AI",
      "Sentence Transformers",
      "RAGAS",
    ],
  },
  {
    label: "Languages & Frameworks",
    skills: [
      "Python",
      "TypeScript",
      "FastAPI",
      "Django",
      "Next.js",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "RESTful APIs",
    ],
  },
  {
    label: "Tools & Databases",
    skills: [
      "Qdrant",
      "ChromaDB",
      "Pandas",
      "Scikit-learn",
      "SQL",
      "Docker",
      "Git",
      "Streamlit",
      "Vercel",
    ],
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function SkillsSection() {
  const prefersReducedMotion = useReducedMotion();

  // Variants inside component so they close over prefersReducedMotion
  const fade = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
    show:   { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: EASE } },
  }), [prefersReducedMotion]);

  const stagger = useMemo(() => ({
    hidden: {},
    show:   { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.04 } },
  }), [prefersReducedMotion]);

  const chip = useMemo(() => ({
    hidden: { opacity: 0, scale: prefersReducedMotion ? 1 : 0.88 },
    show:   { opacity: 1, scale: 1, transition: { duration: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" as const } },
  }), [prefersReducedMotion]);

  return (
    <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black">

      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold text-white">Tech Stack</h2>
      </motion.div>

      <div className="w-full max-w-2xl space-y-8">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.div
            key={group.label}
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: gi * 0.1 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
              {group.label}
            </p>

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              className="flex flex-wrap gap-2"
            >
              {group.skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={chip}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -1 }}
                  className="px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-zinc-300 text-xs font-medium cursor-default select-none hover:bg-white/8 hover:border-white/20 hover:text-white transition-colors"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
