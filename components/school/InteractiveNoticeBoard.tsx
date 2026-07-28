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
  createdAt: string;
}

export default function InteractiveNoticeBoard() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/api/admin/notices");
        if (res.ok) {
          const data = await res.json();
          // Sort pinned first, then by date
          const sorted = (data.notices || []).sort((a: NoticeItem, b: NoticeItem) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setNotices(sorted);
        }
      } catch (err) {
        console.error("Failed to fetch notices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((n) => {
    if (filter === "all") return true;
    return n.category === filter;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "exam":
        return "sticky-pink border-rose-200 text-rose-800";
      case "academic":
        return "sticky-blue border-blue-200 text-blue-800";
      case "events":
        return "sticky-orange border-orange-200 text-orange-800";
      default:
        return "bg-slate-50 border-slate-200 text-slate-800";
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "exam":
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case "academic":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "events":
        return <Trophy className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="w-full">
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {["all", "general", "academic", "exam", "events"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={cn(
              "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full border transition-all cursor-pointer",
              filter === cat
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100 scale-105"
                : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">Retrieving announcements...</p>
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
                "sticky-note p-6 border-2 flex flex-col justify-between min-h-[220px]",
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
                    <span className="bg-indigo-600 text-white p-1 rounded-full shadow-sm animate-bounce" title="Pinned Announcement">
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
              </div>

              {/* Notice Footer Card Info */}
              <div className="pt-4 border-t border-slate-200/40 flex items-center justify-between mt-4">
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
