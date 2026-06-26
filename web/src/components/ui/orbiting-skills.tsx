"use client";

import React, { useEffect, useState, memo } from "react";
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
  // Inner orbit — clockwise
  {
    id: "python",
    orbitRadius: 100,
    size: 50,
    speed: 0.7,
    phaseShift: 0,
    label: "Python",
    Icon: SiPython,
    iconColor: "#FFD43B",
  },
  {
    id: "typescript",
    orbitRadius: 100,
    size: 48,
    speed: 0.7,
    phaseShift: (2 * Math.PI) / 3,
    label: "TypeScript",
    Icon: SiTypescript,
    iconColor: "#3178C6",
  },
  {
    id: "fastapi",
    orbitRadius: 100,
    size: 48,
    speed: 0.7,
    phaseShift: (4 * Math.PI) / 3,
    label: "FastAPI",
    Icon: SiFastapi,
    iconColor: "#009688",
  },
  // Outer orbit — counter-clockwise
  {
    id: "nextjs",
    orbitRadius: 175,
    size: 52,
    speed: -0.45,
    phaseShift: 0,
    label: "Next.js",
    Icon: SiNextdotjs,
    iconColor: "#FFFFFF",
  },
  {
    id: "react",
    orbitRadius: 175,
    size: 48,
    speed: -0.45,
    phaseShift: (2 * Math.PI) / 3,
    label: "React",
    Icon: SiReact,
    iconColor: "#61DAFB",
  },
  {
    id: "docker",
    orbitRadius: 175,
    size: 48,
    speed: -0.45,
    phaseShift: (4 * Math.PI) / 3,
    label: "Docker",
    Icon: SiDocker,
    iconColor: "#2496ED",
  },
];

// ── Orbit ring — white glow ──────────────────────────────────────────────────
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

// ── Single orbiting node ─────────────────────────────────────────────────────
interface OrbitingSkillProps {
  config: SkillConfig;
  angle: number;
}

const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [hovered, setHovered] = useState(false);
  const { orbitRadius, size, label, Icon, iconColor } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2"
      style={{
        width: size,
        height: size,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: hovered ? 20 : 10,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-all duration-300"
        style={{
          transform: hovered ? "scale(1.22)" : "scale(1)",
          boxShadow: hovered
            ? "0 8px 28px rgba(0,0,0,0.5)"
            : "0 2px 10px rgba(0,0,0,0.35)",
        }}
      >
        <Icon style={{ color: iconColor, width: size * 0.44, height: size * 0.44 }} />

        {hovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-900 border border-white/10 rounded-md text-[10px] text-zinc-300 whitespace-nowrap pointer-events-none z-30">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = "OrbitingSkill";

// ── Main export ──────────────────────────────────────────────────────────────
export default function OrbitingSkills() {
  const [time, setTime] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    let frameId: number;
    let last = performance.now();

    const loop = (now: number) => {
      setTime((t) => t + (now - last) / 1000);
      last = now;
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [paused]);

  return (
    <div
      className="relative w-[300px] h-[300px] md:w-[420px] md:h-[420px] flex items-center justify-center flex-shrink-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Orbit rings — bare, no neon */}
      <OrbitRing radius={100} />
      <OrbitRing radius={175} />

      {/* Center node */}
      <div className="relative z-10 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-xl">
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

      {/* Skill nodes */}
      {skillsConfig.map((config) => (
        <OrbitingSkill
          key={config.id}
          config={config}
          angle={time * config.speed + config.phaseShift}
        />
      ))}
    </div>
  );
}
