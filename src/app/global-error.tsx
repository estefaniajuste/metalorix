"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(
        "/api/errors",
        JSON.stringify({
          message: error.message,
          digest: error.digest,
          path: window.location.pathname,
          timestamp: Date.now(),
        })
      );
    }
  }, [error]);

  return (
    <html lang="es">
      <body style={{ background: "#0B0F17", color: "#EAEDF3", fontFamily: "system-ui" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "1rem" }}>
            Error inesperado
          </h1>
          <p style={{ color: "#8B95A8", marginBottom: "2rem", maxWidth: 400, textAlign: "center" }}>
            Se ha producido un error grave. Intenta recargar la página.
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
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
