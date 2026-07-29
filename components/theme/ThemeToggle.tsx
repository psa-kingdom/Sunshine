"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`spn-theme-switch ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding Thumb */}
      <span className={`spn-theme-thumb ${isDark ? "dark" : "light"}`} />

      {/* Sun Icon */}
      <span className={`spn-theme-icon sun ${!isDark ? "active" : ""}`}>
        <Sun size={14} strokeWidth={2.5} />
      </span>

      {/* Moon Icon */}
      <span className={`spn-theme-icon moon ${isDark ? "active" : ""}`}>
        <Moon size={14} strokeWidth={2.5} />
      </span>
    </button>
  );
}
