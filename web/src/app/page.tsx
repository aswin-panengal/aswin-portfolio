"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Terminal, Code2, Database, MessageCircle, X, User, Briefcase, Mail, ExternalLink, GitBranch, FileText, TrendingUp, Brain, Play } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useChat } from "ai/react";

// Navigation setup
const TABS = [
  { id: "about", label: "About", icon: User },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "contact", label: "Contact", icon: Mail },
];

// Project Data 
const PROJECTS = [
  {
    id: "resumelens",
    title: "ResumeLens",
    shortDesc: "An AI-powered placement platform for automated resume coaching and smart candidate matching",
    longDesc: "ResumeLens is an AI-powered recruitment platform that revolutionizes university placements using semantic vector matching and generative AI coaching. Built with Django, ChromaDB, and Google Gemini, it provides students with actionable resume feedback while equipping recruiters with a powerful 'Chat with Resume' RAG interface to instantly discover top talent.",
    stack: ["Python", "Django", "Gemini API", "RAG", "Sentence Transformers", "ChromaDB"],
    icon: FileText,
    color: "text-purple-400",
    github: "https://github.com/aswin-panengal/ResumeLens",
    demo: "https://www.loom.com/share/edaf4624a1364f6f98a20c7f1ce7cb69",
    image: "/resumelens-screenshot.png"
  },
  {
    id: "cris",
    title: "CRIS",
    shortDesc: "Customer Retention Intelligence System for predicting churn.",
    longDesc: "An end-to-end predictive analytics engine that identifies at-risk customers using Random Forest classification. By implementing SMOTE to handle class imbalance and fine-tuning decision thresholds, the system delivers a 94% accuracy rate, allowing businesses to execute proactive retention strategies before churn occurs.",
    stack: ["Python", "Pandas", "Scikit-learn", "Random Forest", "SMOTE", "Streamlit"],
    icon: TrendingUp,
    color: "text-blue-400",
    github: "https://github.com/aswin-panengal/Customer-Retention-Intelligence-System", // <-- Replace with your real link
    image: "/cris-screenshot.png"
  },

  {
    id: "smartops",
    title: "SmartOps (Dual-Engine AI Platform)",
    shortDesc: "Production-grade RAG and analytical engine powered by LangGraph, FastAPI, and Qdrant.",
    longDesc: "A unified conversational interface that intelligently routes queries between a PDF semantic search engine and a CSV pandas-generation engine. It features stateful conversation memory with automatic summarization to prevent token limits. The entire FastAPI, Qdrant, and n8n automation stack is containerized with Docker and auto-deployed via Render.",
    stack: ["FastAPI", "LangGraph", "Qdrant", "Gemini API", "Docker", "n8n"],
    icon: Brain,
    color: "text-emerald-400",
    github: "https://github.com/aswin-panengal/SmartOps",
    image: "/SmartOps logo.png"
  }
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("about");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  // Vercel AI SDK useChat hook (replaces manual fetch logic)
  const { messages, input, handleInputChange, handleSubmit, isLoading, status, error } = useChat({
    api: '/api/chat',
    streamProtocol: 'data',
    onError: (error) => {
      console.error('Chat hook error:', error);
    },
    onResponse: (response) => {
      console.log('Chat API response status:', response.status);
    },
  });

  // Auto-Scroll Logic
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Scroll Spy logic
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TABS.forEach((tab) => {
      const element = document.getElementById(tab.id);
      if (element) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActiveTab(tab.id);
          },
          { threshold: 0.5 }
        );
        observer.observe(element);
        observers.push(observer);
      }
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-black text-zinc-300 font-sans selection:bg-purple-500/30 overflow-x-hidden">

      {/* Floating Pill Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 p-1.5 rounded-full flex gap-2 shadow-2xl shadow-black">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => scrollToSection(tab.id)}
            className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-zinc-800 rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main>
        {/* ABOUT SECTION */}
        <section id="about" className="min-h-screen flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-screen">
            <img
              src="/bg.jpg"
              alt="Aswin"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-transparent via-black/40 to-black"></div>
          </div>

          <div className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16 py-20 bg-black">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Aswin.</span>
              </h1>

              <p className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500 leading-relaxed font-light mb-10 max-w-xl">
                I am a final year MCA student specializing in AI and automation, building smart, real-world solutions.
              </p>

              <div className="flex gap-4">
                <button onClick={() => scrollToSection("projects")} className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-zinc-200 transition-colors">
                  View Work
                </button>
                <button onClick={() => scrollToSection("contact")} className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white rounded-full font-semibold hover:bg-zinc-800 transition-colors">
                  Contact Me
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl w-full"
          >
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Featured Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="p-8 rounded-3xl border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md hover:bg-zinc-900/80 hover:border-zinc-700 transition-all group cursor-pointer flex flex-col h-full"
                >
                  <project.icon className={`w-8 h-8 ${project.color} mb-6 group-hover:scale-110 transition-transform`} />
                  <h3 className="text-2xl text-white font-semibold mb-3">{project.title}</h3>
                  <p className="text-zinc-400 mb-6 leading-relaxed flex-grow">{project.shortDesc}</p>
                  <div className="flex gap-2 flex-wrap mt-auto">
                    {project.stack.map(tech => (
                      <span key={tech} className="text-xs px-3 py-1 bg-zinc-800/50 rounded-full text-zinc-300 border border-zinc-700/50">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="min-h-screen flex flex-col items-center justify-center px-6 pb-20 bg-black">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl"
          >
            <h2 className="text-4xl font-bold text-white mb-6">Let's build something.</h2>
            <p className="text-xl text-zinc-400 mb-12">
              Whether it is a full-time role or a freelanc project, my inbox is open.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=aswinpanengal@gmail.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-red-500/20 hover:border-red-500/50 transition-colors text-white">
                <Mail className="w-5 h-5" /> Gmail
              </a>
              <a href="https://www.linkedin.com/in/aswinpanengal/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                LinkedIn
              </a>
              <a href="https://github.com/aswin-panengal" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-white/10 hover:border-white/30 transition-colors text-white">
                <GitBranch className="w-5 h-5" /> GitHub
              </a>
              <a href="https://www.upwork.com/freelancers/~0168f500087a66cdcd" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:bg-green-600/15 hover:border-green-500/40 transition-colors text-white">
                <ExternalLink className="w-5 h-5" /> Upwork
              </a>
            </div>

            <p className="text-zinc-600 mb-4">Want to know more about me? Talk to My AI.</p>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-8 py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform flex items-center gap-3 mx-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Open AI Assistant
            </button>
          </motion.div>
        </section>
      </main>

      {/* PROJECT POPUP MODAL */}
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
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl custom-scrollbar"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 p-2 bg-zinc-900 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <selectedProject.icon className={`w-12 h-12 ${selectedProject.color} mb-6`} />

              {/* Header & Buttons Container */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-4xl font-bold text-white">{selectedProject.title}</h2>

                <div className="flex flex-wrap gap-3">
                  {/* Loom Demo Button (Makes it purple so it stands out!) */}
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

                  {/* GitHub Button */}
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
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mb-8">
                {selectedProject.stack.map((tech: string) => (
                  <span key={tech} className="text-sm px-4 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-zinc-300">{tech}</span>
                ))}
              </div>

              <p className="text-lg text-zinc-300 leading-relaxed mb-10">
                {selectedProject.longDesc}
              </p>

              {/* Dynamic Image / Screenshot viewer */}
              <div className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-inner">
                {selectedProject.image ? (
                  <img
                    src={selectedProject.image}
                    alt={`${selectedProject.title} screenshot`}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      // Fallback if image path is wrong
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<div class="aspect-video flex items-center justify-center text-zinc-600"><p>Screenshot coming soon!</p></div>';
                    }}
                  />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-zinc-600">
                    <p>Screenshot coming soon!</p>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CHAT WIDGET */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsChatOpen(true)}
            className="fixed bottom-8 right-8 z-[100] p-4 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl shadow-purple-900/50 flex items-center gap-3 group transition-colors"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="font-medium pr-2 flex items-center gap-1">
              <span className="whitespace-nowrap">Ask</span>
              <span className="overflow-hidden max-w-0 group-hover:max-w-[9rem] transition-all duration-300 ease-in-out whitespace-nowrap">
                about me
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[120] w-[400px] h-[600px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Terminal className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Aswin's AI Assistant</h2>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                  <MessageCircle className="w-8 h-8 mb-4 opacity-20" />
                  <p className="text-sm mb-6">Hello! I’m here to help you explore Aswin’s profile. Ask me about his projects, skills, education, or certifications.</p>
                  <div className="flex flex-col gap-2 w-full">
                    {/* Fixed Suggestion Buttons */}
                  </div>
                </div>
              )}

              {messages.map((m: any) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 text-sm ${m.role === 'user'
                    ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm'
                    : 'bg-zinc-800/50 text-zinc-200 rounded-2xl rounded-tl-sm border border-zinc-700/50'
                    }`}>
                    {m.role === 'user' ? (
                      m.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1 text-zinc-200" {...props} />,
                          // THIS IS THE MAGIC LINE that makes AI links open in a new tab with purple styling!
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                            />
                          )
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {/* Only show loading bubble if the AI is thinking, not while it's actively typing */}
              {status === 'error' && error && (
                <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
                  {error.message || 'Something went wrong with the chat. Check the console for details.'}
                </div>
              )}
              {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex gap-1 items-center h-[40px]">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              {/* Invisible element for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}