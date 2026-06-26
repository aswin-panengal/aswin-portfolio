"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, GitBranch, ExternalLink, MessageCircle, Check } from "lucide-react";

interface ContactSectionProps {
  onOpenChat: () => void;
}

export function ContactSection({ onOpenChat }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("aswinpanengal@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.5 },
    },
  };

  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center px-6 pb-20 bg-black"
    >
      <div className="text-center max-w-2xl w-full">
        {/* Shimmer heading — entrance handled by wrapper, shimmer on the h2 itself */}
        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: "easeOut" }}
          className="mb-4"
        >
          <motion.h2
            animate={prefersReducedMotion ? {} : { backgroundPosition: ["0% 50%", "200% 50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundImage: "linear-gradient(90deg, #71717a, #ffffff, #d4d4d8, #ffffff, #71717a)",
            }}
            className="text-4xl md:text-5xl font-bold"
          >
            Let&apos;s Build Something.
          </motion.h2>
        </motion.div>

        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.2, duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-zinc-500 text-sm mb-3"
        >
          Available for freelance projects · Full-stack + AI
        </motion.p>

        <motion.p
          initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.3, duration: prefersReducedMotion ? 0 : 0.6 }}
          className="text-xl text-zinc-400 mb-12"
        >
          Whether it&apos;s a full-time role or a freelance project, my inbox is open.
        </motion.p>

        {/* Social buttons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ y: prefersReducedMotion ? 0 : -3 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-white w-[140px]"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : (
              <Mail className="w-5 h-5" />
            )}
            {copied ? (
              <span className="text-green-400 font-medium">Copied!</span>
            ) : (
              <span>Gmail</span>
            )}
          </motion.button>

          <motion.a
            variants={itemVariants}
            whileHover={{ y: prefersReducedMotion ? 0 : -3 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            href="https://www.linkedin.com/in/aswinpanengal/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 transition-colors text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            LinkedIn
          </motion.a>

          <motion.a
            variants={itemVariants}
            whileHover={{ y: prefersReducedMotion ? 0 : -3 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            href="https://github.com/aswin-panengal"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-white/10 hover:border-white/30 transition-colors text-white"
          >
            <GitBranch className="w-5 h-5" />
            GitHub
          </motion.a>

          <motion.a
            variants={itemVariants}
            whileHover={{ y: prefersReducedMotion ? 0 : -3 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
            href="https://www.upwork.com/freelancers/~0168f500087a66cdcd"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-green-600/15 hover:border-green-500/40 transition-colors text-white"
          >
            <ExternalLink className="w-5 h-5" />
            Upwork
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: prefersReducedMotion ? 0 : 0.4, duration: prefersReducedMotion ? 0 : 0.5 }}
        >
          <p className="text-zinc-600 mb-4">Want to know more about me? Talk to my AI.</p>
          <motion.button
            whileHover={{ scale: prefersReducedMotion ? 1 : 1.04 }}
            whileTap={{ scale: prefersReducedMotion ? 1 : 0.97 }}
            onClick={onOpenChat}
            className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:shadow-lg hover:shadow-white/20 transition-shadow flex items-center gap-3 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Open AI Assistant
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
