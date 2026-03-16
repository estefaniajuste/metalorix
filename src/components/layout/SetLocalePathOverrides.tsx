"use client";

import { useEffect, useRef } from "react";
import { setLocalePathOverrides } from "./locale-paths-store";

interface HrefObj {
  pathname: string;
  params?: Record<string, string>;
}

let nextId = 0;

export function SetLocalePathOverrides({
  hrefs,
}: {
  hrefs: Partial<Record<string, HrefObj>>;
}) {
  const idRef = useRef(++nextId);

  useEffect(() => {
    const id = idRef.current;
    setLocalePathOverrides(id, hrefs);
    return () => setLocalePathOverrides(id, null);
  }, [hrefs]);

  return null;
}
