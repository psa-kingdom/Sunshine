"use client";

import React, { useState } from "react";
import Link from "next/link";

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
          website: honeypot,
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
    <main className="min-h-screen flex flex-col bg-[var(--cream-50,#faf8f5)]">
      {/* Header Bar */}
      <header className="bg-[var(--navy-900,#07192f)] border-b border-[var(--border-subtle,rgba(217,155,38,0.22))] text-white py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-9 h-9 rounded bg-[var(--gold-500,#d99b26)] text-[var(--navy-900,#07192f)] font-bold text-lg flex items-center justify-center font-serif">
              S
            </span>
            <div>
              <strong className="block text-base tracking-wide font-serif text-white group-hover:text-[var(--gold-300,#f5cf7b)] transition-colors">
                SUNSHINE PUBLIC SCHOOL
              </strong>
              <small className="block text-[10px] uppercase tracking-widest text-[var(--gold-400,#e5ad3c)] font-semibold">
                Admission Enquiry 2026–27
              </small>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-[var(--gold-300,#f5cf7b)] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-12 px-4 md:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-[var(--gold-500,#d99b26)] mb-2">
            Admissions Open 2026–27
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--navy-900,#07192f)] font-bold">
            Admission Enquiry Form
          </h1>
          <p className="mt-2 text-gray-600 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Please complete the enquiry form below. Our admissions team will review your submission and contact you within 1–2 working days with details and campus tour schedules.
          </p>
        </div>

        <div className="bg-white border border-[var(--border-subtle,rgba(217,155,38,0.22))] rounded-xl p-6 md:p-10 shadow-lg">
          {successMsg && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-medium">
              ✓ {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-300 text-red-800 text-sm font-medium">
              ⚠ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field (hidden from real users, off-screen to avoid autofill) */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="parentName"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--navy-900,#07192f)] mb-2"
                >
                  Parent / Guardian Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="parentName"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[var(--gold-500,#d99b26)] focus:ring-2 focus:ring-[var(--gold-500,#d99b26)]/20 text-gray-900 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--navy-900,#07192f)] mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rajesh.kumar@example.com"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[var(--gold-500,#d99b26)] focus:ring-2 focus:ring-[var(--gold-500,#d99b26)]/20 text-gray-900 outline-none text-sm transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--navy-900,#07192f)] mb-2"
                >
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[var(--gold-500,#d99b26)] focus:ring-2 focus:ring-[var(--gold-500,#d99b26)]/20 text-gray-900 outline-none text-sm transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="gradeApplyingFor"
                  className="block text-xs font-bold uppercase tracking-wider text-[var(--navy-900,#07192f)] mb-2"
                >
                  Grade Applying For <span className="text-red-500">*</span>
                </label>
                <select
                  id="gradeApplyingFor"
                  required
                  value={gradeApplyingFor}
                  onChange={(e) => setGradeApplyingFor(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[var(--gold-500,#d99b26)] focus:ring-2 focus:ring-[var(--gold-500,#d99b26)]/20 text-gray-900 outline-none text-sm transition-all bg-white"
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
                className="block text-xs font-bold uppercase tracking-wider text-[var(--navy-900,#07192f)] mb-2"
              >
                Additional Message / Specific Questions (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specify any questions regarding curriculum, transportation, hostel facilities, or previous school records..."
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-[var(--gold-500,#d99b26)] focus:ring-2 focus:ring-[var(--gold-500,#d99b26)]/20 text-gray-900 outline-none text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-md bg-[var(--gold-500,#d99b26)] hover:bg-[var(--gold-400,#e5ad3c)] text-[var(--navy-900,#07192f)] font-bold text-sm uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
            >
              {loading ? "Submitting Enquiry..." : "Submit Admission Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
