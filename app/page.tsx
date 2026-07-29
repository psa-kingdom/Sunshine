"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Mail, PhoneCall, Clock, ChevronDown } from "lucide-react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";
import EnquiryDrawer from "@/components/kokonutui/enquiry-drawer";
import InteractiveNoticeBoard from "@/components/school/InteractiveNoticeBoard";
import { StatCounter } from "./StatCounter";

/* ─── FAQ DATA ────────────────────────────────────────────────────────────── */
const FAQ_DATA = [
  {
    q: "What is the admission procedure for new students?",
    a: "Admissions begin with an online enquiry, followed by a scheduled campus visit. Parents then complete the application form, after which students attend a brief age-appropriate interaction session. Final enrollment confirmation is shared within 7 working days.",
  },
  {
    q: "Which curriculum does the school follow?",
    a: "Sunshine Public School is affiliated with the Central Board of Secondary Education (CBSE), New Delhi. Affiliation No. 1234567, School Code: 54321.",
  },
  {
    q: "Are transportation facilities available?",
    a: "Yes. GPS-tracked school buses cover major routes across Gurugram. Transportation fees are charged separately based on route distance. Please contact the transport office for the current route list.",
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
    label: "Senior School",
    grades: "Grade IX – XII",
    desc: "Rigorous CBSE board preparation with Science, Commerce, and Humanities streams. Guided by experienced faculty.",
    img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80&auto=format&fit=crop",
  },
];

