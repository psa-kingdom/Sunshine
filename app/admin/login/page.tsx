"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#051325] text-white">
      <div className="w-full max-w-md bg-[#07192f] border border-[#d99b26]/30 rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d99b26] text-[#051325] font-bold text-xl mb-3">
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-wide text-white">
            Admin Portal
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sunshine Public School Management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-900/40 border border-red-500/50 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sunshineps.edu.in"
              className="w-full px-4 py-3 rounded-lg bg-[#051325] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d99b26] transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider text-gray-300 font-medium mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#051325] border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#d99b26] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-[#d99b26] hover:bg-[#e5ad3e] text-[#051325] font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>
        </form>
      </div>
    </main>
  );
}
