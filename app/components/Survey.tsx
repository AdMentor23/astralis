"use client";
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────
//  SLOVENIAN THEME TOKENS — National Digital Gathering
// ─────────────────────────────────────────────────────────
const T = {
  bg:        "transparent",
  surface:   "rgba(10,26,15,0.75)",
  surface2:  "rgba(15,35,24,0.7)",
  green:     "#72B01D",          // Slovenian Green
  greenDim:  "#5a8c17",
  greenGlow: "rgba(114,176,29,0.18)",
  greenMid:  "#8cc63f",
  greenLight:"#a4d65e",
  blue:      "#005DA4",          // Triglav Blue
  blueMid:   "#1a7dc4",
  blueLight: "#3d9be0",
  red:       "#ef4444",
  gold:      "#fbbf24",
  border:    "rgba(114,176,29,0.14)",
  border2:   "rgba(255,255,255,0.07)",
  text:      "#e2e8f0",
  muted:     "#94a3b8",
  muted2:    "#475569",
  mutedDark: "#334155",
};

// ─────────────────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────────────────
type Role = "citizen" | "politician";
type CitizenStep = "identity" | "feeling" | "departments" | "vision" | "politicians" | "wish";
type PoliticianStep = "identity" | "truth" | "promises" | "gaps" | "ask";
type SurveyPhase = "cinematic" | "intro" | "role" | "survey" | "thankyou";

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
//  PHOTO BACKGROUND — Slovenian landscape
//  Photo of Triglav + Soča river under the Milky Way
//  Dark overlay ensures all text/UI stays readable
// ─────────────────────────────────────────────────────────
function PhotoBg() {
  return (
    <>
      {/* Full-bleed photo */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        backgroundImage:"url(/slovenia-bg.jpg)",
        backgroundSize:"cover",
        backgroundPosition:"center top",
        backgroundRepeat:"no-repeat",
      }} />
      {/* Dark overlay — keeps text readable while photo shows through */}
      <div style={{
        position:"fixed", inset:0, zIndex:0,
        background:`linear-gradient(
          to bottom,
          rgba(5,15,8,0.72) 0%,
          rgba(5,15,8,0.58) 25%,
          rgba(5,15,8,0.50) 50%,
          rgba(5,15,8,0.55) 75%,
          rgba(5,15,8,0.78) 100%
        )`,
        pointerEvents:"none",
      }} />
    </>
  );
}

// ─────────────────────────────────────────────────────────
//  #NISMOFEJK LOGO
// ─────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────
//  PAGE TRANSITION
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
//  STEP DOTS
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
//  RATING SCALE
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
//  CARD
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
//  CINEMATIC INTRO — 3-second flag animation
// ─────────────────────────────────────────────────────────
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
      background: "rgba(5,15,8,0.88)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      opacity: phase === "fading" ? 0 : 1,
      transition: "opacity 0.8s ease-out",
    }}>
      {/* Ambient glow */}
      <div style={{
        position:"absolute", inset:0,
        background: "radial-gradient(ellipse at 50% 40%, rgba(114,176,29,0.08) 0%, transparent 60%)",
      }} />

      {/* Flag */}
      <div style={{
        fontSize:"clamp(5rem,15vw,8rem)",
        lineHeight:1,
        animation: "cinematic-flag-float 3s ease-in-out infinite",
        filter: "drop-shadow(0 0 40px rgba(114,176,29,0.3))",
        marginBottom: 24,
      }}>
        🇸🇮
      </div>

      {/* Text */}
      <div style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(1.1rem,3.5vw,1.6rem)",
        color: "rgba(255,255,255,0.7)",
        fontStyle: "italic",
        letterSpacing: "0.02em",
        textAlign: "center",
        padding: "0 20px",
      }}>
        Slovenija, pozdravljena.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  BETA DISCLAIMER BANNER
