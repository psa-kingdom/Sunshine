"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

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
}: MorphicNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = items.filter((i) => !i.isAction);
  const actionItems = items.filter((i) => i.isAction);

  return (
    <>
      {/* ── Fixed Bar ── */}
      <div className={`spn-nav-shell${scrolled ? " scrolled" : ""}`}>
        <nav className="spn-nav">
          {/* Brand */}
          <Link href="/" className="spn-nav-logo" aria-label="Sunshine Public School Home">
            <span className="spn-nav-crest" aria-hidden="true">S</span>
            <div className="spn-nav-name">
              <span className="spn-nav-name-primary">Sunshine</span>
              <span className="spn-nav-name-sub">Public School</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="spn-nav-links" role="navigation" aria-label="Main navigation">
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href ?? `#${item.id}`}
                className="spn-nav-link"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA + Mobile Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {/* Desktop CTA */}
            <div className="spn-nav-desktop-cta">
              <Link
                href="/login"
                className="spn-btn spn-btn-outline"
                style={{ padding: "0.5rem 1rem", fontSize: "0.7rem" }}
              >
                Portal
              </Link>
              {actionItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-cta-${item.id}`}
                  onClick={() => onActionClick?.(item.id)}
                  className="spn-btn spn-btn-primary"
                  style={{ padding: "0.55rem 1.25rem", fontSize: "0.7rem" }}
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              id="nav-mobile-toggle"
              className="spn-mobile-btn"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </div>

      {/* ── Mobile Drawer ── */}
      <div
        className={`spn-mobile-drawer${mobileOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <button
          type="button"
          id="nav-mobile-close"
          className="spn-mobile-close"
          onClick={() => setMobileOpen(false)}
          aria-label="Close navigation menu"
        >
          <X size={24} />
        </button>

        {/* Logo in drawer */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem", marginTop: "1rem" }}>
          <span
            style={{
              width: 36, height: 36,
              background: "var(--color-brown)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--color-beige)",
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem", fontWeight: 600,
            }}
          >
            S
          </span>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--color-brown)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Sunshine
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Public School
            </div>
          </div>
        </div>

        {/* Mobile Links */}
        <nav style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {navLinks.map((item) => (
            <a
              key={item.id}
              href={item.href ?? `#${item.id}`}
              className="spn-mobile-nav-link"
              onClick={() => setMobileOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Mobile CTA */}
        <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {actionItems.map((item) => (
            <button
              key={item.id}
              type="button"
              id={`mobile-cta-${item.id}`}
              onClick={() => { setMobileOpen(false); onActionClick?.(item.id); }}
              className="spn-btn spn-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {item.name}
            </button>
          ))}
          <Link href="/login" style={{ display: "block", textAlign: "center", padding: "0.75rem", border: "1.5px solid var(--color-sand)", color: "var(--color-brown)", fontFamily: "var(--font-body)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }} onClick={() => setMobileOpen(false)}>
            Student & Staff Portal
          </Link>
          <Link href="/admin/login" style={{ display: "block", textAlign: "center", padding: "0.75rem", background: "var(--color-brown)", color: "var(--color-beige)", fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }} onClick={() => setMobileOpen(false)}>
            Admin Access
          </Link>
        </div>
      </div>

      <style>{`
        .spn-nav-desktop-cta { display: flex; align-items: center; gap: 0.5rem; }
        @media (max-width: 1023px) {
          .spn-nav-desktop-cta { display: none; }
        }
        @media (min-width: 1024px) {
          .spn-mobile-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
