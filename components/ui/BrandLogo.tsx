"use client";

import React from "react";
import Image from "next/image";

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
  if (variant === "light") {
    return (
      <div className={`brand-logo-wrap ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <Image
          src="/ssps logo light.png"
          alt="Sunshine Public School Logo"
          width={width}
          height={height}
          priority
          style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
        />
        {showText && (
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>
            Sunshine Public School
          </span>
        )}
      </div>
    );
  }

  if (variant === "dark") {
    return (
      <div className={`brand-logo-wrap ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
        <Image
          src="/ssps logo dark.png"
          alt="Sunshine Public School Logo"
          width={width}
          height={height}
          priority
          style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
        />
        {showText && (
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>
            Sunshine Public School
          </span>
        )}
      </div>
    );
  }

  // Auto mode: CSS-driven instant theme switching without hydration flash
  return (
    <div className={`brand-logo-auto ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <Image
        src="/ssps logo light.png"
        alt="Sunshine Public School Logo"
        width={width}
        height={height}
        priority
        className="logo-img-light"
        style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
      />
      <Image
        src="/ssps logo dark.png"
        alt="Sunshine Public School Logo"
        width={width}
        height={height}
        priority
        className="logo-img-dark"
        style={{ height: `${height}px`, width: "auto", objectFit: "contain" }}
      />
      {showText && (
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--color-text)" }}>
          Sunshine Public School
        </span>
      )}
    </div>
  );
}
