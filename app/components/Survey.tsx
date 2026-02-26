"use client";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────
//  SLOVENIAN THEME TOKENS
// ─────────────────────────────────────────────────────────
const T = {
  bg:        "#050f08",          // near-black forest night
  surface:   "#0a1a0f",          // dark moss
  surface2:  "#0f2318",          // deep fern
  green:     "#22c55e",          // Soča green
  greenDim:  "#16a34a",
  greenGlow: "rgba(34,197,94,0.18)",
  greenMid:  "#4ade80",
  blue:      "#3b82f6",          // Slovenian flag blue
  red:       "#ef4444",          // Slovenian flag red
  gold:      "#fbbf24",          // politicians
  border:    "rgba(34,197,94,0.14)",
  border2:   "rgba(255,255,255,0.07)",
  text:      "#e2e8f0",
  muted:     "#64748b",
  muted2:    "#334155",
};

// ─────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────
type Role = "citizen" | "politician";
type CitizenStep = "identity" | "feeling" | "departments" | "vision" | "politicians" | "wish";
type PoliticianStep = "identity" | "truth" | "promises" | "gaps" | "ask";
type SurveyPhase = "intro" | "role" | "survey" | "thankyou";

// ─────────────────────────────────────────────────────────
//  SHARED DATA
// ─────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────
//  SVG BACKGROUNDS — Slovenian landscapes
// ─────────────────────────────────────────────────────────

// Triglav — accurate three-peak outline sketch
// Central peak (Triglav) = tallest & sharpest needle
// Right flank (Mali Triglav) = 95% height, also sharp
// Left flank (Rjavec) = ~89% height, slightly broader
// Style: stroke outline only — like a pencil sketch fading into the dark
function TriglavBg() {
  // Coordinate system: viewBox 0 0 1200 600, mountain centered, base at y=600
  // Central peak tip: (600, 40)  — the main Triglav summit
  // Mali Triglav tip: (820, 110) — right, slightly lower
  // Rjavec tip:       (370, 150) — left, lowest of the three

  const outline = `
    M 0,600
    L 0,520
    L 80,500
    L 140,490
    L 190,475
    L 230,465

    L 260,455
    L 295,440
    L 320,418
    L 340,395
    L 355,370
    L 367,345
    L 370,150
    L 378,170
    L 390,205
    L 400,235
    L 408,252
    L 415,268
    L 425,278
    L 434,290
    L 443,305
    L 452,318

    L 460,305
    L 466,290
    L 471,272
    L 476,255
    L 481,235
    L 487,215
    L 492,195
    L 498,172
    L 506,152
    L 512,132
    L 518,110
    L 524,90
    L 530,68
    L 536,46
    L 542,24
    L 548,6
    L 552,24
    L 557,46
    L 562,68
    L 567,90
    L 572,110
    L 577,130
    L 582,150
    L 587,168
    L 592,185
    L 597,200
    L 602,214
    L 608,227

    L 614,218
    L 620,205
    L 628,190
    L 636,175
    L 645,162
    L 655,148
    L 665,135
    L 675,120
    L 685,108
    L 695,96
    L 705,85
    L 715,74
    L 725,64
    L 733,57
    L 740,50
    L 747,57
    L 754,66
    L 762,78
    L 771,91
    L 780,105
    L 790,118
    L 800,132
    L 810,148
    L 820,162
    L 829,178
    L 837,193
    L 844,208
    L 851,224
    L 858,238

    L 866,252
    L 874,265
    L 883,278
    L 892,290
    L 903,302
    L 915,315
    L 928,330
    L 942,343
    L 956,355
    L 970,367
    L 985,377
    L 1000,386
    L 1020,394
    L 1045,400
    L 1070,408
    L 1100,415
    L 1130,422
    L 1160,428
    L 1200,435
    L 1200,600
    Z
  `;

  // Rock face detail lines — the angular facets that make it look like rock
  const rockLines = [
    // Central peak left face facets
    "M 548,6 L 510,130",
    "M 548,6 L 530,68 L 492,150",
    "M 524,90 L 498,172 L 460,305",
    "M 512,132 L 480,200 L 452,318",
    // Central peak right face facets
    "M 548,6 L 577,130",
    "M 548,6 L 562,68 L 597,150",
    "M 572,110 L 602,214",
    "M 587,168 L 614,218",
    // Valley between central and right (Mali Triglav)
    "M 608,227 L 630,260 L 645,248 L 655,235",
    // Mali Triglav (right) left face
    "M 740,50 L 705,85 L 670,135",
    "M 740,50 L 715,74 L 680,122",
    "M 725,64 L 695,96 L 660,148 L 636,175",
    // Mali Triglav right face
    "M 740,50 L 762,78 L 800,132",
    "M 740,50 L 771,91 L 810,148",
    "M 780,105 L 820,162 L 844,208",
    // Valley between central and left (Rjavec)
    "M 452,318 L 440,335 L 425,320 L 408,308",
    // Rjavec (left) right face — approaching from valley
    "M 370,150 L 395,200 L 420,250 L 443,305",
    "M 370,150 L 408,235 L 430,285",
    // Rjavec left face — going down to base
    "M 370,150 L 348,200 L 330,260 L 320,320",
    "M 370,150 L 355,220 L 340,290",
    // Snow ledge lines — horizontal breaks near summits
    "M 535,52 L 562,52",
    "M 526,80 L 570,80",
    "M 730,68 L 752,68",
    "M 722,90 L 760,90",
    "M 362,165 L 382,160",
  ];

  return (
    <svg
      viewBox="0 0 1200 600"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position:"fixed", bottom:0, left:0, width:"100%", height:"70vh",
        pointerEvents:"none", zIndex:0,
        userSelect:"none",
      }}
      preserveAspectRatio="xMidYMax meet"
    >
      <defs>
        {/* Fade: fully visible at bottom, fades out toward tips */}
        <linearGradient id="trig-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4ade80" stopOpacity="0" />
          <stop offset="35%"  stopColor="#4ade80" stopOpacity="0.06" />
          <stop offset="70%"  stopColor="#22c55e" stopOpacity="0.13" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="stroke-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#4ade80" stopOpacity="0.04" />
          <stop offset="40%"  stopColor="#4ade80" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Filled silhouette — very faint green fill */}
      <path d={outline} fill="url(#trig-fade)" />

      {/* Main outline stroke — the sketch effect */}
      <path d={outline}
        fill="none"
        stroke="url(#stroke-fade)"
        strokeWidth="1.8"
        strokeLinejoin="miter"
        strokeLinecap="round"
      />

      {/* Rock face detail lines */}
      {rockLines.map((d, i) => (
        <path key={i} d={d}
          fill="none"
          stroke="#4ade80"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity={0.12}
        />
      ))}

      {/* Snow cap highlights at three tips — tiny bright strokes */}
      {/* Central Triglav snow */}
      <path d="M 535,52 L 548,6 L 562,52 L 553,58 L 543,58 Z"
        fill="none" stroke="#86efac" strokeWidth="1.2" opacity="0.25" />
      {/* Mali Triglav snow */}
      <path d="M 726,68 L 740,50 L 754,68 L 748,74 L 732,74 Z"
        fill="none" stroke="#86efac" strokeWidth="1" opacity="0.18" />
      {/* Rjavec snow */}
      <path d="M 362,164 L 370,150 L 379,164 L 374,170 L 365,170 Z"
        fill="none" stroke="#86efac" strokeWidth="0.9" opacity="0.14" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  #NISMOFEJK LOGO — white pigeon on black circle
