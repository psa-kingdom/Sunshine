"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();
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
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      className={`spn-apple-toggle ${className}`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Track Icons */}
      <span className="spn-toggle-track">
        <span className={`spn-track-icon ${!isDark ? "active" : ""}`}>
          <Sun size={13} strokeWidth={2.2} />
        </span>
        <span className={`spn-track-icon ${isDark ? "active" : ""}`}>
          <Moon size={13} strokeWidth={2.2} />
        </span>
      </span>

      {/* Floating Glass Thumb */}
      <span className={`spn-toggle-thumb ${isDark ? "dark" : "light"}`}>
        {mounted && (
          isDark ? (
            <Moon size={13} strokeWidth={2.5} className="spn-thumb-icon" />
          ) : (
            <Sun size={13} strokeWidth={2.5} className="spn-thumb-icon" />
          )
        )}
      </span>
    </button>
  );
}
