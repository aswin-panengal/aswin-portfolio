"use client";

import React, { useEffect, useRef, memo, useMemo } from "react";
import {
  SiPython,
  SiTypescript,
  SiFastapi,
  SiNextdotjs,
  SiReact,
  SiDocker,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  phaseShift: number;
  label: string;
  Icon: IconType;
  iconColor: string;
}

export const skillsConfig: SkillConfig[] = [
  { id: "python",     orbitRadius: 100, size: 50, speed:  0.7,  phaseShift: 0,                    label: "Python",     Icon: SiPython,     iconColor: "#FFD43B" },
  { id: "typescript", orbitRadius: 100, size: 48, speed:  0.7,  phaseShift: (2 * Math.PI) / 3,   label: "TypeScript", Icon: SiTypescript, iconColor: "#3178C6" },
  { id: "fastapi",    orbitRadius: 100, size: 48, speed:  0.7,  phaseShift: (4 * Math.PI) / 3,   label: "FastAPI",    Icon: SiFastapi,    iconColor: "#009688" },
  { id: "nextjs",     orbitRadius: 175, size: 52, speed: -0.45, phaseShift: 0,                    label: "Next.js",    Icon: SiNextdotjs,  iconColor: "#FFFFFF" },
  { id: "react",      orbitRadius: 175, size: 48, speed: -0.45, phaseShift: (2 * Math.PI) / 3,   label: "React",      Icon: SiReact,      iconColor: "#61DAFB" },
  { id: "docker",     orbitRadius: 175, size: 48, speed: -0.45, phaseShift: (4 * Math.PI) / 3,   label: "Docker",     Icon: SiDocker,     iconColor: "#2496ED" },
];

const OrbitRing = memo(({ radius }: { radius: number }) => (
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
    style={{ width: radius * 2, height: radius * 2 }}
  >
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: "radial-gradient(circle, transparent 30%, rgba(255,255,255,0.03) 70%, rgba(255,255,255,0.07) 100%)",
        boxShadow: "0 0 30px rgba(255,255,255,0.08), inset 0 0 30px rgba(255,255,255,0.03)",
        animation: "pulse 4s ease-in-out infinite",
      }}
    />
    <div
      className="absolute inset-0 rounded-full"
      style={{
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: "0 0 12px rgba(255,255,255,0.06), inset 0 0 12px rgba(255,255,255,0.03)",
      }}
    />
  </div>
));
OrbitRing.displayName = "OrbitRing";

// Positions written directly to DOM via refs — zero React re-renders per frame.
export default function OrbitingSkills() {
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timeRef  = useRef(0);
  const lastRef  = useRef(0);
  const pausedRef = useRef(false);
  const frameRef  = useRef<number | undefined>(undefined);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    if (reducedMotion) {
      skillsConfig.forEach((cfg, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const x = Math.cos(cfg.phaseShift) * cfg.orbitRadius;
        const y = Math.sin(cfg.phaseShift) * cfg.orbitRadius;
        el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
      });
      return;
    }

    lastRef.current = performance.now();

    const loop = (now: number) => {
      if (!pausedRef.current) {
        timeRef.current += (now - lastRef.current) / 1000;

        skillsConfig.forEach((cfg, i) => {
          const el = nodeRefs.current[i];
          if (!el) return;
          const angle = timeRef.current * cfg.speed + cfg.phaseShift;
          const x = Math.cos(angle) * cfg.orbitRadius;
          const y = Math.sin(angle) * cfg.orbitRadius;
          el.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
        });
      }
      lastRef.current = now;
      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [reducedMotion]);

  return (
    <div
      className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center shrink-0"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <OrbitRing radius={100} />
      <OrbitRing radius={175} />

      {/* Center node */}
      <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border border-white/10 bg-white/4 shadow-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>

      {/* Positions driven by DOM refs. Hover scale uses inline style mutation, not React state. */}
      {skillsConfig.map((cfg, i) => (
        <div
          key={cfg.id}
          ref={el => { nodeRefs.current[i] = el; }}
          className="group absolute top-1/2 left-1/2"
          style={{ width: cfg.size, height: cfg.size, zIndex: 10, willChange: "transform" }}
        >
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer border border-white/10 bg-white/5"
            style={{
              transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
              boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "scale(1.22)";
              el.style.boxShadow = "0 8px 28px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.transform = "";
              el.style.boxShadow = "";
            }}
          >
            <cfg.Icon style={{ color: cfg.iconColor, width: cfg.size * 0.44, height: cfg.size * 0.44 }} />

            {/* CSS-only tooltip — no state, no re-render on hover */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-md text-[10px] text-zinc-300 whitespace-nowrap pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {cfg.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
