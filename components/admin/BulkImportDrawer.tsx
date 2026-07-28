"use client";

import React, { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, X, Trash2 } from "lucide-react";
import AdminModal from "./AdminModal";

export interface FieldMapping {
  key: string;
  label: string;
  required?: boolean;
  example?: string;
}

interface BulkImportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FieldMapping[];
  templateHeaders: string[];
  templateSampleRow: string[];
  templateFilename: string;
  onImport: (rows: Record<string, string>[]) => Promise<{ success: boolean; count?: number; error?: string }>;
  onSuccess: () => void;
}

export default function BulkImportDrawer({
  isOpen,
  onClose,
  title,
  fields,
  templateHeaders,
  templateSampleRow,
  templateFilename,
  onImport,
  onSuccess,
}: BulkImportDrawerProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ row: number; msg: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedRows([]);
    setValidationErrors([]);
    setResultMsg(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      [templateHeaders.join(","), templateSampleRow.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", templateFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV file content natively
  const parseCSV = (text: string) => {
    const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      setResultMsg({ type: "error", text: "File is empty or contains no data rows." });
      return;
    }

    const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
    const rows: Record<string, string>[] = [];
    const errors: { row: number; msg: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV row parsing handling quotes
      const rowValues = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(v => v.trim().replace(/^["']|["']$/g, ""));
      const rowData: Record<string, string> = {};

      fields.forEach((field) => {
        // Try matching header name (case-insensitive)
        const headerIdx = headers.findIndex(h => h.toLowerCase() === field.label.toLowerCase() || h.toLowerCase() === field.key.toLowerCase());
        const val = headerIdx !== -1 && rowValues[headerIdx] ? rowValues[headerIdx] : "";
        rowData[field.key] = val;
      });

      // Validation
      const missingRequired = fields.filter(f => f.required && !rowData[f.key]);
      if (missingRequired.length > 0) {
        errors.push({
          row: i + 1,
          msg: `Missing required field(s): ${missingRequired.map(f => f.label).join(", ")}`,
        });
      }

      rows.push(rowData);
    }

    setParsedRows(rows);
    setValidationErrors(errors);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setResultMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) parseCSV(content);
    };
    reader.readAsText(selectedFile);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setUploading(true);
    setResultMsg(null);

    try {
      const res = await onImport(parsedRows);
      if (res.success) {
        setResultMsg({ type: "success", text: `Successfully imported ${res.count || parsedRows.length} records!` });
        setTimeout(() => {
          onSuccess();
          handleClose();
        }, 1500);
      } else {
        setResultMsg({ type: "error", text: res.error || "Failed to import records." });
      }
    } catch {
      setResultMsg({ type: "error", text: "Network error during import." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminModal isOpen={isOpen} onClose={handleClose} title={title} maxWidth="680px">
      <div style={{ display: "grid", gap: "1.25rem" }}>
        {/* Template info bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--navy-900)", padding: "0.85rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FileSpreadsheet style={{ width: "1.25rem", height: "1.25rem", color: "var(--gold-400)" }} />
            <div>
              <div style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 600 }}>Download CSV Template</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>Pre-formatted headers for easy bulk upload</div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.4rem 0.8rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-subtle)",
              color: "var(--gold-400)",
              borderRadius: "var(--radius-sm)",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            <Download style={{ width: "0.85rem", height: "0.85rem" }} />
            Download .CSV
          </button>
        </div>

        {/* Upload Zone */}
        {!file ? (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2.5rem 1.5rem",
              border: "2px dashed var(--border-subtle)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(0,0,0,0.15)",
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold-400)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          >
            <Upload style={{ width: "2rem", height: "2rem", color: "var(--gold-400)", marginBottom: "0.5rem" }} />
            <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.9rem" }}>Click to select CSV file</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", marginTop: "0.25rem" }}>Supports UTF-8 CSV / Excel exports</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--navy-900)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", marginBottom: "1rem" }}>
              <span style={{ color: "#fff", fontWeight: 600, fontSize: "0.85rem" }}>📄 {file.name} ({parsedRows.length} rows)</span>
              <button type="button" onClick={resetState} style={{ background: "transparent", border: "none", color: "#fca5a5", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem" }}>
                <Trash2 style={{ width: "0.85rem", height: "0.85rem" }} /> Remove
              </button>
            </div>

            {/* Validation warning banner */}
            {validationErrors.length > 0 && (
              <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "#fca5a5", fontSize: "0.8rem", marginBottom: "1rem" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>⚠️ Validation Warnings ({validationErrors.length} rows have missing fields)</div>
                {validationErrors.slice(0, 3).map((err, idx) => (
                  <div key={idx}>Row {err.row}: {err.msg}</div>
                ))}
                {validationErrors.length > 3 && <div>+ {validationErrors.length - 3} more rows</div>}
              </div>
            )}

            {/* Preview table */}
            <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.75rem" }}>
                <thead>
                  <tr style={{ background: "var(--navy-900)", color: "var(--gold-400)", textAlign: "left" }}>
                    {fields.map(f => (
                      <th key={f.key} style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border-subtle)" }}>{f.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 5).map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#fff" }}>
                      {fields.map(f => (
                        <td key={f.key} style={{ padding: "0.5rem 0.75rem" }}>{row[f.key] || "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 5 && (
              <div style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.5)", marginTop: "0.5rem" }}>
                Showing 5 of {parsedRows.length} rows preview
              </div>
            )}
          </div>
        )}

        {/* Feedback Message */}
        {resultMsg && (
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "var(--radius-md)",
              fontSize: "0.85rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: resultMsg.type === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
              border: `1px solid ${resultMsg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: resultMsg.type === "success" ? "#86efac" : "#fca5a5",
            }}
          >
            {resultMsg.type === "success" ? <CheckCircle style={{ width: "1rem", height: "1rem" }} /> : <AlertCircle style={{ width: "1rem", height: "1rem" }} />}
            {resultMsg.text}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            type="button"
            onClick={handleClose}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || parsedRows.length === 0 || uploading}
            onClick={handleConfirmImport}
            className="adminSubmitButton"
            style={{ width: "auto", opacity: (!file || parsedRows.length === 0 || uploading) ? 0.5 : 1 }}
          >
            {uploading ? "Importing Records..." : `Import ${parsedRows.length} Records`}
          </button>
        </div>
      </div>
    </AdminModal>
  );
}
