"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface MorphicNavItem {
  id: string;
  name: string;
  href?: string;
  isAction?: boolean;
}

interface MorphicNavbarProps {
  items: MorphicNavItem[];
  onActionClick?: (id: string) => void;
  className?: string;
}

export default function MorphicNavbar({
  items,
  onActionClick,
  className,
}: MorphicNavbarProps) {
  const [activeId, setActiveId] = useState("home");

  return (
    <nav className={cn("wrap mainNav", className)} aria-label="Main navigation">
      <div className="flex items-center justify-center py-1 flex-wrap gap-1">
        <div className="flex items-center justify-center p-1 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded-xl shadow-lg flex-wrap gap-1">
          {items.map((item) => {
            const isActive = activeId === item.id;

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveId(item.id);
                    if (onActionClick) onActionClick(item.id);
                  }}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 cursor-pointer",
                    isActive
                      ? "bg-[var(--gold-500)] text-[var(--navy-900)] font-bold shadow-md scale-105"
                      : "text-[var(--gold-400)] hover:text-white hover:bg-white/10"
                  )}
                >
                  {item.name}
                </button>
              );
            }

            return (
              <a
                key={item.id}
                href={item.href || `#${item.id}`}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-300",
                  isActive
                    ? "bg-[var(--gold-500)] text-[var(--navy-900)] font-bold shadow-md scale-105"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
