"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Mail, PhoneCall, Clock, ChevronDown, Globe } from "lucide-react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";
import EnquiryDrawer from "@/components/kokonutui/enquiry-drawer";
import BrandLogo from "@/components/ui/BrandLogo";
import { StatCounter } from "./StatCounter";
import { SCHOOL_INFO } from "@/lib/constants";

/* ─── FAQ DATA ────────────────────────────────────────────────────────────── */
const FAQ_DATA = [
  {
    q: "What is the admission procedure for new students?",
    a: "Admissions begin with an online enquiry, followed by a scheduled campus visit. Parents then complete the application form, after which students attend a brief age-appropriate interaction session. Final enrollment confirmation is shared within 7 working days.",
  },
  {
    q: "Which curriculum does the school follow?",
    a: "Sunshine Public School is affiliated with the Central Board of Secondary Education (CBSE), New Delhi.",
  },
  {
    q: "Are transportation facilities available?",
    a: "Yes. GPS-tracked school buses cover major routes across Madhepura and surrounding areas. Transportation fees are charged separately based on route distance. Please contact the transport office for the current route list.",
  },
  {
    q: "What is the school's fee structure?",
    a: "Fee details are shared during the campus visit and on submission of the application. Fees vary by grade level and include tuition, activity, and development charges. Payment can be made quarterly or annually.",
  },
  {
    q: "What co-curricular activities are available?",
    a: "We offer a wide range of co-curricular programmes including sports (cricket, football, athletics, swimming), performing arts (music, dance, drama), visual arts, debate, robotics, and various STEM clubs.",
  },
  {
    q: "Is there a uniform policy?",
    a: "Yes, the school has a prescribed uniform for all students. Uniforms are available at the school's designated vendors. Details are shared in the student welcome kit post-enrollment.",
  },
];

/* ─── PROGRAMS DATA ──────────────────────────────────────────────────────── */
const PROGRAMS = [
  {
    label: "Pre-Primary",
    grades: "Nursery – UKG",
    desc: "Play-based early learning fostering curiosity, language, and foundational numeracy in a safe, nurturing environment.",
    img: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Primary",
    grades: "Grade I – V",
    desc: "Structured learning that balances academics, creativity, and physical development through collaborative classrooms.",
    img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Middle School",
    grades: "Grade VI – VIII",
    desc: "Critical thinking, project-based learning, and co-curricular immersion preparing students for senior education.",
    img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80&auto=format&fit=crop",
  },
  {
    label: "Secondary School",
    grades: "Grade IX – X",
    desc: "Rigorous CBSE Board Examination preparation focusing on core concepts, analytical reasoning, and comprehensive subject mastery.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80&auto=format&fit=crop",
  },
];

/* ─── CAMPUS LIFE IMAGES ─────────────────────────────────────────────────── */
const CAMPUS_ITEMS = [
  { label: "Classrooms", img: "/Images/random/pexels-madman-creation-2158167362-35493021.jpg", tall: true },
  { label: "Library", img: "/Images/random/photo-1569098272587-7af816a8293c.webp" },
  { label: "Science Lab", img: "/Images/random/science.webp" },
  { label: "Sports", img: "/Images/random/sports.webp", wide: true },
  { label: "Music & Performing Arts", img: "/Images/random/music.webp" },
  { label: "Computer Lab & Tech", img: "/Images/random/photo-1701922452163-895d70209917.webp" },
  { label: "Art Studio", img: "/Images/random/art.webp" },
];

/* ─── FACILITIES ─────────────────────────────────────────────────────────── */
const FACILITIES = [
  { name: "Smart Classrooms", img: "/Images/random/pexels-madman-creation-2158167362-35493021.jpg" },
  { name: "Science Labs", img: "/Images/random/science.webp" },
  { name: "Computer Lab", img: "/Images/random/photo-1701922452163-895d70209917.webp" },
  { name: "Library", img: "/Images/random/photo-1569098272587-7af816a8293c.webp" },
  { name: "Sports Facilities", img: "/Images/random/sports.webp" },
  { name: "Music Room", img: "/Images/random/music.webp" },
  { name: "Art Studio", img: "/Images/random/art.webp" },
  { name: "Transportation", img: "/Images/random/transportation.webp" },
];


