"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "./event-card";
import { EventEditDialog } from "./event-edit-dialog";
import { ConfidenceBadge } from "./confidence-badge";

interface ReviewGridProps {
  events: CalendarEvent[];
  timezone: string;
  onUpdate: (id: string, updated: Partial<CalendarEvent>) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onExport: () => void;
  onBack: () => void;
}

const eventTypes = ["all", "assignment", "exam", "quiz", "lab", "project", "other"] as const;
const confidenceLevels = ["all", "high", "medium", "low"] as const;

const typeColors: Record<string, string> = {
  assignment: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  exam:       "bg-red-500/15 text-red-400 border-red-500/30",
  quiz:       "bg-amber-500/15 text-amber-400 border-amber-500/30",
  lab:        "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  project:    "bg-purple-500/15 text-purple-400 border-purple-500/30",
  other:      "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
};

// Matches Tailwind *-400 colors for the timeline dots
const dotColors: Record<string, string> = {
  assignment: "#60a5fa",
  exam:       "#f87171",
  quiz:       "#fbbf24",
  lab:        "#34d399",
  project:    "#a78bfa",
  other:      "#a1a1aa",
};

function fmtDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });
  } catch { return dateStr; }
}

function fmtTime(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit",
    });
  } catch { return ""; }
}

const containerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } },
};

