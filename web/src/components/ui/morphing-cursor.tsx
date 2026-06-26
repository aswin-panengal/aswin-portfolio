"use client";

import type React from "react";
import { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface MagneticTextProps {
  text: string;
  hoverText?: string;
  className?: string;
}

export function MagneticText({ text, hoverText = text, className }: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerTextRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(undefined);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const lerp = (start: number, end: number, factor: number) =>
      start + (end - start) * factor;

    const animate = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

      if (circleRef.current) {
        circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }
      if (innerTextRef.current) {
        innerTextRef.current.style.transform = `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // ── Shared helper ─────────────────────────────────────────────────────────
  const getPosFromClient = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const pos = getPosFromClient(e.clientX, e.clientY);
    if (pos) targetPos.current = pos;
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const pos = getPosFromClient(e.clientX, e.clientY);
    if (pos) {
      targetPos.current = pos;
      currentPos.current = pos;
    }
    setIsActive(true);
  }, []);

  const handleMouseLeave = useCallback(() => setIsActive(false), []);

  // ── Touch handlers ────────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const pos = getPosFromClient(touch.clientX, touch.clientY);
    if (pos) {
      targetPos.current = pos;
      currentPos.current = pos;
    }
    setIsActive(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // prevent page scroll while dragging over the element
    const touch = e.touches[0];
    const pos = getPosFromClient(touch.clientX, touch.clientY);
    if (pos) targetPos.current = pos;
  }, []);

  const handleTouchEnd = useCallback(() => setIsActive(false), []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative inline-flex items-center justify-start cursor-none select-none touch-none",
        className
      )}
    >
      {/* Invisible hoverText keeps container wide enough for the longer string */}
      <span className="font-bold tracking-tight opacity-0 pointer-events-none whitespace-nowrap" aria-hidden>
        {hoverText}
      </span>
      {/* Visible text pinned to the left */}
      <span className="absolute left-0 font-bold tracking-tight text-white whitespace-nowrap">
        {text}
      </span>

      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none rounded-full overflow-hidden bg-white"
        style={{
          width: isActive ? 140 : 0,
          height: isActive ? 140 : 0,
          transition:
            "width 0.5s cubic-bezier(0.33, 1, 0.68, 1), height 0.5s cubic-bezier(0.33, 1, 0.68, 1)",
          willChange: "transform, width, height",
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex items-center justify-center"
          style={{
            width: containerSize.width,
            height: containerSize.height,
            top: "50%",
            left: "50%",
            willChange: "transform",
          }}
        >
          <span className="font-bold tracking-tight text-black whitespace-nowrap">
            {hoverText}
          </span>
        </div>
      </div>
    </div>
  );
}
