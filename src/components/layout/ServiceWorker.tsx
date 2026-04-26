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
      window.__pwaPrompt = e as unknown as typeof window.__pwaPrompt;
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // Detectar si se abre desde "Añadir a pantalla de inicio" (Chrome/Edge: display-mode, iOS: navigator.standalone)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true;
    if (isStandalone) {
      const sessionKey = "mtx_pwa_open_sent";
      if (!sessionStorage.getItem(sessionKey)) {
        gtagEvent("pwa_open", { mode: "standalone" });
        sessionStorage.setItem(sessionKey, "1");
      }
    }

    return () => {
      window.removeEventListener("appinstalled", onInstall);
      window.removeEventListener("beforeinstallprompt", onPrompt);
    };
  }, []);

  return null;
}
