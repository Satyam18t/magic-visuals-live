import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { HHGOA_MARKUP } from "@/lib/hhgoa/markup";
import "../hhgoa.css";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hacker House Goa 2026 — Digital ID Generator" },
      {
        name: "description",
        content:
          "28–31 Oct 2026, Panhouse Goa. Build your premium HH Goa builder pass — solo or squad — with photo editing, QR and instant PNG download.",
      },
      { property: "og:title", content: "Hacker House Goa 2026 — Digital Builder Pass" },
      {
        property: "og:description",
        content:
          "Four days of building, breaking and shipping on the coast. Pull your HH Goa 2026 pass — solo or as a squad.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const hostRef = useRef<HTMLDivElement>(null);
  const booted = useRef(false);

  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    let cancelled = false;

    const loadQr = () =>
      new Promise<void>((resolve) => {
        if ((window as any).QRCode) return resolve();
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });

    (async () => {
      await loadQr();
      if (cancelled) return;
      const { initHHGoa } = await import("@/lib/hhgoa/app");
      if (cancelled) return;
      initHHGoa();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={hostRef}
      id="hhgoa-root"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: HHGOA_MARKUP }}
    />
  );
}
