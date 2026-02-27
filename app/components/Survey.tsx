"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  DESIGN SYSTEM — Unified tokens for premium bespoke feel
// ═══════════════════════════════════════════════════════════

// ── Color Palette: Midnight Navy + Slovenian Green + Alpine Blue ──
const C = {
  // Backgrounds
  bg:         "transparent",
  glass:      "rgba(10,15,30,0.72)",
  glassMid:   "rgba(10,15,30,0.60)",
  glassLight: "rgba(255,255,255,0.04)",
  // Slovenian Green (primary — Pantone 377 family)
  emerald:    "#7AB800",
  emeraldDim: "#5e8f00",
  emeraldMid: "#8fcc1a",
  emeraldLt:  "#a3d94e",
  emeraldGlow:"rgba(122,184,0,0.18)",
  // Alpine Blue (accent, labels)
  triglav:    "#4a90c4",
  triglavDim: "#1a5f8a",
  // Gold (politician path)
  gold:       "#fbbf24",
  goldDim:    "#d4a017",
  // Feedback
  red:        "#ef4444",
  purple:     "#a78bfa",
  // Text hierarchy
  white:      "#ffffff",
  text:       "#e2e8f0",
  muted:      "#94a3b8",
  subtle:     "#64748b",
  faint:      "#475569",
  // Borders
  border:     "rgba(122,184,0,0.12)",
  borderFaint:"rgba(255,255,255,0.07)",
};

// ── Spacing ──
const S = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 } as const;

// ── Radius ──  (bento-style: generous, boutique rounding)
const R = { sm:10, md:14, lg:20, xl:24 } as const;

// ── Typography ──
const serif = "'Playfair Display', Georgia, serif";
const sans  = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
type Role = "citizen" | "politician";
type CitizenStep = "identity" | "feeling" | "departments" | "vision" | "politicians" | "wish";
type PoliticianStep = "identity" | "truth" | "promises" | "gaps" | "ask";
type SurveyPhase = "intro" | "role" | "survey" | "thankyou";

// ═══════════════════════════════════════════════════════════
//  DATA
// ═══════════════════════════════════════════════════════════
const DEPARTMENTS = [
  { id:"zdravstvo",       e:"🏥", name:"Zdravstvo" },
  { id:"solstvo",         e:"📚", name:"Šolstvo" },
  { id:"infrastruktura",  e:"🛣️", name:"Infrastruktura" },
  { id:"stanovanja",      e:"🏠", name:"Stanovanja" },
  { id:"ekonomija",       e:"💼", name:"Ekonomija" },
  { id:"okolje",          e:"🌿", name:"Okolje" },
  { id:"varnost",         e:"👮", name:"Varnost" },
  { id:"skupnost",        e:"🤝", name:"Skupnost" },
];

const DEPARTMENTS_POLITICIAN = [
  "Zdravstvo","Šolstvo","Infrastruktura & Promet","Stanovanja",
  "Ekonomija & Finance","Okolje","Notranje zadeve & Varnost",
  "Zunanja politika","Digitalizacija","Kultura","Šport","Drugo",
];

// ═══════════════════════════════════════════════════════════
//  GENERATIVE BACKGROUND — "Abstract Slovenian Topography"
// ═══════════════════════════════════════════════════════════

// ── Triglav ↔ Heart morphing path data (matched bezier structure: M + 10C = 62 numbers) ──
const TRIGLAV_PTS = [
  470,468, 492,456,522,438,550,418, 574,400,594,372,610,338,
  624,368,644,388,662,392, 680,396,698,384,708,358,
  714,340,718,305,720,268, 722,305,726,340,732,358,
  742,384,760,396,778,392, 796,388,816,368,830,338,
  846,372,866,400,890,418, 918,438,948,456,970,468,
];
const HEART_PTS = [
  470,468, 485,430,518,388,552,352, 582,322,596,288,605,258,
  616,226,645,210,680,215, 706,218,717,244,720,274,
  723,290,724,298,723,304, 722,298,721,290,720,274,
  724,244,737,218,762,215, 797,210,826,226,836,258,
  846,288,860,322,890,352, 924,388,957,430,970,468,
];
function buildPath(pts: number[]): string {
  let d = `M${pts[0]},${pts[1]}`;
  for (let i = 2; i < pts.length; i += 6)
    d += ` C${pts[i]},${pts[i+1]} ${pts[i+2]},${pts[i+3]} ${pts[i+4]},${pts[i+5]}`;
  return d;
}
function lerpPath(a: number[], b: number[], t: number): string {
  const p = a.map((v, i) => v + (b[i] - v) * t);
  return buildPath(p);
}
const TRIGLAV_D = buildPath(TRIGLAV_PTS);
const RIVER_LEFT = "M720,465 C700,488 660,505 620,515 C560,530 490,525 420,540 C350,555 280,548 210,562 C140,575 70,570 0,582";
const RIVER_RIGHT = "M720,465 C745,490 785,508 830,518 C900,534 975,530 1050,542 C1125,554 1200,550 1280,560 C1360,570 1410,568 1440,572";

interface BgParticle {
  x:number; y:number; vx:number; vy:number; size:number;
  baseOpacity:number; life:number; decay:number;
  twinkleSpeed:number; twinklePhase:number; twinkleDepth:number;
  haloSize:number; warmth:number;
}

