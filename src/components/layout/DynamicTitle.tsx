"use client";

import { useEffect, useRef } from "react";
import { usePrices } from "@/lib/hooks/use-prices";

export function DynamicTitle() {
  const { prices } = usePrices();
  const baseTitle = useRef<string>("");

  useEffect(() => {
    if (!baseTitle.current) baseTitle.current = document.title;
  }, []);

  useEffect(() => {
    if (!prices) return;
    const gold = prices.find((p) => p.symbol === "XAU");
    if (!gold) return;
    const formatted = gold.price.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    const arrow = gold.changePct >= 0 ? "▲" : "▼";
    document.title = `XAU $${formatted} ${arrow} | Metalorix`;
  }, [prices]);

  useEffect(() => {
    const base = baseTitle.current;
    return () => {
      if (base) document.title = base;
    };
  }, []);

  return null;
}
