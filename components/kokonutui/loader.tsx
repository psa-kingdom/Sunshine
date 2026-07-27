"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  title = "Loading dashboard data...",
  subtitle = "Please wait while we fetch the latest records for you",
  size = "md",
  className,
  ...props
}: LoaderProps) {
  const sizeConfig = {
    sm: {
      container: "w-16 h-16",
      titleClass: "text-xs font-medium text-white/90",
      subtitleClass: "text-[10px] text-white/60",
      spacing: "space-y-1",
      maxWidth: "max-w-44",
    },
    md: {
      container: "w-24 h-24",
      titleClass: "text-sm font-semibold text-white/95",
      subtitleClass: "text-xs text-[var(--gold-300)]",
      spacing: "space-y-2",
      maxWidth: "max-w-56",
    },
    lg: {
      container: "w-32 h-32",
      titleClass: "text-base font-semibold text-white",
      subtitleClass: "text-sm text-[var(--gold-300)]",
      spacing: "space-y-3",
      maxWidth: "max-w-64",
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 text-center",
        className
      )}
      {...props}
    >
      {/* Re-themed Navy/Gold KokonutUI Animated Ring */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        className={cn("relative", config.container)}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {/* Outer Gold Shimmer Ring */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, #d99b26 120deg, #f5cf7b 240deg, transparent 360deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 40%, black 43%, black 47%, transparent 50%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 40%, black 43%, black 47%, transparent 50%)",
            opacity: 0.85,
          }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Counter Rotation Inner Navy/Gold Accent Ring */}
        <motion.div
          animate={{
            rotate: [0, -360],
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 180deg, transparent 0deg, rgba(229, 173, 60, 0.7) 60deg, transparent 120deg)",
            mask: "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 57%, transparent 59%)",
            WebkitMask:
              "radial-gradient(circle at 50% 50%, transparent 52%, black 54%, black 57%, transparent 58%)",
            opacity: 0.5,
          }}
          transition={{
            duration: 3.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>

      {/* Typography with Breathing Effect */}
      <motion.div
        animate={{
          opacity: 1,
          y: 0,
        }}
        className={cn("text-center", config.spacing, config.maxWidth)}
        initial={{ opacity: 0, y: 8 }}
        transition={{
          duration: 0.5,
        }}
      >
        <h3 className={config.titleClass}>{title}</h3>
        {subtitle && <p className={config.subtitleClass}>{subtitle}</p>}
      </motion.div>
    </div>
  );
}
