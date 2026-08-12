import { useEffect, useRef } from "react";

/**
 * Live animated hero background: layered aurora light, drifting sun glow,
 * parallax ocean waves, floating embers/fireflies and occasional shooting stars.
 * Everything is canvas-drawn from design-token colors, runs at ~60fps and
 * respects prefers-reduced-motion.
 */
export function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let t = 0;

    const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

    type P = { x: number; y: number; r: number; s: number; a: number; hue: number; drift: number };
    let motes: P[] = [];
    type Star = { x: number; y: number; life: number; len: number; speed: number; angle: number };
    let stars: Star[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round(Math.min(150, (w * h) / 12000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: rnd(0.6, 2.6),
        s: rnd(0.08, 0.5),
        a: rnd(0.15, 0.75),
        hue: Math.random() < 0.75 ? 0 : 1,
        drift: rnd(-0.25, 0.25),
      }));
    };

    const drawWave = (
      yBase: number,
      amp: number,
      len: number,
      speed: number,
      fill: string,
      phase: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 8) {
        const y =
          yBase +
          Math.sin((x / len + t * speed + phase) * Math.PI * 2) * amp +
          Math.sin((x / (len * 0.42) - t * speed * 1.7) * Math.PI * 2) * amp * 0.35;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
    };

    const frame = () => {
      t += reduce ? 0 : 0.0016;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const px = (mouse.x - 0.5) * 2;
      const py = (mouse.y - 0.5) * 2;

      // base sky
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#062A19");
      sky.addColorStop(0.45, "#0E6238");
      sky.addColorStop(1, "#0A4A2C");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // aurora ribbons
      for (let i = 0; i < 3; i++) {
        const cx = w * (0.25 + i * 0.28) + Math.sin(t * (1.2 + i * 0.5) * Math.PI) * w * 0.12 - px * 26 * (i + 1);
        const cy = h * (0.3 + i * 0.18) + Math.cos(t * (0.9 + i * 0.4) * Math.PI) * h * 0.1 - py * 18 * (i + 1);
        const rad = Math.max(w, h) * (0.36 + i * 0.09);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        const tint = i === 1 ? "255,92,138" : i === 2 ? "28,148,80" : "255,210,63";
        g.addColorStop(0, `rgba(${tint},${i === 0 ? 0.2 : 0.13})`);
        g.addColorStop(0.5, `rgba(${tint},0.05)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // sun disc with breathing halo
      const sunX = w * 0.82 - px * 40;
      const sunY = h * 0.2 - py * 30 + Math.sin(t * 2.4 * Math.PI) * 8;
      const pulse = 1 + Math.sin(t * 3.4 * Math.PI) * 0.06;
      const halo = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 190 * pulse);
      halo.addColorStop(0, "rgba(255,233,138,0.55)");
      halo.addColorStop(0.25, "rgba(255,210,63,0.22)");
      halo.addColorStop(1, "rgba(255,210,63,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 190 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,233,138,0.85)";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 26 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // floating motes
      motes.forEach((m) => {
        if (!reduce) {
          m.y -= m.s;
          m.x += Math.sin((m.y + m.r * 40) / 90) * 0.35 + m.drift;
          if (m.y < -10) {
            m.y = h + 10;
            m.x = Math.random() * w;
          }
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
        }
        const twinkle = 0.55 + Math.sin(t * 40 + m.x) * 0.45;
        const col = m.hue === 0 ? "255,210,63" : "255,247,234";
        ctx.fillStyle = `rgba(${col},${m.a * twinkle})`;
        ctx.beginPath();
        ctx.arc(m.x - px * 12 * m.r, m.y - py * 8 * m.r, m.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // shooting stars
      if (!reduce && Math.random() < 0.006 && stars.length < 2) {
        stars.push({
          x: rnd(w * 0.1, w * 0.9),
          y: rnd(0, h * 0.4),
          life: 1,
          len: rnd(90, 190),
          speed: rnd(7, 12),
          angle: rnd(Math.PI * 0.15, Math.PI * 0.3),
        });
      }
      stars = stars.filter((s) => {
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.012;
        const g = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - Math.cos(s.angle) * s.len,
          s.y - Math.sin(s.angle) * s.len,
        );
        g.addColorStop(0, `rgba(255,247,234,${Math.max(s.life, 0) * 0.9})`);
        g.addColorStop(1, "rgba(255,247,234,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
        return s.life > 0;
      });

      // parallax ocean
      drawWave(h * 0.78 + py * 10, 16, w * 0.55, 0.9, "rgba(6,42,25,0.35)", 0);
      drawWave(h * 0.85 + py * 6, 13, w * 0.4, 1.4, "rgba(28,148,80,0.28)", 0.4);
      drawWave(h * 0.92, 10, w * 0.3, 2.1, "rgba(255,210,63,0.10)", 0.8);
      drawWave(h * 0.97, 7, w * 0.22, 2.8, "rgba(6,42,25,0.55)", 1.2);

      // vignette
      const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.35, w / 2, h / 2, Math.max(w, h) * 0.8);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(3,20,12,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX / window.innerWidth;
      mouse.ty = e.clientY / window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />
      <div className="absolute inset-0 grain" />
      <svg
        aria-hidden="true"
        viewBox="0 0 200 260"
        className="absolute -left-8 bottom-0 w-52 origin-bottom animate-[palmSway_7s_ease-in-out_infinite] opacity-40 sm:w-64"
      >
        <g fill="#FFF7EA">
          <rect x="92" y="60" width="10" height="200" rx="4" />
          <path d="M97 60 C60 30 20 40 5 20 C40 10 80 30 97 55Z" />
          <path d="M97 60 C50 55 20 80 0 70 C25 45 70 45 97 55Z" />
          <path d="M97 60 C70 90 60 130 30 140 C40 100 65 70 97 55Z" />
          <path d="M97 60 C130 40 170 50 190 25 C155 15 115 30 97 55Z" />
        </g>
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 200 260"
        className="absolute -right-10 bottom-0 w-60 origin-bottom animate-[palmSway_8.5s_ease-in-out_-2s_infinite] opacity-35 sm:w-72"
      >
        <g fill="#FFE98A">
          <rect x="92" y="70" width="10" height="200" rx="4" />
          <path d="M97 70 C60 40 20 50 5 30 C40 20 80 40 97 65Z" />
          <path d="M97 70 C50 65 20 90 0 80 C25 55 70 55 97 65Z" />
          <path d="M97 70 C70 100 60 140 30 150 C40 110 65 80 97 65Z" />
          <path d="M97 70 C130 50 170 60 190 35 C155 25 115 40 97 65Z" />
        </g>
      </svg>
    </div>
  );
}
