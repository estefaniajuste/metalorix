"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MetalSpot } from "@/lib/providers/metals";

interface PricesState {
  prices: MetalSpot[] | null;
  source: string;
  lastUpdate: Date | null;
}

let sharedState: PricesState = { prices: null, source: "loading", lastUpdate: null };
let listeners: Set<() => void> = new Set();
let fetchInFlight: Promise<void> | null = null;
let intervalId: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;

function notify() {
  listeners.forEach((fn) => fn());
}

async function doFetch() {
  try {
    const res = await fetch("/api/prices");
    const { source, prices } = await res.json();
    sharedState = { prices, source, lastUpdate: new Date() };
  } catch {
    sharedState = { ...sharedState, source: "error" };
  }
  fetchInFlight = null;
  notify();
}

function ensureFetching() {
  if (!fetchInFlight) {
    fetchInFlight = doFetch();
  }
  return fetchInFlight;
}

export function usePrices(): PricesState & { refresh: () => void } {
  const [, forceRender] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const listener = () => {
      if (mounted.current) forceRender((n) => n + 1);
    };
    listeners.add(listener);
    subscriberCount++;

    ensureFetching();

    if (subscriberCount === 1 && !intervalId) {
      intervalId = setInterval(() => ensureFetching(), 60_000);
    }

    return () => {
      mounted.current = false;
      listeners.delete(listener);
      subscriberCount--;
      if (subscriberCount === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, []);

  const refresh = useCallback(() => {
    ensureFetching();
  }, []);

  return { ...sharedState, refresh };
}
