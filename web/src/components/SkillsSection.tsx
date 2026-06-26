"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const OrbitingSkills = dynamic(() => import("@/components/ui/orbiting-skills"), { ssr: false });

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

const fade = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
} as const;

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.04 } },
} as const;

const chip = {
  hidden: { opacity: 0, scale: 0.88 },
  show:   { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
} as const;

export function SkillsSection() {
  return (
    <section id="skills" className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-black">

      {/* Heading */}
      <motion.div
        variants={fade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold text-white">Tech Stack</h2>
      </motion.div>

      {/* Two-column body */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16">

        {/* LEFT — skill categories */}
        <div className="order-2 lg:order-1 flex-1 w-full space-y-8">
          {SKILL_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: gi * 0.1 }}
            >
              {/* Group header */}
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">
                {group.label}
              </p>

              {/* Skill badges */}
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
                    whileHover={{ scale: 1.05, y: -1 }}
                    className="px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-zinc-300 text-xs font-medium cursor-default select-none hover:bg-white/[0.08] hover:border-white/20 hover:text-white transition-colors"
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* RIGHT — orbit */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="order-1 lg:order-2 flex-shrink-0 flex flex-col items-center"
        >
          <OrbitingSkills />
        </motion.div>

      </div>
    </section>
  );
}