// ─────────────────────────────────────────────────────────
function NismoFejkLogo({ size = 80 }: { size?: number }) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Black circle */}
      <circle cx="100" cy="100" r="100" fill="#000" />

      {/* Pigeon body — stylized, facing left, walking stance */}
      <g fill="#fff">
        {/* Head */}
        <ellipse cx="72" cy="58" rx="14" ry="12" />
        {/* Beak */}
        <polygon points="58,56 48,59 58,62" />
        {/* Eye */}
        <circle cx="68" cy="56" r="2.5" fill="#000" />

        {/* Neck */}
        <path d="M78,66 Q85,72 88,80 L76,80 Q74,72 72,68 Z" />

        {/* Body — plump oval */}
        <ellipse cx="105" cy="92" rx="32" ry="22" />

        {/* Wing detail — layered feathers */}
        <path d="M88,82 Q95,75 110,74 Q125,73 138,78 Q130,82 118,84 Q108,85 98,84 Z" />
        <path d="M90,88 Q100,82 115,81 Q130,80 142,85 Q132,88 120,89 Q108,90 96,89 Z" />

        {/* Tail feathers — fanned out to the right */}
        <path d="M132,86 L158,72 Q155,82 148,88 Z" />
        <path d="M134,90 L162,82 Q158,90 150,95 Z" />
        <path d="M135,94 L160,92 Q156,98 148,102 Z" />
      </g>

      {/* #NISMOFEJK text */}
      <text x="100" y="132" textAnchor="middle"
        fill="#fff" fontWeight="900" fontSize="24" fontFamily="Arial,Helvetica,sans-serif"
        letterSpacing="0.5">#NISMOFEJK</text>

      {/* Pigeon legs — walking stance */}
      <g stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round">
        {/* Left leg — forward */}
        <path d="M92,112 L86,138 L78,142" />
        <path d="M86,138 L92,142" />
        {/* Right leg — back */}
        <path d="M112,112 L118,136 L126,142" />
        <path d="M118,136 L112,142" />
      </g>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  PAGE TRANSITION WRAPPER
