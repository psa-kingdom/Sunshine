"use client";

import React from "react";
import BrandLogo from "@/components/ui/BrandLogo";

interface LogoContainerProps {
  scrolled?: boolean;
  logoHeight?: number;
  logoWidth?: number;
  variant?: "auto" | "light" | "dark";
  className?: string;
}

/**
 * LogoContainer — Centralized design system wrapper for the website header logo.
 * 
 * Provides a high-contrast frosted-glass pill container over transparent/hero backdrops
 * and seamlessly transitions to a transparent container when the navbar scrolls solid,
 * maintaining zero layout shift (CLS) and crisp contrast across all 4 theme/scroll states.
 */
export default function LogoContainer({
  scrolled = false,
  logoHeight = 68,
  logoWidth = 190,
  variant = "auto",
  className = "",
}: LogoContainerProps) {
  return (
    <div
      className={`spn-logo-container ${scrolled ? "scrolled" : "transparent"} ${className}`}
      aria-label="Sunshine Public School Logo Container"
    >
      <BrandLogo
        variant={variant}
        scrolled={scrolled}
        height={logoHeight}
        width={logoWidth}
      />
    </div>
  );
}
