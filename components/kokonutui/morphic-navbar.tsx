"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Lock } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Fixed bar — uses .nav-shell for top offset, .container for width alignment */}
      <div className={cn("nav-shell", scrolled ? "scrolled" : "")}>
        <div className="container">
          <nav className={cn("morphic-nav", className)}>
            {/* Brand Logo */}
            <Link href="/" className="morphic-nav-logo group">
              <span className="logo-icon group-hover:rotate-12 transition-transform duration-300">S</span>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", color: "#1e293b" }}>SUNSHINE</span>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6366f1" }}>Public School</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="nav-links">
              {items.filter(i => !i.isAction).map((item) => (
                <a
                  key={item.id}
                  href={item.href ?? `#${item.id}`}
                  onClick={() => setActiveId(item.id)}
                  className={cn("nav-link", activeId === item.id ? "active" : "")}
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {items.filter(i => i.isAction).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onActionClick?.(item.id)}
                  className="btn-clay btn-clay-primary"
                  style={{ padding: "0.45rem 1.1rem", fontSize: "0.72rem", letterSpacing: "0.06em" }}
                >
                  {item.name}
                </button>
              ))}

              <Link href="/login" title="Portal Login">
                <button
                  type="button"
                  className="btn-clay btn-clay-glass"
                  style={{ padding: "0.55rem", borderRadius: "50%", lineHeight: 1 }}
                >
                  <Lock style={{ width: "0.875rem", height: "0.875rem" }} />
                </button>
              </Link>

              {/* Mobile toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  display: "none",
                  padding: "0.5rem",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#475569",
                }}
                className="mobile-menu-btn"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X style={{ width: "1rem", height: "1rem" }} /> : <Menu style={{ width: "1rem", height: "1rem" }} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Fullscreen Overlay */}
      <div className={cn("mobile-nav-panel", mobileMenuOpen ? "open" : "")}>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "absolute",
            top: "1.5rem", right: "2rem",
            padding: "0.75rem",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.05)",
            border: "none",
            cursor: "pointer",
            color: "#475569",
          }}
        >
          <X style={{ width: "1.25rem", height: "1.25rem" }} />
        </button>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
          {items.map((item) => {
            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setMobileMenuOpen(false); onActionClick?.(item.id); }}
                  className="btn-clay btn-clay-primary"
                  style={{ padding: "0.85rem 2.5rem", fontSize: "0.85rem", marginTop: "1rem" }}
                >
                  {item.name}
                </button>
              );
            }
            return (
              <a
                key={item.id}
                href={item.href ?? `#${item.id}`}
                onClick={() => { setActiveId(item.id); setMobileMenuOpen(false); }}
                className="mobile-nav-link"
              >
                {item.name}
              </a>
            );
          })}
        </div>
      </div>

      {/* Inject mobile toggle visibility via style tag (avoids Tailwind lg: prefix conflicts) */}
      <style>{`
        @media (max-width: 1023px) {
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  );
}
