"use client";

import React from "react";
import { Trash2, Download, RefreshCw, FileSpreadsheet } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataToolbarProps {
  selectedCount: number;
  onDeleteSelected?: () => void;
  onExportCSV: () => void;
  className?: string;
}

export default function DataToolbar({
  selectedCount,
  onDeleteSelected,
  onExportCSV,
  className,
}: DataToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 p-2.5 bg-[var(--navy-900)] border border-[var(--border-subtle)] rounded-lg shadow-md flex-wrap",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/70">
          Selected: <strong className="text-[var(--gold-400)]">{selectedCount}</strong> items
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Real Delete Action */}
        <button
          type="button"
          onClick={onDeleteSelected}
          disabled={selectedCount === 0}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-all cursor-pointer",
            selectedCount > 0
              ? "bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30"
              : "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
          )}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>

        {/* Real CSV Export */}
        <button
          type="button"
          onClick={onExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-[var(--navy-800)] text-[var(--gold-300)] border border-[var(--border-subtle)] hover:border-[var(--gold-400)] transition-all cursor-pointer"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {/* Disabled Bulk Download with "Coming Soon" */}
        <div className="relative group">
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white/5 text-white/40 border border-white/10 cursor-not-allowed opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Bulk Download</span>
            <span className="ml-1 text-[9px] px-1 py-0.2 bg-[var(--gold-500)] text-[var(--navy-900)] font-extrabold rounded uppercase">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Disabled Bulk Update with "Coming Soon" */}
        <div className="relative group">
          <button
            type="button"
            disabled
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-white/5 text-white/40 border border-white/10 cursor-not-allowed opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Bulk Update</span>
            <span className="ml-1 text-[9px] px-1 py-0.2 bg-[var(--gold-500)] text-[var(--navy-900)] font-extrabold rounded uppercase">
              Coming Soon
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