// ─────────────────────────────────────────────────────────
function BetaBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div style={{
      background: `linear-gradient(135deg, rgba(0,93,164,0.15), rgba(114,176,29,0.08))`,
      border: `1px solid rgba(0,93,164,0.25)`,
      borderRadius: 14,
      padding: "16px 20px",
      margin: "0 auto 28px",
      maxWidth: 500,
      position: "relative",
    }}>
      <button onClick={() => setDismissed(true)} style={{
        position:"absolute", top:8, right:12,
        background:"none", border:"none", color:T.muted, cursor:"pointer",
        fontSize:"1.1rem", lineHeight:1,
      }}>×</button>
      <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
        <span style={{
          background: T.blue, color: "white", fontSize:"0.6rem",
          fontWeight:800, padding:"3px 8px", borderRadius:6,
          letterSpacing:"0.08em", flexShrink:0, marginTop:2,
        }}>BETA v1.0</span>
        <p style={{
          fontSize:"0.78rem", color:T.muted, lineHeight:1.75, margin:0,
        }}>
          Nahajate se v beta fazi projekta, ki razvija prvi slovenski digitalni poslušalec.
          Naš cilj je slišati vsakega posameznika. Razvijamo sistem, ki bo v prihodnje
          potreboval le <strong style={{color:"white"}}>3 minute vašega časa na teden</strong>,
          da skupaj izrišemo jasnejšo sliko naše prihodnosti.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SOCIAL PROOF COUNTER
