"use client";

import { useEffect } from "react";

function gtagEvent(name: string, params?: Record<string, string>) {
  const consent = localStorage.getItem("mtx-cookie-consent");
  if (consent === "accepted" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onInstall = () => gtagEvent("pwa_install");
    window.addEventListener("appinstalled", onInstall);

    const onPrompt = (e: Event) => {
      gtagEvent("pwa_install_prompt");
      (window as any).__pwaPrompt = e;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      gtagEvent("pwa_open", { mode: "standalone" });
    }

    return () => {
      window.removeEventListener("appinstalled", onInstall);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  return null;
}
