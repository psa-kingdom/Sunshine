import React from "react";

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
}

export default function AdminTable<T>({
  columns,
  data,
  keyExtractor,
}: AdminTableProps<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              textAlign: "left",
              color: "var(--gold-400)",
              textTransform: "uppercase",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              fontFamily: "var(--font-heading)",
            }}
          >
            {columns.map((col, idx) => (
              <th
                key={idx}
                style={{
                  padding: "0.75rem 1rem",
                  textAlign: col.align || "left",
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                transition: "background 0.15s",
              }}
            >
              {columns.map((col, idx) => {
                let content: React.ReactNode = null;
                if (col.cell) {
                  content = col.cell(row);
                } else if (col.accessor) {
                  if (typeof col.accessor === "function") {
                    content = col.accessor(row);
                  } else {
                    content = row[col.accessor] as React.ReactNode;
                  }
                }

                return (
                  <td
                    key={idx}
                    style={{
                      padding: "0.875rem 1rem",
                      textAlign: col.align || "left",
                    }}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
