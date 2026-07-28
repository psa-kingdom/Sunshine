import React from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  valueColor?: string;
}

export default function AdminStatCard({
  label,
  value,
  subtext,
  valueColor = "#ffffff",
}: AdminStatCardProps) {
  return (
    <div className="adminContentCard" style={{ padding: "1.25rem" }}>
      <div
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          color: "var(--gold-400)",
          fontWeight: 600,
          fontFamily: "var(--font-heading)",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          color: valueColor,
          fontWeight: 700,
          margin: "0.25rem 0",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>
          {subtext}
        </div>
      )}
    </div>
  );
}
