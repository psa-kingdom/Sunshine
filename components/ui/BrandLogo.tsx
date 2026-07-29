"use client";

import React from "react";
import Image from "next/image";
import { useTheme } from "@/components/theme/ThemeProvider";

interface BrandLogoProps {
  variant?: "auto" | "light" | "dark";
  height?: number;
  width?: number;
  className?: string;
  showText?: boolean;
}

export default function BrandLogo({
  variant = "auto",
  height = 42,
  width = 160,
  className = "",
  showText = false,
}: BrandLogoProps) {
  const { theme } = useTheme();

  // Determine which single image path to render
  let logoSrc = "/ssps logo light.png";
  if (variant === "dark") {
    logoSrc = "/ssps logo dark.png";
  } else if (variant === "light") {
    logoSrc = "/ssps logo light.png";
  } else {
    // auto variant: reactively select single logo based on active theme
    logoSrc = theme === "dark" ? "/ssps logo dark.png" : "/ssps logo light.png";
  }

  return (
    <div
      className={`brand-logo-container ${className}`}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
    >
      <Image
        key={logoSrc}
        src={logoSrc}
        alt="Sunshine Public School Logo"
        width={width}
        height={height}
        priority
        style={{
          height: `${height}px`,
          width: "auto",
          objectFit: "contain",
          transition: "opacity 0.2s ease-in-out",
        }}
      />
      {showText && (
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--color-text)",
          }}
        >
          Sunshine Public School
        </span>
      )}
    </div>
  );
}
