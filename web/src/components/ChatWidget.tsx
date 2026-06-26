"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Send, MessageCircle, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import type { Message } from "ai";

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen?: () => void;
  mountDelay?: number;
}

export function ChatWidget({ isOpen, onClose, onOpen, mountDelay = 0 }: ChatWidgetProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, status, error } = useChat({
    api: "/api/chat",
    streamProtocol: "data",
    onError: (err) => {
      console.error("Chat error:", err);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: mountDelay, duration: 0.4, ease: "easeOut" }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[100] bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl shadow-purple-900/50 transition-colors group
              /* mobile: icon-only circle */
              p-4
              /* desktop: pill with expandable text */
              md:flex md:items-center md:gap-3 md:pl-4 md:pr-4"
          >
            <MessageCircle className="w-6 h-6 shrink-0" />
            {/* Text — desktop only */}
            <span className="hidden md:flex font-medium items-center gap-1 overflow-hidden">
              <span className="whitespace-nowrap">Ask</span>
              <span className="max-w-0 group-hover:max-w-[6rem] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap">
                about me
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-8 right-8 z-[120] w-[400px] h-[600px] max-w-[calc(100vw-2rem)] flex flex-col rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/8 rounded-xl">
                  <Terminal className="w-5 h-5 text-zinc-400" />
                </div>
                <h2 className="text-sm font-semibold text-white">Aswin&apos;s AI Assistant</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                  <MessageCircle className="w-8 h-8 mb-4 opacity-20" />
                  <p className="text-sm">
                    Hello! I&apos;m here to help you explore Aswin&apos;s profile. Ask me about his projects,
                    skills, education, or certifications.
                  </p>
                </div>
              )}

              {messages.map((m: Message) => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] p-3 text-sm ${
                      m.role === "user"
                        ? "bg-purple-600 text-white rounded-2xl rounded-tr-sm"
                        : "bg-zinc-800/50 text-zinc-200 rounded-2xl rounded-tl-sm border border-zinc-700/50"
                    }`}
                  >
                    {m.role === "user" ? (
                      m.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1 text-zinc-200" {...props} />,
                          a: ({ node, ...props }) => (
                            <a
                              {...props}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
                            />
                          ),
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {status === "error" && error && (
                <div className="rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
                  {error.message || "Something went wrong with the chat."}
                </div>
              )}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex gap-1 items-center h-[40px]">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
