"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Sparkles, 
  MapPin, 
  Mail, 
  PhoneCall, 
  Clock
} from "lucide-react";
import MorphicNavbar from "@/components/kokonutui/morphic-navbar";

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
    <main className="min-h-screen relative bg-slate-50/50 flex flex-col">
      {/* Background Glowing Blobs */}
      <div className="bg-blobs" aria-hidden="true">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
      </div>

      {/* Floating 2030 Glass Navbar */}
      <MorphicNavbar
        items={[
          { id: "home", name: "Home", href: "/" },
          { id: "about", name: "About Us", href: "/#about" },
          { id: "academics", name: "Academics", href: "/#academics" },
          { id: "notices", name: "Announcements", href: "/#notices" },
          { id: "faculty", name: "Faculty", href: "/#faculty" },
          { id: "admissions", name: "Enquire Now", isAction: true },
          { id: "contact", name: "Contact", href: "#contact" },
        ]}
      />

      {/* Main Form Content */}
      <div className="flex-1 pt-36 pb-20 px-4 md:px-8">
        <div className="wrap max-w-[800px] space-y-8">
          <div className="text-center space-y-3">
            <div className="badge-pill-colorful">
              <span className="badge-dot-animated"></span>
              ADMISSIONS 2026–27 • ONLINE ENQUIRY
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
              Admission Enquiry Form
            </h1>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              Complete the enquiry details below. Our admissions coordinators will reach out within 24 hours to guide you through seat availability, eligibility, and campus visits.
            </p>
          </div>

          <div className="bg-white/80 border-2 border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden backdrop-blur-xl">
            {successMsg && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-2xl mb-6 shadow-sm">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold rounded-2xl mb-6">
                ⚠ {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field (hidden from users, off-screen to avoid autofill) */}
              <div className="opacity-0 absolute top-0 left-0 h-0 w-0 z-[-1] pointer-events-none" aria-hidden="true">
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
                  <label htmlFor="parentName" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Parent / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="parentName"
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rajesh.kumar@example.com"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Contact Phone <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="gradeApplyingFor" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                    Grade Applying For <span className="text-rose-500">*</span>
                  </label>
                  <select
                    id="gradeApplyingFor"
                    required
                    value={gradeApplyingFor}
                    onChange={(e) => setGradeApplyingFor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
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
                <label htmlFor="message" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Additional Questions or Remarks (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Specify any questions regarding curriculum, transportation, hostel facilities, or previous school records..."
                  className="w-full px-4 py-2.5 bg-white border-2 border-slate-200 focus:border-indigo-400 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-clay btn-clay-primary w-full py-4 text-sm uppercase tracking-wider font-extrabold"
                >
                  <span>{loading ? "Submitting Enquiry..." : "Submit Admission Enquiry"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Shared Futuristic Footer */}
      <footer id="contact" className="footer-futuristic border-t border-indigo-50">
        <div className="wrap footerGrid">
          <div className="footerBrand space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="logo-icon">S</span>
              <h3 className="font-display font-extrabold text-slate-800 tracking-wider">SUNSHINE PUBLIC SCHOOL</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Learning • Leadership • Character
            </p>
            <div className="text-xs text-slate-500 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                <span>Sector 45, Gurugram, Haryana 122003</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <a href="mailto:info@sunshineps.edu.in" className="hover:text-indigo-600">info@sunshineps.edu.in</a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
                <a href="tel:+911145678900" className="hover:text-indigo-600">+91 11 4567 8900</a>
              </div>
            </div>
          </div>

          <div>
            <h4>Explore</h4>
            <Link href="/#home">Home</Link>
            <Link href="/#about">About Leadership</Link>
            <Link href="/#academics">Learning Bento</Link>
            <Link href="/#notices">Notice Dispatch</Link>
            <Link href="/login">Portal Login</Link>
          </div>

          <div>
            <h4>Admissions</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
              Our campus doors are open for parent evaluations Monday through Saturday.
            </p>
            <Link href="/enquire" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
              Submit Enquiry Now →
            </Link>
          </div>

          <div>
            <h4>CBSE Affiliation</h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Affiliation No. 1234567<br />
              School Code: 54321
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-500">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>8:00 AM – 3:30 PM</span>
            </div>
          </div>
        </div>

        <div className="wrap copyright text-xs font-medium text-slate-400">
          <span>© 2026 Sunshine Public School. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Built for the Future
          </span>
        </div>
      </footer>
    </main>
  );
}
