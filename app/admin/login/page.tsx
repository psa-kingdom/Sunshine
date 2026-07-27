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
        setError("Invalid email address or password. Please try again.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("An unexpected authentication error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="adminLoginWrapper">
      <div className="adminCard">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div className="adminCrest" style={{ margin: "0 auto 0.75rem auto", width: "2.75rem", height: "2.75rem", fontSize: "1.25rem" }}>
            S
          </div>
          <h1 className="adminHeading">Admin Portal</h1>
          <p className="adminSubheading">
            Sunshine Public School Management
          </p>
        </div>

        {error && (
          <div className="adminError" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="adminFormGroup">
            <label htmlFor="admin-email" className="adminLabel">
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sunshineps.edu.in"
              className="adminInput"
            />
          </div>

          <div className="adminFormGroup">
            <label htmlFor="admin-password" className="adminLabel">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="adminInput"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="adminSubmitButton"
          >
            {loading ? "Signing in..." : "Sign In to Admin Portal"}
          </button>
        </form>
      </div>
    </main>
  );
}
