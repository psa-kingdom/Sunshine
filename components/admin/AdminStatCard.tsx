import React from "react";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  valueColor?: string;
  icon?: React.ReactNode;
}

export default function AdminStatCard({
  label,
  value,
  subtext,
  valueColor,
  icon,
}: AdminStatCardProps) {
  return (
    <div
      className="adminContentCard"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        cursor: "default",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        <div
          style={{
            fontSize: "0.7rem",
            textTransform: "uppercase",
            color: "var(--gold-400)",
            fontWeight: 700,
            fontFamily: "var(--font-body)",
            letterSpacing: "0.07em",
          }}
        >
          {label}
        </div>
        {icon && (
          <div style={{ color: "var(--admin-text-faint)", flexShrink: 0 }}>
            {icon}
          </div>
        )}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2.1rem",
          color: valueColor || "var(--admin-text)",
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.01em",
        }}
      >
        {value}
      </div>
      {subtext && (
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--admin-text-faint)",
            fontWeight: 500,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