/* ─── ADMISSIONS STEPS ───────────────────────────────────────────────────── */
const ADMISSION_STEPS = [
  { num: "01", title: "Inquiry", desc: "Submit your enquiry online or visit the admissions office." },
  { num: "02", title: "Campus Visit", desc: "Schedule a guided tour and meet our faculty and coordinators." },
  { num: "03", title: "Application", desc: "Complete the application form with required documents." },
  { num: "04", title: "Assessment", desc: "Students attend a brief, age-appropriate interaction session." },
  { num: "05", title: "Enrollment", desc: "Receive your offer letter and complete enrollment formalities." },
];

/* ─── NEWS ───────────────────────────────────────────────────────────────── */
const NEWS = [
  {
    date: "July 20, 2026",
    cat: "Achievement",
    title: "Students Win Regional Science Olympiad — 3 Gold Medals",
    excerpt: "Our STEM team represented the school at the Regional Science Olympiad in Patna, bringing home three gold medals and setting a school record.",
    img: "/Images/random/medal.png",
  },
  {
    date: "July 15, 2026",
    cat: "Events",
    title: "Annual Day 2026 — A Celebration of Culture & Excellence",
    excerpt: "Over 500 students, parents, and faculty gathered for our grandest Annual Day yet, featuring performances in music, dance, and drama.",
    img: "/Images/random/time-to-celebrate.png",
  },
  {
    date: "July 8, 2026",
    cat: "Admissions",
    title: "Admissions Open for Session 2026–27",
    excerpt: "Applications are now being accepted for all grades. Early applications receive priority processing. Schedule your campus visit today.",
    img: "/Images/random/Admission_Open.png",
  },
];

