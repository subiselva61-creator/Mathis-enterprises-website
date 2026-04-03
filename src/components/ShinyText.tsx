import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, useMotionValue, useAnimationFrame, useTransform } from "motion/react";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  /** Seconds for one shine sweep (forward pass). */
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  /** When true, loops forward → delay → reverse → delay. Ignored if `once` is true. */
  yoyo?: boolean;
  /** When true, plays one forward sweep (and full yoyo cycle if `yoyo`) then stops — no repeat. */
  once?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  /** Seconds paused at yoyo turning points (only when looping `yoyo` without `once`). */
  delay?: number;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  once = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const directionRef = useRef(direction === "left" ? 1 : -1);

  const timingRef = useRef({
    forwardMs: speed * 1000,
    delayMs: delay * 1000,
    yoyo,
    once,
  });
  timingRef.current = {
    forwardMs: speed * 1000,
    delayMs: delay * 1000,
    yoyo,
    once,
  };

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const { forwardMs, delayMs, yoyo: isYoyo, once: isOnce } = timingRef.current;
    const dir = directionRef.current;

    if (isOnce) {
      if (!isYoyo) {
        if (elapsedRef.current < forwardMs) {
          elapsedRef.current += deltaTime;
          const p = Math.min(100, (elapsedRef.current / forwardMs) * 100);
          progress.set(dir === 1 ? p : 100 - p);
        } else {
          progress.set(dir === 1 ? 100 : 0);
        }
        return;
      }

      const phase1 = forwardMs + delayMs;
      const phase2 = forwardMs + delayMs;
      const total = phase1 + phase2;
      if (elapsedRef.current >= total) {
        progress.set(dir === 1 ? 0 : 100);
        return;
      }
      elapsedRef.current += deltaTime;
      const cycleTime = elapsedRef.current;

      if (cycleTime < forwardMs) {
        const p = (cycleTime / forwardMs) * 100;
        progress.set(dir === 1 ? p : 100 - p);
      } else if (cycleTime < phase1) {
        progress.set(dir === 1 ? 100 : 0);
      } else if (cycleTime < phase1 + forwardMs) {
        const reverseTime = cycleTime - phase1;
        const p = 100 - (reverseTime / forwardMs) * 100;
        progress.set(dir === 1 ? p : 100 - p);
      } else {
        progress.set(dir === 1 ? 0 : 100);
      }
      return;
    }

    elapsedRef.current += deltaTime;

    if (isYoyo) {
      const cycleDuration = forwardMs + delayMs;
      const fullCycle = cycleDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < forwardMs) {
        const p = (cycleTime / forwardMs) * 100;
        progress.set(dir === 1 ? p : 100 - p);
      } else if (cycleTime < cycleDuration) {
        progress.set(dir === 1 ? 100 : 0);
      } else if (cycleTime < cycleDuration + forwardMs) {
        const reverseTime = cycleTime - cycleDuration;
        const p = 100 - (reverseTime / forwardMs) * 100;
        progress.set(dir === 1 ? p : 100 - p);
      } else {
        progress.set(dir === 1 ? 0 : 100);
      }
    } else {
      const cycleDuration = forwardMs + delayMs;
      const cycleTime = elapsedRef.current % cycleDuration;

      if (cycleTime < forwardMs) {
        const p = (cycleTime / forwardMs) * 100;
        progress.set(dir === 1 ? p : 100 - p);
      } else {
        progress.set(dir === 1 ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1;
    elapsedRef.current = 0;
    progress.set(0);
  }, [direction, speed, delay, yoyo, once, text, progress]);

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
