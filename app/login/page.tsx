"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UnifiedLoginPage() {
  const [activeRole, setActiveRole] = useState<"admin" | "teacher" | "student">("admin");
  const [email, setEmail] = useState("admin@sunshineps.edu.in");
  const [password, setPassword] = useState("SunshineAdmin2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRoleSwitch = (role: "admin" | "teacher" | "student") => {
    setActiveRole(role);
    setError("");
    if (role === "admin") {
      setEmail("admin@sunshineps.edu.in");
      setPassword("SunshineAdmin2026!");
    } else if (role === "teacher") {
      setEmail("teacher@sunshineps.edu.in");
      setPassword("Teacher2026!");
    } else {
      setEmail("student@sunshineps.edu.in");
      setPassword("Student2026!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email address or password. Please try again.");
      } else {
        // Redirect based on selected role
        const targetPath =
          activeRole === "admin"
            ? "/admin"
            : activeRole === "teacher"
            ? "/teacher"
            : "/student";
        router.push(targetPath);
        router.refresh();
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adminLoginWrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--navy-950, #051325)" }}>
      {/* Top Brand Bar */}
      <header style={{ width: "100%", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" className="flex items-center gap-3 group" style={{ textDecoration: "none" }}>
          <span className="crest" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "2.25rem", height: "2.25rem", borderRadius: "var(--radius-sm)", background: "var(--gold-500)", color: "var(--navy-900)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>
            S
          </span>
          <div>
            <strong style={{ display: "block", color: "#ffffff", fontFamily: "var(--font-display)", letterSpacing: "0.03em" }}>
              SUNSHINE PUBLIC SCHOOL
            </strong>
            <small style={{ display: "block", color: "var(--gold-400)", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
              Management Portal
            </small>
          </div>
        </Link>
        <Link href="/" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>
          ← Back to Website
        </Link>
      </header>

      {/* Main Login Card */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div className="adminCard" style={{ width: "100%", maxWidth: "460px", background: "var(--navy-900)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "2.5rem 2rem", boxShadow: "var(--shadow-lg)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <h1 className="adminHeading" style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "#ffffff", marginBottom: "0.5rem" }}>
              Portal Sign In
            </h1>
            <p className="adminSubheading" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.65)" }}>
              Access your personalized dashboard using your school credentials.
            </p>
          </div>

          {/* Role Tabs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", marginBottom: "1.5rem", background: "rgba(0,0,0,0.25)", padding: "0.25rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={() => handleRoleSwitch("admin")}
              style={{
                padding: "0.6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "calc(var(--radius-sm) - 2px)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeRole === "admin" ? "var(--gold-500)" : "transparent",
                color: activeRole === "admin" ? "var(--navy-900)" : "rgba(255,255,255,0.7)",
              }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("teacher")}
              style={{
                padding: "0.6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "calc(var(--radius-sm) - 2px)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeRole === "teacher" ? "var(--gold-500)" : "transparent",
                color: activeRole === "teacher" ? "var(--navy-900)" : "rgba(255,255,255,0.7)",
              }}
            >
              Teacher
            </button>
            <button
              type="button"
              onClick={() => handleRoleSwitch("student")}
              style={{
                padding: "0.6rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                borderRadius: "calc(var(--radius-sm) - 2px)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.2s",
                background: activeRole === "student" ? "var(--gold-500)" : "transparent",
                color: activeRole === "student" ? "var(--navy-900)" : "rgba(255,255,255,0.7)",
              }}
            >
              Student
            </button>
          </div>

          {/* Quick Fill Notification Banner */}
          <div style={{ background: "rgba(217, 155, 38, 0.12)", border: "1px solid rgba(217, 155, 38, 0.3)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "var(--gold-300)" }}>
            ⚡ <strong>Portfolio Demo Mode:</strong> Credentials for <strong>{activeRole.toUpperCase()}</strong> have been pre-filled below for instant testing.
          </div>

          {error && <div className="adminError" style={{ marginBottom: "1.25rem" }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.25rem" }}>
            <div>
              <label className="adminLabel" htmlFor="login-email">
                {activeRole === "admin" ? "Admin Email" : activeRole === "teacher" ? "Teacher Email" : "Student Email"}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="adminInput"
                placeholder="name@sunshineps.edu.in"
              />
            </div>

            <div>
              <label className="adminLabel" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="adminInput"
                placeholder="••••••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="adminSubmitButton"
              style={{ marginTop: "0.5rem" }}
            >
              {loading ? `Authenticating as ${activeRole}...` : `Sign In as ${activeRole.toUpperCase()}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
