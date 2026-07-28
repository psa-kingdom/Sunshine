import React from "react";

interface AdminSkeletonProps {
  rows?: number;
  message?: string;
}

export default function AdminSkeleton({
  rows = 4,
  message = "Loading data...",
}: AdminSkeletonProps) {
  return (
    <div style={{ padding: "1.5rem 0" }}>
      <div style={{ textAlign: "center", marginBottom: "1.5rem", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem" }}>
        {message}
      </div>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            style={{
              height: "2.75rem",
              background: "linear-gradient(90deg, var(--navy-800) 25%, var(--navy-700) 50%, var(--navy-800) 75%)",
              backgroundSize: "200% 100%",
              animation: "skeleton-loading 1.5s infinite",
              borderRadius: "var(--radius-sm)",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
