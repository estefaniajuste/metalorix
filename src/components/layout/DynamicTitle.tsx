"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { usePrices } from "@/lib/hooks/use-prices";

export function DynamicTitle() {
  const { prices } = usePrices();
  const baseTitle = useRef<string>("");
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isHomepage = segments.length <= 1;

  useEffect(() => {
    if (!baseTitle.current) baseTitle.current = document.title;
  }, []);

  useEffect(() => {
    if (!isHomepage) {
      if (baseTitle.current) document.title = baseTitle.current;
      return;
    }
    if (!prices) return;
    const gold = prices.find((p) => p.symbol === "XAU");
    if (!gold) return;
    const formatted = gold.price.toLocaleString("en-US", {
      maximumFractionDigits: 0,
    });
    const arrow = gold.changePct >= 0 ? "▲" : "▼";
    document.title = `XAU $${formatted} ${arrow} | Metalorix`;
  }, [prices, isHomepage]);

  useEffect(() => {
    const base = baseTitle.current;
    return () => {
      if (base) document.title = base;
    };
  }, []);

  return null;
}
