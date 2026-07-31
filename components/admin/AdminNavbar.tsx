"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import BrandLogo from "@/components/ui/BrandLogo";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Megaphone,
  CreditCard,
  Mail,
  ImageIcon,
  ClipboardList,
  ChevronDown,
  LogOut,
  BarChart3,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin",               label: "Dashboard",     icon: LayoutDashboard },
  { href: "/admin/students",      label: "Students",      icon: GraduationCap },
  { href: "/admin/teachers",      label: "Teachers",      icon: Users },
  { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { href: "/admin/fees",          label: "Fees",          icon: CreditCard },
  { href: "/admin/analytics",     label: "Analytics",     icon: BarChart3 },
  { href: "/admin/emails",        label: "Emails",        icon: Mail },
  { href: "/admin/gallery",       label: "Gallery",       icon: ImageIcon },
  { href: "/admin/inquiries",     label: "Inquiries",     icon: ClipboardList },
];

interface AdminNavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function AdminNavbar({
  userName = "Administrator",
  userEmail = "admin@sunshineps.edu.in",
}: AdminNavbarProps) {
  const pathname = usePathname();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getPageLabel = (path: string) => {
    if (path === "/admin") return "Overview Console";
    if (path.startsWith("/admin/students")) return "Student Directory";
    if (path.startsWith("/admin/teachers")) return "Faculty Members";
    if (path.startsWith("/admin/fees")) return "Fee Management";
    if (path.startsWith("/admin/inquiries")) return "Admissions Inquiries";
    if (path.startsWith("/admin/announcements") || path.startsWith("/admin/notices")) return "Notices & Announcements";
    if (path.startsWith("/admin/gallery")) return "Media Gallery";
    if (path.startsWith("/admin/analytics")) return "Audit Logs & Reports";
    return "Management Portal";
  };

  const pageLabel = getPageLabel(pathname);

  return (
    <>
      <header className="adminHeader" style={{ position: "sticky", top: 0, zIndex: 50 }}>
        <div className="adminHeaderInner" style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Top Row: Brand Logo (Left) + Profile Dropdown (Right) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              paddingTop: "0.75rem",
              paddingBottom: "0.6rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Brand Logo & Active Module Title */}
            <Link href="/admin" className="adminBrand" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <BrandLogo height={46} />
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--gold-400)", textTransform: "uppercase", letterSpacing: "0.08em", paddingLeft: "0.75rem", borderLeft: "1px solid rgba(255,255,255,0.1)" }}>
                {pageLabel}
              </span>
            </Link>

            {/* Profile Dropdown & Mobile Menu Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {/* Profile Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((o) => !o)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.35rem 0.75rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "var(--radius-full)",
                    color: "var(--admin-text)",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                >
                  <span
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.7rem",
                      flexShrink: 0,
                    }}
                  >
                    {userName.charAt(0).toUpperCase()}
                  </span>
                  <span style={{ maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userName}
                  </span>
                  <ChevronDown
                    style={{
                      width: "0.75rem",
                      height: "0.75rem",
                      color: "var(--gold-400)",
                      transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </button>

                {profileOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      style={{ position: "fixed", inset: 0, zIndex: 40 }}
                      onClick={() => setProfileOpen(false)}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 0.5rem)",
                        width: "240px",
                        background: "#08111F",
                        border: "1px solid rgba(245,185,66,0.3)",
                        borderRadius: "8px",
                        boxShadow: "0 24px 48px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)",
                        zIndex: 50,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          padding: "0.875rem 1rem",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          background: "rgba(5,11,20,0.8)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "var(--admin-text)", fontWeight: 600, fontSize: "0.8rem" }}>{userName}</span>
                          <span
                            style={{
                              padding: "0.15rem 0.5rem",
                              background: "var(--gold-400)",
                              color: "var(--navy-950)",
                              borderRadius: "4px",
                              fontSize: "0.6rem",
                              fontWeight: 800,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            Admin
                          </span>
                        </div>
                        <p style={{ fontSize: "0.72rem", color: "var(--admin-text-faint)", marginTop: "0.2rem" }}>{userEmail}</p>
                      </div>
                      <div style={{ padding: "0.4rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>
                          <ShieldCheck style={{ width: "0.8rem", height: "0.8rem", color: "var(--gold-400)" }} />
                          Verified Admin Account
                        </div>
                        <div style={{ height: "1px", background: "var(--border-subtle)", margin: "0.25rem 0" }} />
                        <button
                          type="button"
                          onClick={() => signOut({ callbackUrl: "/login" })}
                          style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            padding: "0.5rem 0.75rem",
                            background: "transparent",
                            border: "none",
                            color: "var(--gold-300)",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            borderRadius: "var(--radius-sm)",
                            textAlign: "left",
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
                            (e.currentTarget as HTMLButtonElement).style.color = "#fca5a5";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.color = "var(--gold-300)";
                          }}
                        >
                          <LogOut style={{ width: "0.8rem", height: "0.8rem" }} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle button */}
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                className="admin-mobile-toggle"
                style={{
                  padding: "0.4rem",
                  background: "var(--navy-800)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-sm)",
                  color: "#fff",
                  cursor: "pointer",
                  display: "none",
                }}
              >
                {mobileOpen ? <X style={{ width: "1rem", height: "1rem" }} /> : <Menu style={{ width: "1rem", height: "1rem" }} />}
              </button>
            </div>
          </div>

          {/* Bottom Row: Full Navigation Bar (Desktop) */}
          <nav
            className="admin-desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              paddingTop: "0.6rem",
              flexWrap: "wrap",
            }}
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    background: isActive
                      ? "rgba(245, 185, 66, 0.1)"
                      : "transparent",
                    color: isActive
                      ? "var(--gold-400)"
                      : "var(--admin-text-muted)",
                    border: isActive
                      ? "1px solid rgba(245, 185, 66, 0.2)"
                      : "1px solid transparent",
                  }}
                >
                  <Icon style={{ width: "0.85rem", height: "0.85rem", flexShrink: 0 }} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Nav Panel */}
        {mobileOpen && (
          <div
            style={{
              background: "var(--navy-900)",
              borderTop: "1px solid var(--border-subtle)",
              padding: "0.75rem 1.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textDecoration: "none",
                    background: isActive ? "rgba(245,185,66,0.1)" : "rgba(255,255,255,0.03)",
                    color: isActive ? "var(--gold-400)" : "var(--admin-text-muted)",
                    border: `1px solid ${isActive ? "rgba(245,185,66,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  <Icon style={{ width: "0.75rem", height: "0.75rem" }} />
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Responsive CSS */}
      <style>{`
        @media (max-width: 900px) {
          .admin-desktop-nav { display: none !important; }
          .admin-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
}
