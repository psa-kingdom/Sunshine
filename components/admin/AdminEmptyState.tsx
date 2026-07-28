import React from "react";
import { FolderOpen } from "lucide-react";

interface AdminEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
}

export default function AdminEmptyState({
  message = "No records found.",
  icon,
}: AdminEmptyStateProps) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 1.5rem",
        color: "rgba(255,255,255,0.5)",
        border: "1px dashed var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        background: "rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
      }}
    >
      {icon || <FolderOpen style={{ width: "2rem", height: "2rem", color: "var(--gold-400)", opacity: 0.6 }} />}
      <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>{message}</span>
    </div>
  );
}
