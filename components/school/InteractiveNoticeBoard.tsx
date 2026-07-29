"use client";

import React, { useEffect, useState } from "react";
import { Pin, Calendar, BookOpen, Trophy, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoticeItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  targetAudience: string;
  isPinned: boolean;
  attachmentUrl?: string;
  createdAt: string;
}

export default function InteractiveNoticeBoard() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/notices")
      .then((res) => res.json())
      .then((data) => {
        setNotices(data.notices || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch notices", err);
        setLoading(false);
      });
  }, []);

  const filteredNotices = notices.filter((item) => {
    if (filter === "all") return true;
    return item.category.toLowerCase() === filter.toLowerCase();
  });

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "academic":
        return "bg-amber-50 border-amber-200 text-amber-900";
      case "sports":
        return "bg-emerald-50 border-emerald-200 text-emerald-900";
      case "events":
        return "bg-sky-50 border-sky-200 text-sky-900";
      default:
        return "bg-slate-50 border-slate-200 text-slate-900";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "academic":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "sports":
        return <Trophy className="w-3.5 h-3.5" />;
      case "events":
        return <Calendar className="w-3.5 h-3.5" />;
      default:
        return <Info className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="w-full">
      {/* Notice Board Header Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {["all", "academic", "sports", "events"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all duration-200",
                filter === cat
                  ? "bg-slate-900 text-amber-300 shadow-md scale-105"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl border border-slate-200" />
          ))}
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="text-center py-12 bg-white/60 rounded-3xl border border-indigo-50 p-8 shadow-sm max-w-md mx-auto">
          <p className="text-slate-500 font-medium">No active notices found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice._id}
              className={cn(
                "p-6 border-2 flex flex-col justify-between min-h-[220px] rounded-3xl",
                getCategoryColor(notice.category)
              )}
            >
              <div>
                {/* Pin Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 opacity-75">
                    {getCategoryIcon(notice.category)}
                    {notice.category}
                  </span>
                  {notice.isPinned && (
                    <span className="bg-slate-900 text-white p-1 rounded-full shadow-sm" title="Pinned Announcement">
                      <Pin className="w-3 h-3 rotate-45" />
                    </span>
                  )}
                </div>

                <h3 className="font-display font-extrabold text-base leading-tight mb-2 text-slate-900">
                  {notice.title}
                </h3>
                <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-4">
                  {notice.content}
                </p>
                {notice.attachmentUrl && (
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-[11px] font-bold text-amber-700 hover:underline"
                  >
                    📎 Attachment Document →
                  </a>
                )}
              </div>

              {/* Notice Footer Card Info */}
              <div className="pt-4 border-t border-slate-900/10 flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-slate-500">
                  {new Date(notice.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/80 px-2.5 py-1 rounded-full text-slate-600 shadow-sm border border-slate-100">
                  {notice.targetAudience === "all" ? "Public" : notice.targetAudience}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