function GenerativeBg({ showParticles }: { showParticles:boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const riverCoreRef = useRef<SVGPathElement>(null);
  const riverBranchRef = useRef<SVGPathElement>(null);

  // ── Enhanced golden particles with twinkle + halos ──
  useEffect(() => {
    if (!showParticles) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const COUNT = window.innerWidth < 768 ? 35 : 65;
    const particles: BgParticle[] = [];
    const spawn = (randomLife: boolean): BgParticle => ({
      x: Math.random(), y: Math.pow(Math.random(), 0.65),
      vx: (Math.random() - 0.5) * 0.00015, vy: -Math.random() * 0.00022 - 0.00005,
      size: Math.random() * 1.8 + 0.4, baseOpacity: Math.random() * 0.55 + 0.15,
      life: randomLife ? Math.random() : 1, decay: Math.random() * 0.001 + 0.0004,
      twinkleSpeed: Math.random() * 3.0 + 1.2, twinklePhase: Math.random() * Math.PI * 2,
      twinkleDepth: Math.random() * 0.55 + 0.25,
      haloSize: Math.random() * 2.8 + 1.8, warmth: Math.random(),
    });
    for (let i = 0; i < COUNT; i++) particles.push(spawn(true));

    let time = 0;
    const animate = () => {
      const w = window.innerWidth, h = window.innerHeight;
      time += 0.016;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (p.life <= 0 || p.y < -0.06 || p.x < -0.06 || p.x > 1.06) { Object.assign(p, spawn(false)); continue; }
        const sx = p.x * w, sy = p.y * h;
        const t1 = Math.sin(time * p.twinkleSpeed + p.twinklePhase);
        const t2 = Math.sin(time * p.twinkleSpeed * 0.37 + p.twinklePhase * 1.7);
        const twinkle = 1 - p.twinkleDepth * (0.5 + 0.35 * t1 + 0.15 * t2);
        const lifeAlpha = Math.min(p.life * 4, 1) * Math.max(p.life, 0);
        const alpha = p.baseOpacity * lifeAlpha * twinkle;
        if (alpha < 0.008) continue;
        const r = Math.round(251 - p.warmth * 18);
        const g = Math.round(191 - p.warmth * 25);
        const b = Math.round(36 + p.warmth * 20);
        const color = `rgb(${r},${g},${b})`;
        ctx.globalAlpha = alpha; ctx.fillStyle = color;
        ctx.beginPath(); ctx.arc(sx, sy, p.size, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = alpha * 0.2;
        ctx.beginPath(); ctx.arc(sx, sy, p.size * p.haloSize, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = alpha * 0.06;
        ctx.beginPath(); ctx.arc(sx, sy, p.size * p.haloSize * 2.5, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [showParticles]);

  // ── Soča river animation (dash flow + opacity pulse) ──
  useEffect(() => {
    if (!showParticles) return;
    let running = true;
    let coreOff = 0, branchOff = 0, coreT = 0, branchT = 0;
    const animateRiver = () => {
      if (!running) return;
      const core = riverCoreRef.current;
      const branch = riverBranchRef.current;
      if (core) {
        const len = core.getTotalLength();
        if (!core.style.strokeDasharray) core.style.strokeDasharray = `${len*0.18} ${len*0.06} ${len*0.08} ${len*0.04}`;
        coreOff -= 0.4; coreT += 0.016;
        core.style.strokeDashoffset = String(coreOff);
        core.style.opacity = String(0.45 + 0.15 * Math.sin(coreT * 0.8));
      }
      if (branch) {
        const len = branch.getTotalLength();
        if (!branch.style.strokeDasharray) branch.style.strokeDasharray = `${len*0.12} ${len*0.08} ${len*0.06} ${len*0.05}`;
        branchOff -= 0.25; branchT += 0.016;
        branch.style.strokeDashoffset = String(branchOff);
        branch.style.opacity = String(0.28 + 0.12 * Math.sin(branchT * 0.6 + 1.2));
      }
      requestAnimationFrame(animateRiver);
    };
    requestAnimationFrame(animateRiver);
    return () => { running = false; };
  }, [showParticles]);

  return (
    <>
      {/* Layer 0: Deep gradient base (midnight→mossy green) */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:`
          radial-gradient(ellipse 130% 80% at 50% 105%, rgba(15,74,46,0.42) 0%, transparent 55%),
          radial-gradient(ellipse 80% 50% at 18% 72%, rgba(12,60,38,0.28) 0%, transparent 50%),
          radial-gradient(ellipse 55% 65% at 80% 32%, rgba(10,45,30,0.16) 0%, transparent 48%),
          radial-gradient(ellipse 45% 35% at 50% 30%, rgba(20,40,80,0.12) 0%, transparent 42%),
          linear-gradient(175deg, #050a18 0%, #071020 12%, #081422 22%, #091726 34%, #0a1a2a 46%, #0b1d2d 56%, #0a2129 66%, #0a2726 76%, #0b2e24 86%, #0d3422 94%, #0e3820 100%)
        `,
      }} />

      {/* Layer 1: SVG — filters, corona, topo lines, Triglav, Soča, peak corona */}
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" style={{
        position:"fixed", inset:0, zIndex:0, width:"100%", height:"100%", pointerEvents:"none",
      }}>
        <defs>
          <filter id="bg-blur-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.2" /></filter>
          <filter id="bg-blur-medium" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
          <filter id="bg-blur-heavy" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8" /></filter>
          <filter id="bg-blur-corona" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22" /></filter>
          <filter id="bg-blur-corona-in" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="12" /></filter>
          <filter id="bg-blur-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
          <filter id="bg-triglav-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b2" />
            <feColorMatrix in="b1" type="matrix" values="0 0 0 0 0.32 0 0 0 0 0.60 0 0 0 0 0.82 0 0 0 1.5 0" result="g1" />
            <feColorMatrix in="b2" type="matrix" values="0 0 0 0 0.25 0 0 0 0 0.50 0 0 0 0 0.72 0 0 0 0.6 0" result="g2" />
            <feMerge><feMergeNode in="g2" /><feMergeNode in="g1" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="bg-river-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
            <feColorMatrix in="b1" type="matrix" values="0 0 0 0 0.12 0 0 0 0 0.68 0 0 0 0 0.48 0 0 0 1.2 0" result="g1" />
            <feColorMatrix in="b2" type="matrix" values="0 0 0 0 0.08 0 0 0 0 0.55 0 0 0 0 0.38 0 0 0 0.5 0" result="g2" />
            <feMerge><feMergeNode in="g2" /><feMergeNode in="g1" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Edge fade mask */}
          <linearGradient id="bg-fade-h" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="black" /><stop offset="6%" stopColor="white" />
            <stop offset="94%" stopColor="white" /><stop offset="100%" stopColor="black" />
          </linearGradient>
          <linearGradient id="bg-fade-v" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="black" /><stop offset="10%" stopColor="white" />
            <stop offset="90%" stopColor="white" /><stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id="bg-edge-fade">
            <rect width="1440" height="900" fill="url(#bg-fade-h)" />
            <rect width="1440" height="900" fill="url(#bg-fade-v)" style={{mixBlendMode:"multiply"}} />
          </mask>
          {/* Triglav depth mask */}
          <radialGradient id="bg-tri-mask-g" cx="50%" cy="40%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="55%" stopColor="white" stopOpacity="0.85" />
            <stop offset="80%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id="bg-tri-mask"><rect width="1440" height="900" fill="url(#bg-tri-mask-g)" /></mask>
        </defs>

        {/* Deep corona light behind peaks */}
        <g opacity="0.45">
          <ellipse cx="720" cy="330" rx="320" ry="100" fill="rgba(20,60,110,0.25)" filter="url(#bg-blur-corona)" />
          <ellipse cx="720" cy="315" rx="180" ry="55" fill="rgba(40,100,165,0.2)" filter="url(#bg-blur-corona-in)" />
          <ellipse cx="720" cy="300" rx="90" ry="28" fill="rgba(74,144,196,0.18)" filter="url(#bg-blur-heavy)" />
        </g>

        {/* Topographic wave lines */}
        <g mask="url(#bg-edge-fade)" opacity="0.14">
          <path d="M0,105 C120,82 260,128 400,95 C540,62 680,115 820,88 C960,60 1100,108 1240,82 C1340,65 1400,95 1440,78" stroke="rgba(122,184,0,0.55)" strokeWidth="0.7" fill="none" filter="url(#bg-blur-soft)" />
          <path d="M0,145 C140,118 280,162 420,132 C560,102 700,148 840,122 C980,96 1120,142 1260,118 C1360,100 1410,132 1440,115" stroke="rgba(122,184,0,0.45)" strokeWidth="0.65" fill="none" filter="url(#bg-blur-soft)" />
          <path d="M0,188 C160,158 310,198 460,172 C610,146 750,188 900,162 C1050,138 1190,178 1340,155 C1400,145 1430,168 1440,155" stroke="rgba(122,184,0,0.38)" strokeWidth="0.6" fill="none" />
          <path d="M0,228 C180,202 330,238 490,215 C650,192 790,230 950,208 C1110,185 1250,220 1400,200 C1430,195 1440,205 1440,198" stroke="rgba(122,184,0,0.3)" strokeWidth="0.55" fill="none" />
          <path d="M0,305 C150,282 310,322 470,298 C630,274 790,315 950,292 C1110,270 1270,308 1440,288" stroke="rgba(74,144,196,0.4)" strokeWidth="0.6" fill="none" />
          <path d="M0,348 C170,325 340,362 510,340 C680,318 850,355 1020,335 C1190,315 1340,348 1440,332" stroke="rgba(74,144,196,0.32)" strokeWidth="0.55" fill="none" />
          <path d="M0,392 C190,370 360,405 540,385 C720,365 890,398 1070,380 C1250,362 1380,390 1440,378" stroke="rgba(60,150,130,0.28)" strokeWidth="0.55" fill="none" />
          <path d="M0,435 C160,415 330,448 500,428 C670,408 840,440 1010,422 C1180,404 1340,432 1440,420" stroke="rgba(60,150,130,0.22)" strokeWidth="0.5" fill="none" />
          <path d="M0,520 C220,498 400,535 580,515 C760,495 940,528 1120,510 C1300,492 1400,522 1440,508" stroke="rgba(15,74,46,0.5)" strokeWidth="0.6" fill="none" />
          <path d="M0,568 C240,548 420,578 600,560 C780,542 960,572 1140,555 C1320,538 1410,565 1440,552" stroke="rgba(15,74,46,0.4)" strokeWidth="0.55" fill="none" />
          <path d="M0,618 C260,600 440,628 620,610 C800,592 980,620 1160,605 C1340,590 1420,612 1440,602" stroke="rgba(15,74,46,0.32)" strokeWidth="0.5" fill="none" />
          <path d="M0,668 C200,652 380,678 560,662 C740,646 920,672 1100,658 C1280,644 1400,665 1440,655" stroke="rgba(15,74,46,0.25)" strokeWidth="0.45" fill="none" />
          <path d="M0,720 C230,706 410,730 590,716 C770,702 950,725 1130,712 C1310,700 1410,720 1440,710" stroke="rgba(15,74,46,0.2)" strokeWidth="0.4" fill="none" />
          <path d="M0,772 C250,760 430,780 610,768 C790,756 970,776 1150,765 C1330,755 1420,772 1440,762" stroke="rgba(15,74,46,0.15)" strokeWidth="0.38" fill="none" />
        </g>

        {/* Triglav mountain outline — 3 peaks, multi-layer glow */}
        <g mask="url(#bg-tri-mask)">
          <path d={TRIGLAV_D} stroke="rgba(74,144,196,0.08)" strokeWidth="14" fill="none" filter="url(#bg-blur-corona-in)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={TRIGLAV_D} stroke="rgba(74,144,196,0.16)" strokeWidth="4.5" fill="none" filter="url(#bg-blur-glow)" strokeLinecap="round" strokeLinejoin="round" />
          <path d={TRIGLAV_D} stroke="rgba(74,144,196,0.5)" strokeWidth="1.2" fill="none" filter="url(#bg-triglav-glow)" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M360,510 C390,498 420,488 445,478 C458,472 465,470 470,468" stroke="rgba(74,144,196,0.10)" strokeWidth="0.8" fill="none" filter="url(#bg-blur-soft)" strokeLinecap="round" />
          <path d="M970,468 C975,470 982,472 995,478 C1020,488 1050,498 1080,510" stroke="rgba(74,144,196,0.10)" strokeWidth="0.8" fill="none" filter="url(#bg-blur-soft)" strokeLinecap="round" />
        </g>

        {/* Soča river flow */}
        <g mask="url(#bg-edge-fade)">
          <path d={RIVER_LEFT} stroke="rgba(38,180,130,0.05)" strokeWidth="18" fill="none" filter="url(#bg-blur-corona-in)" strokeLinecap="round" />
          <path d={RIVER_LEFT} stroke="rgba(38,180,130,0.10)" strokeWidth="5" fill="none" filter="url(#bg-blur-medium)" strokeLinecap="round" />
          <path ref={riverCoreRef} d={RIVER_LEFT} stroke="rgba(38,180,130,0.45)" strokeWidth="1.1" fill="none" filter="url(#bg-river-glow)" strokeLinecap="round" />
          <path d={RIVER_RIGHT} stroke="rgba(38,180,130,0.04)" strokeWidth="10" fill="none" filter="url(#bg-blur-heavy)" strokeLinecap="round" />
          <path ref={riverBranchRef} d={RIVER_RIGHT} stroke="rgba(38,180,130,0.28)" strokeWidth="0.8" fill="none" filter="url(#bg-river-glow)" strokeLinecap="round" />
        </g>

        {/* Triglav peak corona */}
        <g opacity="0.35">
          <ellipse cx="720" cy="268" rx="70" ry="22" fill="rgba(74,144,196,0.22)" filter="url(#bg-blur-heavy)">
            <animate attributeName="opacity" values="0.22;0.32;0.22" dur="7s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="720" cy="262" rx="35" ry="12" fill="rgba(120,180,220,0.18)" filter="url(#bg-blur-medium)">
            <animate attributeName="opacity" values="0.18;0.28;0.18" dur="5s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="720" cy="258" rx="8" ry="4" fill="rgba(180,210,240,0.12)" filter="url(#bg-blur-soft)">
            <animate attributeName="opacity" values="0.12;0.20;0.12" dur="3.5s" repeatCount="indefinite" />
          </ellipse>
        </g>
      </svg>

      {/* Layer 2: Gold dust particle canvas */}
      <canvas ref={canvasRef} style={{
        position:"fixed", inset:0, zIndex:0, width:"100%", height:"100%", pointerEvents:"none",
      }} />

      {/* Layer 3: Noise texture */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none", opacity:0.03,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize:"256px 256px", mixBlendMode:"overlay",
      }} />

      {/* Layer 4: Vignette */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:"radial-gradient(ellipse 72% 62% at 50% 42%, transparent 0%, rgba(5,10,24,0.5) 100%)",
      }} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════
//  LOGO
// ═══════════════════════════════════════════════════════════
function NismoFejkLogo({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="#000" />
      <g fill="#fff">
        <ellipse cx="72" cy="58" rx="14" ry="12" />
        <polygon points="58,56 48,59 58,62" />
        <circle cx="68" cy="56" r="2.5" fill="#000" />
        <path d="M78,66 Q85,72 88,80 L76,80 Q74,72 72,68 Z" />
        <ellipse cx="105" cy="92" rx="32" ry="22" />
        <path d="M88,82 Q95,75 110,74 Q125,73 138,78 Q130,82 118,84 Q108,85 98,84 Z" />
        <path d="M90,88 Q100,82 115,81 Q130,80 142,85 Q132,88 120,89 Q108,90 96,89 Z" />
        <path d="M132,86 L158,72 Q155,82 148,88 Z" />
        <path d="M134,90 L162,82 Q158,90 150,95 Z" />
        <path d="M135,94 L160,92 Q156,98 148,102 Z" />
      </g>
      <text x="100" y="132" textAnchor="middle"
        fill="#fff" fontWeight="900" fontSize="24" fontFamily="Arial,Helvetica,sans-serif"
        letterSpacing="0.5">#NISMOFEJK</text>
      <g stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M92,112 L86,138 L78,142" />
        <path d="M86,138 L92,142" />
        <path d="M112,112 L118,136 L126,142" />
        <path d="M118,136 L112,142" />
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
//  SHARED UI PRIMITIVES — unified design language
// ═══════════════════════════════════════════════════════════

function FadeSlide({ children, id }: { children: React.ReactNode; id: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }, [id]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    }}>{children}</div>
  );
}

function StepDots({ total, current, color }: { total:number; current:number; color:string }) {
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center" }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          width: i === current ? 24 : 8, height:8, borderRadius:4,
          background: i < current ? color+"88" : i === current ? color : "rgba(255,255,255,0.08)",
          transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      ))}
    </div>
  );
}

function RatingScale({ value, onChange, color }: { value:number|null; onChange:(n:number)=>void; color:string }) {
  return (
    <div style={{ display:"flex", gap:S.sm, flexWrap:"wrap" }}>
      {Array.from({length:10}, (_,i) => i+1).map(n => (
        <button key={n} onClick={() => onChange(n)} style={{
          width:44, height:44, borderRadius:R.md, border:"none", cursor:"pointer",
          fontFamily:sans, fontWeight:700, fontSize:"0.9rem",
          background: value===n ? color : value!==null && value>=n ? color+"33" : "rgba(255,255,255,0.06)",
          color: value!==null && value>=n ? "white" : C.subtle,
          transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
          transform: value===n ? "scale(1.12)" : "scale(1)",
          boxShadow: value===n ? `0 0 20px ${color}44` : "none",
        }}>{n}</button>
      ))}
    </div>
  );
}

// ── Glass Card (citizen green border glow) ──
function Card({ children, style={}, gold=false }: { children:React.ReactNode; style?:React.CSSProperties; gold?:boolean }) {
  const accentBorder = gold ? "rgba(251,191,36,0.16)" : C.border;
  return (
    <div style={{
      background: C.glass,
      backdropFilter: "blur(10px)",
      border: `1px solid ${accentBorder}`,
      borderRadius: R.lg,
      padding: S.lg,
      marginBottom: S.md,
      ...style,
    }}>{children}</div>
  );
}

// ── Action Button (green / gold variants) ──
function ActionBtn({ onClick, disabled, children, large, variant="green" }: {
  onClick:()=>void; disabled?:boolean; children:React.ReactNode; large?:boolean; variant?:"green"|"gold"
}) {
  const isGreen = variant === "green";
  const grad = isGreen
    ? `linear-gradient(135deg, ${C.emerald}, ${C.emeraldDim})`
    : `linear-gradient(135deg, ${C.gold}, ${C.goldDim})`;
  const glow = isGreen ? C.emeraldGlow : "rgba(251,191,36,0.2)";

  return (
    <button onClick={onClick} disabled={disabled} className={!disabled && isGreen ? "pulse-cta" : ""}
      style={{
        width:"100%", padding: large ? "18px 24px" : "14px 24px",
        fontSize: large ? "1rem" : "0.9rem", fontWeight:800,
        fontFamily: sans, letterSpacing:"-0.01em",
        borderRadius: R.md, border:"none",
        background: disabled ? "rgba(255,255,255,0.06)" : grad,
        color: disabled ? C.subtle : isGreen ? "white" : "#000",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : `0 4px 20px ${glow}`,
        transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
      {children}
    </button>
  );
}

// ── Section Label (utility text) ──
function SectionLabel({ children, color=C.triglav }: { children:React.ReactNode; color?:string }) {
  return (
    <div style={{
      fontSize:"0.72rem", fontWeight:700, color,
      fontFamily:sans, textTransform:"uppercase",
      letterSpacing:"0.14em", marginBottom:S.md,
    }}>{children}</div>
  );
}

// ── Step Header (used in citizen + politician surveys) ──
function StepHeader({ step, total, title, sub, color, html }: {
  step:number; total:number; title:string; sub:string; color:string; html?:boolean;
}) {
  return (
    <div style={{ marginTop:S.lg, marginBottom:S.xl }}>
      <div style={{ display:"flex", alignItems:"center", gap:S.sm+2, marginBottom:S.md }}>
        <StepDots total={total} current={step} color={color} />
        <span style={{ fontSize:"0.72rem", color, fontFamily:"monospace", letterSpacing:"0.12em", textTransform:"uppercase" }}>
          {step+1} / {total}{step===total-1?" · Zadnji":""}
        </span>
      </div>
      {html
        ? <h2 style={{ fontFamily:sans, fontSize:"clamp(1.5rem,4.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:S.sm+2, color:C.white, letterSpacing:"-0.02em" }}
            dangerouslySetInnerHTML={{ __html: title }} />
        : <h2 style={{ fontFamily:sans, fontSize:"clamp(1.5rem,4.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:S.sm+2, color:C.white, letterSpacing:"-0.02em" }}>{title}</h2>
      }
      <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{sub}</p>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════
//  BETA BANNER
// ═══════════════════════════════════════════════════════════
function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div style={{
      background:`linear-gradient(135deg, rgba(0,93,164,0.12), rgba(122,184,0,0.06))`,
      backdropFilter:"blur(8px)",
      border:`1px solid rgba(91,163,217,0.20)`,
      borderRadius:R.lg, padding:`${S.md}px ${S.lg}px`,
      margin:`0 auto ${S.xl}px`, maxWidth:520, position:"relative",
    }}>
      <button onClick={() => setDismissed(true)} style={{
        position:"absolute", top:S.sm, right:S.md,
        background:"none", border:"none", color:C.subtle, cursor:"pointer",
        fontSize:"1.1rem", lineHeight:1,
      }}>×</button>
      <div style={{ display:"flex", gap:S.sm+2, alignItems:"flex-start" }}>
        <span style={{
          background:C.triglavDim, color:"white", fontSize:"0.6rem",
          fontWeight:800, padding:"3px 8px", borderRadius:R.sm,
          letterSpacing:"0.08em", flexShrink:0, marginTop:2, fontFamily:sans,
        }}>BETA v1.0</span>
        <p style={{ fontSize:"0.78rem", color:C.muted, lineHeight:1.75, margin:0 }}>
          Povezujemo slovenske zgodbe v eno. To je prvi korak —
          potrebujemo le <strong style={{color:C.white}}>3 minute vašega časa</strong>, da začutimo skupni utrip.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SOCIAL PROOF COUNTER
// ═══════════════════════════════════════════════════════════
function SocialProofCounter() {
  const [count, setCount] = useState(148);
  useEffect(() => {
    const base = 148;
    const tick = () => {
      // Random fluctuation ±12 around base — feels like real users joining/leaving
      const delta = Math.round((Math.random() - 0.45) * 24);
      setCount(Math.max(base - 14, base + delta));
    };
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:15,
      background:"rgba(10,15,30,0.80)", backdropFilter:"blur(14px)",
      borderTop:`1px solid ${C.border}`,
      padding:`${S.sm+2}px max(10vw, 24px)`,
      display:"flex", alignItems:"center", justifyContent:"center", gap:S.sm+2,
    }}>
      <span style={{
        display:"inline-block", width:8, height:8, borderRadius:"50%",
        background:C.emerald, animation:"pulse-dot 1.8s ease-in-out infinite",
      }} />
      <span style={{ fontSize:"0.75rem", color:C.muted, fontFamily:sans }}>
        Trenutno aktivnih uporabnikov: <strong style={{ color:C.white, fontWeight:700 }}>{count}</strong>
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ACCESSIBILITY TOGGLE
// ═══════════════════════════════════════════════════════════
function AccessibilityToggle({ largeText, onToggle }: { largeText:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle} style={{
      position:"fixed", top:60, right:S.md, zIndex:25,
      background: largeText ? "rgba(122,184,0,0.2)" : "rgba(255,255,255,0.06)",
      border:`1px solid ${largeText ? "rgba(122,184,0,0.4)" : C.borderFaint}`,
      borderRadius:R.sm, padding:`${S.xs+2}px ${S.md}px`,
      display:"flex", alignItems:"center", gap:S.xs+2,
      cursor:"pointer", transition:"all 0.2s",
    }} title="Večje besedilo / Large text">
      <span style={{ fontSize:"0.85rem" }}>🔤</span>
      <span style={{ fontSize:"0.65rem", fontWeight:600, fontFamily:sans, color: largeText ? C.emeraldMid : C.muted }}>
        {largeText ? "Aa+" : "Aa"}
      </span>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════
//  INTRO — Začuti Domovino
// ═══════════════════════════════════════════════════════════
function IntroScreen({ onContinue, largeText }: { onContinue:()=>void; largeText:boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const bodyFs = largeText ? "1.02rem" : "0.9rem";
  const bodyLh = largeText ? 2.0 : 1.8;

  return (
    <div style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:`${S.xxl}px max(10vw, 24px) 160px`,
      opacity: visible ? 1 : 0, transition:"opacity 0.9s ease",
    }}>
      <div style={{ maxWidth:520, width:"100%", position:"relative", zIndex:1 }}>

        {/* ── Brand mark ── */}
        <div style={{ textAlign:"center", marginBottom:S.lg }}>
          <div style={{
            display:"inline-block",
            fontSize:"clamp(2rem,7vw,3rem)", fontWeight:900,
            fontFamily:sans, letterSpacing:"-0.03em",
            background:`linear-gradient(135deg, ${C.emeraldMid}, ${C.emerald}, ${C.emeraldDim})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            filter:`drop-shadow(0 0 32px ${C.emeraldGlow})`,
          }}>#nismofejk</div>
        </div>

        <BetaBanner />

        {/* ── Hero headline ── */}
        <h1 style={{
          fontFamily:serif,
          fontSize:"clamp(2rem,6.5vw,2.8rem)", fontWeight:700,
          lineHeight:1.18, color:C.white,
          textAlign:"center", marginBottom:S.xl,
          letterSpacing:"-0.02em",
        }}>
          Slovenija, združena<br/>
          <span style={{
            background:`linear-gradient(135deg, ${C.emeraldMid}, ${C.emerald})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>v enem utripu.</span>
        </h1>

        {/* ── Subheadline ── */}
        <p style={{
          textAlign:"center", fontFamily:sans, fontSize:"clamp(0.88rem,2.5vw,1.05rem)",
          color:C.muted, lineHeight:1.8, marginBottom:S.xl, maxWidth:420, marginLeft:"auto", marginRight:"auto",
        }}>
          Povezujemo gore, vode in ljudi v digitalni prostor, ki diha z nami.
        </p>

        {/* ── Glas, ki razume naše srce ── */}
        <div style={{
          background:C.glass, backdropFilter:"blur(12px)",
          border:`1px solid rgba(255,255,255,0.08)`,
          borderRadius:R.xl, padding:`${S.xl+4}px ${S.lg}px`, marginBottom:S.xl,
        }}>
          <SectionLabel color={C.triglav}>Glas, ki ga čutimo vsi</SectionLabel>

          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, marginBottom:S.lg }}>
            Nekje v Sloveniji živi človek, ki ga ne boste videli na televiziji.
            Ni politik, ni zvezdnik. Je oče, dedek, delavec — eden izmed nas.
            Cele življenje je gradil, volil, verjel.
          </p>

          {/* Sacred quote */}
          <div style={{
            background:"rgba(255,255,255,0.05)", backdropFilter:"blur(6px)",
            borderRadius:R.lg, padding:`${S.lg}px`,
            marginBottom:S.lg, borderLeft:`4px solid ${C.emerald}`,
          }}>
            <p style={{
              fontFamily:serif,
              fontSize: largeText ? "1.15rem" : "clamp(1.05rem,3vw,1.2rem)",
              fontStyle:"italic", color:"rgba(255,255,255,0.92)",
              lineHeight:1.8, margin:0,
            }}>
              &ldquo;Gledam, kako se spopadajo med sabo. Levi, desni, sredinski — vseeno.
              Vsak vleče v svojo smer, nihče pa ne vpraša nas, kaj sploh rabimo.
              Tako ne bo šlo. Dokler ne potegnemo skupaj, se ne bo nič spremenilo.&rdquo;
            </p>
          </div>

          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, margin:0 }}>
            Ne želi slave, ne želi pozornosti. Želi si samo,
            da bi spet znali stati skupaj — kot smo nekoč znali.
          </p>
        </div>

        {/* ── V1.0 Call to Action ── */}
        <div style={{
          background:`linear-gradient(135deg, rgba(0,93,164,0.10), rgba(122,184,0,0.06))`,
          backdropFilter:"blur(10px)",
          border:`1px solid rgba(91,163,217,0.16)`,
          borderRadius:R.xl, padding:`${S.lg}px`, marginBottom:S.xl,
        }}>
          <SectionLabel color={C.emerald}>Povezujemo gore, vode in ljudi</SectionLabel>
          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, marginBottom:S.md }}>
            Vaši odgovori oblikujejo sliko resnične Slovenije — ne tiste iz parlamenta,
            ampak tiste, ki jo živite vsak dan.
          </p>
          <p style={{ fontSize:bodyFs, color:"rgba(255,255,255,0.78)", lineHeight:bodyLh, fontWeight:500, marginBottom:0 }}>
            <strong style={{ color:C.white }}>
              Ali bomo sami začeli graditi svojo prihodnost — ali čakamo,
              da nam jo določi nekdo drug?
            </strong>
          </p>
          <p style={{ fontSize:"clamp(0.95rem,3vw,1.05rem)", fontWeight:800, fontFamily:sans, color:C.emerald, marginTop:S.md, marginBottom:0 }}>
            Začutimo skupni utrip.
          </p>
        </div>

        {/* ── Stats ── */}
        <div style={{
          display:"flex", marginBottom:S.xl,
          background:C.glassMid, backdropFilter:"blur(8px)",
          border:`1px solid ${C.border}`, borderRadius:R.lg, overflow:"hidden",
        }}>
          {[
            { v:"2.100.000+", l:"Slovencev",               c:C.emerald },
            { v:"3.600+",     l:"Izvoljenih funkcionarjev", c:C.gold },
            { v:"~5 min",     l:"Čas izpolnjevanja",        c:C.emeraldMid },
          ].map((s,i) => (
            <div key={i} style={{
              flex:1, padding:`${S.md}px ${S.sm}px`, textAlign:"center",
              borderRight: i<2 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{ fontSize:"clamp(0.95rem,3vw,1.3rem)", fontWeight:900, fontFamily:sans, color:s.c, marginBottom:S.xs, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:"0.6rem", fontFamily:sans, color:C.faint, textTransform:"uppercase", letterSpacing:"0.07em", lineHeight:1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <ActionBtn onClick={onContinue} large>Vstopi v novo poglavje →</ActionBtn>

        <p style={{ marginTop:S.md, fontSize:"0.72rem", fontFamily:sans, color:C.faint, lineHeight:1.6, textAlign:"center" }}>
          Anonimno · Brez registracije · Vaš glas se zlije z glasovi vseh
        </p>

        {/* ── Footer info box ── */}
        <div style={{
          marginTop:S.xl, padding:`${S.lg}px`,
          background:"rgba(122,184,0,0.04)", backdropFilter:"blur(6px)",
          border:`1px solid rgba(122,184,0,0.10)`,
          borderRadius:R.lg, textAlign:"left",
        }}>
          <p style={{ fontSize: largeText ? "0.82rem" : "0.76rem", fontFamily:sans, color:C.faint, lineHeight:1.9, margin:0 }}>
            <span style={{ color:C.emerald, fontWeight:700 }}>Zakaj?</span><br />
            Ko politik oceni zdravstvo s 6, državljan pa s 3.8 — to ni mnenje. To je dejstvo.
            Ko zberemo dovolj takih dejstev,{" "}
            <span style={{ color:C.emerald, fontWeight:600 }}>se pokaže, kje Slovenija resnično diha.</span>
          </p>
          <div style={{ marginTop:S.md, fontSize:"0.65rem", fontFamily:sans, color:C.faint }}>
            #nismofejk · 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ROLE SELECT
// ═══════════════════════════════════════════════════════════
function RoleSelect({ onSelect }: { onSelect:(r:Role)=>void }) {
  const roleBtn = (accent:string, accentDim:string) => ({
    padding:`${S.lg+4}px ${S.lg}px`, borderRadius:R.xl,
    border:`2px solid ${accent}33`, background:`${accent}0a`,
    cursor:"pointer", textAlign:"left" as const,
    transition:"all 0.22s ease", width:"100%",
    backdropFilter:"blur(8px)",
  });

  return (
    <FadeSlide id="role">
      <div style={{ maxWidth:500, margin:"0 auto", padding:`${S.xxl}px max(10vw, 24px) 160px` }}>
        <div style={{ textAlign:"center", marginBottom:S.xl+S.sm }}>
          <SectionLabel>Izberi vlogo</SectionLabel>
          <h2 style={{ fontFamily:sans, fontSize:"clamp(1.7rem,5vw,2.4rem)", fontWeight:800, lineHeight:1.1, color:C.white, marginBottom:S.sm, letterSpacing:"-0.02em" }}>
            Kdo ste?
          </h2>
          <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>Glede na vašo vlogo boste prejeli drugačna vprašanja.</p>
        </div>

        <div style={{ display:"grid", gap:S.md, marginBottom:S.lg }}>
          <button onClick={() => onSelect("citizen")} style={roleBtn(C.emerald, C.emeraldDim)}
            onMouseEnter={e=>{const s=e.currentTarget.style;s.borderColor=`${C.emerald}88`;s.background=`${C.emerald}18`;s.transform="translateY(-2px)";}}
            onMouseLeave={e=>{const s=e.currentTarget.style;s.borderColor=`${C.emerald}33`;s.background=`${C.emerald}0a`;s.transform="translateY(0)";}}
          >
            <div style={{ fontSize:"2rem", marginBottom:S.sm+2 }}>🏔️</div>
            <div style={{ fontSize:"1.08rem", fontWeight:800, fontFamily:sans, color:C.white, marginBottom:S.xs+2 }}>Sem Slovenec / Slovenka</div>
            <div style={{ fontSize:"0.84rem", fontFamily:sans, color:C.muted, lineHeight:1.7 }}>
              Celo življenje ste bili zraven. Danes pa končno nekdo vpraša — kaj si vi mislite?
            </div>
            <div style={{ marginTop:S.md, fontSize:"0.72rem", fontFamily:sans, color:C.emeraldMid, fontWeight:700 }}>6 korakov · ~5 minut →</div>
          </button>

          <button onClick={() => onSelect("politician")} style={roleBtn(C.gold, C.goldDim)}
            onMouseEnter={e=>{const s=e.currentTarget.style;s.borderColor=`${C.gold}88`;s.background=`${C.gold}14`;s.transform="translateY(-2px)";}}
            onMouseLeave={e=>{const s=e.currentTarget.style;s.borderColor=`${C.gold}33`;s.background=`${C.gold}0a`;s.transform="translateY(0)";}}
          >
            <div style={{ fontSize:"2rem", marginBottom:S.sm+2 }}>🏛️</div>
            <div style={{ fontSize:"1.08rem", fontWeight:800, fontFamily:sans, color:C.white, marginBottom:S.xs+2 }}>Sem Slovenski politik</div>
            <div style={{ fontSize:"0.84rem", fontFamily:sans, color:C.muted, lineHeight:1.7 }}>
              Ljudje gledajo, kako se grebete. Tukaj je priložnost pokazati, da vam je mar.
            </div>
            <div style={{ marginTop:S.md, fontSize:"0.72rem", fontFamily:sans, color:C.gold, fontWeight:700 }}>5 korakov · ~7 minut →</div>
          </button>
        </div>

        <Card style={{ padding:S.md }}>
          <div style={{ display:"flex", gap:S.md, alignItems:"flex-start" }}>
            <span style={{ fontSize:"1.1rem" }}>🔒</span>
            <div>
              <div style={{ fontSize:"0.78rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.xs }}>Anonimno & varno</div>
              <div style={{ fontSize:"0.72rem", fontFamily:sans, color:C.faint, lineHeight:1.65 }}>
                Nobenih osebnih podatkov. Odgovori se združijo z drugimi. Cilj je videti celotno sliko.
              </div>
            </div>
          </div>
        </Card>
      </div>
    </FadeSlide>
  );
}

// ═══════════════════════════════════════════════════════════
//  CITIZEN SURVEY
// ═══════════════════════════════════════════════════════════
function CitizenSurvey({ onDone }: { onDone:()=>void }) {
  const TOTAL = 6;
  const [step, setStep] = useState<CitizenStep>("identity");
  const idx: Record<CitizenStep,number> = { identity:0, feeling:1, departments:2, vision:3, politicians:4, wish:5 };

  const [region, setRegion] = useState("");
  const [age, setAge] = useState("");
  const [feelingScore, setFeelingScore] = useState<number|null>(null);
  const [feelingText, setFeelingText] = useState("");
  const [thumb, setThumb] = useState<"up"|"down"|null>(null);
  const [deptScores, setDeptScores] = useState<Record<string,number>>({});
  const [visionTop3, setVisionTop3] = useState<string[]>([]);
  const [visionText, setVisionText] = useState("");
  const [polTrust, setPolTrust] = useState<number|null>(null);
  const [polFeedback, setPolFeedback] = useState("");
  const [wish, setWish] = useState("");
  const [wishRealistic, setWishRealistic] = useState("");

  const togglePriority = (id:string) =>
    setVisionTop3(p => p.includes(id) ? p.filter(x=>x!==id) : p.length<3 ? [...p,id] : p);

  const W = (inner: React.ReactNode, stepKey: string) => (
    <FadeSlide id={stepKey}>
      <div style={{ maxWidth:540, margin:"0 auto", padding:`${S.xxl-8}px max(10vw, 24px) 160px` }}>{inner}</div>
    </FadeSlide>
  );

  const H = (s:number, title:string, sub:string, html?:boolean) => (
    <StepHeader step={s} total={TOTAL} title={title} sub={sub} color={C.emerald} html={html} />
  );

  if (step === "identity") return W(<>
    {H(idx.identity, "Povejte nam, kdo ste.", "Anonimno. Nobenih imen — samo da vidimo celotno sliko Slovenije.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:S.md, marginBottom:S.lg }}>
      <div>
        <label style={{ fontSize:"0.75rem", fontFamily:sans, color:C.muted, fontWeight:600, display:"block", marginBottom:S.xs+2 }}>Regija</label>
        <select className="app-input" value={region} onChange={e=>setRegion(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["Ljubljana","Maribor","Celje","Koper","Kranj","Novo Mesto","Murska Sobota","Gorenjska","Koroška","Notranjska","Primorska","Drugo"].map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:"0.75rem", fontFamily:sans, color:C.muted, fontWeight:600, display:"block", marginBottom:S.xs+2 }}>Starost</label>
        <select className="app-input" value={age} onChange={e=>setAge(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["18–25","26–35","36–45","46–55","56–65","65+"].map(a=><option key={a}>{a}</option>)}
        </select>
      </div>
    </div>
    <ActionBtn onClick={()=>setStep("feeling")} disabled={!region||!age}>Naprej →</ActionBtn>
  </>, "c-identity");

  if (step === "feeling") return W(<>
    {H(idx.feeling, "Kako se počutite v Sloveniji?", "Nikoli vas niso vprašali. Danes vas vprašamo. Ni napačnega odgovora.")}
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>Na lestvici 1–10: kako dober kraj za življenje je Slovenija <em>za vas</em>?</div>
      <RatingScale value={feelingScore} onChange={setFeelingScore} color={C.emerald} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:S.sm+2 }}>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>1 = Zelo slabo</span>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>10 = Odlično</span>
      </div>
    </Card>
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>&ldquo;Smo na pravi poti?&rdquo;</div>
      <div style={{ display:"flex", gap:S.sm+2 }}>
        {[{v:"up" as const,e:"👍",l:"Da, gremo naprej",c:C.emerald},{v:"down" as const,e:"👎",l:"Ne, sprememba smeri",c:C.red}].map(b=>(
          <button key={b.v} onClick={()=>setThumb(b.v)} style={{
            flex:1, padding:`${S.md}px ${S.sm}px`, borderRadius:R.lg, border:"none", cursor:"pointer",
            background: thumb===b.v?`${b.c}1a`:C.glassLight,
            outline: thumb===b.v?`2px solid ${b.c}`:"2px solid transparent",
            transition:"all 0.2s",
          }}>
            <div style={{ fontSize:"2.2rem", marginBottom:S.xs+2 }}>{b.e}</div>
            <div style={{ fontSize:"0.75rem", fontFamily:sans, color:thumb===b.v?b.c:C.muted, fontWeight:600, lineHeight:1.35 }}>{b.l}</div>
          </button>
        ))}
      </div>
    </Card>
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Z enim stavkom: kaj si resnično mislite? <span style={{color:C.muted,fontWeight:400}}>(neobvezno)</span></div>
      <textarea className="app-input" rows={3} placeholder="Npr: 'Potencial imamo, politična volja manjka.'" value={feelingText} onChange={e=>setFeelingText(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("departments")} disabled={feelingScore===null||thumb===null}>Naprej →</ActionBtn>
  </>, "c-feeling");

  if (step === "departments") return W(<>
    {H(idx.departments, "Ocenite vsako področje.", "1 = zelo slabo · 10 = odlično. Bodite realni, brez zadržkov.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:S.sm+2, marginBottom:S.lg }}>
      {DEPARTMENTS.map(d=>(
        <div key={d.id} style={{
          background:C.glass, backdropFilter:"blur(8px)",
          border:`1px solid ${C.border}`, borderRadius:R.lg, padding:S.md,
          borderLeftWidth: deptScores[d.id] ? 3 : 1,
          borderLeftColor: deptScores[d.id] ? (deptScores[d.id]>=7?C.emerald:deptScores[d.id]>=4?C.gold:C.red) : C.border,
          transition:"border-color 0.2s",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:S.sm-1, marginBottom:S.sm+2 }}>
            <span style={{ fontSize:"1.2rem" }}>{d.e}</span>
            <span style={{ fontSize:"0.82rem", fontWeight:700, fontFamily:sans, color:C.white }}>{d.name}</span>
            {deptScores[d.id] && <span style={{ marginLeft:"auto", fontSize:"1rem", fontWeight:900, fontFamily:sans, color:deptScores[d.id]>=7?C.emerald:deptScores[d.id]>=4?C.gold:C.red }}>{deptScores[d.id]}</span>}
          </div>
          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
            {Array.from({length:10},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setDeptScores(s=>({...s,[d.id]:n}))} style={{
                width:26, height:26, borderRadius:R.sm, border:"none", cursor:"pointer",
                fontWeight:700, fontSize:"0.7rem", fontFamily:sans,
                background: deptScores[d.id]===n?(n>=7?C.emerald:n>=4?"#f59e0b":C.red):deptScores[d.id]>n?`rgba(122,184,0,0.18)`:"rgba(255,255,255,0.05)",
                color: deptScores[d.id]>=n?"white":C.faint,
                transition:"all 0.1s",
              }}>{n}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
    <ActionBtn onClick={()=>setStep("vision")} disabled={Object.keys(deptScores).length<DEPARTMENTS.length}>
      {Object.keys(deptScores).length<DEPARTMENTS.length?`Ocenite vsa področja (${Object.keys(deptScores).length}/${DEPARTMENTS.length})`:"Naprej →"}
    </ActionBtn>
  </>, "c-departments");

  if (step === "vision") return W(<>
    {H(idx.vision, "Kaj bi vi naredili?", "Ne bodite skromni — bodite realni. To je vaša Slovenija.")}
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>Izberite 3 najpomembnejše prioritete za Slovenijo:</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:S.sm }}>
        {DEPARTMENTS.map(d=>{
          const sel=visionTop3.includes(d.id);
          return (
            <button key={d.id} onClick={()=>togglePriority(d.id)} style={{
              padding:`${S.sm+3}px ${S.md}px`, borderRadius:R.md, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:S.sm, textAlign:"left",
              background:sel?`rgba(122,184,0,0.14)`:C.glassLight,
              outline:sel?`2px solid rgba(122,184,0,0.5)`:"2px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:"1rem" }}>{d.e}</span>
              <span style={{ fontSize:"0.78rem", fontWeight:600, fontFamily:sans, color:sel?C.emeraldMid:C.muted }}>{d.name}</span>
              {sel && <span style={{ marginLeft:"auto", color:C.emerald, fontWeight:900, fontSize:"0.9rem" }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize:"0.72rem", fontFamily:sans, color:C.faint, marginTop:S.sm+2 }}>Izbrano: {visionTop3.length} / 3</div>
    </Card>
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Opišite svojo vizijo za Slovenijo:</div>
      <textarea className="app-input" rows={5} placeholder="Npr: 'Hočem, da se moj otrok ne sprašuje, ali bo imel streho nad glavo.'" value={visionText} onChange={e=>setVisionText(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("politicians")} disabled={visionTop3.length<3||!visionText.trim()}>Naprej →</ActionBtn>
  </>, "c-vision");

  if (step === "politicians") return W(<>
    {H(idx.politicians, "O politikih — odkrito.", "Nihče vas ne bo obsojal. Povejte, kar si resnično mislite.")}
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>Na lestvici 1–10: koliko zaupate Slovenskim politikom?</div>
      <RatingScale value={polTrust} onChange={setPolTrust} color={C.purple} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:S.sm+2 }}>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>1 = Nič</span>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>10 = Popolno zaupanje</span>
      </div>
    </Card>
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj bi sporočili politiku, ki bi vas danes resnično poslušal? <span style={{color:C.muted,fontWeight:400}}>(neobvezno)</span></div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Nehajte se prepirati in delajte.'" value={polFeedback} onChange={e=>setPolFeedback(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("wish")} disabled={polTrust===null}>Naprej →</ActionBtn>
  </>, "c-politicians");

  if (step === "wish") return W(<>
    {H(idx.wish, "Ena želja.<br/>Katera bi bila?", "Jutri boste prebrali: 'Slovenija je naredila X.' Kaj bi si želeli, da je ta X?", true)}
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm+2 }}>Moja ena želja za Slovenijo:</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Da pridemo k zdravniku v enem tednu, ne v enem letu.'" value={wish} onChange={e=>setWish(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <Card>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm+2 }}>Ali menite, da je ta želja uresničljiva v 5 letih?</div>
      <div style={{ display:"flex", gap:S.sm }}>
        {[{v:"da",l:"Da 🙂"},{v:"mozda",l:"Morda 🤞"},{v:"ne",l:"Iskreno ne 😔"}].map(b=>(
          <button key={b.v} onClick={()=>setWishRealistic(b.v)} style={{
            flex:1, padding:`${S.md-2}px ${S.xs+2}px`, borderRadius:R.md, border:"none", cursor:"pointer",
            fontSize:"0.78rem", fontWeight:600, fontFamily:sans,
            background:wishRealistic===b.v?`rgba(122,184,0,0.16)`:C.glassLight,
            color:wishRealistic===b.v?C.emeraldMid:C.muted,
            outline:wishRealistic===b.v?`2px solid rgba(122,184,0,0.45)`:"2px solid transparent",
            transition:"all 0.15s",
          }}>{b.l}</button>
        ))}
      </div>
    </Card>
    <ActionBtn onClick={onDone} disabled={!wish.trim()||!wishRealistic} large>Oddaj odgovor 🇸🇮</ActionBtn>
  </>, "c-wish");

  return null;
}

// ═══════════════════════════════════════════════════════════
//  POLITICIAN SURVEY
// ═══════════════════════════════════════════════════════════
function PoliticianSurvey({ onDone }: { onDone:()=>void }) {
  const TOTAL = 5;
  const [step, setStep] = useState<PoliticianStep>("identity");
  const idx: Record<PoliticianStep,number> = { identity:0, truth:1, promises:2, gaps:3, ask:4 };

  const [dept, setDept] = useState("");
  const [years, setYears] = useState("");
  const [selfScore, setSelfScore] = useState<number|null>(null);
  const [achievement, setAchievement] = useState("");
  const [failure, setFailure] = useState("");
  const [promisesKept, setPromisesKept] = useState<number|null>(null);
  const [promisesWhy, setPromisesWhy] = useState("");
  const [obstacle, setObstacle] = useState("");
  const [wouldChange, setWouldChange] = useState("");
  const [askPublic, setAskPublic] = useState("");
  const [wish, setWish] = useState("");

  const W = (inner: React.ReactNode, stepKey: string) => (
    <FadeSlide id={stepKey}>
      <div style={{ maxWidth:520, margin:"0 auto", padding:`${S.xxl-8}px max(10vw, 24px) 160px` }}>{inner}</div>
    </FadeSlide>
  );

  const H = (s:number, title:string, sub:string) => (
    <StepHeader step={s} total={TOTAL} title={title} sub={sub} color={C.gold} />
  );

  if (step === "identity") return W(<>
    {H(idx.identity, "Postavite vse na mizo.", "Ni PR-a, ni kamere. Samo vi in vprašanja.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:S.md, marginBottom:S.lg }}>
      <div>
        <label style={{ fontSize:"0.75rem", fontFamily:sans, color:C.muted, fontWeight:600, display:"block", marginBottom:S.xs+2 }}>Področje</label>
        <select className="app-input" value={dept} onChange={e=>setDept(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {DEPARTMENTS_POLITICIAN.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:"0.75rem", fontFamily:sans, color:C.muted, fontWeight:600, display:"block", marginBottom:S.xs+2 }}>Leta v politiki</label>
        <select className="app-input" value={years} onChange={e=>setYears(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["1–2 leti","3–5 let","6–10 let","11–20 let","20+ let"].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>
    </div>
    <ActionBtn onClick={()=>setStep("truth")} disabled={!dept||!years} variant="gold">Naprej →</ActionBtn>
  </>, "p-identity");

  if (step === "truth") return W(<>
    {H(idx.truth, "Resnica brez kamere.", "Ni moderatorja, ni nasprotnika. Samo vprašanje in vi.")}
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>Na lestvici 1–10: kako dobro ste po vašem mnenju opravili svoje delo?</div>
      <RatingScale value={selfScore} onChange={setSelfScore} color={C.gold} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:S.sm+2 }}>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>1 = Nisem dosegel/a ničesar</span>
        <span style={{ fontSize:"0.68rem", fontFamily:sans, color:C.faint }}>10 = Presegl/a sem pričakovanja</span>
      </div>
    </Card>
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Na kaj ste resnično ponosni? (ena stvar)</div>
      <textarea className="app-input" rows={3} placeholder="Brez PR-a. Kaj resnično koristi Sloveniji?" value={achievement} onChange={e=>setAchievement(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj bi naredili drugače? Kje ste zgrešili?</div>
      <textarea className="app-input" rows={3} placeholder="Iskrenost je vredna več kot vsak PR." value={failure} onChange={e=>setFailure(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("promises")} disabled={selfScore===null||!achievement.trim()||!failure.trim()} variant="gold">Naprej →</ActionBtn>
  </>, "p-truth");

  if (step === "promises") return W(<>
    {H(idx.promises, "Obljube vs. realnost.", "Vsak politik vstopi s cilji. Koliko ste jih dosegli?")}
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.md }}>Koliko % predvolilnih obljub ste izpolnili?</div>
      <div style={{ display:"flex", gap:S.sm, flexWrap:"wrap" }}>
        {[0,10,20,30,40,50,60,70,80,90,100].map(n=>(
          <button key={n} onClick={()=>setPromisesKept(n)} style={{
            padding:`${S.sm+2}px ${S.md}px`, borderRadius:R.sm, border:"none", cursor:"pointer",
            fontWeight:700, fontSize:"0.82rem", fontFamily:sans,
            background:promisesKept===n?C.gold:"rgba(255,255,255,0.06)",
            color:promisesKept===n?"#000":C.muted,
            transition:"all 0.15s",
            transform:promisesKept===n?"scale(1.08)":"scale(1)",
          }}>{n}%</button>
        ))}
      </div>
    </Card>
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Zakaj niste izpolnili vseh? Kaj vas je ustavilo?</div>
      <textarea className="app-input" rows={4} placeholder="Sistem? Koalicijsko usklajevanje? Proračun?" value={promisesWhy} onChange={e=>setPromisesWhy(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("gaps")} disabled={promisesKept===null||!promisesWhy.trim()} variant="gold">Naprej →</ActionBtn>
  </>, "p-promises");

  if (step === "gaps") return W(<>
    {H(idx.gaps, "Kaj bi spremenili?", "Če bi imeli popolno moč za en dan — kaj bi naredili?")}
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj je največja sistemska ovira v Slovenski politiki?</div>
      <textarea className="app-input" rows={3} placeholder="Birokracija? Koalicijsko usklajevanje? Kratki mandati?" value={obstacle} onChange={e=>setObstacle(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj bi spremenili v načinu dela politike v Sloveniji?</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Skupna miza brez kamer — odkrita debata brez strankarskih interesov.'" value={wouldChange} onChange={e=>setWouldChange(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={()=>setStep("ask")} disabled={!obstacle.trim()||!wouldChange.trim()} variant="gold">Naprej →</ActionBtn>
  </>, "p-gaps");

  if (step === "ask") return W(<>
    {H(idx.ask, "Vaše sporočilo Slovencem.", "Enkrat — brez medijev, brez stranke. Samo vi in 2,1 milijona Slovencev.")}
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj bi vprašali Slovence, če bi vas jutri resnično poslušali?</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Želim vedeti, kaj resnično potrebujete.'" value={askPublic} onChange={e=>setAskPublic(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <Card gold>
      <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Vaša ena želja za Slovenijo:</div>
      <textarea className="app-input" rows={3} placeholder="Brez politike. Kot Slovenec / Slovenka — ne kot funkcionar." value={wish} onChange={e=>setWish(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </Card>
    <ActionBtn onClick={onDone} disabled={!askPublic.trim()||!wish.trim()} large variant="gold">Oddaj odgovor 🇸🇮</ActionBtn>
  </>, "p-ask");

  return null;
}

// ═══════════════════════════════════════════════════════════
//  THANK YOU
// ═══════════════════════════════════════════════════════════
function ThankYou({ role }: { role:Role }) {
  return (
    <FadeSlide id="thankyou">
      <div style={{ maxWidth:500, margin:"0 auto", textAlign:"center", padding:`60px max(10vw, 24px) 180px`, position:"relative" }}>
        <div style={{
          fontSize:"5rem", marginBottom:S.lg, lineHeight:1,
          animation:"cinematic-flag-float 3s ease-in-out infinite",
        }}>🇸🇮</div>

        <h2 style={{
          fontFamily:sans, fontSize:"clamp(1.8rem,5vw,2.4rem)", fontWeight:800,
          color:C.white, marginBottom:S.md, lineHeight:1.15, letterSpacing:"-0.02em",
        }}>
          {role==="citizen" ? "Hvala. Vaš glas šteje." : "Hvala. To je pogum."}
        </h2>

        <p style={{
          fontSize:"clamp(1.1rem,3.5vw,1.3rem)", fontWeight:700, marginBottom:S.xl,
          background:`linear-gradient(135deg, ${C.emeraldMid}, ${C.emerald})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>Pokazali ste, da niste fejk.</p>

        <p style={{ color:C.muted, fontSize:"0.9rem", fontFamily:sans, lineHeight:1.8, maxWidth:400, margin:`0 auto ${S.xl}px` }}>
          {role==="citizen"
            ? "Vaš odgovor se bo združil z odgovori tisočih Slovencev in politikov. Tudi vi ste danes pokazali, da vam ni vseeno."
            : "Vaš odgovor bo del celotne slike. Danes ste pokazali, da znate tudi poslušati."}
        </p>

        {/* Quote */}
        <div style={{
          background:"rgba(255,255,255,0.05)", backdropFilter:"blur(6px)",
          borderRadius:R.lg, padding:`${S.lg}px`,
          marginBottom:S.lg, borderLeft:`4px solid ${C.emerald}`, textAlign:"left",
        }}>
          <p style={{
            fontFamily:serif, fontSize:"1.05rem", fontStyle:"italic",
            color:"rgba(255,255,255,0.85)", lineHeight:1.8, margin:0,
          }}>&ldquo;Mogli bi vsi skupaj tiščati gor pa skupaj začeti graditi.&rdquo;</p>
        </div>

        <Card>
          <div style={{ fontSize:"0.84rem", fontWeight:700, fontFamily:sans, color:C.white, marginBottom:S.sm }}>Kaj zdaj?</div>
          <p style={{ fontSize:"0.78rem", fontFamily:sans, color:C.muted, lineHeight:1.75, margin:0 }}>
            Ko zberemo dovolj odgovorov, bomo objavili skupno sliko — brez filtra, brez spina.
            Spremljajte nas za obvestilo.
          </p>
        </Card>

        <div style={{
          padding:`${S.md+2}px ${S.lg}px`,
          background:"rgba(122,184,0,0.04)", backdropFilter:"blur(4px)",
          border:`1px solid rgba(122,184,0,0.10)`, borderRadius:R.lg,
        }}>
          <p style={{ fontSize:"0.75rem", fontFamily:sans, color:C.faint, lineHeight:1.85, margin:0 }}>
            Pošljite naprej — vsakemu, ki mu ni vseeno.<br />
            <span style={{ color:C.emerald, fontWeight:600 }}>Slovenija ne rabi pasti. Rabi nas.</span>
          </p>
        </div>

        <div style={{ position:"fixed", bottom:56, right:S.lg, zIndex:10, opacity:0.7, transition:"opacity 0.2s" }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="1";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="0.7";}}
        ><NismoFejkLogo size={64} /></div>
      </div>
    </FadeSlide>
  );
}

// ═══════════════════════════════════════════════════════════
//  HEADER
// ═══════════════════════════════════════════════════════════
function SurveyHeader({ phase, onBack }: { phase: string; onBack:()=>void }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      background:"rgba(10,15,30,0.75)", backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${C.border}`,
      padding:`${S.md-2}px max(10vw, 24px)`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div style={{ fontSize:"0.95rem", fontWeight:900, fontFamily:sans, letterSpacing:"-0.02em" }}>
        <span style={{ color:C.emerald }}>#</span><span style={{ color:"#f1f5f9" }}>nismofejk</span>
      </div>
      {phase !== "intro" && (
        <button onClick={onBack} style={{
          padding:`${S.sm-1}px ${S.md}px`, background:"transparent",
          color:C.muted, border:`1px solid ${C.borderFaint}`,
          borderRadius:R.sm, fontSize:"0.72rem", fontWeight:500, fontFamily:sans,
          cursor:"pointer", transition:"all 0.15s",
        }}
          onMouseEnter={e=>{const s=e.currentTarget.style;s.color="white";s.borderColor=`rgba(122,184,0,0.3)`;}}
          onMouseLeave={e=>{const s=e.currentTarget.style;s.color=C.muted;s.borderColor=C.borderFaint;}}
        >← Nazaj</button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MAIN
// ═══════════════════════════════════════════════════════════
export default function Survey() {
  const [phase, setPhase] = useState<SurveyPhase>("intro");
  const [role, setRole] = useState<Role>("citizen");
  const [largeText, setLargeText] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Smooth page-reveal on mount
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 50); return () => clearTimeout(t); }, []);
  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [phase]);

  const handleBack = () => {
    if (phase === "role") setPhase("intro");
    else if (phase === "survey") setPhase("role");
    else if (phase === "thankyou") setPhase("role");
  };

  return (
    <div style={{ minHeight:"100vh", background:"transparent", position:"relative", letterSpacing:"0.01em" }}
      className={largeText ? "large-text-mode" : ""}>
      <GenerativeBg showParticles />
      <div style={{
        position:"relative", zIndex:1,
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(18px)",
        transition:"opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <SurveyHeader phase={phase} onBack={handleBack} />
        {phase !== "thankyou" && (
          <AccessibilityToggle largeText={largeText} onToggle={() => setLargeText(p => !p)} />
        )}
        {phase === "intro"     && <IntroScreen onContinue={()=>setPhase("role")} largeText={largeText} />}
        {phase === "role"      && <RoleSelect onSelect={r=>{setRole(r);setPhase("survey");}} />}
        {phase === "survey" && role === "citizen"    && <CitizenSurvey onDone={()=>setPhase("thankyou")} />}
        {phase === "survey" && role === "politician" && <PoliticianSurvey onDone={()=>setPhase("thankyou")} />}
        {phase === "thankyou"  && <ThankYou role={role} />}
      </div>
      <SocialProofCounter />
    </div>
  );
}
