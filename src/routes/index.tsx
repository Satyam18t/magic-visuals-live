import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LiveBackground } from "@/components/LiveBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hacker House Goa 2026 — Pull Your Builder Pass" },
      {
        name: "description",
        content:
          "28–31 Oct 2026 in Panhouse, Goa. Four days of building, breaking and shipping on the coast. Create your digital builder pass.",
      },
      { property: "og:title", content: "Hacker House Goa 2026 — Digital Builder Pass" },
      {
        property: "og:description",
        content:
          "Four days of building, breaking and shipping on the coast. Pull your builder pass — solo or as a squad.",
      },
    ],
  }),
  component: Index,
});

const EVENT_DATE = new Date("2026-10-28T09:00:00+05:30").getTime();

function useCountdown() {
  const [parts, setParts] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(EVENT_DATE - Date.now(), 0);
      setParts({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return parts;
}

function Index() {
  const c = useCountdown();
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <main className="relative min-h-screen overflow-hidden bg-goa-700">
      <LiveBackground />

      <nav className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2 font-mono text-[12.5px] font-extrabold tracking-[0.1em] text-sun-soft">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-sun shadow-[0_0_10px_3px_var(--sun)]" />
          HH / GOA / 2026
        </div>
        <div className="flex items-center gap-2.5">
          <button className="rounded-full border-[1.4px] border-hairline bg-cream/5 px-4 py-2.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-cream transition hover:border-sun/55 hover:bg-sun/10">
            Check Hype
          </button>
          <button className="rounded-full border-[1.4px] border-sun bg-sun px-4 py-2.5 font-mono text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-goa-900 transition hover:-translate-y-px hover:bg-sun-soft">
            Create
          </button>
        </div>
      </nav>

      <section className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-5 pb-24 pt-10 text-center">
        <p className="rise font-mono text-[11px] uppercase tracking-[0.32em] text-sun-soft">
          28 – 31 October 2026 · Panhouse, Goa
        </p>

        <h1 className="rise mt-6 flex flex-wrap items-center justify-center gap-x-[clamp(8px,2.2vw,30px)] gap-y-2 [animation-delay:0.1s]">
          <span className="font-display text-[clamp(44px,10vw,142px)] uppercase leading-[0.86] text-shimmer">
            Hacker
          </span>
          <span className="flex size-[clamp(72px,9vw,116px)] shrink-0 animate-[floatSlow_5s_ease-in-out_infinite] flex-col items-center justify-center rounded-full border-[2.4px] border-dashed border-sun bg-goa-900/25 backdrop-blur-sm">
            <span className="font-display text-[clamp(18px,2.2vw,27px)] leading-none text-sun">GOA</span>
            <span className="mt-1 font-mono text-[clamp(6px,0.6vw,7.5px)] uppercase tracking-[0.2em] text-sun-soft">
              Est. 2026
            </span>
          </span>
          <span className="font-display text-[clamp(44px,10vw,142px)] uppercase leading-[0.86] text-sun drop-shadow-[0_8px_30px_oklch(0.89_0.16_92/25%)]">
            House
          </span>
        </h1>

        <p className="rise mt-7 max-w-[460px] text-[14.5px] leading-relaxed text-cream/85 [animation-delay:0.2s]">
          Four days of building, breaking and shipping on the coast. Pull your builder pass — solo or
          as a squad — and lock in your spot.
        </p>

        <div className="rise mt-9 flex flex-wrap justify-center divide-x divide-hairline overflow-hidden rounded-2xl border-[1.4px] border-hairline bg-goa-900/30 backdrop-blur-md [animation-delay:0.3s]">
          <div className="px-6 py-4 text-left">
            <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-sun/60">
              Countdown
            </span>
            <strong className="block font-mono text-base font-extrabold tabular-nums text-sun">
              {c ? `${c.d}d ${pad(c.h)}:${pad(c.m)}:${pad(c.s)}` : "—"}
            </strong>
          </div>
          <div className="px-6 py-4 text-left">
            <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-sun/60">
              Venue
            </span>
            <strong className="block text-sm font-semibold text-cream">Panhouse, Goa</strong>
          </div>
          <div className="px-6 py-4 text-left">
            <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.16em] text-sun/60">
              Edition
            </span>
            <strong className="block text-sm font-semibold text-cream">Set 01</strong>
          </div>
        </div>

        <div className="rise mt-10 flex flex-wrap justify-center gap-3 [animation-delay:0.4s]">
          <button className="flex items-center gap-2.5 rounded-full border-[1.6px] border-hairline bg-cream/5 px-10 py-4 font-display text-lg uppercase tracking-[0.04em] text-cream transition hover:-translate-y-0.5 hover:border-sun/55">
            <span className="size-2.5 animate-ping rounded-full bg-sun" />
            Check Hype
          </button>
          <button className="rounded-full bg-sun px-11 py-4 font-display text-lg uppercase tracking-[0.04em] text-goa-900 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]">
            Create Your Pass
          </button>
        </div>

        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.22em] text-cream/55">
          Move your cursor
        </p>
      </section>
    </main>
  );
}