// ─────────────────────────────────────────────────────────
function FadeSlide({ children, id }: { children: React.ReactNode; id: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, [id]);
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(18px)",
      transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)",
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  STEP INDICATOR
// ─────────────────────────────────────────────────────────
function StepDots({ total, current, color }: { total:number; current:number; color:string }) {
  return (
    <div style={{ display:"flex", gap:6, alignItems:"center", marginBottom:4 }}>
      {Array.from({length:total}).map((_,i) => (
        <div key={i} style={{
          width: i === current ? 24 : 7, height:7, borderRadius:4,
          background: i < current ? color + "88" : i === current ? color : "rgba(255,255,255,0.08)",
          transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
        }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  RATING SCALE — mobile-friendly larger touch targets
// ─────────────────────────────────────────────────────────
function RatingScale({ value, onChange, color }: { value:number|null; onChange:(n:number)=>void; color:string }) {
  return (
    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
      {Array.from({length:10}, (_,i) => i+1).map(n => (
        <button key={n} onClick={() => onChange(n)}
          style={{
            width:44, height:44, borderRadius:10, border:"none", cursor:"pointer",
            fontWeight:700, fontSize:"0.9rem",
            background: value === n ? color : value !== null && value >= n ? color + "33" : "rgba(255,255,255,0.06)",
            color: value !== null && value >= n ? "white" : "#64748b",
            transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
            transform: value === n ? "scale(1.15)" : "scale(1)",
            boxShadow: value === n ? `0 0 16px ${color}55` : "none",
          }}>
          {n}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  GREEN GLOW CARD — Slovenian forest surface
// ─────────────────────────────────────────────────────────
function GCard({ children, style = {} }: { children:React.ReactNode; style?:React.CSSProperties }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: 16,
      padding: 20,
      marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  INTRO — #nismofejk · Slovenian green cinematic
// ─────────────────────────────────────────────────────────
function IntroScreen({ onContinue }: { onContinue:()=>void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"32px 20px 48px",
      background:`radial-gradient(ellipse at 50% 20%, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.03) 40%, transparent 70%)`,
      opacity: visible ? 1 : 0,
      transition:"opacity 0.9s ease",
    }}>
      <div style={{ maxWidth:500, width:"100%", textAlign:"center", position:"relative", zIndex:1 }}>

        {/* Hashtag */}
        <div style={{
          display:"inline-block",
          fontSize:"clamp(2.2rem,8vw,3.6rem)",
          fontWeight:900,
          letterSpacing:"-0.03em",
          marginBottom:20,
          background:"linear-gradient(135deg,#4ade80,#22c55e,#16a34a)",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent",
          backgroundClip:"text",
          filter:"drop-shadow(0 0 32px rgba(34,197,94,0.4))",
        }}>
          #nismofejk
        </div>

        {/* Flag */}
        <div style={{ fontSize:"3rem", marginBottom:16, lineHeight:1 }}>🇸🇮</div>

        {/* Headline */}
        <h1 style={{
          fontSize:"clamp(1.9rem,6vw,3.2rem)",
          fontWeight:900,
          lineHeight:1.08,
          color:"white",
          marginBottom:18,
          letterSpacing:"-0.025em",
        }}>
          Slovenija ne rabi pasti.<br />
          <span style={{
            background:"linear-gradient(135deg,#86efac,#22c55e)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            Rabi se umeriti.
          </span>
        </h1>

        {/* Body */}
        <p style={{
          color:"#64748b",
          fontSize:"clamp(0.88rem,2.8vw,1rem)",
          lineHeight:1.85,
          maxWidth:420,
          margin:"0 auto 32px",
        }}>

          Eden starjši gospod nam je povedal: <em>&quot;Od kar sem polnoleten, nisem niti enkrat volitev zgrešil.
          Niti enkrat. Ker sem zmeraj hotel sodelovat zraven — da imaš en občutek, da si nekaj naredil.&quot;</em>
          <br /><br />
          Celo življenje je bil aktiven — v fabriki, v sindikatu, v delegaciji za republiško skupščino.
          Danes gleda, kako se grebejo, kako grdo se obravnavajo eden drugega —
          in reče: <strong style={{ color:"white" }}>&quot;Vse delajo za nas. Ampak delajo tako grdo, da je to nekaj neverjetnega.&quot;</strong>
          <br /><br />
          Njegov prijatelj doda: <em>&quot;Mogli bi vsi skupaj tiščati gor pa skupaj začeti graditi.
          Ne pa da vsak svoje probleme meče. Sam pač — kdo bo to naredil?&quot;</em>
          <br /><br />
          <strong style={{ color:"white" }}>Mi. Skupaj. Tukaj.</strong>
        </p>

        {/* Stats bar */}
        <div style={{
          display:"flex",
          marginBottom:32,
          background:"rgba(34,197,94,0.04)",
          border:`1px solid ${T.border}`,
          borderRadius:16,
          overflow:"hidden",
        }}>
          {[
            { v:"2.100.000+", l:"Slovencev",               c:T.green },
            { v:"3.600+",     l:"Izvoljenih funkcionarjev", c:T.gold },
            { v:"~5 min",     l:"Čas izpolnjevanja",        c:T.greenMid },
          ].map((s,i) => (
            <div key={i} style={{
              flex:1, padding:"16px 8px", textAlign:"center",
              borderRight: i < 2 ? `1px solid ${T.border}` : "none",
            }}>
              <div style={{ fontSize:"clamp(0.95rem,3vw,1.4rem)", fontWeight:900, color:s.c, marginBottom:4, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:"0.6rem", color:"#475569", textTransform:"uppercase", letterSpacing:"0.07em", lineHeight:1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button onClick={onContinue} style={{
          width:"100%", padding:"17px 24px",
          fontSize:"1.05rem", fontWeight:800, borderRadius:14,
          background:`linear-gradient(135deg, ${T.green}, ${T.greenDim})`,
          border:"none", color:"white", cursor:"pointer",
          boxShadow:`0 4px 24px rgba(34,197,94,0.35)`,
          transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          letterSpacing:"-0.01em",
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px) scale(1.01)";(e.currentTarget as HTMLElement).style.boxShadow="0 8px 32px rgba(34,197,94,0.45)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0) scale(1)";(e.currentTarget as HTMLElement).style.boxShadow="0 4px 24px rgba(34,197,94,0.35)";}}
        >
          Začni anketo →
        </button>

        <p style={{ marginTop:16, fontSize:"0.68rem", color:"#1e3a1e", lineHeight:1.6 }}>
          Anonimno · Brez registracije · Odgovori se združijo z vsemi drugimi
        </p>

        {/* Why box */}
        <div style={{
          marginTop:32, padding:"20px 22px",
          background:"rgba(34,197,94,0.03)",
          border:`1px solid rgba(34,197,94,0.1)`,
          borderRadius:16, textAlign:"left",
        }}>
          <p style={{ fontSize:"0.73rem", color:"#334155", lineHeight:1.9, margin:0 }}>
            <span style={{ color:"#4ade80", fontWeight:700 }}>Zakaj ta anketa?</span>
            <br />
            Tole gradi en človek v ozadju — z ljudmi, ki jih že celo življenje ni nihče vprašal,
            pa so zmeraj bili zraven. V fabriki, na volitvah, v sindikatu, na ulici.
            Ljudje, ki jim ni bilo nikoli vseeno.
            <br /><br />
            Slovenija ne rabi pasti. Rabi samo{" "}
            <span style={{ color:T.greenMid, fontWeight:600 }}>na novo umeriti, kako vse skupaj deluje.</span>
            {" "}Ampak za to moramo najprej vedeti, kje smo. Ne iz medijev,
            ne iz strank — od vas. Od vsakega Slovenca.
            <br /><br />
            Ko politik oceni zdravstvo s 6/10, državljan pa s 3.8/10 — to ni mnenje. To je dejstvo.
            In ko imaš dovolj takih dejstev,{" "}
            <span style={{ color:T.green, fontWeight:600 }}>se začne videti, kje moramo popraviti.</span>{" "}
            Pošljite naprej. Vsak Slovenec šteje.
          </p>
          <div style={{ marginTop:14, fontSize:"0.65rem", color:"#1e3a1e" }}>
            #nismofejk · 2025 ·{" "}
            <a href="https://instagram.com/NEPRIDIPRAV" target="_blank" rel="noopener noreferrer"
              style={{ color:T.green, fontWeight:700, textDecoration:"none" }}>
              @NEPRIDIPRAV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  ROLE SELECT
// ─────────────────────────────────────────────────────────
function RoleSelect({ onSelect }: { onSelect:(r:Role)=>void }) {
  return (
    <FadeSlide id="role">
      <div style={{ maxWidth:500, margin:"0 auto", padding:"40px 20px 80px" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ fontSize:"0.7rem", color:T.green, fontFamily:"monospace", letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:10 }}>
            Izberi vlogo
          </div>
          <h2 style={{ fontSize:"clamp(1.7rem,5vw,2.6rem)", fontWeight:900, lineHeight:1.05, color:"white", marginBottom:10 }}>Kdo ste?</h2>
          <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.6 }}>Glede na vašo vlogo boste prejeli drugačna vprašanja.</p>
        </div>

        <div style={{ display:"grid", gap:14, marginBottom:24 }}>
          {/* Citizen */}
          <button onClick={() => onSelect("citizen")} style={{
            padding:"26px 22px", borderRadius:20,
            border:`2px solid rgba(34,197,94,0.25)`,
            background:`rgba(34,197,94,0.06)`, cursor:"pointer", textAlign:"left",
            transition:"all 0.22s ease", width:"100%",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(34,197,94,0.55)";(e.currentTarget as HTMLElement).style.background="rgba(34,197,94,0.12)";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(34,197,94,0.25)";(e.currentTarget as HTMLElement).style.background="rgba(34,197,94,0.06)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
          >
            <div style={{ fontSize:"2rem", marginBottom:10 }}>🏔️</div>
            <div style={{ fontSize:"1.1rem", fontWeight:900, color:"white", marginBottom:6 }}>Sem Slovenec / Slovenka</div>
            <div style={{ fontSize:"0.82rem", color:T.muted, lineHeight:1.65 }}>
              Celo življenje ste bili zraven. Danes pa končno nekdo vpraša — kaj si vi mislite?
            </div>
            <div style={{ marginTop:12, fontSize:"0.72rem", color:T.greenMid, fontWeight:700 }}>6 korakov · ~5 minut →</div>
          </button>

          {/* Politician */}
          <button onClick={() => onSelect("politician")} style={{
            padding:"26px 22px", borderRadius:20,
            border:`2px solid rgba(251,191,36,0.25)`,
            background:`rgba(251,191,36,0.05)`, cursor:"pointer", textAlign:"left",
            transition:"all 0.22s ease", width:"100%",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(251,191,36,0.55)";(e.currentTarget as HTMLElement).style.background="rgba(251,191,36,0.11)";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(251,191,36,0.25)";(e.currentTarget as HTMLElement).style.background="rgba(251,191,36,0.05)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
          >
            <div style={{ fontSize:"2rem", marginBottom:10 }}>🏛️</div>
            <div style={{ fontSize:"1.1rem", fontWeight:900, color:"white", marginBottom:6 }}>Sem Slovenski politik</div>
            <div style={{ fontSize:"0.82rem", color:T.muted, lineHeight:1.65 }}>
              Ljudje gledajo, kako se grebete. Tukaj je priložnost pokazati, da vam je mar. Brez kamere, brez PR-a.
            </div>
            <div style={{ marginTop:12, fontSize:"0.72rem", color:T.gold, fontWeight:700 }}>5 korakov · ~7 minut →</div>
          </button>
        </div>

        <GCard style={{ padding:16 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:"1.1rem" }}>🔒</span>
            <div>
              <div style={{ fontSize:"0.78rem", fontWeight:700, color:"white", marginBottom:3 }}>Anonimno & varno</div>
              <div style={{ fontSize:"0.72rem", color:"#475569", lineHeight:1.55 }}>
                Nobenih osebnih podatkov. Odgovori se združijo z drugimi. Cilj je videti celotno sliko.
              </div>
            </div>
          </div>
        </GCard>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, fontSize:"0.68rem", color:"#1e3a1e" }}>
          <span>3.600+ izvoljenih funkcionarjev · 2,1M Slovencev</span>
          <span style={{ color:"#2d5a2d" }}>#nismofejk</span>
        </div>
      </div>
    </FadeSlide>
  );
}

// ─────────────────────────────────────────────────────────
//  CITIZEN SURVEY
// ─────────────────────────────────────────────────────────
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
      <div style={{ maxWidth:560, margin:"0 auto", padding:"32px 20px 80px" }}>{inner}</div>
    </FadeSlide>
  );

  const H = (s: number, title: string, sub: string) => (
    <div style={{ marginTop:24, marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <StepDots total={TOTAL} current={s} color={T.green} />
        <span style={{ fontSize:"0.68rem", color:T.green, fontFamily:"monospace", letterSpacing:"0.14em", textTransform:"uppercase" }}>
          {s+1} / {TOTAL}
        </span>
      </div>
      <h2 style={{ fontSize:"clamp(1.55rem,4.5vw,2.3rem)", fontWeight:900, lineHeight:1.12, marginBottom:10, color:"white" }}
        dangerouslySetInnerHTML={{ __html: title }} />
      <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.65 }}>{sub}</p>
    </div>
  );

  if (step === "identity") return W(<>
    {H(idx.identity, "Povejte nam, kdo ste.", "Anonimno. Nobenih imen — samo da vidimo celotno sliko Slovenije.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
      <div>
        <label style={{ fontSize:"0.75rem", color:T.muted, fontWeight:600, display:"block", marginBottom:6 }}>Regija</label>
        <select className="app-input" value={region} onChange={e=>setRegion(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["Ljubljana","Maribor","Celje","Koper","Kranj","Novo Mesto","Murska Sobota","Gorenjska","Koroška","Notranjska","Primorska","Drugo"].map(r=><option key={r}>{r}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:"0.75rem", color:T.muted, fontWeight:600, display:"block", marginBottom:6 }}>Starost</label>
        <select className="app-input" value={age} onChange={e=>setAge(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["18–25","26–35","36–45","46–55","56–65","65+"].map(a=><option key={a}>{a}</option>)}
        </select>
      </div>
    </div>
    <GreenBtn onClick={()=>setStep("feeling")} disabled={!region||!age}>Naprej →</GreenBtn>
  </>, "c-identity");

  if (step === "feeling") return W(<>
    {H(idx.feeling, "Kako se počutite v Sloveniji?", "Nikoli vas niso vprašali. Danes vas vprašamo. Ni napačnega odgovora.")}
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:16 }}>Na lestvici 1–10: kako dober kraj za življenje je Slovenija <em>za vas</em>?</div>
      <RatingScale value={feelingScore} onChange={setFeelingScore} color={T.green} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>1 = Zelo slabo</span>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>10 = Odlično</span>
      </div>
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:12 }}>"Smo na pravi poti?"</div>
      <div style={{ display:"flex", gap:10 }}>
        {[{v:"up" as const,e:"👍",l:"Da, gremo naprej",c:"#22c55e"},{v:"down" as const,e:"👎",l:"Ne, sprememba smeri",c:"#ef4444"}].map(b=>(
          <button key={b.v} onClick={()=>setThumb(b.v)} style={{
            flex:1, padding:"16px 10px", borderRadius:14, border:"none", cursor:"pointer",
            background: thumb===b.v?`${b.c}1a`:"rgba(255,255,255,0.04)",
            outline: thumb===b.v?`2px solid ${b.c}`:"2px solid transparent",
            transition:"all 0.2s",
          }}>
            <div style={{ fontSize:"2.2rem", marginBottom:6 }}>{b.e}</div>
            <div style={{ fontSize:"0.75rem", color:thumb===b.v?b.c:T.muted, fontWeight:600, lineHeight:1.3 }}>{b.l}</div>
          </button>
        ))}
      </div>
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Z enim stavkom: kaj si resnično mislite? <span style={{color:T.muted,fontWeight:400}}>(neobvezno)</span></div>
      <textarea className="app-input" rows={3} placeholder="Npr: 'Potencial imamo, politična volja manjka.'" value={feelingText} onChange={e=>setFeelingText(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GCard>
    <GreenBtn onClick={()=>setStep("departments")} disabled={feelingScore===null||thumb===null}>Naprej →</GreenBtn>
  </>, "c-feeling");

  if (step === "departments") return W(<>
    {H(idx.departments, "Ocenite vsako področje.", "1 = zelo slabo · 10 = odlično. Bodite realni, brez zadržkov.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
      {DEPARTMENTS.map(d=>(
        <div key={d.id} style={{
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:14, padding:14,
          borderLeftWidth: deptScores[d.id] ? 3 : 1,
          borderLeftColor: deptScores[d.id] ? (deptScores[d.id]>=7?T.green:deptScores[d.id]>=4?T.gold:T.red) : T.border,
          transition:"border-color 0.2s",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:10 }}>
            <span style={{ fontSize:"1.2rem" }}>{d.e}</span>
            <span style={{ fontSize:"0.82rem", fontWeight:700, color:"white" }}>{d.name}</span>
            {deptScores[d.id] && <span style={{ marginLeft:"auto", fontSize:"1rem", fontWeight:900, color:deptScores[d.id]>=7?T.green:deptScores[d.id]>=4?T.gold:T.red }}>{deptScores[d.id]}</span>}
          </div>
          <div style={{ display:"flex", gap:3, flexWrap:"wrap" }}>
            {Array.from({length:10},(_,i)=>i+1).map(n=>(
              <button key={n} onClick={()=>setDeptScores(s=>({...s,[d.id]:n}))} style={{
                width:26, height:26, borderRadius:6, border:"none", cursor:"pointer",
                fontWeight:700, fontSize:"0.7rem",
                background: deptScores[d.id]===n?(n>=7?T.green:n>=4?"#f59e0b":T.red):deptScores[d.id]>n?`rgba(34,197,94,0.18)`:"rgba(255,255,255,0.05)",
                color: deptScores[d.id]>=n?"white":"#475569",
                transition:"all 0.1s",
              }}>{n}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
    <GreenBtn onClick={()=>setStep("vision")} disabled={Object.keys(deptScores).length<DEPARTMENTS.length}>
      {Object.keys(deptScores).length<DEPARTMENTS.length?`Ocenite vsa področja (${Object.keys(deptScores).length}/${DEPARTMENTS.length})`:"Naprej →"}
    </GreenBtn>
  </>, "c-departments");

  if (step === "vision") return W(<>
    {H(idx.vision, "Kaj bi vi naredili?", "Ne bodite skromni — bodite realni. To je vaša Slovenija.")}
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:12 }}>Izberite 3 najpomembnejše prioritete za Slovenijo:</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {DEPARTMENTS.map(d=>{
          const sel=visionTop3.includes(d.id);
          return (
            <button key={d.id} onClick={()=>togglePriority(d.id)} style={{
              padding:"11px 12px", borderRadius:11, border:"none", cursor:"pointer",
              display:"flex", alignItems:"center", gap:8, textAlign:"left",
              background:sel?`rgba(34,197,94,0.15)`:"rgba(255,255,255,0.04)",
              outline:sel?`2px solid rgba(34,197,94,0.5)`:"2px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:"1rem" }}>{d.e}</span>
              <span style={{ fontSize:"0.78rem", fontWeight:600, color:sel?T.greenMid:"#94a3b8" }}>{d.name}</span>
              {sel && <span style={{ marginLeft:"auto", color:T.green, fontWeight:900, fontSize:"0.9rem" }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize:"0.7rem", color:T.muted2, marginTop:10 }}>Izbrano: {visionTop3.length} / 3</div>
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Opišite svojo vizijo za Slovenijo:</div>
      <textarea className="app-input" rows={5} placeholder="Npr: 'Hočem, da se moj otrok ne sprašuje, ali bo imel streho nad glavo.'" value={visionText} onChange={e=>setVisionText(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GCard>
    <GreenBtn onClick={()=>setStep("politicians")} disabled={visionTop3.length<3||!visionText.trim()}>Naprej →</GreenBtn>
  </>, "c-vision");

  if (step === "politicians") return W(<>
    {H(idx.politicians, "O politikih — odkrito.", "Nihče vas ne bo obsojal. Povejte, kar si resnično mislite.")}
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:16 }}>Na lestvici 1–10: koliko zaupate Slovenskim politikom?</div>
      <RatingScale value={polTrust} onChange={setPolTrust} color="#a78bfa" />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>1 = Nič</span>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>10 = Popolno zaupanje</span>
      </div>
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj bi sporočili politiku, ki bi vas danes resnično poslušal? <span style={{color:T.muted,fontWeight:400}}>(neobvezno)</span></div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Nehajte se prepirati in delajte.' ali 'Bodite bližje ljudem.'" value={polFeedback} onChange={e=>setPolFeedback(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GCard>
    <GreenBtn onClick={()=>setStep("wish")} disabled={polTrust===null}>Naprej →</GreenBtn>
  </>, "c-politicians");

  if (step === "wish") return W(<>
    {H(idx.wish, "Ena želja.<br/>Katera bi bila?", "Jutri boste prebrali: 'Slovenija je naredila X.' Kaj bi si želeli, da je ta X?")}
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:10 }}>Moja ena želja za Slovenijo:</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Da pridemo k zdravniku v enem tednu, ne v enem letu.'" value={wish} onChange={e=>setWish(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:10 }}>Ali menite, da je ta želja uresničljiva v 5 letih?</div>
      <div style={{ display:"flex", gap:8 }}>
        {[{v:"da",l:"Da 🙂"},{v:"mozda",l:"Morda 🤞"},{v:"ne",l:"Iskreno ne 😔"}].map(b=>(
          <button key={b.v} onClick={()=>setWishRealistic(b.v)} style={{
            flex:1, padding:"13px 6px", borderRadius:12, border:"none", cursor:"pointer",
            fontSize:"0.78rem", fontWeight:600,
            background:wishRealistic===b.v?`rgba(34,197,94,0.18)`:"rgba(255,255,255,0.04)",
            color:wishRealistic===b.v?T.greenMid:T.muted,
            outline:wishRealistic===b.v?`2px solid rgba(34,197,94,0.45)`:"2px solid transparent",
            transition:"all 0.15s",
          }}>{b.l}</button>
        ))}
      </div>
    </GCard>
    <GreenBtn onClick={onDone} disabled={!wish.trim()||!wishRealistic} large>
      Oddaj odgovor 🇸🇮
    </GreenBtn>
  </>, "c-wish");

  return null;
}

// ─────────────────────────────────────────────────────────
//  POLITICIAN SURVEY
// ─────────────────────────────────────────────────────────
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
      <div style={{ maxWidth:540, margin:"0 auto", padding:"32px 20px 80px" }}>{inner}</div>
    </FadeSlide>
  );

  const H = (s: number, title: string, sub: string) => (
    <div style={{ marginTop:24, marginBottom:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
        <StepDots total={TOTAL} current={s} color={T.gold} />
        <span style={{ fontSize:"0.68rem", color:T.gold, fontFamily:"monospace", letterSpacing:"0.14em", textTransform:"uppercase" }}>
          {s+1} / {TOTAL}{s===TOTAL-1?" · Zadnji":""}
        </span>
      </div>
      <h2 style={{ fontSize:"clamp(1.45rem,4vw,2.1rem)", fontWeight:900, lineHeight:1.12, marginBottom:10, color:"white" }}>{title}</h2>
      <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.65 }}>{sub}</p>
    </div>
  );

  const GoldCard = ({ children, style={} }: { children:React.ReactNode; style?:React.CSSProperties }) => (
    <div style={{ background:T.surface, border:`1px solid rgba(251,191,36,0.18)`, borderRadius:16, padding:20, marginBottom:14, ...style }}>
      {children}
    </div>
  );

  const GoldBtn = ({ onClick, disabled, children, large }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode; large?:boolean }) => (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding: large ? "16px 24px" : "13px 24px",
      fontSize: large ? "0.95rem" : "0.88rem", fontWeight:800, borderRadius:13,
      background: disabled ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${T.gold}, #f59e0b)`,
      border:"none", color: disabled ? T.muted : "#000", cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 20px rgba(251,191,36,0.3)",
      transition:"all 0.2s", letterSpacing:"-0.01em",
    }}>
      {children}
    </button>
  );

  if (step === "identity") return W(<>
    {H(idx.identity, "Postavite vse na mizo.", "Ni PR-a, ni kamere. Samo vi in vprašanja.")}
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
      <div>
        <label style={{ fontSize:"0.75rem", color:T.muted, fontWeight:600, display:"block", marginBottom:6 }}>Področje</label>
        <select className="app-input" value={dept} onChange={e=>setDept(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {DEPARTMENTS_POLITICIAN.map(d=><option key={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label style={{ fontSize:"0.75rem", color:T.muted, fontWeight:600, display:"block", marginBottom:6 }}>Leta v politiki</label>
        <select className="app-input" value={years} onChange={e=>setYears(e.target.value)} style={{ appearance:"none", fontSize:"0.88rem", padding:"12px" }}>
          <option value="">Izberite...</option>
          {["1–2 leti","3–5 let","6–10 let","11–20 let","20+ let"].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>
    </div>
    <GoldBtn onClick={()=>setStep("truth")} disabled={!dept||!years}>Naprej →</GoldBtn>
  </>, "p-identity");

  if (step === "truth") return W(<>
    {H(idx.truth, "Resnica brez kamere.", "Ni moderatorja, ni nasprotnika. Samo vprašanje in vi.")}
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:16 }}>Na lestvici 1–10: kako dobro ste po vašem mnenju opravili svoje delo?</div>
      <RatingScale value={selfScore} onChange={setSelfScore} color={T.gold} />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:10 }}>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>1 = Nisem dosegel/a ničesar</span>
        <span style={{ fontSize:"0.68rem", color:T.muted2 }}>10 = Presegl/a sem pričakovanja</span>
      </div>
    </GoldCard>
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Na kaj ste resnično ponosni? (ena stvar)</div>
      <textarea className="app-input" rows={3} placeholder="Brez PR-a. Kaj resnično koristi Sloveniji?" value={achievement} onChange={e=>setAchievement(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj bi naredili drugače? Kje ste zgrešili?</div>
      <textarea className="app-input" rows={3} placeholder="Iskrenost je vredna več kot vsak PR." value={failure} onChange={e=>setFailure(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldBtn onClick={()=>setStep("promises")} disabled={selfScore===null||!achievement.trim()||!failure.trim()}>Naprej →</GoldBtn>
  </>, "p-truth");

  if (step === "promises") return W(<>
    {H(idx.promises, "Obljube vs. realnost.", "Vsak politik vstopi s cilji. Koliko ste jih dosegli?")}
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:14 }}>Koliko % predvolilnih obljub ste izpolnili?</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {[0,10,20,30,40,50,60,70,80,90,100].map(n=>(
          <button key={n} onClick={()=>setPromisesKept(n)} style={{
            padding:"10px 13px", borderRadius:9, border:"none", cursor:"pointer", fontWeight:700, fontSize:"0.82rem",
            background:promisesKept===n?T.gold:"rgba(255,255,255,0.06)",
            color:promisesKept===n?"#000":T.muted,
            transition:"all 0.15s",
            transform: promisesKept===n ? "scale(1.08)" : "scale(1)",
          }}>{n}%</button>
        ))}
      </div>
    </GoldCard>
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Zakaj niste izpolnili vseh? Kaj vas je ustavilo?</div>
      <textarea className="app-input" rows={4} placeholder="Sistem? Koalicijsko usklajevanje? Proračun? Bodite iskreni." value={promisesWhy} onChange={e=>setPromisesWhy(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldBtn onClick={()=>setStep("gaps")} disabled={promisesKept===null||!promisesWhy.trim()}>Naprej →</GoldBtn>
  </>, "p-promises");

  if (step === "gaps") return W(<>
    {H(idx.gaps, "Kaj bi spremenili?", "Če bi imeli popolno moč za en dan — kaj bi naredili?")}
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj je največja sistemska ovira v Slovenski politiki?</div>
      <textarea className="app-input" rows={3} placeholder="Birokracija? Koalicijsko usklajevanje? Kratki mandati?" value={obstacle} onChange={e=>setObstacle(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj bi spremenili v načinu dela politike v Sloveniji?</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Skupna miza brez kamer — odkrita debata brez strankarskih interesov.'" value={wouldChange} onChange={e=>setWouldChange(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldBtn onClick={()=>setStep("ask")} disabled={!obstacle.trim()||!wouldChange.trim()}>Naprej →</GoldBtn>
  </>, "p-gaps");

  if (step === "ask") return W(<>
    {H(idx.ask, "Vaše sporočilo Slovencem.", "Enkrat — brez medijev, brez stranke. Samo vi in 2,1 milijona Slovencev.")}
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj bi vprašali Slovence, če bi vas jutri resnično poslušali?</div>
      <textarea className="app-input" rows={4} placeholder="Npr: 'Želim vedeti, kaj resnično potrebujete.'" value={askPublic} onChange={e=>setAskPublic(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Vaša ena želja za Slovenijo:</div>
      <textarea className="app-input" rows={3} placeholder="Brez politike. Kot Slovenec / Slovenka — ne kot funkcionar." value={wish} onChange={e=>setWish(e.target.value)} style={{ resize:"none", fontSize:"0.88rem" }} />
    </GoldCard>
    <GoldBtn onClick={onDone} disabled={!askPublic.trim()||!wish.trim()} large>
      Oddaj odgovor 🇸🇮
    </GoldBtn>
  </>, "p-ask");

  return null;
}

// ─────────────────────────────────────────────────────────
//  GREEN BUTTON (shared)
// ─────────────────────────────────────────────────────────
function GreenBtn({ onClick, disabled, children, large }: { onClick:()=>void; disabled?:boolean; children:React.ReactNode; large?:boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%", padding: large ? "16px 24px" : "13px 24px",
      fontSize: large ? "0.95rem" : "0.88rem", fontWeight:800, borderRadius:13,
      background: disabled ? "rgba(255,255,255,0.06)" : `linear-gradient(135deg, ${T.green}, ${T.greenDim})`,
      border:"none", color: disabled ? T.muted : "white", cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: disabled ? "none" : `0 4px 20px ${T.greenGlow}`,
      transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", letterSpacing:"-0.01em",
    }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
//  THANK YOU
// ─────────────────────────────────────────────────────────
function ThankYou({ role }: { role:Role }) {
  return (
    <FadeSlide id="thankyou">
      <div style={{ maxWidth:480, margin:"0 auto", textAlign:"center", padding:"60px 20px 80px", position:"relative" }}>
        {/* Animated flag */}
        <div style={{
          fontSize:"5rem", marginBottom:20, lineHeight:1,
          animation:"float 3s ease-in-out infinite",
        }}>🇸🇮</div>
        <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>

        <h2 style={{ fontSize:"clamp(1.8rem,5vw,2.4rem)", fontWeight:900, color:"white", marginBottom:12, lineHeight:1.1 }}>
          {role==="citizen" ? "Hvala. Vaš glas šteje." : "Hvala. To je pogum."}
        </h2>

        <p style={{
          fontSize:"clamp(1.1rem,3.5vw,1.4rem)", fontWeight:700, marginBottom:24,
          background:"linear-gradient(135deg,#4ade80,#22c55e)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>
          Pokazali ste, da niste fejk.
        </p>

        <p style={{ color:T.muted, fontSize:"0.9rem", lineHeight:1.75, maxWidth:380, margin:"0 auto 32px" }}>
          {role==="citizen"
            ? "Vaš odgovor se bo združil z odgovori tisočih Slovencev in politikov. Tako kot tisti gospod, ki ni nikoli zgrešil volitev — tudi vi ste danes pokazali, da vam ni vseeno."
            : "Vaš odgovor bo del celotne slike. Ljudje gledajo, kako se grebete — danes ste pokazali, da znate tudi poslušati."}
        </p>

        <div style={{
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:18, padding:"20px 24px", marginBottom:24,
        }}>
          <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj zdaj?</div>
          <p style={{ fontSize:"0.78rem", color:T.muted, lineHeight:1.7, margin:0 }}>
            Ko zberemo dovolj odgovorov, bomo objavili skupno sliko — brez filtra, brez spina.
            Spremljajte{" "}
            <a href="https://instagram.com/NEPRIDIPRAV" target="_blank" rel="noopener noreferrer"
              style={{ color:T.green, fontWeight:700, textDecoration:"none" }}>
              @NEPRIDIPRAV
            </a>{" "}
            za obvestilo.
          </p>
        </div>

        <div style={{
          padding:"18px 20px",
          background:"rgba(34,197,94,0.03)",
          border:`1px solid rgba(34,197,94,0.1)`,
          borderRadius:14,
        }}>
          <p style={{ fontSize:"0.72rem", color:"#334155", lineHeight:1.85, margin:0 }}>
            Mogli bi vsi skupaj tiščati gor pa skupaj začeti graditi.
            Pošljite naprej — vsakemu, ki mu ni vseeno.
            <br />
            <span style={{ color:T.green, fontWeight:600 }}>Slovenija ne rabi pasti. Rabi nas.</span>
          </p>
        </div>

        {/* #nismofejk logo — bottom right corner */}
        <div style={{
          position:"fixed", bottom:20, right:20, zIndex:10,
          opacity:0.7, transition:"opacity 0.2s",
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.opacity="1";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.opacity="0.7";}}
        >
          <NismoFejkLogo size={64} />
        </div>
      </div>
    </FadeSlide>
  );
}

// ─────────────────────────────────────────────────────────
//  SURVEY HEADER — sticky, forest-themed
// ─────────────────────────────────────────────────────────
function SurveyHeader({ phase, onBack }: { phase: string; onBack:()=>void }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      background:"rgba(5,15,8,0.94)", backdropFilter:"blur(14px)",
      borderBottom:`1px solid rgba(34,197,94,0.1)`,
      padding:"13px 20px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div style={{ fontSize:"0.95rem", fontWeight:900, letterSpacing:"-0.02em" }}>
        <span style={{ color:T.green }}>#</span><span style={{ color:"#f1f5f9" }}>nismofejk</span>
      </div>
      {phase !== "intro" && phase !== "results" && (
        <button onClick={onBack} style={{
          padding:"7px 14px", background:"transparent",
          color:T.muted, border:`1px solid ${T.border2}`,
          borderRadius:8, fontSize:"0.72rem", fontWeight:500, cursor:"pointer",
          transition:"all 0.15s",
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="white";(e.currentTarget as HTMLElement).style.borderColor=`rgba(34,197,94,0.3)`;}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=T.muted;(e.currentTarget as HTMLElement).style.borderColor=T.border2;}}
        >← Nazaj</button>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  MAIN
// ─────────────────────────────────────────────────────────
export default function Survey() {
  const [phase, setPhase] = useState<SurveyPhase>("intro");
  const [role, setRole] = useState<Role>("citizen");

  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [phase]);

  const handleBack = () => {
    if (phase === "role") setPhase("intro");
    else if (phase === "survey") setPhase("role");
    else if (phase === "thankyou") setPhase("role");
  };

  return (
    <div style={{ minHeight:"100vh", background:T.bg, position:"relative" }}>
      <TriglavBg />
      <div style={{ position:"relative", zIndex:1 }}>
      <SurveyHeader phase={phase} onBack={handleBack} />
      {phase === "intro"     && <IntroScreen onContinue={()=>setPhase("role")} />}
      {phase === "role"      && <RoleSelect onSelect={r=>{setRole(r);setPhase("survey");}} />}
      {phase === "survey" && role === "citizen"    && <CitizenSurvey onDone={()=>setPhase("thankyou")} />}
      {phase === "survey" && role === "politician" && <PoliticianSurvey onDone={()=>setPhase("thankyou")} />}
      {phase === "thankyou"  && <ThankYou role={role} />}
      </div>
    </div>
  );
}
