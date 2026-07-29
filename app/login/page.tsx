"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, UserCheck, GraduationCap, Lock } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function UnifiedLoginPage() {
  const [activeRole, setActiveRole] = useState<"admin" | "teacher" | "student">("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRoleSwitch = (role: "admin" | "teacher" | "student") => {
    setActiveRole(role);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        role: activeRole,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email address or password. Please try again.");
      } else {
        const targetPath =
          activeRole === "admin"
            ? "/admin"
            : activeRole === "teacher"
            ? "/teacher"
            : "/student";
        router.replace(targetPath);
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    admin: {
      label: "Administrator",
      icon: ShieldCheck,
      color: "var(--gold-400)",
      desc: "School Administration",
    },
    teacher: {
      label: "Educator",
      icon: UserCheck,
      color: "#60a5fa",
      desc: "Faculty & Staff",
    },
    student: {
      label: "Student",
      icon: GraduationCap,
      color: "#86efac",
      desc: "Learner Access",
    },
  };

  const activeConfig = roleConfig[activeRole];
  const ActiveIcon = activeConfig.icon;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--navy-950)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Ambient Background ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {/* Large radial glow top-left */}
        <div style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
        }} />
        {/* Smaller glow bottom-right */}
        <div style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(234,88,12,0.09) 0%, transparent 70%)",
        }} />
        {/* Faint grid overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Floating orbs */}
        <div style={{
          position: "absolute",
          top: "20%",
          left: "8%",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "rgba(255,215,0,0.25)",
          boxShadow: "0 0 20px rgba(255,215,0,0.2)",
        }} />
        <div style={{
          position: "absolute",
          top: "60%",
          right: "12%",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: "rgba(96,165,250,0.3)",
          boxShadow: "0 0 16px rgba(96,165,250,0.2)",
        }} />
        <div style={{
          position: "absolute",
          top: "40%",
          left: "18%",
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          background: "rgba(134,239,172,0.3)",
        }} />
      </div>

      {/* ── Navigation Bar ── */}
      <header
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(10,15,30,0.6)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" style={{ textDecoration: "none" }}>
          <BrandLogo height={38} />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <ThemeToggle />
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              padding: "0.4rem 0.8rem",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255,255,255,0.1)",
              transition: "all 0.2s",
            }}
          >
            <ArrowLeft size={14} /> Back to Website
          </Link>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div style={{
        flex: 1,
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 1.5rem",
      }}>
        {/* Supporting heading */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem", maxWidth: "480px" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.2)",
            borderRadius: "var(--radius-full)",
            padding: "0.3rem 0.85rem",
            marginBottom: "1.25rem",
          }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--gold-400)" }}>
              Secure Access Portal
            </span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 900, margin: "0 0 0.75rem 0", lineHeight: 1.2 }}>
            Welcome Back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", margin: 0 }}>
            Access the Sunshine Public School ERP system.<br />Select your role and sign in below.
          </p>
        </div>

        {/* ── Login Card ── */}
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-lg, 1.25rem)",
            padding: "2rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          }}
        >
          {/* Role Segmented Control */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0.5rem",
              background: "rgba(255,255,255,0.04)",
              padding: "0.3rem",
              borderRadius: "var(--radius-md, 0.75rem)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              {(["admin", "teacher", "student"] as const).map((role) => {
                const cfg = roleConfig[role];
                const Icon = cfg.icon;
                const isActive = activeRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleSwitch(role)}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.25rem",
                      padding: "0.65rem 0.5rem",
                      borderRadius: "calc(var(--radius-md, 0.75rem) - 0.2rem)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                      boxShadow: isActive ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
                    }}
                  >
                    <Icon
                      style={{
                        width: "1.1rem",
                        height: "1.1rem",
                        color: isActive ? cfg.color : "rgba(255,255,255,0.4)",
                        transition: "color 0.2s",
                      }}
                    />
                    <span style={{
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: "0.6rem", color: isActive ? cfg.color : "rgba(255,255,255,0.25)", fontWeight: 600 }}>
                      {cfg.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Indicator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.5rem 0.75rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "var(--radius-sm)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <ActiveIcon style={{ width: "0.9rem", height: "0.9rem", color: activeConfig.color }} />
            <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              Signing in as <span style={{ color: "#fff", fontWeight: 800 }}>{activeConfig.label}</span>
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#fca5a5",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "0.5rem",
              }}>
                {activeRole === "admin" ? "Admin Email" : activeRole === "teacher" ? "Teacher Email" : "Student Email"}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@sunshineps.edu.in"
                className="adminInput"
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "rgba(255,255,255,0.55)",
                marginBottom: "0.5rem",
              }}>
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="adminInput"
                style={{ fontSize: "0.9rem" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="adminSubmitButton"
              style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Lock style={{ width: "0.9rem", height: "0.9rem" }} />
              {loading ? "Authenticating..." : `Sign In as ${activeConfig.label}`}
            </button>
          </form>
        </div>

        {/* ── Trust Badges ── */}
        <div style={{
          display: "flex",
          gap: "1.5rem",
          marginTop: "1.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {[
            { icon: "🔒", label: "Encrypted Authentication" },
            { icon: "🛡️", label: "Role Based Access" },
            { icon: "✅", label: "Secure Login" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.9rem" }}>{item.icon}</span>
              <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.25rem 2rem",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,15,30,0.4)",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          © 2026 Sunshine Public School
        </span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>•</span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          CBSE Affiliated
        </span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.2)" }}>•</span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", fontWeight: 600 }}>
          Powered by Sunshine ERP
        </span>
      </footer>
    </div>
  );
}
