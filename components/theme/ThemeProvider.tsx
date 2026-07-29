"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("sunshine_theme") as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
      document.documentElement.setAttribute("data-theme", stored);
    } else {
      // First visit: check system preference, default to light
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initialTheme: Theme = prefersDark ? "dark" : "light";
      setThemeState(initialTheme);
      document.documentElement.setAttribute("data-theme", initialTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("sunshine_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
