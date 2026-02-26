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

// Triglav — traced from real photo
// Sharp central summit, rocky ridges left & right, snow fields
// Style: lines only — no fill, no color, just white strokes fading into dark
function TriglavBg() {
  // Main ridgeline silhouette — traced from the photo
  // The photo shows: massive central peak, broad snow shoulders,
  // rocky crags on both sides, left ridge drops with sub-peaks,
  // right side has a secondary shoulder before dropping
  const ridgeline = `
    M 0,600 L 0,480
    L 40,472 L 80,460 L 110,448
    L 140,438 L 165,430 L 185,422
    L 205,416 L 225,408 L 240,398
    L 255,386 L 268,372 L 278,360
    L 285,352 L 292,348 L 298,342
    L 308,338 L 318,330 L 325,322
    L 335,318 L 342,310 L 350,306
    L 358,298 L 365,290 L 372,286
    L 380,282 L 388,276 L 395,268
    L 402,258 L 408,250 L 416,244
    L 422,240 L 428,238 L 436,236
    L 445,232 L 452,228
    L 458,220 L 464,212
    L 470,206 L 476,198
    L 484,188 L 490,178
    L 496,168 L 502,158
    L 510,146 L 516,136
    L 522,126 L 528,116
    L 534,106 L 540,96
    L 546,86 L 552,76
    L 558,66 L 564,56
    L 570,48 L 576,42
    L 582,38 L 588,35
    L 594,33 L 600,32
    L 606,33 L 612,36
    L 618,40 L 624,46
    L 630,54 L 636,62
    L 642,72 L 648,82
    L 654,94 L 660,106
    L 666,116 L 672,128
    L 678,138 L 684,148
    L 690,156 L 696,164
    L 702,170 L 708,176
    L 716,184 L 722,190
    L 728,194 L 734,198
    L 742,204 L 750,210
    L 758,218 L 766,226
    L 774,234 L 782,240
    L 790,248 L 798,256
    L 808,264 L 818,272
    L 828,280 L 840,290
    L 852,298 L 864,306
    L 878,314 L 892,322
    L 908,330 L 924,338
    L 940,346 L 958,354
    L 978,362 L 1000,370
    L 1025,378 L 1050,386
    L 1080,394 L 1110,402
    L 1145,410 L 1180,418
    L 1200,424 L 1200,600 Z
  `;

  // Rock face lines — angular cracks and ridges traced from the photo
  const rockLines = [
    // Central peak — left face: steep rocky slabs
    "M 600,32 L 570,80 L 545,140",
    "M 600,32 L 558,90 L 520,165",
    "M 600,32 L 580,65 L 555,120 L 530,185",
    "M 564,56 L 540,110 L 510,175",
    "M 546,86 L 516,150 L 490,210",
    "M 528,116 L 500,175 L 476,230",
    // Central peak — right face: slightly gentler but still rocky
    "M 600,32 L 630,78 L 658,140",
    "M 600,32 L 640,88 L 678,160",
    "M 600,32 L 620,60 L 648,115 L 674,170",
    "M 636,62 L 662,120 L 690,180",
    "M 654,94 L 680,150 L 702,200",
    "M 672,128 L 696,178 L 720,225",
    // Left shoulder — sub-ridges and crags
    "M 452,228 L 430,260 L 410,290",
    "M 436,236 L 415,268 L 395,300",
    "M 422,240 L 400,275 L 380,308",
    "M 395,268 L 370,305 L 348,340",
    "M 365,290 L 340,328 L 320,360",
    "M 335,318 L 310,352 L 290,380",
    "M 308,338 L 285,370 L 265,400",
    // Right shoulder — broader descent
    "M 742,204 L 768,248 L 792,280",
    "M 758,218 L 785,258 L 810,295",
    "M 782,240 L 808,278 L 835,310",
    "M 808,264 L 838,300 L 865,330",
    "M 840,290 L 870,322 L 900,350",
    // Horizontal snow ledges — the bright horizontal breaks
    "M 570,52 L 612,48 L 630,52",
    "M 555,72 L 600,65 L 645,72",
    "M 540,100 L 600,90 L 660,100",
    "M 525,130 L 600,118 L 675,130",
    // Lower snow field contours
    "M 480,195 L 520,185 L 560,180",
    "M 640,180 L 680,185 L 720,195",
    "M 460,215 L 500,208 L 540,205",
    "M 660,205 L 700,208 L 740,215",
    // Jagged ridge detail — small angular breaks
    "M 292,348 L 300,340 L 312,335",
    "M 350,306 L 360,298 L 372,294",
    "M 408,250 L 418,242 L 430,240",
    "M 728,194 L 738,200 L 750,206",
    "M 798,256 L 812,262 L 825,270",
    "M 864,306 L 878,312 L 892,318",
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
        <linearGradient id="line-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0.02" />
          <stop offset="30%"  stopColor="white" stopOpacity="0.06" />
          <stop offset="60%"  stopColor="white" stopOpacity="0.10" />
          <stop offset="100%" stopColor="white" stopOpacity="0.14" />
        </linearGradient>
        <linearGradient id="detail-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="white" stopOpacity="0.01" />
          <stop offset="50%"  stopColor="white" stopOpacity="0.04" />
          <stop offset="100%" stopColor="white" stopOpacity="0.07" />
        </linearGradient>
      </defs>

      {/* Main ridgeline — the silhouette outline */}
      <path d={ridgeline}
        fill="none"
        stroke="url(#line-fade)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Rock face detail lines */}
      {rockLines.map((d, i) => (
        <path key={i} d={d}
          fill="none"
          stroke="url(#detail-fade)"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
      ))}
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
