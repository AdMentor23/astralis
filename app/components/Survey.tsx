"use client";
import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  DESIGN SYSTEM — Unified tokens for premium bespoke feel
// ═══════════════════════════════════════════════════════════

// ── Color Palette: Deep Forest + Soča Emerald + Triglav White ──
const C = {
  // Backgrounds
  bg:         "transparent",
  glass:      "rgba(10,26,15,0.72)",
  glassMid:   "rgba(10,26,15,0.60)",
  glassLight: "rgba(255,255,255,0.04)",
  // Soča Emerald (primary action color)
  emerald:    "#72B01D",
  emeraldDim: "#5a8c17",
  emeraldMid: "#8cc63f",
  emeraldLt:  "#a4d65e",
  emeraldGlow:"rgba(114,176,29,0.18)",
  // Triglav Blue (accent, labels)
  triglav:    "#5ba3d9",
  triglavDim: "#005DA4",
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
  border:     "rgba(114,176,29,0.12)",
  borderFaint:"rgba(255,255,255,0.07)",
};

// ── Spacing ──
const S = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48 } as const;

// ── Radius ──  (only 4 values, ever)
const R = { sm:8, md:12, lg:16, xl:20 } as const;

// ── Typography ──
const serif = "'Playfair Display', Georgia, serif";
const sans  = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ═══════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════
type Role = "citizen" | "politician";
type CitizenStep = "identity" | "feeling" | "departments" | "vision" | "politicians" | "wish";
type PoliticianStep = "identity" | "truth" | "promises" | "gaps" | "ask";
type SurveyPhase = "cinematic" | "intro" | "role" | "survey" | "thankyou";

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
//  PHOTO BACKGROUND
// ═══════════════════════════════════════════════════════════
function PhotoBg() {
  return (
    <>
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        backgroundImage:"url(/slovenia-bg.jpg)",
        backgroundSize:"cover",
        backgroundPosition:"center 30%",
        backgroundRepeat:"no-repeat",
      }} />
      {/* Radial vignette — spotlight on center content */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:`radial-gradient(ellipse 80% 70% at 50% 45%,
          rgba(5,15,8,0.32) 0%, rgba(5,15,8,0.50) 50%, rgba(5,15,8,0.72) 100%)`,
        pointerEvents:"none",
      }} />
      {/* Top/bottom bands for header & footer */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:`linear-gradient(to bottom,
          rgba(5,15,8,0.55) 0%, transparent 12%, transparent 88%, rgba(5,15,8,0.60) 100%)`,
        pointerEvents:"none",
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
        ? <h2 style={{ fontFamily:sans, fontSize:"clamp(1.5rem,4.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:S.sm+2, color:C.white }}
            dangerouslySetInnerHTML={{ __html: title }} />
        : <h2 style={{ fontFamily:sans, fontSize:"clamp(1.5rem,4.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:S.sm+2, color:C.white }}>{title}</h2>
      }
      <p style={{ color:C.muted, fontSize:"0.88rem", lineHeight:1.75 }}>{sub}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CINEMATIC INTRO
// ═══════════════════════════════════════════════════════════
function CinematicIntro({ onDone }: { onDone:()=>void }) {
  const [phase, setPhase] = useState<"flag"|"fading">("flag");
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fading"), 2400);
    const t2 = setTimeout(() => onDone(), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:100,
      background:"rgba(5,15,8,0.88)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase==="fading" ? 0 : 1,
      transition:"opacity 0.8s ease-out",
    }}>
      <div style={{ position:"absolute", inset:0,
        background:"radial-gradient(ellipse at 50% 40%, rgba(114,176,29,0.08) 0%, transparent 60%)" }} />
      <div style={{
        fontSize:"clamp(5rem,15vw,8rem)", lineHeight:1,
        animation:"cinematic-flag-float 3s ease-in-out infinite",
        filter:`drop-shadow(0 0 40px ${C.emeraldGlow})`, marginBottom:S.lg,
      }}>🇸🇮</div>
      <div style={{
        fontFamily:serif, fontSize:"clamp(1.1rem,3.5vw,1.6rem)",
        color:"rgba(255,255,255,0.7)", fontStyle:"italic",
        letterSpacing:"0.02em", textAlign:"center", padding:`0 ${S.lg}px`,
      }}>Slovenija, pozdravljena.</div>
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
      background:`linear-gradient(135deg, rgba(0,93,164,0.12), rgba(114,176,29,0.06))`,
      backdropFilter:"blur(8px)",
      border:`1px solid rgba(91,163,217,0.20)`,
      borderRadius:R.lg, padding:`${S.md}px ${S.lg}px`,
      margin:`0 auto ${S.xl}px`, maxWidth:480, position:"relative",
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
          Nahajate se v beta fazi projekta, ki razvija prvi slovenski digitalni poslušalec.
          Razvijamo sistem, ki bo potreboval le <strong style={{color:C.white}}>3 minute vašega časa na teden</strong>.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SOCIAL PROOF COUNTER
// ═══════════════════════════════════════════════════════════
function SocialProofCounter() {
  const [count, setCount] = useState(147);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const interval = setInterval(() => { if (mounted.current) setCount(c => c + (Math.random() > 0.7 ? 1 : 0)); }, 8000);
    return () => { mounted.current = false; clearInterval(interval); };
  }, []);

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:15,
      background:"rgba(5,15,8,0.80)", backdropFilter:"blur(14px)",
      borderTop:`1px solid ${C.border}`,
      padding:`${S.sm+2}px ${S.xl}px`,
      display:"flex", alignItems:"center", justifyContent:"center", gap:S.sm+2,
    }}>
      <span style={{
        display:"inline-block", width:8, height:8, borderRadius:"50%",
        background:C.emerald, animation:"pulse-dot 1.8s ease-in-out infinite",
      }} />
      <span style={{ fontSize:"0.75rem", color:C.muted, fontFamily:sans }}>
        Trenutno sodeluje: <strong style={{ color:C.white, fontWeight:700 }}>{count}</strong> Slovencev,
        ki si upajo sanjati o boljši državi.
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
      background: largeText ? "rgba(114,176,29,0.2)" : "rgba(255,255,255,0.06)",
      border:`1px solid ${largeText ? "rgba(114,176,29,0.4)" : C.borderFaint}`,
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
//  INTRO — National Digital Gathering
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
      padding:`${S.xxl}px ${S.xl}px 160px`,
      opacity: visible ? 1 : 0, transition:"opacity 0.9s ease",
    }}>
      <div style={{ maxWidth:480, width:"100%", position:"relative", zIndex:1 }}>

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
          Slovenija, čas je,<br/>
          <span style={{
            background:`linear-gradient(135deg, ${C.emeraldMid}, ${C.emerald})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>da se umerimo.</span>
        </h1>

        {/* ── Modrost Neznanega Slovenca ── */}
        <div style={{
          background:C.glass, backdropFilter:"blur(12px)",
          border:`1px solid rgba(255,255,255,0.08)`,
          borderRadius:R.xl, padding:`${S.xl+4}px ${S.lg}px`, marginBottom:S.xl,
        }}>
          <SectionLabel color={C.triglav}>Modrost Neznanega Slovenca</SectionLabel>

          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, marginBottom:S.lg }}>
            Obstaja človek, ki ga morda ne boste nikoli srečali na televiziji ali v parlamentu.
            Je eden izmed nas — tisti, ki je gradil naše tovarne, stal v vrstah in nikoli zamudil volitev.
            Je glas tiste modrosti, ki mu Slovenci najbolj zaupamo: glas delavnega, poštenega očeta in dedka.
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
              &ldquo;Vse življenje sem gradil. Danes pa gledam, kako se ljudje razdvajajo.
              Vsi delajo za nas, a delajo tako grdo, da je težko gledati.
              Pozabili smo, da moramo vsi tiščati v isto smer.&rdquo;
            </p>
          </div>

          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, margin:0 }}>
            Ta gospod želi ostati anonimen, a si želi le eno: da bi vi mislili dobro o sosedu,
            tako kot on misli dobro o vas. Verjame, da lahko zgradimo Slovenijo, kjer si pomagamo
            in kjer sistem vodi k zeleni, trajnostni rasti.
          </p>
        </div>

        {/* ── V1.0 Call to Action ── */}
        <div style={{
          background:`linear-gradient(135deg, rgba(0,93,164,0.10), rgba(114,176,29,0.06))`,
          backdropFilter:"blur(10px)",
          border:`1px solid rgba(91,163,217,0.16)`,
          borderRadius:R.xl, padding:`${S.lg}px`, marginBottom:S.xl,
        }}>
          <SectionLabel color={C.emerald}>V1.0 Anketa</SectionLabel>
          <p style={{ fontSize:bodyFs, color:C.muted, lineHeight:bodyLh, marginBottom:S.md }}>
            To je prva verzija ankete. Vaši odgovori so &ldquo;hrana&rdquo; za sistem, ki bo začel organizirati
            in voditi Slovenijo na podlagi dejanskih potreb ljudi — ne pa interesov posameznikov.
          </p>
          <p style={{ fontSize:bodyFs, color:"rgba(255,255,255,0.78)", lineHeight:bodyLh, fontWeight:500, marginBottom:0 }}>
            Vprašanje je le:{" "}
            <strong style={{ color:C.white }}>
              Ali bomo začeli graditi svojo prihodnost zdaj, s svojo pametjo in svojo srčnostjo,
              ali pa bomo čakali, da nam usodo določi nekdo drug od zunaj?
            </strong>
          </p>
          <p style={{ fontSize:"clamp(0.95rem,3vw,1.05rem)", fontWeight:800, fontFamily:sans, color:C.emerald, marginTop:S.md, marginBottom:0 }}>
            Mi odločamo. Danes.
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
        <ActionBtn onClick={onContinue} large>Začni anketo →</ActionBtn>

        <p style={{ marginTop:S.md, fontSize:"0.72rem", fontFamily:sans, color:C.faint, lineHeight:1.6, textAlign:"center" }}>
          Anonimno · Brez registracije · Odgovori se združijo z vsemi drugimi
        </p>

        {/* ── Footer info box ── */}
        <div style={{
          marginTop:S.xl, padding:`${S.lg}px`,
          background:"rgba(114,176,29,0.04)", backdropFilter:"blur(6px)",
          border:`1px solid rgba(114,176,29,0.10)`,
          borderRadius:R.lg, textAlign:"left",
        }}>
          <p style={{ fontSize: largeText ? "0.82rem" : "0.76rem", fontFamily:sans, color:C.faint, lineHeight:1.9, margin:0 }}>
            <span style={{ color:C.emerald, fontWeight:700 }}>Zakaj ta anketa?</span><br />
            Tole gradi en človek v ozadju — z ljudmi, ki jih že celo življenje ni nihče vprašal,
            pa so zmeraj bili zraven. Ljudje, ki jim ni bilo nikoli vseeno.
            <br /><br />
            Ko politik oceni zdravstvo s 6/10, državljan pa s 3.8/10 — to ni mnenje. To je dejstvo.
            In ko imaš dovolj takih dejstev,{" "}
            <span style={{ color:C.emerald, fontWeight:600 }}>se začne videti, kje moramo popraviti.</span>
          </p>
          <div style={{ marginTop:S.md, fontSize:"0.65rem", fontFamily:sans, color:C.faint }}>
            #nismofejk · 2025 ·{" "}
            <a href="https://instagram.com/NEPRIDIPRAV" target="_blank" rel="noopener noreferrer"
              style={{ color:C.emerald, fontWeight:700, textDecoration:"none" }}>@NEPRIDIPRAV</a>
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
      <div style={{ maxWidth:460, margin:"0 auto", padding:`${S.xxl}px ${S.xl}px 160px` }}>
        <div style={{ textAlign:"center", marginBottom:S.xl+S.sm }}>
          <SectionLabel>Izberi vlogo</SectionLabel>
          <h2 style={{ fontFamily:sans, fontSize:"clamp(1.7rem,5vw,2.4rem)", fontWeight:800, lineHeight:1.1, color:C.white, marginBottom:S.sm }}>
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
      <div style={{ maxWidth:500, margin:"0 auto", padding:`${S.xxl-8}px ${S.xl}px 160px` }}>{inner}</div>
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
                background: deptScores[d.id]===n?(n>=7?C.emerald:n>=4?"#f59e0b":C.red):deptScores[d.id]>n?`rgba(114,176,29,0.18)`:"rgba(255,255,255,0.05)",
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
              background:sel?`rgba(114,176,29,0.14)`:C.glassLight,
              outline:sel?`2px solid rgba(114,176,29,0.5)`:"2px solid transparent",
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
            background:wishRealistic===b.v?`rgba(114,176,29,0.16)`:C.glassLight,
            color:wishRealistic===b.v?C.emeraldMid:C.muted,
            outline:wishRealistic===b.v?`2px solid rgba(114,176,29,0.45)`:"2px solid transparent",
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
      <div style={{ maxWidth:480, margin:"0 auto", padding:`${S.xxl-8}px ${S.xl}px 160px` }}>{inner}</div>
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
      <div style={{ maxWidth:460, margin:"0 auto", textAlign:"center", padding:`60px ${S.xl}px 180px`, position:"relative" }}>
        <div style={{
          fontSize:"5rem", marginBottom:S.lg, lineHeight:1,
          animation:"cinematic-flag-float 3s ease-in-out infinite",
        }}>🇸🇮</div>

        <h2 style={{
          fontFamily:sans, fontSize:"clamp(1.8rem,5vw,2.4rem)", fontWeight:800,
          color:C.white, marginBottom:S.md, lineHeight:1.15,
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
            Spremljajte{" "}
            <a href="https://instagram.com/NEPRIDIPRAV" target="_blank" rel="noopener noreferrer"
              style={{ color:C.emerald, fontWeight:700, textDecoration:"none" }}>@NEPRIDIPRAV</a>{" "}za obvestilo.
          </p>
        </Card>

        <div style={{
          padding:`${S.md+2}px ${S.lg}px`,
          background:"rgba(114,176,29,0.04)", backdropFilter:"blur(4px)",
          border:`1px solid rgba(114,176,29,0.10)`, borderRadius:R.lg,
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
      background:"rgba(5,15,8,0.75)", backdropFilter:"blur(16px)",
      borderBottom:`1px solid ${C.border}`,
      padding:`${S.md-2}px ${S.xl}px`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div style={{ fontSize:"0.95rem", fontWeight:900, fontFamily:sans, letterSpacing:"-0.02em" }}>
        <span style={{ color:C.emerald }}>#</span><span style={{ color:"#f1f5f9" }}>nismofejk</span>
      </div>
      {phase !== "intro" && phase !== "cinematic" && (
        <button onClick={onBack} style={{
          padding:`${S.sm-1}px ${S.md}px`, background:"transparent",
          color:C.muted, border:`1px solid ${C.borderFaint}`,
          borderRadius:R.sm, fontSize:"0.72rem", fontWeight:500, fontFamily:sans,
          cursor:"pointer", transition:"all 0.15s",
        }}
          onMouseEnter={e=>{const s=e.currentTarget.style;s.color="white";s.borderColor=`rgba(114,176,29,0.3)`;}}
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
  const [phase, setPhase] = useState<SurveyPhase>("cinematic");
  const [role, setRole] = useState<Role>("citizen");
  const [largeText, setLargeText] = useState(false);

  useEffect(() => { window.scrollTo({ top:0, behavior:"smooth" }); }, [phase]);

  const handleBack = () => {
    if (phase === "role") setPhase("intro");
    else if (phase === "survey") setPhase("role");
    else if (phase === "thankyou") setPhase("role");
  };

  return (
    <div style={{ minHeight:"100vh", background:"transparent", position:"relative" }}
      className={largeText ? "large-text-mode" : ""}>
      <PhotoBg />
      {phase === "cinematic" && <CinematicIntro onDone={() => setPhase("intro")} />}
      <div style={{ position:"relative", zIndex:1 }}>
        {phase !== "cinematic" && <SurveyHeader phase={phase} onBack={handleBack} />}
        {phase !== "cinematic" && phase !== "thankyou" && (
          <AccessibilityToggle largeText={largeText} onToggle={() => setLargeText(p => !p)} />
        )}
        {phase === "intro"     && <IntroScreen onContinue={()=>setPhase("role")} largeText={largeText} />}
        {phase === "role"      && <RoleSelect onSelect={r=>{setRole(r);setPhase("survey");}} />}
        {phase === "survey" && role === "citizen"    && <CitizenSurvey onDone={()=>setPhase("thankyou")} />}
        {phase === "survey" && role === "politician" && <PoliticianSurvey onDone={()=>setPhase("thankyou")} />}
        {phase === "thankyou"  && <ThankYou role={role} />}
      </div>
      {phase !== "cinematic" && <SocialProofCounter />}
    </div>
  );
}
