"use client";

import { useEffect, useState } from "react";

const LABELS: Record<string, { title: string; message: string; retry: string }> = {
  es: { title: "Error inesperado", message: "Se ha producido un error grave. Intenta recargar la página.", retry: "Reintentar" },
  en: { title: "Unexpected error", message: "A critical error has occurred. Please try reloading the page.", retry: "Retry" },
  zh: { title: "意外错误", message: "发生严重错误。请尝试重新加载页面。", retry: "重试" },
  ar: { title: "خطأ غير متوقع", message: "حدث خطأ خطير. يرجى محاولة إعادة تحميل الصفحة.", retry: "إعادة المحاولة" },
  tr: { title: "Beklenmeyen hata", message: "Ciddi bir hata oluştu. Sayfayı yeniden yüklemeyi deneyin.", retry: "Tekrar dene" },
  de: { title: "Unerwarteter Fehler", message: "Ein schwerwiegender Fehler ist aufgetreten. Bitte laden Sie die Seite neu.", retry: "Erneut versuchen" },
};

function getLocale(): string {
  if (typeof window === "undefined") return "es";
  const match = window.location.pathname.match(/^\/([a-z]{2})\//);
  return match?.[1] && match[1] in LABELS ? match[1] : "es";
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState("es");

  useEffect(() => {
    setLocale(getLocale());
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(
        "/api/errors",
        JSON.stringify({
          message: error.message,
          digest: error.digest,
          path: window.location.pathname,
          statusCode: 500,
          timestamp: Date.now(),
        })
      );
    }
  }, [error]);

  const l = LABELS[locale] || LABELS.es;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body style={{ background: "#0B0F17", color: "#EAEDF3", fontFamily: "system-ui" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
            {l.title}
          </h1>
          <p style={{ color: "#8B95A8", marginBottom: "2rem", maxWidth: 400, textAlign: "center" }}>
            {l.message}
          </p>
          <button
            onClick={reset}
            style={{
              background: "#D6B35A",
              color: "#0B0F17",
              fontWeight: 700,
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "0.875rem",
            }}
          >
            {l.retry}
          </button>
        </div>
      </body>
    </html>
  );
}
