"use client";

import { useRef, useEffect, useMemo, useState } from "react";
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

// Extracts the countdown in seconds from the server's rate-limit response body.
function parseRetryAfter(err: Error): number {
  const match = err.message.match(/try again in (\d+) seconds?/i);
  return match ? parseInt(match[1], 10) : 0;
}

function isDailyLimit(err: Error): boolean {
  return err.message.toLowerCase().includes("daily limit");
}

function getFriendlyError(err: Error): string {
  const m = err.message.toLowerCase();
  if (m.includes("daily limit"))
    return "You've hit the daily message limit. Please come back tomorrow.";
  if (m.includes("rate limit"))
    return "Too many messages — the AI needs a short breather.";
  if (m.includes("50") || m.includes("server"))
    return "Something went wrong on our end. Please try again.";
  if (m.includes("fetch") || m.includes("network") || m.includes("failed"))
    return "Connection issue. Please check your internet and try again.";
  return "Something went wrong. Please try again.";
}

/**
 * Floating AI chat widget that streams responses from /api/chat.
 *
 * Props:
 *   isOpen     — controlled by the parent; toggling triggers AnimatePresence mount/unmount
 *   mountDelay — seconds before the FAB appears; set to 1.2 in page.tsx so the button
 *                doesn't compete visually with the LCP element during initial load
 *
 * Stream lifecycle: closing while a response is in-flight calls `stop()` to abort the
 * underlying fetch before unmounting — without it, the Vercel AI SDK's internal promise
 * resolves into an unmounted component, silently leaking memory.
 */
