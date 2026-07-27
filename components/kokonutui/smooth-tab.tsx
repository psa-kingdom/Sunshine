"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  badge?: number | string;
}

interface SmoothTabProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function SmoothTab({
  tabs,
  activeTab,
  onChange,
  className,
}: SmoothTabProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded-lg shadow-inner",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer z-10 select-none",
              isActive
                ? "text-[var(--navy-950)] font-bold"
                : "text-white/70 hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute inset-0 bg-[var(--gold-500)] rounded-md -z-10 shadow"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-extrabold rounded-full",
                  isActive
                    ? "bg-[var(--navy-900)] text-[var(--gold-400)]"
                    : "bg-white/10 text-white/80"
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
