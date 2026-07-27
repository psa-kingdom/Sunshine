"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, CheckCircle } from "lucide-react";

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnquiryDrawer({ isOpen, onClose }: EnquiryDrawerProps) {
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeApplyingFor, setGradeApplyingFor] = useState("Grade X");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // Honeypot field
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

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
          website,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setParentName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        setError(data.error || "Failed to submit enquiry. Please try again.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Smooth Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-[var(--navy-900)] text-white shadow-2xl border-l border-[var(--gold-500)] flex flex-col"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--navy-800)]">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold-400)]">
                    SUNSHINE PUBLIC SCHOOL
                  </div>
                  <h2 className="text-xl font-bold font-serif text-white mt-0.5">
                    Admission Enquiry
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {success ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Enquiry Received!</h3>
                    <p className="text-sm text-white/70 max-w-xs mx-auto">
                      Thank you for reaching out to Sunshine Public School. Our admissions coordinator will contact you shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="px-4 py-2 bg-[var(--gold-500)] text-[var(--navy-900)] font-bold text-xs rounded hover:bg-[var(--gold-400)] transition-colors cursor-pointer"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot hidden field */}
                    <input
                      type="text"
                      name="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {error && (
                      <div className="p-3 rounded bg-red-500/20 border border-red-500/50 text-red-300 text-xs">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-[var(--gold-300)] mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar"
                        className="w-full px-3 py-2 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded text-sm text-white focus:outline-none focus:border-[var(--gold-400)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--gold-300)] mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className="w-full px-3 py-2 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded text-sm text-white focus:outline-none focus:border-[var(--gold-400)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--gold-300)] mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded text-sm text-white focus:outline-none focus:border-[var(--gold-400)]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--gold-300)] mb-1">
                        Grade Applying For *
                      </label>
                      <select
                        value={gradeApplyingFor}
                        onChange={(e) => setGradeApplyingFor(e.target.value)}
                        className="w-full px-3 py-2 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded text-sm text-white focus:outline-none focus:border-[var(--gold-400)]"
                      >
                        <option value="Nursery" className="bg-[var(--navy-900)]">Nursery / Kindergarten</option>
                        <option value="Grade I-V" className="bg-[var(--navy-900)]">Grade I – V (Primary)</option>
                        <option value="Grade VI-VIII" className="bg-[var(--navy-900)]">Grade VI – VIII (Middle)</option>
                        <option value="Grade IX" className="bg-[var(--navy-900)]">Grade IX</option>
                        <option value="Grade X" className="bg-[var(--navy-900)]">Grade X</option>
                        <option value="Grade XI" className="bg-[var(--navy-900)]">Grade XI (Science / Commerce / Arts)</option>
                        <option value="Grade XII" className="bg-[var(--navy-900)]">Grade XII</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--gold-300)] mb-1">
                        Additional Questions or Message
                      </label>
                      <textarea
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Inquire about hostel, transport, or fee structure..."
                        className="w-full px-3 py-2 bg-[var(--navy-950)] border border-[var(--border-subtle)] rounded text-sm text-white focus:outline-none focus:border-[var(--gold-400)]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-4 bg-[var(--gold-500)] text-[var(--navy-900)] font-bold text-sm rounded hover:bg-[var(--gold-400)] transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? "Submitting Enquiry..." : "Submit Admission Enquiry"}</span>
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