export function ReviewGrid({
  events,
  timezone,
  onUpdate,
  onDelete,
  onToggle,
  onExport,
  onBack,
}: ReviewGridProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [confidenceFilter, setConfidenceFilter] = useState<string>("all");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [displayCount, setDisplayCount] = useState(0);
  const [showAllCards, setShowAllCards] = useState(false);

  // Count up from 0 to events.length on mount / length change
  useEffect(() => {
    setDisplayCount(0);
    if (events.length === 0) return;
    const total = events.length;
    const steps = Math.min(total, 30);
    const increment = total / steps;
    const stepTime = Math.max(16, Math.floor(700 / steps));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, total);
      setDisplayCount(Math.round(current));
      if (current >= total) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [events.length]);

  const typeFiltered =
    typeFilter === "all" ? events : events.filter((e) => e.type === typeFilter);
  const filtered =
    confidenceFilter === "all"
      ? typeFiltered
      : typeFiltered.filter((e) => e.confidence === confidenceFilter);

  const visibleFiltered = showAllCards ? filtered : filtered.slice(0, 9);
  const hiddenCardCount = filtered.length - 9;

  const selectedCount = events.filter((e) => e.selected).length;

  const selectAll = () => { events.forEach((e) => { if (!e.selected) onToggle(e.id); }); };
  const deselectAll = () => { events.forEach((e) => { if (e.selected) onToggle(e.id); }); };

  // Timeline: apply same filters, sorted chronologically
  const timelineEvents = [...filtered].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Review Events</h2>
          <p className="text-sm text-muted-foreground">
            {displayCount} events found &middot; {selectedCount} selected
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 text-sm transition-colors cursor-pointer border-l border-border ${
                viewMode === "timeline"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              Timeline
            </button>
          </div>
          <Button variant="ghost" size="sm" onClick={selectAll} className="cursor-pointer">
            Select All
          </Button>
          <Button variant="ghost" size="sm" onClick={deselectAll} className="cursor-pointer">
            Deselect All
          </Button>
        </div>
      </div>

      {/* Type filter */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Task Type</p>
        <div className="flex gap-2 flex-wrap">
          {eventTypes.map((type) => (
            <button key={type} onClick={() => { setTypeFilter(type); setShowAllCards(false); }} className="cursor-pointer">
              <Badge variant={typeFilter === type ? "default" : "outline"} className="capitalize cursor-pointer">
                {type}
                {type !== "all" && (
                  <span className="ml-1 opacity-60">({events.filter((e) => e.type === type).length})</span>
                )}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Confidence filter */}
      <div className="space-y-1.5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confidence Level</p>
        <div className="flex gap-2 flex-wrap">
          {confidenceLevels.map((level) => (
            <button key={level} onClick={() => { setConfidenceFilter(level); setShowAllCards(false); }} className="cursor-pointer">
              <Badge variant={confidenceFilter === level ? "default" : "outline"} className="capitalize cursor-pointer">
                {level}
                {level !== "all" && (
                  <span className="ml-1 opacity-60">({typeFiltered.filter((e) => e.confidence === level).length})</span>
                )}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid view ── */}
      {viewMode === "grid" && (
        <>
          <motion.div
            key={`grid-${typeFilter}-${confidenceFilter}-${showAllCards}`}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {visibleFiltered.map((event) => (
              <motion.div key={event.id} variants={cardVariants}>
                <EventCard
                  event={event}
                  timezone={timezone}
                  onEdit={() => setEditingEvent(event)}
                  onDelete={() => onDelete(event.id)}
                  onToggle={() => onToggle(event.id)}
                />
              </motion.div>
            ))}
          </motion.div>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No events match the current filter.
            </div>
          )}
          {hiddenCardCount > 0 && !showAllCards && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllCards(true)}
              className="w-full text-muted-foreground cursor-pointer"
            >
              Show {hiddenCardCount} more event{hiddenCardCount !== 1 ? "s" : ""}
            </Button>
          )}
        </>
      )}

      {/* ── Timeline view ── */}
      {viewMode === "timeline" && (
        <div className="space-y-0">
          {timelineEvents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No events match the current filter.
            </div>
          )}
          {timelineEvents.map((event, i) => {
            const thisMonth = new Date(event.startDate).toLocaleDateString("en-US", {
              month: "long", year: "numeric",
            });
            const prevMonth =
              i > 0
                ? new Date(timelineEvents[i - 1].startDate).toLocaleDateString("en-US", {
                    month: "long", year: "numeric",
                  })
                : null;
            const showMonthHeader = thisMonth !== prevMonth;
            const isLast = i === timelineEvents.length - 1;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3, ease: "easeOut" }}
              >
                {showMonthHeader && (
                  <div className="flex gap-3 items-center mb-2 mt-4 first:mt-0">
                    <div className="w-3 shrink-0" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      {thisMonth}
                    </p>
                  </div>
                )}
                <div className="flex gap-3 items-start">
                  {/* Dot + connector line */}
                  <div className="flex flex-col items-center shrink-0 w-3">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-background mt-2 shrink-0"
                      style={{ backgroundColor: dotColors[event.type] ?? dotColors.other }}
                    />
                    {!isLast && <div className="w-px flex-1 bg-border mt-1 min-h-[24px]" />}
                  </div>
                  {/* Event row */}
                  <div
                    className={`flex-1 border rounded-lg p-3 mb-3 transition-all ${
                      event.selected
                        ? "border-primary/30 bg-card"
                        : "border-border/50 bg-card/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={event.selected}
                          onChange={() => onToggle(event.id)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                        <h3 className="font-semibold text-sm">{event.title}</h3>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Badge
                          variant="outline"
                          className={typeColors[event.type] ?? typeColors.other}
                        >
                          {event.type}
                        </Badge>
                        <ConfidenceBadge level={event.confidence} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                      {fmtDate(event.startDate)}
                      {!event.isAllDay && ` · ${fmtTime(event.startDate)}`}
                      {event.location && ` · ${event.location}`}
                    </p>
                    <div className="flex gap-1 mt-2 ml-6">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => setEditingEvent(event)}
                        className="text-xs h-7 cursor-pointer"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => onDelete(event.id)}
                        className="text-xs h-7 text-destructive hover:text-destructive cursor-pointer"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Bottom actions */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="cursor-pointer">
          Back
        </Button>
        <Button onClick={onExport} disabled={selectedCount === 0} className="cursor-pointer">
          Export {selectedCount} Events
        </Button>
      </div>

      {/* Edit dialog — preserved exactly */}
      <EventEditDialog
        event={editingEvent}
        open={editingEvent !== null}
        onSave={onUpdate}
        onClose={() => setEditingEvent(null)}
      />
    </div>
  );
}
