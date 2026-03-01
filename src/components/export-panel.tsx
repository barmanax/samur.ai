"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { downloadICS } from "@/lib/ics-generator";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar-links";

// Pre-computed petal positions: 24 petals in a full circle, varied distances
const PETALS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2 - Math.PI / 2; // start from top
  const radius = 80 + (i % 5) * 18; // 80–152px
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotate: (i * 47) % 360,
    duration: 0.55 + (i % 4) * 0.12,
  };
});

interface ExportPanelProps {
  events: CalendarEvent[];
  courseName: string;
  timezone: string;
  onReset: () => void;
  onBack: () => void;
}

export function ExportPanel({
  events,
  courseName,
  timezone,
  onReset,
  onBack,
}: ExportPanelProps) {
  const [bursting, setBursting] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleEvents = showAll ? events : events.slice(0, 9);
  const hiddenCount = events.length - 9;

  const handleDownloadICS = () => {
    downloadICS(events, courseName); // existing behavior unchanged
    setBursting(true);
    setTimeout(() => setBursting(false), 1400);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Export Events</h2>
        <p className="text-muted-foreground">
          {events.length} events ready to export for{" "}
          <span className="text-primary font-medium">{courseName}</span>
        </p>
      </div>

      {/* Primary: Download ICS with petal burst */}
      <div className="flex justify-center">
        <div style={{ position: "relative", display: "inline-block" }}>
          <Button
            size="lg"
            onClick={handleDownloadICS}
            className="text-lg px-8 py-6 cursor-pointer"
          >
            Download ICS File
          </Button>
          {bursting &&
            PETALS.map((p, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.4, rotate: p.rotate }}
                transition={{ duration: p.duration, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: 10,
                  height: 10,
                  marginLeft: -5,
                  marginTop: -5,
                  borderRadius: "15px 0 15px 0",
                  background: "#f5789a",
                  pointerEvents: "none",
                  zIndex: 50,
                }}
              />
            ))}
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Import this file into Google Calendar, Apple Calendar, or Outlook
      </p>

      {/* Per-event export */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Or add events individually</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleEvents.map((event) => (
            <Card key={event.id} className="bg-card">
              <CardContent className="p-3 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <a
                    href={googleCalendarUrl(event, timezone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    Google
                  </a>
                  <a
                    href={outlookCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs px-2 py-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors"
                  >
                    Outlook
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {hiddenCount > 0 && !showAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(true)}
            className="w-full text-muted-foreground cursor-pointer"
          >
            Show {hiddenCount} more event{hiddenCount !== 1 ? "s" : ""}
          </Button>
        )}
      </div>

      {/* Bottom actions */}
      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="cursor-pointer">
          Back to Review
        </Button>
        <Button variant="outline" onClick={onReset} className="cursor-pointer">
          Start Over
        </Button>
      </div>
    </div>
  );
}
