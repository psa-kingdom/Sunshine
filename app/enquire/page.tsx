"use client";

import React, { useState } from "react";
import Link from "next/link";

const Arrow = () => (
  <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
    →
  </span>
);

export default function EnquirePage() {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeApplyingFor, setGradeApplyingFor] = useState("Nursery");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName,
          email,
          phone,
          gradeApplyingFor,
          message,
          b_hp_2026: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit enquiry. Please try again.");
      } else {
        setSuccessMsg(data.message || "Thank you! Your enquiry has been received.");
        setParentName("");
        setEmail("");
        setPhone("");
        setGradeApplyingFor("Nursery");
        setMessage("");
      }
    } catch {
      setErrorMsg("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[var(--cream-50)] text-[var(--text-primary)]">
      {/* Utility Contact & Portal Bar */}
      <div className="utility">
        <div className="wrap utilityInner">
          <div className="utilityItem">
            <span>☎</span>
            <a href="tel:+911145678900">+91 11 4567 8900</a>
          </div>
          <div className="utilityItem">
            <span>✉</span>
            <a href="mailto:info@sunshineps.edu.in">info@sunshineps.edu.in</a>
          </div>
          <div className="utilityItem">
            <span>⌖</span>
            <span>Sector 45, Gurugram, Haryana</span>
          </div>
          <nav aria-label="Portal links">
            <Link href="/#portal">Alumni</Link>
            <Link href="/#portal">Parent Portal</Link>
            <Link href="/#portal">Student Login</Link>
          </nav>
        </div>
      </div>

      {/* Main Header & Brand Bar */}
      <header>
        <div className="wrap brandRow">
          <Link className="brand" href="/" aria-label="Sunshine Public School home">
            <span className="crest" aria-hidden="true">S</span>
            <div className="brandText">
              <strong>SUNSHINE PUBLIC SCHOOL</strong>
              <small>Learning <b>•</b> Leadership <b>•</b> Character</small>
            </div>
          </Link>
          <Link className="admissionTop" href="/enquire">
            ADMISSIONS OPEN 2026–27
          </Link>
        </div>
        <nav id="navigation" className="mainNav" aria-label="Main navigation">
          <div className="wrap">
            <Link href="/">Home</Link>
            <Link href="/#about">About Us</Link>
            <Link href="/#academics">Academics</Link>
            <Link href="/#admissions">Admissions</Link>
            <Link className="active" href="/enquire">Enquire Now</Link>
            <Link href="/#life">Student Life</Link>
            <Link href="/#achievements">Achievements</Link>
            <Link href="/#contact">Contact</Link>
          </div>
        </nav>
      </header>

      {/* Main Form Content */}
      <div className="flex-1 py-12 px-4 md:px-8">
        <div className="wrap" style={{ maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div className="badgePill" style={{ display: "inline-flex", marginBottom: "1rem" }}>
              <span className="badgeDot"></span>
              ADMISSIONS 2026–27 • ONLINE ENQUIRY
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", color: "var(--navy-900)", marginBottom: "0.75rem" }}>
              Admission Enquiry Form
            </h1>
            <p className="lede" style={{ fontSize: "var(--text-base)", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
              Please complete the enquiry details below. Our admissions coordinators will reach out within 24 hours to guide you through seat availability, eligibility, and campus visits.
            </p>
          </div>

          <div
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-md)",
              padding: "clamp(1.5rem, 4vw, 2.5rem)",
            }}
          >
            {successMsg && (
              <div
                style={{
                  background: "var(--gold-100)",
                  border: "1px solid var(--gold-400)",
                  color: "var(--navy-900)",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1.5rem",
                  fontWeight: 500,
                  fontSize: "var(--text-sm)",
                }}
              >
                ✓ {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "1.5rem",
                  fontWeight: 500,
                  fontSize: "var(--text-sm)",
                }}
              >
                ⚠ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem" }}>
              {/* Honeypot field (hidden from users, off-screen to avoid autofill) */}
              <div style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, pointerEvents: "none" }} aria-hidden="true">
                <input
                  type="text"
                  name="b_hp_2026"
                  tabIndex={-1}
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label
                    htmlFor="parentName"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--navy-900)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Parent / Guardian Name <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-primary)",
                      background: "var(--cream-50)",
                      border: "1px solid rgba(7, 25, 47, 0.2)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--navy-900)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Email Address <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh.kumar@example.com"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-primary)",
                      background: "var(--cream-50)",
                      border: "1px solid rgba(7, 25, 47, 0.2)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
                <div>
                  <label
                    htmlFor="phone"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--navy-900)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Contact Phone <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-primary)",
                      background: "var(--cream-50)",
                      border: "1px solid rgba(7, 25, 47, 0.2)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="gradeApplyingFor"
                    style={{
                      display: "block",
                      fontFamily: "var(--font-heading)",
                      fontSize: "var(--text-xs)",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--navy-900)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Grade Applying For <span style={{ color: "#dc2626" }}>*</span>
                  </label>
                  <select
                    id="gradeApplyingFor"
                    required
                    value={gradeApplyingFor}
                    onChange={(e) => setGradeApplyingFor(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      color: "var(--text-primary)",
                      background: "var(--cream-50)",
                      border: "1px solid rgba(7, 25, 47, 0.2)",
                      borderRadius: "var(--radius-sm)",
                      outline: "none",
                    }}
                  >
                    <option value="Nursery">Nursery (Age 3+)</option>
                    <option value="KG">KG (Age 4+)</option>
                    <option value="Grade I">Grade I</option>
                    <option value="Grade II">Grade II</option>
                    <option value="Grade III">Grade III</option>
                    <option value="Grade IV">Grade IV</option>
                    <option value="Grade V">Grade V</option>
                    <option value="Grade VI">Grade VI</option>
                    <option value="Grade VII">Grade VII</option>
                    <option value="Grade VIII">Grade VIII</option>
                    <option value="Grade IX">Grade IX</option>
                    <option value="Grade X">Grade X</option>
                    <option value="Grade XI">Grade XI</option>
                    <option value="Grade XII">Grade XII</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: "block",
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--navy-900)",
                    marginBottom: "0.5rem",
                  }}
                >
                  Additional Questions or Remarks (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify any questions regarding curriculum, transportation, hostel facilities, or previous school records..."
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-sm)",
                    color: "var(--text-primary)",
                    background: "var(--cream-50)",
                    border: "1px solid rgba(7, 25, 47, 0.2)",
                    borderRadius: "var(--radius-sm)",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="goldButton group"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  <span>{loading ? "Submitting Enquiry..." : "Submit Admission Enquiry"}</span>
                  <Arrow />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Shared Footer */}
      <footer>
        <div className="wrap footerGrid">
          <div className="footerBrand">
            <span className="crest">S</span>
            <h3>SUNSHINE<br />PUBLIC SCHOOL</h3>
            <p>Learning • Leadership • Character</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/#about">About Us</Link>
            <Link href="/#academics">Academic Programs</Link>
            <Link href="/#life">Student Life</Link>
            <Link href="/#admissions">Admissions</Link>
            <Link href="/enquire">Online Enquiry</Link>
          </div>
          <div>
            <h4>Admissions</h4>
            <p>Sector 45, Gurugram<br />Haryana 122003</p>
            <p style={{ marginTop: "1rem" }}>
              Phone: +91 11 4567 8900<br />
              Email: admissions@sunshineps.edu.in
            </p>
          </div>
          <div>
            <h4>CBSE Affiliation</h4>
            <p>Affiliation No. 1234567<br />School Code: 54321</p>
            <p style={{ marginTop: "1rem" }}>
              Hours: Mon – Sat<br />
              8:00 AM – 3:30 PM
            </p>
          </div>
        </div>
        <div className="wrap copyright">
          <span>© 2026 Sunshine Public School. All rights reserved.</span>
          <span>CBSE Affiliated Institution</span>
        </div>
      </footer>
    </main>
  );
}