/* ─── FAQ COMPONENT ──────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`spn-faq-item${open ? " open" : ""}`}>
      <button
        type="button"
        className="spn-faq-question"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="spn-faq-icon" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div className="spn-faq-answer" style={{ display: open ? "block" : "none" }}>
        <div className="spn-faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

/* ─── CONTACT FORM ───────────────────────────────────────────────────────── */
function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: name.trim(),
          parentName: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          grade: "General Inquiry",
          notes: message.trim(),
        }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Failed to submit message. Please try again.");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "3rem 0" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 600, color: "var(--color-brown)", marginBottom: "0.75rem" }}>
          Thank You
        </div>
        <p style={{ color: "var(--color-text-muted)", lineHeight: 1.75 }}>
          We have received your message and will respond within one business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {errorMsg && (
        <div style={{ padding: "0.75rem 1rem", background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", fontSize: "0.85rem" }}>
          {errorMsg}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label htmlFor="cf-name" className="spn-label">Full Name</label>
          <input
            id="cf-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rajesh Kumar"
            className="spn-input"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="spn-label">Phone</label>
          <input
            id="cf-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="spn-input"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-email" className="spn-label">Email Address</label>
        <input
          id="cf-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="spn-input"
        />
      </div>
      <div>
        <label htmlFor="cf-message" className="spn-label">Message</label>
        <textarea
          id="cf-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help you?"
          className="spn-input"
          style={{ resize: "vertical", verticalAlign: "top" }}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="spn-btn spn-btn-primary"
        style={{ alignSelf: "flex-start" }}
      >
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string | null>(null);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  // Local hero video and image fallbacks
  const LOCAL_HERO_VIDEO = "/SchoolVideo1.mp4";
  const LOCAL_HERO_IMAGE = "/hero-school.webp";

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

  // Priority Chain:
  // 1. Active Hero Video (from DB /api/hero-video)
  // 2. Active Hero Image (from DB /api/hero-image if no active video)
  // 3. Default bundled fallback (/SchoolVideo1.mp4 with /hero-school.webp fallback)
  const renderDbVideo = Boolean(heroVideoUrl);
  const renderDbImage = !renderDbVideo && Boolean(heroImageUrl);

  const activeVideoSrc = renderDbVideo
    ? heroVideoUrl!
    : !renderDbImage
    ? LOCAL_HERO_VIDEO
    : null;

  const activeImageSrc = renderDbImage
    ? heroImageUrl!
    : LOCAL_HERO_IMAGE;

  return (
    <main style={{ background: "var(--color-bg)" }}>
      {/* ── Enquiry Drawer ── */}
      <EnquiryDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      {/* ── Navbar ── */}
      <MorphicNavbar
        items={[
          { id: "about",      name: "About",          href: "#about" },
          { id: "academics",  name: "Academics",       href: "#academics" },
          { id: "campus",     name: "Campus Life",     href: "#campus" },
          { id: "admissions", name: "Admissions",      href: "#admissions" },
          { id: "contact",    name: "Contact",         href: "#contact" },
          { id: "enquire",    name: "Enquire Now",     isAction: true },
        ]}
        onActionClick={(id) => { if (id === "enquire") setIsDrawerOpen(true); }}
      />

      {/* ════════════════════════════════════════════════════════════════════
          § 1 — HERO
          ════════════════════════════════════════════════════════════════════ */}
      <section id="home" className="spn-hero" aria-label="Hero">
        {/* Video or Image based on Priority Chain */}
        {activeVideoSrc && !videoError ? (
          <video
            key={activeVideoSrc}
            src={activeVideoSrc}
            className="spn-hero-video"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            onError={() => setVideoError(true)}
          />
        ) : (
          <img
            className="spn-hero-img"
            src={activeImageSrc}
            alt="Sunshine Public School Campus"
            aria-hidden="true"
          />
        )}

        {/* Dark overlay */}
        <div className="spn-hero-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="spn-hero-content">
          <span className="spn-hero-tagline">{SCHOOL_INFO.heroTagline}</span>
          <h1 className="spn-hero-h1">
            Learn &bull; Grow &bull; Shine<br />
            <span style={{ fontSize: "0.62em", fontWeight: 400, display: "block", marginTop: "0.6rem", color: "rgba(255,255,255,0.92)", letterSpacing: "0.01em" }}>
              Nurturing Young Minds for a Brighter Tomorrow
            </span>
          </h1>
          <div className="spn-hero-actions" style={{ marginTop: "2.5rem" }}>
            <button
              type="button"
              id="hero-cta-primary"
              className="spn-btn spn-btn-primary"
              onClick={() => setIsDrawerOpen(true)}
            >
              Schedule a Campus Visit
            </button>
            <a
              href="#admissions"
              id="hero-cta-secondary"
              className="spn-btn spn-btn-outline-light"
            >
              Explore Admissions
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="spn-hero-scroll" aria-hidden="true">
          <ChevronDown size={18} />
          <span>Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 2 — PRINCIPAL'S MESSAGE
          ════════════════════════════════════════════════════════════════════ */}
      <section id="principal" className="spn-section-white" aria-labelledby="principal-heading">
        <div className="container">
          <div className="spn-principal-grid">
            {/* Portrait */}
            <div className="spn-principal-photo">
              <img
                src="/Images/director-chandra-mohan-singh.jpeg"
                alt="Chandra Mohan Singh, Director"
                loading="lazy"
              />
              <div className="spn-principal-caption">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, color: "var(--color-brown)" }}>
                  Chandra Mohan Singh
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                  Director
                </div>
              </div>
            </div>

            {/* Message */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="spn-eyebrow">A Message from the Director</span>
              <h2 id="principal-heading" className="spn-h2" style={{ marginBottom: "1.5rem" }}>
                Welcome to Sunshine Public School
              </h2>
              <div className="spn-divider" style={{ marginBottom: "2rem" }} />
              <p style={{ fontSize: "1.05rem", color: "var(--color-text)", lineHeight: 1.9, marginBottom: "1.25rem", fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                &ldquo;Education is the foundation upon which dreams are built. At Sun Shine Public School, our objective is not only academic excellence but also the overall development of every child. We believe every student deserves opportunities to explore their talents, build confidence, and become responsible citizens with strong moral values.&rdquo;
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                Our dedicated faculty, disciplined environment, and commitment to quality education ensure that every child receives the guidance needed for a bright and successful future.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
                Together, let us inspire young minds to learn, grow, and shine.
              </p>
              <div className="spn-signature">Chandra Mohan Singh</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                Director, Sunshine Public School
              </div>
              <div style={{ marginTop: "2rem" }}>
                <button
                  type="button"
                  id="principal-cta"
                  className="spn-btn spn-btn-primary"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  Schedule a Visit
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 3 — WHY CHOOSE US
          ════════════════════════════════════════════════════════════════════ */}
      <section id="why" className="spn-section-beige" aria-labelledby="why-heading">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: "3.5rem" }}>
            <span className="spn-eyebrow">Why Sunshine</span>
            <h2 id="why-heading" className="spn-h2">Four Pillars of an Exceptional Education</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "2rem",
          }}>
            {[
              {
                num: "01",
                title: "Academic Excellence",
                desc: "A rigorous CBSE curriculum delivered by subject matter experts, supported by structured assessments, personalised mentoring, and a consistent record of outstanding board results.",
                img: "/Images/academic_excellence.webp",
                imgAlt: "Academic Excellence",
              },
              {
                num: "02",
                title: "Character Building",
                desc: "Ethics, empathy, and leadership are woven into everyday school life — from morning assemblies to community service programmes and student-led councils.",
                img: "/Images/character_building.webp",
                imgAlt: "Character Building",
              },
              {
                num: "03",
                title: "Holistic Development",
                desc: "Sports, performing arts, music, visual arts, and STEM clubs run alongside academics — because a well-rounded student is a prepared student.",
                img: "/Images/holistic_development.webp",
                imgAlt: "Holistic Development",
              },
              {
                num: "04",
                title: "Experienced Faculty",
                desc: "Our teachers are dedicated professionals committed to continuous professional development, student-centred pedagogy, and personal mentoring.",
                img: "/Images/experienced_faculty.webp",
                imgAlt: "Experienced Faculty",
              },
            ].map(({ num, title, desc, img, imgAlt }) => (
              <div
                key={num}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-sand-light)",
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ width: "100%", height: "210px", overflow: "hidden", position: "relative" }}>
                  <img
                    src={img}
                    alt={imgAlt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: "2rem 1.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="spn-pillar-num" style={{ marginBottom: "0.5rem" }}>{num}</div>
                  <h3 className="spn-h3" style={{ fontSize: "1.35rem", marginBottom: "0.75rem" }}>{title}</h3>
                  <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8, fontSize: "0.92rem", margin: 0, flex: 1 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 4 — ABOUT THE SCHOOL
          ════════════════════════════════════════════════════════════════════ */}
      <section id="about" aria-labelledby="about-heading">
        <div className="spn-about-grid">
          <div className="spn-about-img-wrap">
            <img
              src="/Images/ssps image.png"
              alt="Sunshine Public School campus building"
              loading="lazy"
            />
          </div>
          <div className="spn-about-copy">
            <span className="spn-eyebrow">Our Story</span>
            <h2 id="about-heading" className="spn-h2" style={{ marginBottom: "1.5rem" }}>
              A Legacy of Learning Since {SCHOOL_INFO.established}
            </h2>
            <div className="spn-divider" style={{ marginBottom: "2rem" }} />
            <p style={{ color: "var(--color-text)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              Founded in {SCHOOL_INFO.established}, Sunshine Public School began with a single vision: to create an
              institution where rigorous scholarship and genuine human development co-exist.
              What started with a passion for quality education has grown into one of {SCHOOL_INFO.address.city}&apos;s
              most respected educational institutions.
            </p>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.9, marginBottom: "2rem" }}>
              Our philosophy is simple — every child deserves an education that honours their
              unique potential. Our 15-acre campus provides the space, resources, and community
              for students to discover who they are and who they wish to become.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
              {[
                { heading: "Vision", body: "To be a beacon of educational excellence that produces thoughtful, confident, and ethical citizens." },
                { heading: "Mission", body: "To deliver an education that balances intellectual rigour with emotional intelligence and creative freedom." },
              ].map(({ heading, body }) => (
                <div key={heading}>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-brown-light)", marginBottom: "0.5rem" }}>
                    {heading}
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>{body}</p>
                </div>
              ))}
            </div>
            <Link href="/login">
              <button type="button" id="about-portal-btn" className="spn-btn spn-btn-outline">
                Student & Staff Portal
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 5 — ACADEMIC PROGRAMS
          ════════════════════════════════════════════════════════════════════ */}
      <section id="academics" className="spn-section" aria-labelledby="academics-heading">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: "3rem" }}>
            <span className="spn-eyebrow">Academic Programmes</span>
            <h2 id="academics-heading" className="spn-h2">From First Steps to Final Exams</h2>
          </div>
          <div className="spn-programs-grid">
            {PROGRAMS.map((prog) => (
              <div key={prog.label} className="spn-program-card">
                <div style={{ overflow: "hidden" }}>
                  <img src={prog.img} alt={prog.label} className="spn-program-img" loading="lazy" />
                </div>
                <div className="spn-program-body">
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-brown-light)", marginBottom: "0.4rem" }}>
                    {prog.grades}
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 600, color: "var(--color-brown)", marginBottom: "0.75rem" }}>
                    {prog.label}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.8 }}>{prog.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 6 — CAMPUS LIFE
          ════════════════════════════════════════════════════════════════════ */}
      <section id="campus" className="spn-section-beige" aria-labelledby="campus-heading">
        <div className="container" style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="spn-eyebrow">Life at Sunshine</span>
              <h2 id="campus-heading" className="spn-h2">A Vibrant School Community</h2>
            </div>
            <button
              type="button"
              id="campus-cta"
              className="spn-btn spn-btn-outline"
              onClick={() => setIsDrawerOpen(true)}
            >
              Schedule a Visit
            </button>
          </div>
        </div>
        <div className="container">
          <div className="spn-campus-grid">
            {CAMPUS_ITEMS.map((item) => (
              <div
                key={item.label}
                className={`spn-campus-item${item.tall ? " tall" : ""}${item.wide ? " wide" : ""}`}
              >
                <img src={item.img} alt={item.label} loading="lazy" />
                <div className="spn-campus-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 7 — FACILITIES
          ════════════════════════════════════════════════════════════════════ */}
      <section id="facilities" className="spn-section" aria-labelledby="facilities-heading">
        <div className="container">
          <div style={{ maxWidth: 560, marginBottom: "3rem" }}>
            <span className="spn-eyebrow">World-Class Facilities</span>
            <h2 id="facilities-heading" className="spn-h2">Infrastructure Built for Excellence</h2>
          </div>
          <div className="spn-facilities-grid">
            {FACILITIES.map((f) => (
              <div key={f.name} className="spn-facility-item">
                <div style={{ overflow: "hidden" }}>
                  <img src={f.img} alt={f.name} className="spn-facility-img" loading="lazy" />
                </div>
                <div className="spn-facility-name">{f.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 8 — ACHIEVEMENTS
          ════════════════════════════════════════════════════════════════════ */}
      <section id="achievements" className="spn-section-brown" aria-labelledby="achievements-heading">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <span className="spn-eyebrow spn-eyebrow-light">By the Numbers</span>
              <h2 id="achievements-heading" className="spn-h2 spn-h2-light" style={{ marginBottom: "1.5rem" }}>
                A Record of Consistent Excellence
              </h2>
              <div className="spn-divider" style={{ background: "rgba(213,195,161,0.4)", marginBottom: "2rem" }} />
              <p style={{ color: "rgba(242,232,216,0.72)", lineHeight: 1.9, fontSize: "0.95rem" }}>
                For over 12 years, our students have excelled in board examinations, sports,
                co-curricular competitions, and holistic learning. These numbers reflect the
                dedication of our students, families, and faculty.
              </p>
            </div>
            <div className="spn-stats-grid" style={{ border: "1px solid rgba(213,195,161,0.2)" }}>
              {[
                { value: "12+", label: "Years of Experience" },
                { value: "400+", label: "Students Enrolled" },
                { value: "100%", label: "CBSE Pass Rate" },
                { value: "50+", label: "Faculty Members" },
              ].map(({ value, label }) => (
                <div key={label} className="spn-stat-item" style={{ border: "none", borderRight: "1px solid rgba(213,195,161,0.2)" }}>
                  <span className="spn-stat-num" style={{ color: "var(--color-beige)" }}>
                    <StatCounter value={value} className="" />
                  </span>
                  <span className="spn-stat-label" style={{ color: "rgba(213,195,161,0.65)" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            #achievements .container > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          }
        `}</style>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 10 — ADMISSIONS
          ════════════════════════════════════════════════════════════════════ */}
      <section id="admissions" className="spn-section-beige" aria-labelledby="admissions-heading">
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 4rem" }}>
            <span className="spn-eyebrow">Admissions 2026–27</span>
            <h2 id="admissions-heading" className="spn-h2" style={{ marginBottom: "1rem" }}>
              How to Join Sunshine
            </h2>
            <p style={{ color: "var(--color-text-muted)", lineHeight: 1.8 }}>
              Our admissions process is designed to be straightforward and transparent,
              ensuring every family has a welcoming experience from the first inquiry to enrollment.
            </p>
          </div>

          <div className="spn-timeline">
            {ADMISSION_STEPS.map((step) => (
              <div key={step.num} className="spn-timeline-item">
                <div className="spn-timeline-num">{step.num}</div>
                <div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, color: "var(--color-brown)", marginBottom: "0.5rem", marginTop: "0.75rem" }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", lineHeight: 1.75 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <button
              type="button"
              id="admissions-cta"
              className="spn-btn spn-btn-primary"
              onClick={() => setIsDrawerOpen(true)}
              style={{ padding: "1rem 2.5rem" }}
            >
              Begin Your Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 11 — NEWS & EVENTS
          ════════════════════════════════════════════════════════════════════ */}
      <section id="news" className="spn-section" aria-labelledby="news-heading">
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}>
            <div>
              <span className="spn-eyebrow">Latest from School</span>
              <h2 id="news-heading" className="spn-h2">News & Upcoming Events</h2>
            </div>
          </div>

          {/* Editorial news cards */}
          <div className="spn-news-grid">
            {NEWS.map((item) => (
              <div key={item.title} className="spn-news-card">
                <div style={{ overflow: "hidden", height: "220px", position: "relative" }}>
                  <img src={item.img} alt={item.title} className="spn-news-img" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                </div>
                <div className="spn-news-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-brown-light)" }}>
                      {item.cat}
                    </span>
                    <span style={{ width: "1px", height: "12px", background: "var(--color-sand)" }} />
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--color-text-muted)" }}>{item.date}</span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 600, color: "var(--color-brown)", marginBottom: "0.75rem", lineHeight: 1.35 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--color-text-muted)", lineHeight: 1.8, flex: 1 }}>{item.excerpt}</p>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 12 — FAQ
          ════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="spn-section-beige" aria-labelledby="faq-heading">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", alignItems: "start" }}>
            <div style={{ position: "sticky", top: "8rem" }}>
              <span className="spn-eyebrow">Common Questions</span>
              <h2 id="faq-heading" className="spn-h2" style={{ marginBottom: "1.5rem" }}>
                Frequently Asked Questions
              </h2>
              <div className="spn-divider" />
              <p style={{ color: "var(--color-text-muted)", lineHeight: 1.85, marginTop: "1.5rem", marginBottom: "2rem", fontSize: "0.95rem" }}>
                Can&apos;t find your answer? Contact our admissions office directly &mdash; we&apos;re happy to help.
              </p>
              <button
                type="button"
                id="faq-contact-cta"
                className="spn-btn spn-btn-outline"
                onClick={() => setIsDrawerOpen(true)}
              >
                Ask Us Directly
              </button>
            </div>
            <div>
              {FAQ_DATA.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #faq .container > div { grid-template-columns: 1fr !important; gap: 2rem !important; }
            #faq [style*="sticky"] { position: static !important; }
          }
        `}</style>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 13 — CONTACT
          ════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="spn-section-white" aria-labelledby="contact-heading">
        <div className="container" style={{ marginBottom: "3rem" }}>
          <span className="spn-eyebrow">Get in Touch</span>
          <h2 id="contact-heading" className="spn-h2">We&apos;d Love to Hear from You</h2>
        </div>

        <div className="container">
          <div className="spn-contact-grid">
            {/* Map / Campus Image */}
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src="/Images/ssps image.png"
                alt="Sunshine Public School campus entrance"
                className="spn-contact-map"
                loading="lazy"
              />
              {/* Address overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "2rem",
                background: "linear-gradient(to top, rgba(30,18,8,0.85) 0%, transparent 100%)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {[
                    { Icon: MapPin, text: SCHOOL_INFO.address.full },
                    { Icon: Mail, text: SCHOOL_INFO.email.primary, href: `mailto:${SCHOOL_INFO.email.primary}` },
                    { Icon: PhoneCall, text: SCHOOL_INFO.phone.display, href: SCHOOL_INFO.phone.primaryHref },
                    { Icon: Clock, text: "Mon–Sat · 8:00 AM – 3:30 PM" },
                  ].map(({ Icon, text, href }) => (
                    <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "rgba(242,232,216,0.85)", fontSize: "0.85rem" }}>
                      <Icon size={14} style={{ flexShrink: 0, color: "var(--color-sand)" }} />
                      {href ? <a href={href} style={{ color: "inherit" }}>{text}</a> : <span>{text}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="spn-contact-form-wrap">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 600, color: "var(--color-brown)", marginBottom: "0.5rem" }}>
                Send Us a Message
              </h3>
              <p style={{ color: "var(--color-text-muted)", marginBottom: "2rem", lineHeight: 1.75, fontSize: "0.9rem" }}>
                Admissions enquiries, general questions, or feedback — we respond within one business day.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 14 — FOOTER
          ════════════════════════════════════════════════════════════════════ */}
      <footer className="spn-footer" aria-label="Site footer">
        <div className="container">
          <div className="spn-footer-grid">
            {/* Brand column */}
            <div>
              <div style={{ marginBottom: "1.25rem" }}>
                <BrandLogo variant="dark" height={58} />
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(242,232,216,0.55)", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "280px" }}>
                {SCHOOL_INFO.tagline} &bull; {SCHOOL_INFO.subTagline} since {SCHOOL_INFO.established}.
                CBSE Affiliated
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { Icon: MapPin, text: SCHOOL_INFO.address.full },
                  { Icon: Mail, text: SCHOOL_INFO.email.primary, href: `mailto:${SCHOOL_INFO.email.primary}` },
                  { Icon: PhoneCall, text: SCHOOL_INFO.phone.display, href: SCHOOL_INFO.phone.primaryHref },
                ].map(({ Icon, text, href }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(242,232,216,0.55)" }}>
                    <Icon size={13} style={{ color: "var(--color-sand)", flexShrink: 0 }} />
                    {href ? <a href={href} style={{ color: "inherit" }}>{text}</a> : <span>{text}</span>}
                  </div>
                ))}
              </div>

              {/* Social Media Links */}
              <div className="spn-footer-social" aria-label="Social media channels">
                {[
                  {
                    label: "Facebook",
                    href: "https://facebook.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    ),
                  },
                  {
                    label: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    ),
                  },
                  {
                    label: "YouTube",
                    href: "https://youtube.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                      </svg>
                    ),
                  },
                  {
                    label: "LinkedIn",
                    href: "https://linkedin.com",
                    icon: (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    ),
                  },
                  {
                    label: "CBSE Portal",
                    href: "https://cbse.gov.in",
                    icon: <Globe size={15} />,
                  },
                ].map(({ icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="spn-footer-social-link"
                    aria-label={`Follow Sunshine Public School on ${label}`}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4>Explore</h4>
              <a href="#principal">Principal&apos;s Message</a>
              <a href="#why">Why Choose Us</a>
              <a href="#about">About the School</a>
              <a href="#academics">Academic Programmes</a>
              <a href="#campus">Campus Life</a>
              <a href="#facilities">Facilities</a>
            </div>

            {/* Admissions */}
            <div>
              <h4>Admissions</h4>
              <a href="#admissions">Admission Process</a>
              <a href="#faq">FAQ</a>
              <button
                type="button"
                id="footer-enquire-btn"
                onClick={() => setIsDrawerOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.88rem", color: "rgba(242,232,216,0.65)", padding: 0, textAlign: "left", display: "block", marginBottom: "0.6rem", fontFamily: "var(--font-body)", transition: "color 0.18s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-beige)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(242,232,216,0.65)")}
              >
                Submit an Enquiry
              </button>
              <a href="#contact">Contact Office</a>
            </div>

            {/* Portal & CBSE */}
            <div>
              <h4>Portal & Info</h4>
              <Link href="/login">Student Portal</Link>
              <Link href="/login">Staff Login</Link>
              <Link href="/admin/login">Admin Access</Link>
              <a href="#news">News & Events</a>
              <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(213,195,161,0.15)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-sand)", marginBottom: "0.5rem" }}>CBSE</div>
                <p style={{ fontSize: "0.8rem", color: "rgba(242,232,216,0.45)", lineHeight: 1.7 }}>
                  CBSE Affiliated · {SCHOOL_INFO.classes}<br />
                  Mon–Sat · 8:00 AM – 3:30 PM
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="spn-footer-copy">
            <span>© 2026 {SCHOOL_INFO.name}. All rights reserved.</span>
            <span>{SCHOOL_INFO.address.full}</span>
          </div>
        </div>
      </footer>

      {/* Floating Quick Action Button */}
      <button
        type="button"
        id="floating-enquire-btn"
        className="spn-floating-cta"
        onClick={() => setIsDrawerOpen(true)}
        aria-label="Open admission enquiry drawer"
      >
        <Mail size={16} />
        <span>Enquire Now</span>
      </button>
    </main>
  );
}