export function ChatWidget({ isOpen, onClose, onOpen, mountDelay = 0 }: ChatWidgetProps) {
  const [retryIn, setRetryIn] = useState(0);

  const { messages, input, handleInputChange, handleSubmit, isLoading, status, error, reload, stop } = useChat({
    api: "/api/chat",
    streamProtocol: "data",
    onError: (err) => {
      console.error("Chat error:", err);
      const secs = parseRetryAfter(err);
      if (secs > 0) setRetryIn(secs);
    },
  });

  const messagesEndRef    = useRef<HTMLDivElement>(null);
  const lastMessageIdRef  = useRef<string | undefined>(undefined);

  // Memoized so ReactMarkdown doesn't re-create renderer functions on every streaming token.
  const markdownComponents = useMemo(() => ({
    strong: ({ node: _n, ...props }: React.ComponentPropsWithoutRef<"span"> & { node?: unknown }) =>
      <span className="font-bold text-white" {...props} />,
    p: ({ node: _n, ...props }: React.ComponentPropsWithoutRef<"p"> & { node?: unknown }) =>
      <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node: _n, ...props }: React.ComponentPropsWithoutRef<"ul"> & { node?: unknown }) =>
      <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
    li: ({ node: _n, ...props }: React.ComponentPropsWithoutRef<"li"> & { node?: unknown }) =>
      <li className="mb-1 text-zinc-200" {...props} />,
    // Sanitize href — only allow http/https/mailto to prevent javascript: XSS
    a: ({ node: _n, href, children, ...props }: React.ComponentPropsWithoutRef<"a"> & { node?: unknown; href?: string }) => {
      const isSafe = href ? /^(https?:\/\/|mailto:)/.test(href) : false;
      if (!isSafe) return <span className="text-purple-400 underline cursor-not-allowed" {...props}>{children}</span>;
      return (
        <a href={href} {...props} target="_blank" rel="noopener noreferrer"
           className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors">
          {children}
        </a>
      );
    },
  }), []);

  // Decrements retryIn every second so the Retry button re-enables automatically
  // when the server's rate-limit window expires.
  useEffect(() => {
    if (retryIn <= 0) return;
    const t = setTimeout(() => setRetryIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [retryIn]);

  // Smooth-scrolls on a new message arrival; uses instant scroll while tokens are streaming —
  // animating scroll position 20+ times/sec during a fast stream causes layout thrashing.
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg) return;
    const isNewMessage = lastMsg.id !== lastMessageIdRef.current;
    messagesEndRef.current?.scrollIntoView({ behavior: isNewMessage ? "smooth" : "auto" });
    if (isNewMessage) lastMessageIdRef.current = lastMsg.id;
  }, [messages]);

  // Abort the in-flight Groq stream before unmounting to prevent the SDK's fetch
  // promise from resolving into an unmounted component.
  const handleClose = () => {
    if (isLoading) stop();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: mountDelay, duration: 0.4, ease: "easeOut" }}
            onClick={onOpen}
            aria-label="Open AI chat assistant"
            className="fixed right-6 md:right-8 z-[100] bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-2xl shadow-purple-900/50 transition-colors group
              p-4
              md:flex md:items-center md:gap-3 md:pl-4 md:pr-4"
            style={{ bottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 0.5rem))" }}
          >
            <MessageCircle className="w-6 h-6 shrink-0" aria-hidden="true" />
            <span className="hidden md:flex font-medium items-center gap-1 overflow-hidden">
              <span className="whitespace-nowrap">Ask</span>
              <span className="max-w-0 group-hover:max-w-[6rem] overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap">
                about me
              </span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[120] w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-5rem)] flex flex-col rounded-3xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-2xl shadow-2xl overflow-hidden"
            style={{
              bottom: "max(2rem, env(safe-area-inset-bottom))",
              right:  "max(2rem, env(safe-area-inset-right))",
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Aswin's AI Assistant"
          >
            <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/8 rounded-xl">
                  <Terminal className="w-5 h-5 text-zinc-400" aria-hidden="true" />
                </div>
                <h2 className="text-sm font-semibold text-white">Aswin&apos;s AI Assistant</h2>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close chat"
                className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Chat messages"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-6">
                  <MessageCircle className="w-8 h-8 mb-4 opacity-20" aria-hidden="true" />
                  <p className="text-sm">
                    Hello! I&apos;m here to help you explore Aswin&apos;s profile. Ask me about his projects,
                    skills, education, or certifications.
                  </p>
                </div>
              )}

              {messages.map((m: Message) => (
                <div key={m.id} className={`flex chat-message-enter ${m.role === "user" ? "justify-end" : "justify-start"}`}>
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
                      <ReactMarkdown components={markdownComponents}>
                        {m.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}

              {status === "error" && error && (
                <div className="chat-message-enter rounded-2xl border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200 flex items-center justify-between gap-3">
                  <span>{getFriendlyError(error)}</span>
                  {!isDailyLimit(error) && (
                    <button
                      onClick={() => { setRetryIn(0); reload(); }}
                      disabled={retryIn > 0}
                      className="text-xs text-red-300 hover:text-white underline shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                    >
                      {retryIn > 0 ? `Retry in ${retryIn}s` : "Retry"}
                    </button>
                  )}
                </div>
              )}

              {isLoading && messages.length > 0 && messages[messages.length - 1].role === "user" && (
                <div className="flex justify-start chat-message-enter">
                  <div className="px-4 py-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 flex gap-1 items-center h-[40px]" aria-label="AI is typing">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" aria-hidden="true" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75" aria-hidden="true" />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150" aria-hidden="true" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-zinc-900/30 border-t border-zinc-800/50">
              <form onSubmit={handleSubmit} className="relative flex items-center">
                <label htmlFor="chat-input" className="sr-only">
                  Message Aswin&apos;s AI
                </label>
                <input
                  id="chat-input"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask a question..."
                  disabled={isLoading}
                  maxLength={2000}
                  className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-2xl py-3 pl-4 pr-12 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-white/30 transition-all disabled:opacity-50"
                />
                {input.length > 1500 && (
                  <span className={`absolute right-12 bottom-3 text-[10px] ${input.length > 1800 ? "text-red-400" : "text-zinc-500"}`}>
                    {input.length}/2000
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                  className="absolute right-2 p-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
