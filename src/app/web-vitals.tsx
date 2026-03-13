"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    const { name, value, rating } = metric;

    if (process.env.NODE_ENV === "development") {
      const color =
        rating === "good" ? "green" : rating === "needs-improvement" ? "orange" : "red";
      console.log(`%c[Web Vital] ${name}: ${Math.round(value)}ms (${rating})`, `color: ${color}`);
    }

    if (typeof window !== "undefined" && "sendBeacon" in navigator) {
      const body = JSON.stringify({
        name,
        value: Math.round(value),
        rating,
        path: window.location.pathname,
        timestamp: Date.now(),
      });
      navigator.sendBeacon("/api/vitals", body);
    }
  });

  return null;
}
