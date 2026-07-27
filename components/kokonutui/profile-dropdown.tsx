"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, Shield, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileDropdownProps {
  userName?: string;
  userEmail?: string;
  userRole?: string;
  className?: string;
}

export default function ProfileDropdown({
  userName = "User",
  userEmail = "user@sunshineps.edu.in",
  userRole = "Admin",
  className,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[var(--navy-800)] border border-[var(--border-subtle)] hover:border-[var(--gold-400)] transition-all cursor-pointer text-white text-xs"
      >
        <div className="w-6 h-6 rounded-full bg-[var(--navy-900)] border border-[var(--gold-400)] flex items-center justify-center text-[var(--gold-400)] font-bold text-xs">
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </div>
        <span className="font-medium hidden sm:inline max-w-[120px] truncate">{userName}</span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-[var(--gold-400)] transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-64 rounded-md bg-[var(--navy-900)] border border-[var(--gold-500)] shadow-2xl z-50 overflow-hidden"
          >
            {/* Header info */}
            <div className="p-3 border-b border-[var(--border-subtle)] bg-[var(--navy-800)]">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold text-xs truncate max-w-[140px]">{userName}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider text-[var(--navy-900)] bg-[var(--gold-400)] rounded text-uppercase">
                  {userRole}
                </span>
              </div>
              <p className="text-[11px] text-white/60 truncate mt-0.5">{userEmail}</p>
            </div>

            {/* Action Items */}
            <div className="p-1">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-white/80 rounded hover:bg-white/5">
                <Shield className="w-3.5 h-3.5 text-[var(--gold-400)]" />
                <span>Verified Account Role</span>
              </div>

              <div className="h-[1px] bg-[var(--border-subtle)] my-1" />

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[var(--gold-300)] font-semibold rounded hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
