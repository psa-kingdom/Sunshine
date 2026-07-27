"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatCounterProps {
  value: string;
  className?: string;
}

export function StatCounter({ value, className }: StatCounterProps) {
  const ref = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState(value);
  const animatedRef = useRef(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayText(value);
      return;
    }

    // Ratio / Non-countable strings (e.g. "18:1")
    if (value.includes(":")) {
      const el = ref.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setDisplayText(value);
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setDisplayText(value);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }

    // Parse numeric parts and formatting
    const numMatch = value.match(/[\d,.]+/);
    if (!numMatch) {
      setDisplayText(value);
      return;
    }

    const numStr = numMatch[0];
    const prefix = value.slice(0, numMatch.index);
    const suffix = value.slice((numMatch.index || 0) + numStr.length);
    const hasCommas = numStr.includes(",");
    const decimalParts = numStr.split(".");
    const decimals = decimalParts.length > 1 ? decimalParts[1].length : 0;
    const targetValue = parseFloat(numStr.replace(/,/g, ""));

    if (isNaN(targetValue)) {
      setDisplayText(value);
      return;
    }

    // Initial state before animation triggers: 0 with same formatting
    const initialFormatted =
      prefix +
      (decimals > 0 ? (0).toFixed(decimals) : "0") +
      suffix;

    setDisplayText(initialFormatted);

    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setDisplayText(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observer.disconnect();

          const duration = 1350; // ~1.35 seconds
          const startTime = performance.now();

          // Ease-out cubic function: 1 - (1 - t)^3
          const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            const easedProgress = easeOutCubic(progress);
            const currentNum = targetValue * easedProgress;

            let formattedNum: string;
            if (decimals > 0) {
              formattedNum = currentNum.toFixed(decimals);
            } else {
              formattedNum = Math.floor(currentNum).toString();
            }

            if (hasCommas) {
              const parts = formattedNum.split(".");
              parts[0] = parseInt(parts[0], 10).toLocaleString("en-US");
              formattedNum = parts.join(".");
            }

            setDisplayText(prefix + formattedNum + suffix);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setDisplayText(value); // Ensure exact final string formatting
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [value]);

  return (
    <strong ref={ref} className={className}>
      {displayText}
    </strong>
  );
}