/* ─── CAMPUS LIFE IMAGES ─────────────────────────────────────────────────── */
const CAMPUS_ITEMS = [
  { label: "Classrooms", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80&auto=format&fit=crop", tall: true },
  { label: "Library", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&q=80&auto=format&fit=crop" },
  { label: "Science Lab", img: "https://images.unsplash.com/photo-1532094349884-543559b8a7b0?w=600&q=80&auto=format&fit=crop" },
  { label: "Sports", img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80&auto=format&fit=crop", wide: true },
  { label: "Performing Arts", img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop" },
  { label: "Morning Assembly", img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format&fit=crop" },
  { label: "Art Studio", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80&auto=format&fit=crop" },
];

/* ─── FACILITIES ─────────────────────────────────────────────────────────── */
const FACILITIES = [
  { name: "Smart Classrooms", img: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&q=80&auto=format&fit=crop" },
  { name: "Science Labs", img: "https://images.unsplash.com/photo-1532094349884-543559b8a7b0?w=400&q=80&auto=format&fit=crop" },
  { name: "Computer Lab", img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80&auto=format&fit=crop" },
  { name: "Library", img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80&auto=format&fit=crop" },
  { name: "Sports Facilities", img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80&auto=format&fit=crop" },
  { name: "Music Room", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80&auto=format&fit=crop" },
  { name: "Art Studio", img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&q=80&auto=format&fit=crop" },
  { name: "Transportation", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80&auto=format&fit=crop" },
];

/* ─── TESTIMONIALS ───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "The depth of attention each teacher gives to my child's individual growth has been remarkable. This school genuinely cares.",
    name: "Mrs. Sunita Agarwal",
    role: "Parent — Grade VII",
    portrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&auto=format&fit=crop&face",
  },
  {
    quote: "I cleared my board exams with distinction and secured admission in Delhi University — all thanks to the foundation built here.",
    name: "Arjun Mehta",
    role: "Alumni — Batch of 2024",
    portrait: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&auto=format&fit=crop&face",
  },
  {
    quote: "The balance between academics and co-curriculars is something no other school in the region matches. Truly holistic.",
    name: "Mr. Rajan Sharma",
    role: "Parent — Grade X",
    portrait: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80&auto=format&fit=crop&face",
  },
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
    title: "Students Win National Science Olympiad — 3 Gold Medals",
    excerpt: "Our STEM team represented the school at the National Science Olympiad in Delhi, bringing home three gold medals and setting a school record.",
    img: "https://images.unsplash.com/photo-1532094349884-543559b8a7b0?w=600&q=80&auto=format&fit=crop",
  },
  {
    date: "July 15, 2026",
    cat: "Events",
    title: "Annual Day 2026 — A Celebration of Culture & Excellence",
    excerpt: "Over 1,200 students, parents, and faculty gathered for our grandest Annual Day yet, featuring performances in music, dance, and drama.",
    img: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=80&auto=format&fit=crop",
  },
  {
    date: "July 8, 2026",
    cat: "Admissions",
    title: "Admissions Open for Session 2026–27",
    excerpt: "Applications are now being accepted for all grades. Early applications receive priority processing. Schedule your campus visit today.",
    img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80&auto=format&fit=crop",
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
        <span className="spn-faq-icon" aria-hidden="true">+</span>
      </button>
      <div className="spn-faq-answer" aria-hidden={!open}>
        <div className="spn-faq-answer-inner">{a}</div>
      </div>
    </div>
  );
}

/* ─── CONTACT FORM ───────────────────────────────────────────────────────── */
function ContactForm() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setSent(true);
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label htmlFor="cf-name" className="spn-label">Full Name</label>
          <input id="cf-name" type="text" required placeholder="Rajesh Kumar" className="spn-input" />
        </div>
        <div>
          <label htmlFor="cf-phone" className="spn-label">Phone</label>
          <input id="cf-phone" type="tel" required placeholder="+91 98765 43210" className="spn-input" />
        </div>
      </div>
      <div>
        <label htmlFor="cf-email" className="spn-label">Email Address</label>
        <input id="cf-email" type="email" required placeholder="your@email.com" className="spn-input" />
      </div>
      <div>
        <label htmlFor="cf-message" className="spn-label">Message</label>
        <textarea
          id="cf-message"
          rows={4}
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

  // Pexels fallback video (direct CDN)
  const PEXELS_VIDEO = "https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4";

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

  const activeVideo = heroVideoUrl ?? PEXELS_VIDEO;

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
        {/* Video background */}
        <video
          key={activeVideo}
          className="spn-hero-video"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          onError={(e) => {
            // If pexels video fails, fall back to static image
            const vid = e.currentTarget;
            if (heroImageUrl) {
              vid.style.display = "none";
              const img = document.querySelector(".spn-hero-img-fallback") as HTMLElement;
              if (img) img.style.display = "block";
            }
          }}
        >
          <source src={activeVideo} type="video/mp4" />
        </video>

        {/* Image fallback (admin-controlled hero image or public webp) */}
        <img
          className="spn-hero-img spn-hero-img-fallback"
          src={heroImageUrl ?? "/hero-school.webp"}
          alt="Sunshine Public School Campus"
          style={{ display: "none" }}
          aria-hidden="true"
        />

        {/* Dark overlay */}
        <div className="spn-hero-overlay" aria-hidden="true" />

        {/* Content */}
        <div className="spn-hero-content">
          <span className="spn-hero-tagline">Est. 1998 · CBSE Affiliated · Gurugram</span>
          <h1 className="spn-hero-h1">
            Shaping Curious Minds.<br />
            Building Confident Futures.
          </h1>
          <p className="spn-hero-desc">
            At Sunshine Public School, we believe education is more than examinations. It is
            the pursuit of character, the development of creativity, and the cultivation of
            lifelong learners who lead with empathy and purpose.
          </p>
          <div className="spn-hero-actions">
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
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=720&auto=format&fit=crop&crop=top"
                alt="Dr. Meenakshi Sundaram, Principal"
                loading="lazy"
              />
              <div className="spn-principal-caption">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 600, color: "var(--color-brown)" }}>
                  Dr. Meenakshi Sundaram
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                  Principal · Ph.D. Education
                </div>
              </div>
            </div>

            {/* Message */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <span className="spn-eyebrow">A Message from the Principal</span>
              <h2 id="principal-heading" className="spn-h2" style={{ marginBottom: "1.5rem" }}>
                Welcome to Sunshine Public School
              </h2>
              <div className="spn-divider" style={{ marginBottom: "2rem" }} />
              <p style={{ fontSize: "1.05rem", color: "var(--color-text)", lineHeight: 1.9, marginBottom: "1.25rem", fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                "Education, in its truest form, is not the filling of a vessel but the lighting
                of a flame. At Sunshine Public School, we have spent over two decades building
                an environment where every child is seen, heard, and empowered."
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "1.25rem" }}>
                Our curriculum is designed to challenge young minds while nurturing their
                individual strengths. We believe in the dignity of every learner and the
                responsibility of every teacher to model curiosity, integrity, and compassion.
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", lineHeight: 1.85, marginBottom: "2.5rem" }}>
                I invite you to experience our campus, meet our faculty, and discover why
                thousands of families in Gurugram have trusted us with their children's most
                formative years.
              </p>
              <div className="spn-signature">Dr. Meenakshi Sundaram</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                Principal, Sunshine Public School
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
          <div style={{ maxWidth: 560, marginBottom: "4rem" }}>
            <span className="spn-eyebrow">Why Sunshine</span>
            <h2 id="why-heading" className="spn-h2">Four Pillars of an Exceptional Education</h2>
          </div>
        </div>

        <div className="spn-pillars">
          {[
            {
              num: "01",
              title: "Academic Excellence",
              desc: "A rigorous CBSE curriculum delivered by subject matter experts, supported by structured assessments, personalised mentoring, and a consistent record of outstanding board results.",
              img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=700&q=80&auto=format&fit=crop",
              imgAlt: "Students in a classroom",
              imgLeft: true,
            },
            {
              num: "02",
              title: "Character Building",
              desc: "Ethics, empathy, and leadership are woven into everyday school life — from morning assemblies to community service programmes and student-led councils.",
              img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80&auto=format&fit=crop",
              imgAlt: "Morning assembly",
              imgLeft: false,
            },
            {
              num: "03",
              title: "Holistic Development",
              desc: "Sports, performing arts, music, visual arts, and STEM clubs run alongside academics — because a well-rounded student is a prepared student.",
              img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=700&q=80&auto=format&fit=crop",
              imgAlt: "Students in sports",
              imgLeft: true,
            },
            {
              num: "04",
              title: "Experienced Faculty",
              desc: "Our teachers are postgraduates and Ph.D. holders in their disciplines, committed to continuous professional development and student-centred pedagogy.",
              img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=700&q=80&auto=format&fit=crop",
              imgAlt: "Faculty member",
              imgLeft: false,
            },
          ].map(({ num, title, desc, img, imgAlt, imgLeft }) => (
            <div key={num} className="spn-pillar">
              {imgLeft ? (
                <>
                  <div style={{ overflow: "hidden" }}>
                    <img src={img} alt={imgAlt} className="spn-pillar-img" loading="lazy" />
                  </div>
                  <div className="spn-pillar-body">
                    <div className="spn-pillar-num">{num}</div>
                    <h3 className="spn-h3" style={{ marginBottom: "1rem" }}>{title}</h3>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.85, fontSize: "0.95rem" }}>{desc}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="spn-pillar-body">
                    <div className="spn-pillar-num">{num}</div>
                    <h3 className="spn-h3" style={{ marginBottom: "1rem" }}>{title}</h3>
                    <p style={{ color: "var(--color-text-muted)", lineHeight: 1.85, fontSize: "0.95rem" }}>{desc}</p>
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <img src={img} alt={imgAlt} className="spn-pillar-img" loading="lazy" />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          § 4 — ABOUT THE SCHOOL
          ════════════════════════════════════════════════════════════════════ */}
      <section id="about" aria-labelledby="about-heading">
        <div className="spn-about-grid">
          <div className="spn-about-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80&auto=format&fit=crop"
              alt="Sunshine Public School campus"
              loading="lazy"
            />
          </div>
          <div className="spn-about-copy">
            <span className="spn-eyebrow">Our Story</span>
            <h2 id="about-heading" className="spn-h2" style={{ marginBottom: "1.5rem" }}>
              A Legacy of Learning Since 1998
            </h2>
            <div className="spn-divider" style={{ marginBottom: "2rem" }} />
            <p style={{ color: "var(--color-text)", lineHeight: 1.9, marginBottom: "1.25rem" }}>
              Founded in 1998, Sunshine Public School began with a single vision: to create an
              institution where rigorous scholarship and genuine human development co-exist.
              What started with 180 students and 12 teachers has grown into one of Gurugram's
              most respected educational institutions, serving over 2,400 students today.
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
                For over 25 years, our students have excelled in board examinations, national
                competitions, university placements, and sports championships. These numbers
                reflect the dedication of our students, families, and faculty.
              </p>
            </div>
            <div className="spn-stats-grid" style={{ border: "1px solid rgba(213,195,161,0.2)" }}>
              {[
                { value: "25+", label: "Years of Excellence" },
                { value: "2,400+", label: "Students Enrolled" },
                { value: "100%", label: "CBSE Pass Rate" },
                { value: "180+", label: "Faculty Members" },
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
          § 9 — TESTIMONIALS
          ════════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="spn-section-white" aria-labelledby="testimonials-heading">
        <div className="container">
          <div style={{ maxWidth: 480, marginBottom: "3.5rem" }}>
            <span className="spn-eyebrow">What Our Community Says</span>
            <h2 id="testimonials-heading" className="spn-h2">Words from Parents & Alumni</h2>
          </div>
          <div className="spn-testimonial-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="spn-testimonial">
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", lineHeight: 1, color: "var(--color-sand)", marginBottom: "-0.5rem" }}>"</div>
                <p className="spn-testimonial-quote">{t.quote}</p>
                <div className="spn-testimonial-author">
                  <img src={t.portrait} alt={t.name} className="spn-testimonial-portrait" loading="lazy" />
                  <div>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.9rem", color: "var(--color-brown)" }}>{t.name}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
                <div style={{ overflow: "hidden" }}>
                  <img src={item.img} alt={item.title} className="spn-news-img" loading="lazy" />
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

          {/* Live Notice Board */}
          <div style={{ marginTop: "5rem" }}>
            <div style={{ marginBottom: "2rem" }}>
              <span className="spn-eyebrow">Live Announcements</span>
              <h2 id="notices-heading" className="spn-h3">School Notice Board</h2>
            </div>
            <InteractiveNoticeBoard />
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
                Can't find your answer? Contact our admissions office directly — we're happy to help.
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
          <h2 id="contact-heading" className="spn-h2">We'd Love to Hear from You</h2>
        </div>

        <div className="container">
          <div className="spn-contact-grid">
            {/* Map / Campus Image */}
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=80&auto=format&fit=crop"
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
                    { Icon: MapPin, text: "Sector 45, Gurugram, Haryana 122003" },
                    { Icon: Mail, text: "admissions@sunshineps.edu.in", href: "mailto:admissions@sunshineps.edu.in" },
                    { Icon: PhoneCall, text: "+91 11 4567 8900", href: "tel:+911145678900" },
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ width: 36, height: 36, background: "var(--color-beige)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-brown)", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 600, flexShrink: 0 }}>S</span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--color-beige)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Sunshine Public School</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", fontWeight: 500, color: "var(--color-sand)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Gurugram, Haryana</div>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "rgba(242,232,216,0.55)", lineHeight: 1.8, marginBottom: "1.5rem", maxWidth: "280px" }}>
                Nurturing curious minds and building confident futures since 1998.
                CBSE Affiliated · Affiliation No. 1234567
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { Icon: MapPin, text: "Sector 45, Gurugram, Haryana 122003" },
                  { Icon: Mail, text: "info@sunshineps.edu.in", href: "mailto:info@sunshineps.edu.in" },
                  { Icon: PhoneCall, text: "+91 11 4567 8900", href: "tel:+911145678900" },
                ].map(({ Icon, text, href }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "rgba(242,232,216,0.55)" }}>
                    <Icon size={13} style={{ color: "var(--color-sand)", flexShrink: 0 }} />
                    {href ? <a href={href} style={{ color: "inherit" }}>{text}</a> : <span>{text}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4>Explore</h4>
              <a href="#principal">Principal's Message</a>
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
              <a href="#news">News & Events</a>
              <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(213,195,161,0.15)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-sand)", marginBottom: "0.5rem" }}>CBSE</div>
                <p style={{ fontSize: "0.8rem", color: "rgba(242,232,216,0.45)", lineHeight: 1.7 }}>
                  Affiliation No. 1234567<br />
                  School Code: 54321<br />
                  Mon–Sat · 8:00 AM – 3:30 PM
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="spn-footer-copy">
            <span>© 2026 Sunshine Public School. All rights reserved.</span>
            <span>Sector 45, Gurugram, Haryana 122003</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