// ─────────────────────────────────────────────────────────
function SocialProofCounter() {
  const [count, setCount] = useState(147);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    // Subtle animation — slight random increment for "live" feel
    const interval = setInterval(() => {
      if (mounted.current) {
        setCount(c => c + (Math.random() > 0.7 ? 1 : 0));
      }
    }, 8000);
    return () => { mounted.current = false; clearInterval(interval); };
  }, []);

  return (
    <div style={{
      position:"fixed", bottom:0, left:0, right:0, zIndex:15,
      background:"rgba(5,15,8,0.80)", backdropFilter:"blur(14px)",
      borderTop:`1px solid ${T.border}`,
      padding:"10px 20px",
      display:"flex", alignItems:"center", justifyContent:"center", gap:10,
    }}>
      <span style={{
        display:"inline-block", width:8, height:8, borderRadius:"50%",
        background:T.green,
        animation:"pulse-dot 1.8s ease-in-out infinite",
      }} />
      <span style={{ fontSize:"0.75rem", color:T.muted, lineHeight:1.4 }}>
        Trenutno sodeluje: <strong style={{ color:"white", fontWeight:700 }}>{count}</strong> Slovencev,
        ki si upajo sanjati o boljši državi.
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  ACCESSIBILITY TOGGLE
// ─────────────────────────────────────────────────────────
function AccessibilityToggle({ largeText, onToggle }: { largeText:boolean; onToggle:()=>void }) {
  return (
    <button onClick={onToggle} style={{
      position:"fixed", top:60, right:16, zIndex:25,
      background: largeText ? "rgba(114,176,29,0.2)" : "rgba(255,255,255,0.06)",
      border: `1px solid ${largeText ? "rgba(114,176,29,0.4)" : T.border2}`,
      borderRadius:10, padding:"6px 12px",
      display:"flex", alignItems:"center", gap:6,
      cursor:"pointer", transition:"all 0.2s",
    }}
      title="Večje besedilo / Large text"
    >
      <span style={{ fontSize:"0.85rem" }}>🔤</span>
      <span style={{ fontSize:"0.65rem", fontWeight:600, color: largeText ? T.greenMid : T.muted }}>
        {largeText ? "Aa+" : "Aa"}
      </span>
    </button>
  );
}

// ─────────────────────────────────────────────────────────
//  INTRO — National Digital Gathering
// ─────────────────────────────────────────────────────────
function IntroScreen({ onContinue, largeText }: { onContinue:()=>void; largeText:boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const bodySize = largeText ? "1.05rem" : "clamp(0.88rem,2.8vw,0.98rem)";
  const bodyLine = largeText ? 2.1 : 1.85;

  return (
    <div style={{
      minHeight:"100vh", position:"relative", overflow:"hidden",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:"32px 20px 100px",
      background:`radial-gradient(ellipse at 50% 20%, rgba(114,176,29,0.06) 0%, rgba(0,93,164,0.03) 40%, transparent 70%)`,
      opacity: visible ? 1 : 0,
      transition:"opacity 0.9s ease",
    }}>
      <div style={{ maxWidth:540, width:"100%", position:"relative", zIndex:1 }}>

        {/* Hashtag branding */}
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <div style={{
            display:"inline-block",
            fontSize:"clamp(2rem,7vw,3.2rem)",
            fontWeight:900,
            letterSpacing:"-0.03em",
            marginBottom:8,
            background:`linear-gradient(135deg, ${T.greenMid}, ${T.green}, ${T.greenDim})`,
            WebkitBackgroundClip:"text",
            WebkitTextFillColor:"transparent",
            backgroundClip:"text",
            filter:`drop-shadow(0 0 32px ${T.greenGlow})`,
          }}>
            #nismofejk
          </div>
        </div>

        {/* Beta disclaimer */}
        <BetaBanner />

        {/* ── HEADLINE ── */}
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem,6.5vw,3rem)",
          fontWeight: 700,
          lineHeight: 1.15,
          color: T.blue,
          textAlign: "center",
          marginBottom: 28,
          letterSpacing: "-0.02em",
        }}>
          Slovenija, čas je,<br/>
          <span style={{
            background:`linear-gradient(135deg, ${T.greenMid}, ${T.green})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          }}>
            da se umerimo.
          </span>
        </h1>

        {/* ── SECTION: Modrost Neznanega Slovenca ── */}
        <div style={{
          background:"rgba(255,255,255,0.03)",
          border:`1px solid rgba(255,255,255,0.06)`,
          borderRadius:20, padding:"28px 24px", marginBottom:28,
        }}>
          <div style={{
            fontSize:"0.68rem", fontWeight:700, color:T.blue,
            textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:16,
            fontFamily:"'Inter', sans-serif",
          }}>
            Modrost Neznanega Slovenca
          </div>

          <p style={{
            fontSize:bodySize, color:T.muted, lineHeight:bodyLine, marginBottom:20,
          }}>
            Obstaja človek, ki ga morda ne boste nikoli srečali na televiziji ali v parlamentu.
            Je eden izmed nas — tisti, ki je gradil naše tovarne, stal v vrstah in nikoli zamudil volitev.
            Je glas tiste modrosti, ki mu Slovenci najbolj zaupamo: glas delavnega, poštenega očeta in dedka.
          </p>

          {/* ── THE QUOTE — serif, sacred styling ── */}
          <div style={{
            background:"rgba(255,255,255,0.04)",
            borderRadius:16,
            padding:"24px 22px",
            marginBottom:20,
            borderLeft:`3px solid ${T.green}`,
          }}>
            <p style={{
              fontFamily:"'Playfair Display', Georgia, serif",
              fontSize: largeText ? "1.2rem" : "clamp(1.05rem,3vw,1.25rem)",
              fontStyle:"italic",
              color:"rgba(255,255,255,0.88)",
              lineHeight:1.75,
              margin:0,
            }}>
              &ldquo;Vse življenje sem gradil. Danes pa gledam, kako se ljudje razdvajajo.
              Vsi delajo za nas, a delajo tako grdo, da je težko gledati.
              Pozabili smo, da moramo vsi tiščati v isto smer.&rdquo;
            </p>
          </div>

          <p style={{
            fontSize:bodySize, color:T.muted, lineHeight:bodyLine, margin:0,
          }}>
            Ta gospod želi ostati anonimen, a si želi le eno: da bi vi mislili dobro o sosedu,
            tako kot on misli dobro o vas. Verjame, da lahko zgradimo Slovenijo, kjer si pomagamo
            in kjer sistem vodi k zeleni, trajnostni rasti.
          </p>
        </div>

        {/* ── SECTION: Call to Action ── */}
        <div style={{
          background:`linear-gradient(135deg, rgba(0,93,164,0.08), rgba(114,176,29,0.06))`,
          border:`1px solid rgba(0,93,164,0.18)`,
          borderRadius:20, padding:"24px 22px", marginBottom:28,
        }}>
          <div style={{
            fontSize:"0.68rem", fontWeight:700, color:T.green,
            textTransform:"uppercase", letterSpacing:"0.14em", marginBottom:14,
            fontFamily:"'Inter', sans-serif",
          }}>
            V1.0 Anketa
          </div>
          <p style={{
            fontSize:bodySize, color:T.muted, lineHeight:bodyLine, marginBottom:16,
          }}>
            To je prva verzija ankete. Vaši odgovori so &ldquo;hrana&rdquo; za sistem, ki bo začel organizirati
            in voditi Slovenijo na podlagi dejanskih potreb ljudi — ne pa interesov posameznikov.
          </p>
          <p style={{
            fontSize:bodySize, color:"rgba(255,255,255,0.75)", lineHeight:bodyLine, marginBottom:0,
            fontWeight:500,
          }}>
            Vprašanje je le:{" "}
            <strong style={{ color:"white" }}>
              Ali bomo začeli graditi svojo prihodnost zdaj, s svojo pametjo in svojo srčnostjo,
              ali pa bomo čakali, da nam sistem in usodo določi nekdo drug od zunaj?
            </strong>
          </p>
          <p style={{
            fontSize: largeText ? "1.1rem" : "clamp(0.95rem,3vw,1.1rem)",
            fontWeight:800, color:T.green, marginTop:14, marginBottom:0,
          }}>
            Mi odločamo. Danes.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display:"flex",
          marginBottom:28,
          background:"rgba(114,176,29,0.04)",
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
              <div style={{ fontSize:"0.6rem", color:T.muted2, textTransform:"uppercase", letterSpacing:"0.07em", lineHeight:1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* CTA — pulsing green */}
        <button onClick={onContinue} className="pulse-cta" style={{
          width:"100%", padding:"18px 24px",
          fontSize: largeText ? "1.15rem" : "1.08rem",
          fontWeight:800, borderRadius:16,
          background:`linear-gradient(135deg, ${T.green}, ${T.greenDim})`,
          border:"none", color:"white", cursor:"pointer",
          transition:"transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          letterSpacing:"-0.01em",
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(-2px) scale(1.01)";}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.transform="translateY(0) scale(1)";}}
        >
          Začni anketo →
        </button>

        <p style={{ marginTop:14, fontSize:"0.7rem", color:T.mutedDark, lineHeight:1.6, textAlign:"center" }}>
          Anonimno · Brez registracije · Odgovori se združijo z vsemi drugimi
        </p>

        {/* "Zakaj ta anketa?" */}
        <div style={{
          marginTop:28, padding:"20px 22px",
          background:"rgba(114,176,29,0.03)",
          border:`1px solid rgba(114,176,29,0.1)`,
          borderRadius:16, textAlign:"left",
        }}>
          <p style={{ fontSize: largeText ? "0.85rem" : "0.76rem", color:T.muted2, lineHeight:1.9, margin:0 }}>
            <span style={{ color:T.green, fontWeight:700 }}>Zakaj ta anketa?</span>
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
          <div style={{ marginTop:14, fontSize:"0.65rem", color:T.mutedDark }}>
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
      <div style={{ maxWidth:500, margin:"0 auto", padding:"40px 20px 120px" }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{
            fontSize:"0.7rem", color:T.green, fontFamily:"monospace",
            letterSpacing:"0.16em", textTransform:"uppercase", marginBottom:10,
          }}>
            Izberi vlogo
          </div>
          <h2 style={{
            fontFamily:"'Playfair Display', Georgia, serif",
            fontSize:"clamp(1.7rem,5vw,2.6rem)", fontWeight:700, lineHeight:1.1,
            color:T.blue, marginBottom:10,
          }}>
            Kdo ste?
          </h2>
          <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.7 }}>Glede na vašo vlogo boste prejeli drugačna vprašanja.</p>
        </div>

        <div style={{ display:"grid", gap:14, marginBottom:24 }}>
          {/* Citizen */}
          <button onClick={() => onSelect("citizen")} style={{
            padding:"26px 22px", borderRadius:20,
            border:`2px solid rgba(114,176,29,0.25)`,
            background:`rgba(114,176,29,0.06)`, cursor:"pointer", textAlign:"left",
            transition:"all 0.22s ease", width:"100%",
          }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(114,176,29,0.55)";(e.currentTarget as HTMLElement).style.background="rgba(114,176,29,0.12)";(e.currentTarget as HTMLElement).style.transform="translateY(-2px)";}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(114,176,29,0.25)";(e.currentTarget as HTMLElement).style.background="rgba(114,176,29,0.06)";(e.currentTarget as HTMLElement).style.transform="translateY(0)";}}
          >
            <div style={{ fontSize:"2rem", marginBottom:10 }}>🏔️</div>
            <div style={{ fontSize:"1.1rem", fontWeight:900, color:"white", marginBottom:6 }}>Sem Slovenec / Slovenka</div>
            <div style={{ fontSize:"0.82rem", color:T.muted, lineHeight:1.7 }}>
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
            <div style={{ fontSize:"0.82rem", color:T.muted, lineHeight:1.7 }}>
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
              <div style={{ fontSize:"0.72rem", color:T.muted2, lineHeight:1.6 }}>
                Nobenih osebnih podatkov. Odgovori se združijo z drugimi. Cilj je videti celotno sliko.
              </div>
            </div>
          </div>
        </GCard>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16, fontSize:"0.68rem", color:T.mutedDark }}>
          <span>3.600+ izvoljenih funkcionarjev · 2,1M Slovencev</span>
          <span style={{ color:T.muted2 }}>#nismofejk</span>
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
      <div style={{ maxWidth:560, margin:"0 auto", padding:"32px 20px 120px" }}>{inner}</div>
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
      <h2 style={{
        fontFamily:"'Playfair Display', Georgia, serif",
        fontSize:"clamp(1.55rem,4.5vw,2.3rem)", fontWeight:700, lineHeight:1.15,
        marginBottom:10, color:T.blue,
      }}
        dangerouslySetInnerHTML={{ __html: title }} />
      <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.7 }}>{sub}</p>
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
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>1 = Zelo slabo</span>
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>10 = Odlično</span>
      </div>
    </GCard>
    <GCard>
      <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:12 }}>&ldquo;Smo na pravi poti?&rdquo;</div>
      <div style={{ display:"flex", gap:10 }}>
        {[{v:"up" as const,e:"👍",l:"Da, gremo naprej",c:T.green},{v:"down" as const,e:"👎",l:"Ne, sprememba smeri",c:"#ef4444"}].map(b=>(
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
                background: deptScores[d.id]===n?(n>=7?T.green:n>=4?"#f59e0b":T.red):deptScores[d.id]>n?`rgba(114,176,29,0.18)`:"rgba(255,255,255,0.05)",
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
              background:sel?`rgba(114,176,29,0.15)`:"rgba(255,255,255,0.04)",
              outline:sel?`2px solid rgba(114,176,29,0.5)`:"2px solid transparent",
              transition:"all 0.15s",
            }}>
              <span style={{ fontSize:"1rem" }}>{d.e}</span>
              <span style={{ fontSize:"0.78rem", fontWeight:600, color:sel?T.greenMid:"#94a3b8" }}>{d.name}</span>
              {sel && <span style={{ marginLeft:"auto", color:T.green, fontWeight:900, fontSize:"0.9rem" }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ fontSize:"0.7rem", color:T.mutedDark, marginTop:10 }}>Izbrano: {visionTop3.length} / 3</div>
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
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>1 = Nič</span>
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>10 = Popolno zaupanje</span>
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
            background:wishRealistic===b.v?`rgba(114,176,29,0.18)`:"rgba(255,255,255,0.04)",
            color:wishRealistic===b.v?T.greenMid:T.muted,
            outline:wishRealistic===b.v?`2px solid rgba(114,176,29,0.45)`:"2px solid transparent",
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
      <div style={{ maxWidth:540, margin:"0 auto", padding:"32px 20px 120px" }}>{inner}</div>
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
      <h2 style={{
        fontFamily:"'Playfair Display', Georgia, serif",
        fontSize:"clamp(1.45rem,4vw,2.1rem)", fontWeight:700, lineHeight:1.15,
        marginBottom:10, color:T.blue,
      }}>{title}</h2>
      <p style={{ color:T.muted, fontSize:"0.88rem", lineHeight:1.7 }}>{sub}</p>
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
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>1 = Nisem dosegel/a ničesar</span>
        <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>10 = Presegl/a sem pričakovanja</span>
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
//  GREEN BUTTON
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
//  THANK YOU — National Digital Gathering
// ─────────────────────────────────────────────────────────
function ThankYou({ role }: { role:Role }) {
  return (
    <FadeSlide id="thankyou">
      <div style={{ maxWidth:500, margin:"0 auto", textAlign:"center", padding:"60px 20px 120px", position:"relative" }}>
        {/* Animated flag */}
        <div style={{
          fontSize:"5rem", marginBottom:20, lineHeight:1,
          animation:"cinematic-flag-float 3s ease-in-out infinite",
        }}>🇸🇮</div>

        <h2 style={{
          fontFamily:"'Playfair Display', Georgia, serif",
          fontSize:"clamp(1.8rem,5vw,2.4rem)", fontWeight:700, color:T.blue,
          marginBottom:12, lineHeight:1.15,
        }}>
          {role==="citizen" ? "Hvala. Vaš glas šteje." : "Hvala. To je pogum."}
        </h2>

        <p style={{
          fontSize:"clamp(1.1rem,3.5vw,1.4rem)", fontWeight:700, marginBottom:24,
          background:`linear-gradient(135deg, ${T.greenMid}, ${T.green})`,
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
        }}>
          Pokazali ste, da niste fejk.
        </p>

        <p style={{ color:T.muted, fontSize:"0.9rem", lineHeight:1.8, maxWidth:400, margin:"0 auto 32px" }}>
          {role==="citizen"
            ? "Vaš odgovor se bo združil z odgovori tisočih Slovencev in politikov. Tako kot tisti gospod, ki ni nikoli zgrešil volitev — tudi vi ste danes pokazali, da vam ni vseeno."
            : "Vaš odgovor bo del celotne slike. Ljudje gledajo, kako se grebete — danes ste pokazali, da znate tudi poslušati."}
        </p>

        {/* Quote */}
        <div style={{
          background:"rgba(255,255,255,0.04)",
          borderRadius:16, padding:"20px 22px",
          marginBottom:24, borderLeft:`3px solid ${T.green}`,
          textAlign:"left",
        }}>
          <p style={{
            fontFamily:"'Playfair Display', Georgia, serif",
            fontSize:"1.05rem", fontStyle:"italic",
            color:"rgba(255,255,255,0.8)", lineHeight:1.75, margin:0,
          }}>
            &ldquo;Mogli bi vsi skupaj tiščati gor pa skupaj začeti graditi.&rdquo;
          </p>
        </div>

        <div style={{
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:18, padding:"20px 24px", marginBottom:24,
        }}>
          <div style={{ fontSize:"0.82rem", fontWeight:700, color:"white", marginBottom:8 }}>Kaj zdaj?</div>
          <p style={{ fontSize:"0.78rem", color:T.muted, lineHeight:1.75, margin:0 }}>
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
          background:`rgba(114,176,29,0.03)`,
          border:`1px solid rgba(114,176,29,0.1)`,
          borderRadius:14,
        }}>
          <p style={{ fontSize:"0.75rem", color:T.muted2, lineHeight:1.85, margin:0 }}>
            Pošljite naprej — vsakemu, ki mu ni vseeno.
            <br />
            <span style={{ color:T.green, fontWeight:600 }}>Slovenija ne rabi pasti. Rabi nas.</span>
            <br />
            <span style={{ fontSize:"0.68rem", color:T.mutedDark }}>Skupaj gradimo sistem, ki sliši.</span>
          </p>
        </div>

        {/* Logo — bottom right */}
        <div style={{
          position:"fixed", bottom:56, right:20, zIndex:10,
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
//  SURVEY HEADER
// ─────────────────────────────────────────────────────────
function SurveyHeader({ phase, onBack }: { phase: string; onBack:()=>void }) {
  return (
    <div style={{
      position:"sticky", top:0, zIndex:20,
      background:"rgba(5,15,8,0.82)", backdropFilter:"blur(16px)",
      borderBottom:`1px solid rgba(114,176,29,0.12)`,
      padding:"13px 20px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
    }}>
      <div style={{ fontSize:"0.95rem", fontWeight:900, letterSpacing:"-0.02em" }}>
        <span style={{ color:T.green }}>#</span><span style={{ color:"#f1f5f9" }}>nismofejk</span>
      </div>
      {phase !== "intro" && phase !== "cinematic" && (
        <button onClick={onBack} style={{
          padding:"7px 14px", background:"transparent",
          color:T.muted, border:`1px solid ${T.border2}`,
          borderRadius:8, fontSize:"0.72rem", fontWeight:500, cursor:"pointer",
          transition:"all 0.15s",
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color="white";(e.currentTarget as HTMLElement).style.borderColor=`rgba(114,176,29,0.3)`;}}
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
      className={largeText ? "large-text-mode" : ""}
    >
      <PhotoBg />

      {/* Cinematic intro overlay */}
      {phase === "cinematic" && (
        <CinematicIntro onDone={() => setPhase("intro")} />
      )}

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

      {/* Social proof counter — always visible except cinematic */}
      {phase !== "cinematic" && <SocialProofCounter />}
    </div>
  );
}
