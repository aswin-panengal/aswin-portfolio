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
  const containerRef  = useRef<HTMLDivElement>(null);
  const circleRef     = useRef<HTMLDivElement>(null);
  const innerTextRef  = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const targetPos    = useRef({ x: 0, y: 0 });
  const currentPos   = useRef({ x: 0, y: 0 });
  const frameRef     = useRef<number | undefined>(undefined);
  const isActiveRef  = useRef(false); // ref mirror so the rAF loop can read it without stale closure

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width:  containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // rAF loop — only runs while active or while lerping back to zero after deactivation.
  const startLoop = useCallback(() => {
    if (frameRef.current) return; // already running

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const tick = () => {
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

      if (circleRef.current) {
        circleRef.current.style.transform =
          `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
      }
      if (innerTextRef.current) {
        innerTextRef.current.style.transform =
          `translate(${-currentPos.current.x}px, ${-currentPos.current.y}px)`;
      }

      // Keep running while active, or until position has settled back to zero
      const settled =
        !isActiveRef.current &&
        Math.abs(currentPos.current.x - targetPos.current.x) < 0.3 &&
        Math.abs(currentPos.current.y - targetPos.current.y) < 0.3;

      if (settled) {
        frameRef.current = undefined;
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    // Don't cancel — let the loop detect "settled" and exit naturally for smooth return
    // Just reset the target so it lerps back to origin
    targetPos.current = { x: 0, y: 0 };
  }, []);

  const getPosFromClient = (clientX: number, clientY: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

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
    isActiveRef.current = true;
    setIsActive(true);
    startLoop();
  }, [startLoop]);

  const handleMouseLeave = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    stopLoop(); // target → (0,0), loop exits when settled
  }, [stopLoop]);

  // Touch: no magnetic effect on mobile — just activate/deactivate circle size via CSS
  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const pos = getPosFromClient(touch.clientX, touch.clientY);
    if (pos) {
      targetPos.current = pos;
      currentPos.current = pos;
    }
    isActiveRef.current = true;
    setIsActive(true);
    startLoop();
  }, [startLoop]);

  const handleTouchEnd = useCallback(() => {
    isActiveRef.current = false;
    setIsActive(false);
    stopLoop();
  }, [stopLoop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative inline-flex items-center justify-start cursor-none select-none touch-none",
        className
      )}
    >
      {/* Invisible spacer keeps container wide enough for the longer string */}
      <span className="font-bold tracking-tight opacity-0 pointer-events-none whitespace-nowrap" aria-hidden>
        {hoverText}
      </span>
      {/* Visible static text */}
      <span className="absolute left-0 font-bold tracking-tight text-white whitespace-nowrap">
        {text}
      </span>

      <div
        ref={circleRef}
        className="absolute top-0 left-0 pointer-events-none rounded-full overflow-hidden bg-white"
        style={{
          width:  isActive ? 140 : 0,
          height: isActive ? 140 : 0,
          transition: "width 0.5s cubic-bezier(0.33,1,0.68,1), height 0.5s cubic-bezier(0.33,1,0.68,1)",
          willChange: "transform, width, height",
        }}
      >
        <div
          ref={innerTextRef}
          className="absolute flex items-center justify-center"
          style={{
            width:  containerSize.width,
            height: containerSize.height,
            top:  "50%",
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
