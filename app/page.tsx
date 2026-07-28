"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Laptop,
  Library,
  Music,
  Trophy,
  Sparkles,
  MapPin,
  Mail,
  PhoneCall,
  Clock,
  Star,
} from "lucide-react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";
import EnquiryDrawer from "@/components/kokonutui/enquiry-drawer";
import InteractiveNoticeBoard from "@/components/school/InteractiveNoticeBoard";
import { StatCounter } from "./StatCounter";

/* ─── Page-level inline styles ────────────────────────────────────────────── */
const S = {
  /* Hero */
  heroSection: {
    paddingTop: "var(--hero-pt)",
    paddingBottom: "4rem",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
  } as React.CSSProperties,

  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "3rem",
    alignItems: "center",
    width: "100%",
  } as React.CSSProperties,

  /* Sections */
  section: {
    paddingTop: "var(--section-y)",
    paddingBottom: "var(--section-y)",
  } as React.CSSProperties,

  sectionAlt: {
    paddingTop: "var(--section-y)",
    paddingBottom: "var(--section-y)",
    background: "rgba(255,255,255,0.4)",
    borderTop: "1px solid rgba(99,102,241,0.08)",
    borderBottom: "1px solid rgba(99,102,241,0.08)",
  } as React.CSSProperties,

  sectionNotice: {
    paddingTop: "var(--section-y)",
    paddingBottom: "var(--section-y)",
    background: "rgba(238,242,255,0.3)",
    borderTop: "1px solid rgba(199,210,254,0.4)",
    borderBottom: "1px solid rgba(199,210,254,0.4)",
  } as React.CSSProperties,

  sectionCallout: {
    paddingTop: "var(--section-y)",
    paddingBottom: "var(--section-y)",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    position: "relative",
    overflow: "hidden",
  } as React.CSSProperties,

  /* Section headings */
  sectionHeadWrap: {
    maxWidth: "600px",
    margin: "0 auto 4rem",
    textAlign: "center",
  } as React.CSSProperties,

  /* Hero left */
  heroLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "0",
  } as React.CSSProperties,

  h1: {
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
    fontWeight: 900,
    fontFamily: "var(--font-display)",
    lineHeight: 1.1,
    color: "#0f172a",
    marginBottom: "1.5rem",
    letterSpacing: "-0.02em",
  } as React.CSSProperties,

  heroDesc: {
    fontSize: "1.05rem",
    color: "#475569",
    lineHeight: 1.75,
    maxWidth: "500px",
    marginBottom: "2rem",
  } as React.CSSProperties,

  heroButtons: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.75rem",
    marginBottom: "2.5rem",
  } as React.CSSProperties,

  heroStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "1rem",
    paddingTop: "1.5rem",
    borderTop: "1px solid rgba(199,210,254,0.5)",
    maxWidth: "420px",
  } as React.CSSProperties,

  statLabel: {
    fontSize: "0.65rem",
    fontFamily: "var(--font-heading)",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#94a3b8",
    marginTop: "0.25rem",
  } as React.CSSProperties,

  /* Hero right card */
  heroRight: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "1.5rem",
    paddingBottom: "1.5rem",
  } as React.CSSProperties,

  dashCard: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "2px solid rgba(199,210,254,0.6)",
    borderRadius: "1.5rem",
    padding: "1.5rem",
    boxShadow: "0 20px 60px -15px rgba(99,102,241,0.15), inset 0 2px 4px rgba(255,255,255,0.8)",
    width: "100%",
    maxWidth: "440px",
    position: "relative" as const,
    overflow: "hidden" as const,
  } as React.CSSProperties,

  /* About grid */
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "2.5rem",
    alignItems: "center",
    maxWidth: "900px",
    margin: "0 auto",
  } as React.CSSProperties,

  /* Faculty grid */
  facultyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "2rem",
  } as React.CSSProperties,

  /* Admissions callout glow orbs */
  glowOrb: {
    position: "absolute" as const,
    width: "240px",
    height: "240px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.08)",
    filter: "blur(40px)",
    pointerEvents: "none" as const,
  } as React.CSSProperties,
} as const;

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [isTouring, setIsTouring] = useState(false);

  useEffect(() => {
    fetch("/api/hero-video")
      .then((r) => r.json())
      .then((d) => { if (d?.video?.url) setHeroVideoUrl(d.video.url); })
      .catch(() => {});

    fetch("/api/hero-image")
      .then((r) => r.json())
      .then((d) => { if (d?.image?.url) setHeroImageUrl(d.image.url); })
      .catch(() => {});
  }, []);

  const handleStartTour = () => {
    if (isTouring) return;
    setIsTouring(true);
    const sections = ["home", "about", "academics", "notices", "faculty", "contact"];
    sections.forEach((secId, index) => {
      setTimeout(() => {
        const el = document.getElementById(secId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        if (index === sections.length - 1) {
          setTimeout(() => setIsTouring(false), 1500);
        }
      }, index * 1800);
    });
  };

  return (
    <main style={{ position: "relative", background: "var(--color-bg)" }}>
      {/* ── Decorative Background Blobs ── */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* ── Enquiry Drawer ── */}
      <EnquiryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* ── Navbar ── */}
      <MorphicNavbar
        items={[
          { id: "home",       name: "Home",          href: "#home" },
          { id: "about",      name: "About Us",       href: "#about" },
          { id: "academics",  name: "Academics",      href: "#academics" },
          { id: "notices",    name: "Announcements",  href: "#notices" },
          { id: "faculty",    name: "Faculty",        href: "#faculty" },
          { id: "admissions", name: "Enquire Now",    isAction: true },
          { id: "contact",    name: "Contact",        href: "#contact" },
        ]}
        onActionClick={(id) => { if (id === "admissions") setIsDrawerOpen(true); }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          HERO SECTION
          <section> = semantic landmark + vertical rhythm only
          <div class="container"> = max-width 1280px, 24px padding, centered
      ════════════════════════════════════════════════════════════════════ */}
      <section id="home" style={{ ...S.heroSection, position: "relative", overflow: "hidden" }}>
        {/* Background hero media (admin-controlled priority: Video -> Image -> Default) */}
        {heroVideoUrl ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              src={heroVideoUrl}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                opacity: 0.2,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(248,250,252,0.95) 40%, rgba(248,250,252,0.7) 100%)",
                zIndex: 1,
              }}
            />
          </>
        ) : heroImageUrl ? (
          <>
            <img
              src={heroImageUrl}
              alt="Hero Banner"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 0,
                opacity: 0.22,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, rgba(248,250,252,0.95) 40%, rgba(248,250,252,0.7) 100%)",
                zIndex: 1,
              }}
            />
          </>
        ) : null}
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="hero-grid">
            {/* Left Column */}
            <div style={S.heroLeft}>
              <div className="badge-pill-colorful" style={{ marginBottom: "1.25rem", alignSelf: "flex-start" }}>
                <span className="badge-dot-animated" />
                EST. 1998 • CBSE AFFILIATED
              </div>

              <h1 style={S.h1}>
                Where learning feels like{" "}
                <span style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Play
                </span>
                , and leads to greatness.
              </h1>

              <p style={S.heroDesc}>
                Sunshine Public School is a futuristic, child-centric CBSE campus nurturing
                curiosity, creative thinking, and bold confidence — across 15 acres of
                high-tech space.
              </p>

              <div style={S.heroButtons}>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="btn-clay btn-clay-primary"
                  style={{ padding: "0.85rem 2rem", fontSize: "0.8rem", letterSpacing: "0.06em" }}
                >
                  Submit Admission Enquiry
                </button>
                <Link href="/login">
                  <button
                    type="button"
                    className="btn-clay btn-clay-glass"
                    style={{ padding: "0.85rem 2rem", fontSize: "0.8rem", letterSpacing: "0.06em", color: "#4f46e5" }}
                  >
                    Student &amp; Staff Portal
                  </button>
                </Link>
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="btn-clay btn-clay-glass"
                  style={{ padding: "0.85rem 1.5rem", fontSize: "0.8rem", letterSpacing: "0.06em", color: "#059669", borderColor: "#a7f3d0", background: "#ecfdf5" }}
                >
                  {isTouring ? "Touring..." : "Take a Tour 🚀"}
                </button>
              </div>

              {/* Quick Stats */}
              <div style={S.heroStats}>
                {[
                  { value: "25+",    label: "Years of Trust",  color: "#6366f1" },
                  { value: "2,400+", label: "Students",        color: "#a855f7" },
                  { value: "100%",   label: "CBSE Pass Rate",  color: "#ec4899" },
                ].map(({ value, label, color }) => (
                  <div key={label}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 900, color, display: "block", lineHeight: 1 }}>
                      <StatCounter value={value} className="" />
                    </span>
                    <p style={S.statLabel}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div style={S.heroRight}>
              <div style={S.dashCard}>
                {/* Subtle glow effects inside card (position:absolute, scoped to card) */}
                <div style={{ position: "absolute", top: "-3rem", right: "-3rem", width: "8rem", height: "8rem", background: "rgba(199,210,254,0.35)", borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: "-3rem", left: "-3rem", width: "8rem", height: "8rem", background: "rgba(251,207,232,0.3)", borderRadius: "50%", filter: "blur(30px)", pointerEvents: "none" }} />

                {/* Student Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(199,210,254,0.4)", paddingBottom: "1rem", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", boxShadow: "0 4px 12px rgba(99,102,241,0.3)", flexShrink: 0 }}>
                      S
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem", color: "#0f172a", lineHeight: 1 }}>Sunny Sunshine</p>
                      <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem" }}>Level 12 • Student Hub</p>
                    </div>
                  </div>
                  <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", fontSize: "0.6rem", fontWeight: 800, padding: "0.25rem 0.6rem", borderRadius: "999px", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                    Active
                  </span>
                </div>

                {/* Achievement Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "1rem" }}>
                  <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#94a3b8" }}>Recent Achievements</p>
                  {[
                    { icon: <Trophy style={{ width: "0.875rem", height: "0.875rem" }} />, bg: "#eef2ff", color: "#6366f1", title: "First Place in CBSE District Debate", sub: "Awarded to Debate Society Team" },
                    { icon: <Laptop  style={{ width: "0.875rem", height: "0.875rem" }} />, bg: "#f5f3ff", color: "#7c3aed", title: "Robotic Rover Project: Passed",      sub: "STEM lab telemetry test complete" },
                    { icon: <Sparkles style={{ width: "0.875rem", height: "0.875rem" }} />, bg: "#fdf2f8", color: "#db2777", title: "Creative Writing Badge Earned",      sub: "Unlocked 15 badges milestone" },
                  ].map(({ icon, bg, color, title, sub }) => (
                    <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem", padding: "0.625rem", background: "#f8fafc", borderRadius: "0.75rem", border: "1px solid #f1f5f9" }}>
                      <span style={{ padding: "0.375rem", background: bg, color, borderRadius: "0.5rem", flexShrink: 0 }}>{icon}</span>
                      <div>
                        <p style={{ fontFamily: "var(--font-heading)", fontSize: "0.75rem", fontWeight: 700, color: "#1e293b" }}>{title}</p>
                        <p style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "0.1rem" }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress bar */}
                <div style={{ background: "rgba(238,242,255,0.5)", border: "1px solid rgba(199,210,254,0.4)", padding: "0.75rem 1rem", borderRadius: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#4f46e5" }}>Olympiad Prep Progress</span>
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#4f46e5" }}>85%</span>
                  </div>
                  <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: "85%", height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)", borderRadius: "999px", animation: "pulse 3s infinite" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ABOUT — Principal
      ════════════════════════════════════════════════════════════════════ */}
      <section id="about" style={S.sectionAlt}>
        <div className="container">
          <div style={S.sectionHeadWrap}>
            <span className="badge-pill-colorful" style={{ marginBottom: "1rem" }}>OUR LEADERSHIP</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Welcome from our Academic Director
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Timeless educational values reimagined with cutting-edge student leadership.
            </p>
          </div>

          <div className="about-grid">
            {/* Principal Photo */}
            <div style={{ position: "relative" }} className="about-photo">
              <div style={{ position: "absolute", inset: "-6px", background: "linear-gradient(135deg, #6366f1, #ec4899)", borderRadius: "1.25rem", opacity: 0.2, filter: "blur(8px)" }} />
              <div style={{ position: "relative", aspectRatio: "3/4", borderRadius: "1.25rem", overflow: "hidden", border: "2px solid white", boxShadow: "var(--shadow-lg)", background: "#e0e7ff" }}>
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Principal Dr. Meenakshi Sundaram" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <h4 className="font-display font-extrabold text-slate-900 text-sm">Dr. Meenakshi Sundaram</h4>
                <p style={{ fontSize: "0.65rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "0.2rem" }}>Principal • Ph.D. Education</p>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="principal-speech-bubble" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-semibold">
                &quot;At Sunshine Public School, education in 2030 transcends classic textbooks. We empower young minds to ask bold questions, experiment with scientific tools, and lead with deep empathy.&quot;
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We design our curriculum to be highly interactive, gamified, and responsive to individual paces, ensuring no student is left behind.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingTop: "0.5rem" }}>
                <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-clay btn-clay-primary" style={{ padding: "0.55rem 1.25rem", fontSize: "0.75rem" }}>
                  Partner With Us
                </button>
                <a href="#contact" style={{ fontSize: "0.72rem", fontFamily: "var(--font-heading)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94a3b8" }}>
                  Visit Campus →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ACADEMICS — Bento Grid
      ════════════════════════════════════════════════════════════════════ */}
      <section id="academics" style={S.section}>
        <div className="container">
          <div style={S.sectionHeadWrap}>
            <span className="badge-pill-colorful" style={{ marginBottom: "1rem" }}>THE BENTO STUDY</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Future-Proof Learning Spaces
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              An ecosystem built for tech immersion, collaboration, and athletic wellness.
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "#ecfdf5", border: "1px solid #a7f3d0", display: "flex", alignItems: "center", justifyContent: "center", color: "#059669", marginBottom: "1rem" }}>
                  <Laptop style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900" style={{ marginBottom: "0.5rem" }}>Advanced STEM &amp; Robotics Pods</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Telemetry pods, 3D printers, and Arduino coding decks. Students build robots, code simulations, and explore automation.
                </p>
              </div>
              <div className="stem-widget">
                <div className="stem-orbit">
                  <div className="stem-center" />
                  <div className="stem-satellite" />
                </div>
              </div>
            </div>

            <div className="bento-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "#fff7ed", border: "1px solid #fed7aa", display: "flex", alignItems: "center", justifyContent: "center", color: "#ea580c", marginBottom: "1rem" }}>
                  <Trophy style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900" style={{ marginBottom: "0.5rem" }}>15-Acre Sports Arena</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Synthetic athletic fields, indoor arenas coached by Olympiad experts.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>12 Active Coaches</span>
                <span style={{ background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>Olympic Standards</span>
              </div>
            </div>

            <div className="bento-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "#eef2ff", border: "1px solid #c7d2fe", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", marginBottom: "1rem" }}>
                  <Library style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900" style={{ marginBottom: "0.5rem" }}>Digital Resource Library</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  25,000+ volumes with interactive quiet study pods, e-book clouds, and research portals.
                </p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "1.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>25,000+ Titles</span>
                <span style={{ background: "#eef2ff", color: "#6366f1", border: "1px solid #c7d2fe", fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>Study Pods</span>
              </div>
            </div>

            <div className="bento-card" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", background: "#fdf2f8", border: "1px solid #fbcfe8", display: "flex", alignItems: "center", justifyContent: "center", color: "#db2777", marginBottom: "1rem" }}>
                  <Music style={{ width: "1.25rem", height: "1.25rem" }} />
                </div>
                <h3 className="font-display font-extrabold text-xl text-slate-900" style={{ marginBottom: "0.5rem" }}>Acoustic Theater &amp; Arts Guild</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  600-seat acoustic theater hosting recitals, drama, visual art workshops, and debating societies.
                </p>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "1rem", padding: "1rem", justifyContent: "center" }}>
                {["🎭", "🎨", "🎼"].map((e) => (
                  <div key={e} style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "linear-gradient(135deg, #ec4899, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", animation: "bounce 1s infinite" }}>{e}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          NOTICES — Live board
      ════════════════════════════════════════════════════════════════════ */}
      <section id="notices" style={S.sectionNotice}>
        <div className="container">
          <div style={S.sectionHeadWrap}>
            <span className="badge-pill-colorful" style={{ marginBottom: "1rem" }}>THE DISPATCH</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Live School Notice Board
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Real-time notices fetched directly from our academic management center.
            </p>
          </div>
          <InteractiveNoticeBoard />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FACULTY — Teacher Cards
      ════════════════════════════════════════════════════════════════════ */}
      <section id="faculty" style={S.section}>
        <div className="container">
          <div style={S.sectionHeadWrap}>
            <span className="badge-pill-colorful" style={{ marginBottom: "1rem" }}>DISTINGUISHED STAFF</span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Meet Our Department Directors
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-3 font-medium">
              Ph.D. scholars and academic leaders dedicated to student growth.
            </p>
          </div>

          <div style={S.facultyGrid}>
            {[
              { src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop", name: "Dr. Ananya Sharma",   role: "Head of Sciences",  exp: "14+", fav: "Physics Pod",    badge: "Olympiad Mentor" },
              { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop", name: "Prof. Rajesh Malhotra", role: "Math Director",     exp: "18+", fav: "Calculus Hub",   badge: "JEE Expert" },
              { src: "https://images.unsplash.com/photo-1580894732468-918939c4f1c9?q=80&w=400&auto=format&fit=crop", name: "Priya Nair",           role: "Debating Lead",     exp: "11+", fav: "Debate Podium",  badge: "Literary Editor" },
            ].map(({ src, name, role, exp, fav, badge }) => (
              <div key={name} className="teacher-collectible">
                <div className="teacher-photo-container">
                  <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <h3 className="font-display font-extrabold text-base text-slate-900" style={{ marginBottom: "0.25rem" }}>{name}</h3>
                <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>{role}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid #f1f5f9", fontSize: "0.7rem", color: "#94a3b8", fontWeight: 700 }}>
                  <div><p>EXP</p><p style={{ color: "#334155" }}>{exp} Years</p></div>
                  <div><p>FAVORITE</p><p style={{ color: "#334155" }}>{fav}</p></div>
                </div>
                <div className="teacher-stat-badge">{badge}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ADMISSIONS CALLOUT
      ════════════════════════════════════════════════════════════════════ */}
      <section style={S.sectionCallout}>
        {/* Decorative orbs — absolutely inside section (overflow:hidden) */}
        <div style={{ ...S.glowOrb, top: "50%", left: "-4rem", transform: "translateY(-50%)" }} />
        <div style={{ ...S.glowOrb, top: "50%", right: "-4rem", transform: "translateY(-50%)" }} />

        <div className="container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", fontSize: "0.65rem", fontFamily: "var(--font-heading)", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", padding: "0.3rem 0.9rem", borderRadius: "999px", marginBottom: "1.5rem" }}>
            Admissions 2026–27 Open
          </span>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 900, color: "white", marginBottom: "1rem", lineHeight: 1.1 }}>
            Give your child a bright learning future.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Schedule a virtual walkthrough, tour our high-tech labs, and speak directly with our coaches.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
            <button type="button" onClick={() => setIsDrawerOpen(true)} className="btn-clay" style={{ background: "white", color: "#4f46e5", fontWeight: 800, padding: "0.85rem 2rem", fontSize: "0.85rem" }}>
              Start Admission Enquiry
            </button>
            <a href="mailto:admissions@sunshineps.edu.in" className="btn-clay btn-clay-glass" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.12)", padding: "0.85rem 2rem", fontSize: "0.85rem" }}>
              Email Admissions
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════ */}
      <footer id="contact" className="footer-futuristic">
        <div className="container">
          <div className="footerGrid">
            {/* Brand */}
            <div className="footerBrand">
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span className="logo-icon">S</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#1e293b", fontSize: "0.95rem", letterSpacing: "0.05em" }}>SUNSHINE PUBLIC SCHOOL</h3>
              </div>
              <p style={{ fontSize: "0.7rem", fontFamily: "var(--font-heading)", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Learning • Leadership • Character
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { icon: <MapPin style={{ width: "0.875rem", height: "0.875rem", color: "#6366f1", flexShrink: 0 }} />, text: "Sector 45, Gurugram, Haryana 122003" },
                  { icon: <Mail   style={{ width: "0.875rem", height: "0.875rem", color: "#6366f1", flexShrink: 0 }} />, text: "info@sunshineps.edu.in", href: "mailto:info@sunshineps.edu.in" },
                  { icon: <PhoneCall style={{ width: "0.875rem", height: "0.875rem", color: "#6366f1", flexShrink: 0 }} />, text: "+91 11 4567 8900", href: "tel:+911145678900" },
                ].map(({ icon, text, href }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b" }}>
                    {icon}
                    {href ? <a href={href} style={{ color: "inherit" }}>{text}</a> : <span>{text}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Explore links */}
            <div>
              <h4>Explore</h4>
              <a href="#home">Home</a>
              <a href="#about">About Leadership</a>
              <a href="#academics">Learning Spaces</a>
              <a href="#notices">Notice Board</a>
              <Link href="/login">Portal Login</Link>
            </div>

            {/* Admissions */}
            <div>
              <h4>Admissions</h4>
              <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6, marginBottom: "1rem" }}>
                Campus doors open for evaluations Monday–Saturday.
              </p>
              <button type="button" onClick={() => setIsDrawerOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 700, color: "#6366f1", padding: 0 }}>
                Submit Enquiry Now →
              </button>
            </div>

            {/* CBSE Info */}
            <div>
              <h4>CBSE Affiliation</h4>
              <p style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.6 }}>
                Affiliation No. 1234567<br />School Code: 54321
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem", fontSize: "0.8rem", color: "#64748b" }}>
                <Clock style={{ width: "0.875rem", height: "0.875rem", color: "#6366f1" }} />
                <span>8:00 AM – 3:30 PM</span>
              </div>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="copyright">
            <span>© 2026 Sunshine Public School. All rights reserved.</span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Sparkles style={{ width: "0.875rem", height: "0.875rem", color: "#6366f1" }} />
              Built for the Future
            </span>
          </div>
        </div>
      </footer>

      {/* ── Responsive CSS injected at page level ── */}
      <style>{`
        /* Hero 2-column grid */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }

        /* About grid */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr 2fr;
          }
          .about-photo {
            max-width: 260px;
          }
        }
      `}</style>
    </main>
  );
}
