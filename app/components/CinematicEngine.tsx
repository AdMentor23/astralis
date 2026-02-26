"use client";
import { useEffect, useRef, useState, useCallback } from "react";

// ─────────────────────────────────────────────────────────
//  SCENE DURATIONS  (ms)
// ─────────────────────────────────────────────────────────
const SCENE_DURATIONS = [9000, 11000, 12000, 11000, 12000, 10000, 13000, 13000, 13000, 13000, 11000, 9000];
const TOTAL_SCENES = SCENE_DURATIONS.length;

// ─────────────────────────────────────────────────────────
//  PARTICLE ENGINE
// ─────────────────────────────────────────────────────────
type Particle = {
  x: number; y: number; vx: number; vy: number;
  size: number; alpha: number; color: string; life: number; maxLife: number;
};

function useParticleCanvas(scene: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);

  const sceneColors = [
    ["#3b82f6","#1d4ed8","#60a5fa"],   // 0 hero
    ["#ef4444","#dc2626","#f87171"],   // 1 problem
    ["#f97316","#ea580c","#fb923c"],   // 2 sauna
    ["#22c55e","#16a34a","#86efac"],   // 3 data
    ["#8b5cf6","#7c3aed","#a78bfa"],   // 4 platform
    ["#3b82f6","#06b6d4","#60a5fa"],   // 5 pillars
    ["#facc15","#eab308","#fde68a"],   // 6 politician portal
    ["#a78bfa","#7c3aed","#c4b5fd"],   // 7 ai engine
    ["#34d399","#059669","#6ee7b7"],   // 8 citizen app
    ["#f472b6","#db2777","#fbcfe8"],   // 9 dept hubs
    ["#60a5fa","#f97316","#4ade80"],   // 10 system flow
    ["#f8fafc","#94a3b8","#3b82f6"],   // 11 credits
  ];

  const spawnParticle = useCallback((canvas: HTMLCanvasElement, colors: string[]) => {
    const edge = Math.random();
    let x = 0, y = 0;
    if (edge < 0.25) { x = Math.random() * canvas.width; y = 0; }
    else if (edge < 0.5) { x = canvas.width; y = Math.random() * canvas.height; }
    else if (edge < 0.75) { x = Math.random() * canvas.width; y = canvas.height; }
    else { x = 0; y = Math.random() * canvas.height; }

    const cx = canvas.width / 2, cy = canvas.height / 2;
    const dx = cx - x, dy = cy - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = 0.3 + Math.random() * 0.8;

    particles.current.push({
      x, y,
      vx: (dx / dist) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.5,
      vy: (dy / dist) * speed * (Math.random() > 0.5 ? 1 : -1) * 0.5,
      size: 1 + Math.random() * 2.5,
      alpha: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: 120 + Math.random() * 200,
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const colors = sceneColors[scene] ?? sceneColors[0];
    const maxParticles = scene === 2 ? 120 : 70; // more for sauna

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn
      if (particles.current.length < maxParticles) {
        spawnParticle(canvas, colors);
      }

      // Draw & update
      particles.current = particles.current.filter(p => p.life < p.maxLife);
      for (const p of particles.current) {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        const progress = p.life / p.maxLife;
        p.alpha = progress < 0.2
          ? progress / 0.2
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 1;

        ctx.save();
        ctx.globalAlpha = p.alpha * 0.55;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      raf.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      particles.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene]);

  return canvasRef;
}

// ─────────────────────────────────────────────────────────
//  TYPEWRITER HOOK
// ─────────────────────────────────────────────────────────
function useTypewriter(phrases: string[], speed = 70) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[idx];
    const t = setTimeout(() => {
      if (!deleting && displayed.length < current.length) {
        setDisplayed(current.slice(0, displayed.length + 1));
      } else if (!deleting && displayed.length === current.length) {
        setTimeout(() => setDeleting(true), 1200);
      } else if (deleting && displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1));
      } else {
        setDeleting(false);
        setIdx((i) => (i + 1) % phrases.length);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [displayed, deleting, idx, phrases, speed]);

  return displayed;
}

// ─────────────────────────────────────────────────────────
//  SCENE 0 — INTRO / HERO
// ─────────────────────────────────────────────────────────
const typingPhrases = ["Zdravstveni sistem...","Čakalne vrste...","BDP rast...","Infrastruktura...","Šolstvo...","Okolje..."];

function Scene0({ active }: { active: boolean }) {
  const typed = useTypewriter(typingPhrases);
  return (
    <div className={`scene-content w-full max-w-5xl mx-auto px-8 text-center ${active ? "visible" : ""}`}>
      {/* HUD corners */}
      <div className="hud-corner top-8 left-8 border-t-2 border-l-2 rounded-tl-sm" style={{position:"fixed"}} />
      <div className="hud-corner top-8 right-8 border-t-2 border-r-2 rounded-tr-sm" style={{position:"fixed"}} />
      <div className="hud-corner bottom-8 left-8 border-b-2 border-l-2 rounded-bl-sm" style={{position:"fixed",bottom:"3.5rem",left:"2rem"}} />
      <div className="hud-corner bottom-8 right-8 border-b-2 border-r-2 rounded-br-sm" style={{position:"fixed",bottom:"3.5rem",right:"2rem"}} />

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-10 text-xs text-blue-400 tracking-widest uppercase">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{animation:"pulse 1.5s infinite"}} />
        Koncept platforme · 2025
      </div>

      <h1 className="font-black leading-none tracking-tight mb-6" style={{fontSize:"clamp(4rem,10vw,9rem)"}}>
        <span className="grad-white block">AI</span>
        <span className="grad-blue block">SLOVENIJA</span>
      </h1>

      <p className="text-slate-400 mb-4 font-light" style={{fontSize:"clamp(1rem,2.5vw,1.5rem)"}}>
        Nehajmo se pretvarjati. Poglejmo dejstva.
      </p>

      <div className="h-10 flex items-center justify-center mb-12">
        <span className="font-mono text-blue-400" style={{fontSize:"clamp(0.85rem,1.5vw,1.1rem)"}}>
          Analiziramo: {typed}
          <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-cursor" style={{verticalAlign:"middle"}} />
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[
          { n:"2.1M", l:"Slovencev čaka na odgovor", c:"#60a5fa" },
          { n:"∞",    l:"Debat brez rešitev na TV",  c:"#f87171" },
          { n:"1",    l:"Platforma, ki bo spremenila igro", c:"#4ade80" },
        ].map((s,i) => (
          <div key={i} className="glass rounded-2xl p-5 text-center glow-blue"
            style={{animation:`badge-pop 0.5s ${i*0.15+0.3}s both`}}>
            <div className="text-3xl font-black mb-1" style={{color:s.c}}>{s.n}</div>
            <div className="text-xs text-slate-400 leading-tight">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Orbiting ring decoration */}
      <div className="pointer-events-none" style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:-1}}>
        <div style={{width:600,height:600,border:"1px solid rgba(59,130,246,0.08)",borderRadius:"50%",animation:"rotate-slow 30s linear infinite"}} />
        <div style={{position:"absolute",width:400,height:400,border:"1px solid rgba(59,130,246,0.06)",borderRadius:"50%",animation:"rotate-slow 20s linear infinite reverse"}} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 1 — THE PROBLEM / TV DEBATE
// ─────────────────────────────────────────────────────────
const debateLines = [
  { speaker:"Minister A", text:'„Naredili smo največji napredek v zdravstvu doslej!"', c:"#60a5fa" },
  { speaker:"Opozicija B", text:'„Laži! Čakalne vrste so se PODVOJILE pod vami!"', c:"#f87171" },
  { speaker:"Minister A", text:'„Investirali smo 340 milijonov evrov —"', c:"#60a5fa" },
  { speaker:"Opozicija B", text:'„— bolnišnice, ki jih ŠE NI! Iz leta 2019 govorite!"', c:"#f87171" },
  { speaker:"Minister C", text:'„Oprostite — a smem dokončati? DIGITALIZACIJA —"', c:"#c084fc" },
  { speaker:"Moderator", text:'„Gospoda... prosim. GOSPODA."', c:"#94a3b8" },
];

function Scene1({ active }: { active: boolean }) {
  const [shown, setShown] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (!active) { setShown(0); return; }
    setShown(0);
    let i = 0;
    timer.current = setInterval(() => {
      i++;
      setShown(i);
      if (i >= debateLines.length) clearInterval(timer.current!);
    }, 1400);
    return () => { if(timer.current) clearInterval(timer.current); };
  }, [active]);

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-10">
        <div className="text-xs font-mono text-red-400 tracking-widest uppercase mb-3">Problem</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(2rem,5vw,4rem)"}}>
          <span className="grad-white">Vsak četrtek</span><br/>
          <span className="text-red-400">ista predstava.</span>
        </h2>
      </div>

      {/* TV */}
      <div className="glass rounded-3xl overflow-hidden" style={{border:"1px solid rgba(239,68,68,0.2)"}}>
        <div className="px-5 py-3 flex items-center justify-between" style={{background:"rgba(239,68,68,0.06)"}}>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="flex items-center gap-2 text-xs text-red-400">
            <span className="w-2 h-2 bg-red-500 rounded-full" style={{animation:"pulse 1s infinite"}} />
            V ŽIVO · POLITIČNA DEBATA
          </div>
          <div className="text-xs text-slate-600 font-mono">21:03</div>
        </div>
        <div className="p-6 space-y-3 min-h-56">
          {debateLines.slice(0, shown).map((l, i) => (
            <div key={i} className="flex gap-3"
              style={{animation:"badge-pop 0.4s both",opacity:shown>i?1:0,transition:"opacity 0.3s"}}>
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{background:l.c}} />
              <div>
                <div className="text-xs font-bold mb-0.5" style={{color:l.c}}>{l.speaker}</div>
                <p className="text-sm text-slate-300">{l.text}</p>
              </div>
            </div>
          ))}
          {shown >= debateLines.length && (
            <div className="pt-3 border-t border-slate-800 text-center text-xs text-slate-600">
              18 minut pozneje · 0 rešitev predlaganih.
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {[
          { n:"34", l:"Prekinjanj na debato", c:"#f87171" },
          { n:"0",  l:"Trditev preverjenih v živo", c:"#fbbf24" },
          { n:"2",  l:"Konkretnih rešitev od 47", c:"#60a5fa" },
        ].map((s,i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <div className="text-3xl font-black mb-1" style={{color:s.c}}>{s.n}</div>
            <div className="text-xs text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 2 — SAUNA LETTER
// ─────────────────────────────────────────────────────────
function Scene2({ active }: { active: boolean }) {
  return (
    <div className={`scene-content w-full max-w-3xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="sauna-ambient absolute inset-0 pointer-events-none" />

      {/* Steam */}
      {active && [0,1,2,3].map(i => (
        <div key={i} className="pointer-events-none absolute" style={{
          bottom:"15%", left:`${20+i*18}%`,
          width:6, height:24,
          borderRadius:8,
          background:"rgba(251,146,60,0.15)",
          animation:`steam-rise ${2.5+i*0.4}s ease-in-out ${i*0.6}s infinite`,
          filter:"blur(3px)",
        }} />
      ))}

      <div className="text-center mb-8">
        <div className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-2">Posebno sporočilo</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>
          <span className="grad-orange">Prekinitev programa.</span>
        </h2>
      </div>

      <div className="glass-orange rounded-3xl p-8 glow-orange">
        <div className="text-center text-orange-400 text-xs font-mono tracking-widest uppercase mb-6">
          📺 Odprto pismo · Vsem politikom danes na TV
        </div>

        <div className="space-y-4 text-slate-300 leading-relaxed" style={{fontSize:"clamp(0.9rem,1.5vw,1.1rem)"}}>
          <p><span className="text-orange-300 font-bold">Hej, vsi ste bili danes odlični.</span></p>
          <p>Resno. Vsak od vas govori dejstva. Vsak ljubi Slovenijo. Samo malo nas utrujate. 😅</p>

          <div className="rounded-2xl p-5 my-2" style={{background:"rgba(249,115,22,0.08)",border:"1px solid rgba(249,115,22,0.25)"}}>
            <p className="text-orange-200 font-semibold text-lg mb-2">🧖 Greste vsi skupaj v savno.</p>
            <p className="text-sm text-slate-300">Ni kamer. Ni mikrofona. Samo para in morda kakšna dobra beseda med Slovenci.</p>
            <p className="text-sm text-slate-300 mt-2">Potem sedete za skupno mizo — z <span className="text-orange-300 font-semibold">resničnimi slovenskimi podatki.</span> In skupaj naredite Slovenijo najboljšo državo na svetu.</p>
          </div>

          <p>Mi hočemo AI nad vami. Ampak <span className="text-orange-300 font-bold">vas še vedno hočemo.</span> Ne kot nasprotnike. Kot <span className="text-white font-bold">Slovence.</span></p>

          <p className="text-sm text-slate-400">To je tisti četrtkovi šov, ki bi ga vsi gledali.</p>
        </div>

        <div className="mt-6 pt-5 border-t flex items-center justify-between" style={{borderColor:"rgba(249,115,22,0.2)"}}>
          <div>
            <p className="text-orange-400 font-semibold text-sm">Z spoštovanjem,</p>
            <p className="text-white font-bold">2.1 milijona Slovencev 🇸🇮</p>
          </div>
          <div className="text-2xl">🧖 🫂 🌍</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 3 — WAITLIST DATA / CASE STUDY
// ─────────────────────────────────────────────────────────
const waitlistData = [
  {y:"2018",v:42},{y:"2019",v:48},{y:"2020",v:71},{y:"2021",v:58},{y:"2022",v:55},{y:"2023",v:61},{y:"2024",v:52}
];
const claims = [
  { pol:"Minister za zdravje", text:'„Do 2027 bomo implementirali popolno sledenje čakalnih vrst."', verdict:"partial", label:"Delno res", cls:"claim-partial", badge:"text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    analysis:"ZZZS beleži le 40% specialistov. Polna implementacija ni zakonsko zagotovljena.", src:"NIJZ 2024" },
  { pol:"Opozicija", text:'„Čakalne vrste so se PODVOJILE pod to vlado!"', verdict:"false", label:"Netočno", cls:"claim-false", badge:"text-red-400 bg-red-500/10 border-red-500/30",
    analysis:"NIJZ kaže 23% rast — ne 100%. Trend se je začel že 2018, pred to vlado.", src:"NIJZ & ZZZS 2018–2024" },
  { pol:"Premier", text:'„Vlagamo rekordnih 1.2 milijarde v zdravstvo."', verdict:"true", label:"Drži", cls:"claim-true", badge:"text-green-400 bg-green-500/10 border-green-500/30",
    analysis:"Proračun 2024: 1.19 mrd EUR. Rekorden nominalno — a pod EU povprečjem kot % BDP.", src:"Min. za finance, 2024" },
];
const MAX_DAYS = 80;

function Scene3({ active }: { active: boolean }) {
  const [barsActive, setBarsActive] = useState(false);
  const [claimIdx, setClaimIdx] = useState(0);

  useEffect(() => {
    if (!active) { setBarsActive(false); return; }
    const t = setTimeout(() => setBarsActive(true), 400);
    return () => clearTimeout(t);
  }, [active]);

  const claim = claims[claimIdx];

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-8">
        <div className="text-xs font-mono text-green-400 tracking-widest uppercase mb-2">Živi primer · Danes na TV</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>
          <span className="grad-white">Čakalne vrste</span><br/>
          <span className="grad-blue">vs. resnica</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Chart */}
        <div className="glass rounded-2xl p-5">
          <div className="text-sm font-bold text-white mb-1">Čakalna doba (dni) · 2018–2024</div>
          <div className="text-xs text-slate-500 mb-4">Vir: NIJZ</div>
          <div className="flex items-end gap-1.5 h-36">
            {waitlistData.map((d, i) => (
              <div key={d.y} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t"
                  style={{
                    height: barsActive ? `${(d.v / MAX_DAYS) * 128}px` : "2px",
                    background: d.y === "2020"
                      ? "linear-gradient(to top,#ef4444,#f87171)"
                      : "linear-gradient(to top,#2563eb,#60a5fa)",
                    transition:`height 0.8s cubic-bezier(0.34,1.56,0.64,1) ${i*80}ms`,
                    transformOrigin:"bottom",
                  }}
                />
                <div className="text-xs text-slate-600">{d.y}</div>
                {barsActive && <div className="text-xs font-bold text-slate-300">{d.v}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Claim analyzer */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" style={{animation:"pulse 1.5s infinite"}} />
            <span className="text-xs font-bold text-white">AI Analiza trditev</span>
          </div>
          <div className="flex gap-1.5 mb-3">
            {claims.map((c,i) => (
              <button key={i} onClick={() => setClaimIdx(i)}
                className="px-2 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: claimIdx===i ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.05)",
                  color: claimIdx===i ? "#93c5fd" : "#94a3b8",
                  border: claimIdx===i ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
                }}>
                {c.pol}
              </button>
            ))}
          </div>
          <div className={`rounded-xl p-4 ${claim.cls}`}>
            <p className="text-xs text-slate-300 italic mb-2">{claim.text}</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border mb-2 ${claim.badge}`}>
              {claim.label}
            </span>
            <p className="text-xs text-slate-400">{claim.analysis}</p>
            <p className="text-xs text-slate-600 mt-1">Vir: {claim.src}</p>
          </div>
        </div>
      </div>

      {/* AI pipeline */}
      <div className="glass rounded-2xl p-5 mt-5">
        <div className="text-center text-xs text-slate-500 mb-4">Kar bi AI Slovenija naredila v živo med debato</div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {icon:"🎙️", step:"01", t:"Ujame trditev", d:"Audio-to-text v realnem času"},
            {icon:"🔍", step:"02", t:"Preveri podatke", d:"NIJZ · SURS · Eurostat v 3s"},
            {icon:"📺", step:"03", t:"Prikaže javnosti", d:"Ocena resničnosti v živo"},
          ].map((s,i) => (
            <div key={i} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-mono text-blue-400 mb-0.5">KORAK {s.step}</div>
              <div className="text-xs font-semibold text-white mb-0.5">{s.t}</div>
              <div className="text-xs text-slate-400">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 4 — PLATFORM VISION / DASHBOARD
// ─────────────────────────────────────────────────────────
const depts = [
  { name:"Zdravstvo", e:"🏥", score:61, trend:"↗", c:"#60a5fa" },
  { name:"Šolstvo",   e:"📚", score:74, trend:"→", c:"#4ade80" },
  { name:"Okolje",    e:"🌿", score:68, trend:"↗", c:"#34d399" },
  { name:"Infrastr.", e:"🛣️", score:55, trend:"↘", c:"#fbbf24" },
  { name:"Ekonomija", e:"📈", score:72, trend:"↗", c:"#a78bfa" },
  { name:"Varnost",   e:"🛡️", score:81, trend:"→", c:"#94a3b8" },
];

function Scene4({ active }: { active: boolean }) {
  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-8">
        <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">Vizija platforme</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>
          <span className="grad-white">AI Slovenija</span><br/>
          <span className="grad-blue">kako bi izgledalo</span>
        </h2>
      </div>

      {/* Dashboard mock */}
      <div className="glass rounded-3xl p-6" style={{border:"1px solid rgba(59,130,246,0.2)"}}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="font-black text-blue-400 text-lg">AI<span className="text-white">SLO</span></span>
            <div style={{width:1,height:20,background:"rgba(255,255,255,0.1)"}} />
            <span className="text-slate-500 text-xs">Stanje države · Januar 2025</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" style={{animation:"pulse 1.5s infinite"}} />
            v realnem času
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {depts.map((d, i) => (
            <div key={i} className="rounded-xl p-3" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div className="flex items-center justify-between mb-2">
                <span>{d.e}</span>
                <span className="text-xs font-bold" style={{color: d.trend==="↗"?"#4ade80":d.trend==="↘"?"#f87171":"#fbbf24"}}>{d.trend}</span>
              </div>
              <div className="text-xs font-semibold text-white mb-1.5">{d.name}</div>
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full" style={{background:"rgba(255,255,255,0.08)"}}>
                  <div className="h-1 rounded-full" style={{width:`${d.score}%`,background:d.c,transition:"width 1s ease"}} />
                </div>
                <span className="text-xs font-bold" style={{color:d.c}}>{d.score}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl p-4 flex items-center justify-between" style={{background:"rgba(255,255,255,0.04)"}}>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-0.5">Skupni indeks</div>
              <div className="text-2xl font-black text-white">68.5 <span className="text-green-400 text-sm">↗</span></div>
            </div>
            <div style={{width:1,height:32,background:"rgba(255,255,255,0.1)"}} />
            <div>
              <div className="text-xs text-slate-500 mb-0.5">EU povprečje</div>
              <div className="text-xl font-bold text-slate-400">71.2</div>
            </div>
          </div>
          <div className="text-xs text-slate-600">SURS · NIJZ · Eurostat</div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 5 — THREE PILLARS
// ─────────────────────────────────────────────────────────
function Scene5({ active }: { active: boolean }) {
  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-10">
        <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2">Arhitektura</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(2rem,5vw,3.5rem)"}}>
          <span className="grad-white">Trije stebri</span><br/>
          <span className="grad-blue">platforme</span>
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {[
          { num:"01", title:"Podatkovni temelj", c:"#60a5fa", icon:"🗄️",
            items:["SURS statistike","EU Eurostat","Vladni proračuni","NIJZ zdravje"],
            desc:"Vsak vladni oddelek. Vsaka številka. Posodobljeno samodejno." },
          { num:"02", title:"AI Fact-checker", c:"#a78bfa", icon:"🤖",
            items:["Audio-to-text analiza","Claude AI verificiranje","Scorecard politikov","Zgodovinski kontekst"],
            desc:"Vsaka trditev na TV se analizira v realnem času." },
          { num:"03", title:"Javni Dashboard", c:"#4ade80", icon:"📊",
            items:["Mobilna aplikacija","Tedensko poročilo","Primerjava obljub","Glasovanje javnosti"],
            desc:"Ena stran. Vsak Slovenec jo razume. Brez spin." },
        ].map((p, i) => (
          <div key={i} className="glass rounded-2xl p-5"
            style={{animation:`badge-pop 0.5s ${i*0.2+0.2}s both`,border:`1px solid ${p.c}22`}}>
            <div className="text-xs font-mono tracking-widest mb-3" style={{color:p.c}}>STEBER {p.num}</div>
            <div className="text-2xl mb-2">{p.icon}</div>
            <h3 className="font-bold text-white mb-2" style={{fontSize:"0.95rem"}}>{p.title}</h3>
            <p className="text-xs text-slate-400 mb-4">{p.desc}</p>
            <ul className="space-y-1.5">
              {p.items.map(it => (
                <li key={it} className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{background:p.c}} />
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Know your politician */}
      <div className="glass rounded-2xl p-5 mt-5 text-center">
        <span className="text-xl mr-2">👤</span>
        <span className="font-bold text-white">Spoznaj svojega politika</span>
        <span className="text-slate-400 text-sm ml-3">Ne samo politike — človeka. Vsak teden en politik, njegova zgodba.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 6 — CREDITS / OUTRO
// ─────────────────────────────────────────────────────────
// Scene 6 — Civic OS interlude: the big idea before we dive into the 4 layers
function Scene6({ active }: { active: boolean }) {
  const layers = [
    { n:"01", icon:"🏛️", title:"Portal politika",    sub:"Vsak politik · enak template · javno",  c:"#facc15" },
    { n:"02", icon:"🤖", title:"AI analiza",         sub:"Claude preveri vsako trditev v 4s",      c:"#a78bfa" },
    { n:"03", icon:"📲", title:"Moja Slovenija",     sub:"App za 2.1M Slovencev · glas + vpliv",  c:"#4ade80" },
    { n:"04", icon:"🏗️", title:"Gradimo Slovenijo",  sub:"8 oddelkov · skupnost · graditelji",     c:"#f472b6" },
  ];

  return (
    <div className={`scene-content text-center max-w-3xl mx-auto px-6 ${active ? "visible" : ""}`}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0"
        style={{background:"radial-gradient(ellipse at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 65%)"}} />

      <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-4">Civic OS · Vizija</div>

      <h2 className="font-black leading-none mb-4" style={{fontSize:"clamp(2.5rem,7vw,6rem)"}}>
        <span className="grad-white block">Slovenija</span>
        <span className="grad-blue block">kot operacijski sistem.</span>
      </h2>

      <p className="text-slate-400 mb-10 max-w-xl mx-auto" style={{fontSize:"clamp(0.9rem,1.5vw,1.1rem)"}}>
        Ne samo platforma za gledanje politikov.
        <br/>
        <span className="text-white font-semibold">Sistem, kjer vsak Slovenec postane del upravljanja države.</span>
      </p>

      {/* 4 layers preview */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {layers.map((l, i) => (
          <div key={i} className="glass rounded-2xl p-5 text-left"
            style={{
              border:`1px solid ${l.c}22`,
              animation:`badge-pop 0.5s ${i * 0.15 + 0.2}s both`,
            }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{background:`${l.c}18`, border:`1px solid ${l.c}33`}}>
                {l.icon}
              </div>
              <div className="text-xs font-mono tracking-widest" style={{color:l.c}}>PLAST {l.n}</div>
            </div>
            <div className="text-white font-bold text-sm mb-1">{l.title}</div>
            <div className="text-xs text-slate-400">{l.sub}</div>
          </div>
        ))}
      </div>

      <div className="text-slate-500 text-sm">
        Skupaj → <span className="text-white font-semibold">civilni operacijski sistem za Slovenijo.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 7 — POLITICIAN PORTAL
// ─────────────────────────────────────────────────────────
function Scene7({ active }: { active: boolean }) {
  const [tab, setTab] = useState(0);
  const tabs = ["Obljube","Poraba","Rezultati","AI Ocena"];
  const mockData = [
    [
      { label:"Čakalne vrste pod 30 dni", status:"V teku", p:40, c:"#fbbf24" },
      { label:"200 novih zdravnikov", status:"Delno", p:55, c:"#fbbf24" },
      { label:"Digitalizacija NIJZ", status:"Doseženo", p:100, c:"#4ade80" },
      { label:"3 nove ambulante", status:"Zamuda", p:20, c:"#f87171" },
    ],
    [
      { label:"Infrastruktura bolnišnic", val:"€42M", sub:"od €60M načrtovanih" },
      { label:"Plače zdravnikov", val:"€18M", sub:"povišanje realizirano" },
      { label:"IT sistemi", val:"€8.4M", sub:"v teku" },
      { label:"Skupaj porabljeno", val:"€68.4M", sub:"od €110M proračuna" },
    ],
    [
      { label:"Zmanjšanje čakalnih dob", val:"-12%", c:"#4ade80" },
      { label:"Novo zaposleni zdravniki", val:"87", c:"#60a5fa" },
      { label:"Digitalizirane ambulante", val:"34%", c:"#fbbf24" },
      { label:"Zadovoljstvo pacientov", val:"6.1/10", c:"#f87171" },
    ],
    null,
  ];

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-6">
        <div className="text-xs font-mono text-yellow-400 tracking-widest uppercase mb-2">Plast 1 · Sistem</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(1.8rem,4vw,3rem)"}}>
          <span className="grad-white">Portal politika</span><br/>
          <span style={{background:"linear-gradient(135deg,#fde68a,#eab308)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Njihov lasten server.</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">Vsak politik dobi enak template. Nobenih izjem. Vnese podatke — AI analizira — javnost vidi vse.</p>
      </div>

      <div className="glass rounded-3xl overflow-hidden" style={{border:"1px solid rgba(234,179,8,0.2)"}}>
        {/* Portal header */}
        <div className="px-6 py-4 flex items-center justify-between" style={{background:"rgba(234,179,8,0.06)",borderBottom:"1px solid rgba(234,179,8,0.12)"}}>
          <div>
            <div className="text-xs text-yellow-500 font-mono tracking-widest uppercase">PORTAL · ZDRAVSTVO</div>
            <div className="text-white font-bold text-sm mt-0.5">Minister Janez Novak</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" style={{animation:"pulse 1.5s infinite"}} />
            <span className="text-xs text-green-400">Javno vidno</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{borderColor:"rgba(255,255,255,0.06)"}}>
          {tabs.map((t,i) => (
            <button key={i} onClick={() => setTab(i)}
              className="flex-1 py-3 text-xs font-medium transition-all"
              style={{
                color: tab===i ? "#fbbf24" : "#64748b",
                borderBottom: tab===i ? "2px solid #eab308" : "2px solid transparent",
                background: "transparent",
                cursor: "pointer",
              }}>
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tab === 0 && (
            <div className="space-y-3">
              {(mockData[0] as {label:string;status:string;p:number;c:string}[]).map((item,i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">{item.label}</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{color:item.c,background:`${item.c}18`}}>{item.status}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{background:"rgba(255,255,255,0.08)"}}>
                      <div className="h-1.5 rounded-full" style={{width:`${item.p}%`,background:item.c,transition:"width 1s ease"}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {(mockData[1] as {label:string;val:string;sub:string}[]).map((item,i) => (
                <div key={i} className="rounded-xl p-4" style={{background:"rgba(234,179,8,0.06)",border:"1px solid rgba(234,179,8,0.12)"}}>
                  <div className="text-xs text-slate-500 mb-1">{item.label}</div>
                  <div className="text-xl font-black text-yellow-400">{item.val}</div>
                  <div className="text-xs text-slate-500">{item.sub}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {(mockData[2] as {label:string;val:string;c:string}[]).map((item,i) => (
                <div key={i} className="rounded-xl p-4 text-center" style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)"}}>
                  <div className="text-2xl font-black mb-1" style={{color:item.c}}>{item.val}</div>
                  <div className="text-xs text-slate-400">{item.label}</div>
                </div>
              ))}
            </div>
          )}
          {tab === 3 && (
            <div className="text-center py-4">
              <div className="text-5xl font-black mb-3" style={{color:"#fbbf24"}}>62<span className="text-2xl">/100</span></div>
              <div className="text-sm text-slate-300 mb-4">AI ocena doslednosti obljub in rezultatov</div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {l:"Obljube izpolnjene",v:"44%",c:"#fbbf24"},
                  {l:"Poraba po planu",v:"62%",c:"#60a5fa"},
                  {l:"Javna preglednost",v:"81%",c:"#4ade80"},
                ].map((s,i) => (
                  <div key={i} className="rounded-lg p-3" style={{background:"rgba(255,255,255,0.04)"}}>
                    <div className="font-black" style={{color:s.c}}>{s.v}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-600">Vir: Vneseni podatki + SURS + NIJZ · Claude AI analiza</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {["🏥 Zdravstvo","📚 Šolstvo","🛣️ Infrastruktura","🌿 Okolje","💼 Ekonomija"].map((d,i) => (
          <div key={i} className="flex-1 glass rounded-xl py-2 text-center text-xs text-slate-400">{d}</div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 8 — AI ANALYSIS ENGINE
// ─────────────────────────────────────────────────────────
function Scene8({ active }: { active: boolean }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon:"📥", label:"Podatki prejeti", desc:"Minister vnese obljube, porabo, rezultate", color:"#60a5fa", done:true },
    { icon:"🔍", label:"Ekstrakcija trditev", desc:"AI izloči vsako konkretno obljubo in številko", color:"#a78bfa", done:true },
    { icon:"📊", label:"Primerjava z bazami", desc:"SURS · NIJZ · Eurostat · vladni proračuni", color:"#34d399", done:true },
    { icon:"⚖️", label:"Ocenjevanje doslednosti", desc:"Obljuba vs. realnost = % ujemanja", color:"#fbbf24", done:false },
    { icon:"🌐", label:"Javna objava", desc:"Scorecard viden vsem Slovencem v app-u", color:"#f472b6", done:false },
  ];

  useEffect(() => {
    if (!active) { setStep(0); return; }
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length) clearInterval(t);
    }, 1800);
    return () => clearInterval(t);
  }, [active]);  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-8">
        <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2">Plast 2 · AI</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(1.8rem,4vw,3rem)"}}>
          <span className="grad-white">AI analiza</span><br/>
          <span className="grad-blue">v realnem času</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">Ko politik vnese podatke, Claude analizira brez politike.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className="glass rounded-2xl p-6">
          <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-4">AI Pipeline</div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-3 transition-all"
                style={{opacity: i < step ? 1 : 0.25, transform: i < step ? "translateX(0)" : "translateX(-8px)", transition:"all 0.5s ease"}}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{background: i < step ? `${s.color}20` : "rgba(255,255,255,0.04)", border: `1px solid ${i < step ? s.color+"44" : "rgba(255,255,255,0.06)"}`}}>
                  {i < step ? s.icon : "·"}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{s.label}</div>
                  <div className="text-xs text-slate-500">{s.desc}</div>
                </div>
                {i < step && <div className="ml-auto text-green-400 text-xs">✓</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Live output card */}
        <div className="space-y-3">
          <div className="glass rounded-2xl p-5" style={{border:"1px solid rgba(167,139,250,0.2)"}}>
            <div className="text-xs font-mono text-purple-400 mb-3">🤖 AI OUTPUT · ZDRAVSTVO</div>
            <div className="space-y-2 text-xs font-mono" style={{color:"#94a3b8"}}>
              <div style={{color: step>0?"#60a5fa":"#334155"}}>{">"} load_portal(zdravstvo_2024)</div>
              <div style={{color: step>1?"#a78bfa":"#334155"}}>{">"} extract_claims() → 14 found</div>
              <div style={{color: step>2?"#34d399":"#334155"}}>{">"} verify(SURS, NIJZ) → 9/14 match</div>
              <div style={{color: step>3?"#fbbf24":"#334155"}}>{">"} score() → 62/100</div>
              <div style={{color: step>4?"#f472b6":"#334155"}}>{">"} publish(public=true) ✓</div>
            </div>
          </div>

          {step >= 4 && (
            <div className="glass rounded-2xl p-5" style={{border:"1px solid rgba(52,211,153,0.2)",animation:"badge-pop 0.5s both"}}>
              <div className="text-xs font-mono text-green-400 mb-2">📊 JAVNA KARTICA</div>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-black text-yellow-400">62<span className="text-xl">/100</span></div>
                <div>
                  <div className="text-white font-bold text-sm">Zdravstvo · Jan Novak</div>
                  <div className="text-xs text-slate-400">9 od 14 obljub preverljivih</div>
                  <div className="text-xs text-slate-500">Posodobljeno: danes</div>
                </div>
              </div>
            </div>
          )}

          <div className="glass rounded-2xl p-4 text-center">
            <div className="text-xs text-slate-500 mb-1">Hitrost analize</div>
            <div className="text-2xl font-black text-purple-400">&lt; 4s</div>
            <div className="text-xs text-slate-600">od vnosa do javne objave</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 9 — CITIZEN APP "MOJA SLOVENIJA"
// ─────────────────────────────────────────────────────────
function Scene9({ active }: { active: boolean }) {
  const [screen, setScreen] = useState(0);
  const screens = ["Domov","Oceni","Glasuj","Prijavi","Graditelji"];

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-6">
        <div className="text-xs font-mono text-green-400 tracking-widest uppercase mb-2">Plast 3 · Aplikacija</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(1.8rem,4vw,3rem)"}}>
          <span className="grad-white">Moja Slovenija</span><br/>
          <span style={{background:"linear-gradient(135deg,#6ee7b7,#22c55e)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>App za vsakega Slovenca.</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">2.1 milijona Slovencev. Vsak ima glas. Vsak ima vpliv. Prvič.</p>
      </div>

      <div className="grid grid-cols-5 gap-1 mb-4">
        {screens.map((s,i) => (
          <button key={i} onClick={() => setScreen(i)}
            className="py-2 rounded-xl text-xs font-medium transition-all"
            style={{
              background: screen===i ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.04)",
              color: screen===i ? "#4ade80" : "#64748b",
              border: `1px solid ${screen===i ? "rgba(34,197,94,0.3)" : "transparent"}`,
              cursor:"pointer",
            }}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Phone mockup */}
        <div className="col-span-1">
          <div className="rounded-3xl overflow-hidden mx-auto" style={{
            width:160, background:"#0f172a", border:"2px solid rgba(255,255,255,0.1)",
            boxShadow:"0 0 40px rgba(34,197,94,0.15)",
          }}>
            <div style={{padding:"16px 12px 8px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
              <div className="text-xs font-black text-green-400 text-center">MOJA 🇸🇮 SLO</div>
            </div>
            <div style={{padding:12,minHeight:240}}>
              {screen === 0 && (
                <div className="space-y-2">
                  <div style={{background:"rgba(34,197,94,0.1)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:8,padding:"6px 8px"}}>
                    <div style={{fontSize:"0.55rem",color:"#4ade80"}}>SI Index</div>
                    <div style={{fontSize:"1.2rem",fontWeight:900,color:"white"}}>68.5</div>
                  </div>
                  {["🏥 62","📚 74","🛣️ 55","🌿 68"].map((d,i) => (
                    <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:"0.6rem",color:"#94a3b8"}}>
                      <span>{d.split(" ")[0]}</span><span style={{color:"#60a5fa"}}>{d.split(" ")[1]}/100</span>
                    </div>
                  ))}
                </div>
              )}
              {screen === 1 && (
                <div className="space-y-2">
                  <div style={{fontSize:"0.6rem",color:"#94a3b8",marginBottom:8}}>Zdravstvo · Jan Novak</div>
                  <div style={{background:"rgba(251,191,36,0.1)",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                    <div style={{fontSize:"1.4rem",fontWeight:900,color:"#fbbf24"}}>62/100</div>
                    <div style={{fontSize:"0.55rem",color:"#94a3b8"}}>AI ocena</div>
                  </div>
                  <div style={{fontSize:"0.6rem",color:"#475569",textAlign:"center"}}>Vaša ocena:</div>
                  <div style={{display:"flex",justifyContent:"center",gap:4}}>
                    {["😡","😐","🙂","😊","🤩"].map((e,i) => (
                      <div key={i} style={{fontSize:"1rem",cursor:"pointer"}}>{e}</div>
                    ))}
                  </div>
                </div>
              )}
              {screen === 2 && (
                <div className="space-y-2">
                  <div style={{fontSize:"0.6rem",color:"#94a3b8",marginBottom:4}}>Prioritete te mesece:</div>
                  {["Zdravstvo","Stanovanja","Šolstvo"].map((p,i) => (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0"}}>
                      <div style={{width:12,height:12,borderRadius:3,background:"rgba(96,165,250,0.3)",border:"1px solid rgba(96,165,250,0.4)",flexShrink:0}} />
                      <span style={{fontSize:"0.6rem",color:"#cbd5e1"}}>{p}</span>
                    </div>
                  ))}
                  <div style={{background:"rgba(96,165,250,0.15)",borderRadius:8,padding:"4px 8px",textAlign:"center",marginTop:8}}>
                    <div style={{fontSize:"0.55rem",color:"#60a5fa",fontWeight:700}}>GLASUJ →</div>
                  </div>
                </div>
              )}
              {screen === 3 && (
                <div className="space-y-2">
                  <div style={{fontSize:"0.6rem",color:"#94a3b8"}}>Prijavi problem:</div>
                  <div style={{background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"6px",fontSize:"0.55rem",color:"#64748b",border:"1px dashed rgba(255,255,255,0.1)"}}>
                    Luč pri mostu ne deluje že 3 tedne...
                  </div>
                  <div style={{fontSize:"0.6rem",color:"#475569"}}>Kategorija:</div>
                  {["🛣️ Infrastruktura","🏥 Zdravstvo"].map((c,i) => (
                    <div key={i} style={{padding:"3px 6px",borderRadius:6,background:"rgba(255,255,255,0.04)",fontSize:"0.55rem",color:"#94a3b8"}}>{c}</div>
                  ))}
                </div>
              )}
              {screen === 4 && (
                <div className="space-y-2">
                  <div style={{fontSize:"0.6rem",color:"#94a3b8",marginBottom:4}}>Graditelji te mesece:</div>
                  {[
                    {n:"Ana K.",r:"Zdravstvo · Ljubljana",s:"🔥 847 sledilcev"},
                    {n:"Miha P.",r:"Infrastruktura · Maribor",s:"⭐ 412 sledilcev"},
                  ].map((u,i) => (
                    <div key={i} style={{padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
                      <div style={{fontSize:"0.6rem",fontWeight:700,color:"white"}}>{u.n}</div>
                      <div style={{fontSize:"0.5rem",color:"#64748b"}}>{u.r}</div>
                      <div style={{fontSize:"0.5rem",color:"#4ade80"}}>{u.s}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature description */}
        <div className="col-span-2 space-y-3">
          {[
            { icon:"⭐", title:"Oceni politike", desc:"Vsak politik ima javni scorecard. AI ocena + tvoja ocena = celotna slika.", c:"#fbbf24", active: screen===1 },
            { icon:"🗳️", title:"Glasuj o prioritetah", desc:"Povej, kaj je Slovencem najpomembneje ta mesec. Vlada vidi rezultate.", c:"#60a5fa", active: screen===2 },
            { icon:"📍", title:"Prijavi lokalni problem", desc:"Luč ne dela? Cesta razbita? Prijavi → gre direktno na pravi oddelek.", c:"#f87171", active: screen===3 },
            { icon:"🔨", title:"Sledi graditeljem", desc:"Navadni Slovenci, ki gradijo rešitve. Ne politiki — pravi doers.", c:"#4ade80", active: screen===4 },
          ].map((f,i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-start gap-3 transition-all cursor-pointer"
              onClick={() => setScreen(i+1)}
              style={{border:`1px solid ${f.active ? f.c+"44" : "rgba(255,255,255,0.06)"}`,background: f.active ? `${f.c}08` : undefined}}>
              <span className="text-xl">{f.icon}</span>
              <div>
                <div className="text-sm font-bold text-white">{f.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 10 — DEPARTMENT HUBS "GRADIMO SLOVENIJO"
// ─────────────────────────────────────────────────────────
const departments = [
  { e:"🏥", name:"Zdravstvo",      score:61, trend:"↗", problems:847,  builders:34,  c:"#60a5fa" },
  { e:"📚", name:"Šolstvo",        score:74, trend:"→", problems:312,  builders:28,  c:"#a78bfa" },
  { e:"🌿", name:"Okolje",         score:68, trend:"↗", problems:203,  builders:19,  c:"#34d399" },
  { e:"🛣️", name:"Infrastruktura", score:55, trend:"↘", problems:1204, builders:41,  c:"#fbbf24" },
  { e:"💼", name:"Ekonomija",      score:72, trend:"↗", problems:189,  builders:55,  c:"#f472b6" },
  { e:"👮", name:"Varnost",        score:81, trend:"→", problems:98,   builders:12,  c:"#94a3b8" },
  { e:"🏠", name:"Stanovanja",     score:48, trend:"↘", problems:1891, builders:23,  c:"#fb923c" },
  { e:"🤝", name:"Skupnost",       score:63, trend:"↗", problems:445,  builders:67,  c:"#4ade80" },
];

function Scene10({ active }: { active: boolean }) {
  const [selected, setSelected] = useState(0);
  const dept = departments[selected];

  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-6">
        <div className="text-xs font-mono text-pink-400 tracking-widest uppercase mb-2">Plast 4 · Oddelki</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(1.8rem,4vw,3rem)"}}>
          <span className="grad-white">Gradimo Slovenijo</span><br/>
          <span style={{background:"linear-gradient(135deg,#fbcfe8,#db2777)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>8 javnih centrov.</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">Vsak oddelek ima skupnost, probleme, graditelje in živ napredek.</p>
      </div>

      {/* Department grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {departments.map((d,i) => (
          <button key={i} onClick={() => setSelected(i)}
            className="rounded-xl p-3 text-left transition-all"
            style={{
              background: selected===i ? `${d.c}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${selected===i ? d.c+"44" : "rgba(255,255,255,0.06)"}`,
              cursor:"pointer",
            }}>
            <div className="text-lg mb-1">{d.e}</div>
            <div className="text-xs font-bold text-white">{d.name}</div>
            <div className="text-xs font-black mt-1" style={{color:d.c}}>{d.score}/100</div>
          </button>
        ))}
      </div>

      {/* Selected department detail */}
      <div className="glass rounded-2xl p-5" style={{border:`1px solid ${dept.c}22`}}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{dept.e}</span>
          <div>
            <div className="text-white font-black text-lg">{dept.name}</div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 rounded-full w-32" style={{background:"rgba(255,255,255,0.08)"}}>
                <div className="h-1.5 rounded-full" style={{width:`${dept.score}%`,background:dept.c}} />
              </div>
              <span className="text-sm font-black" style={{color:dept.c}}>{dept.score}/100</span>
              <span className="text-sm" style={{color: dept.trend==="↗"?"#4ade80":dept.trend==="↘"?"#f87171":"#fbbf24"}}>{dept.trend}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl p-3 text-center" style={{background:"rgba(255,255,255,0.04)"}}>
            <div className="text-2xl font-black" style={{color:dept.c}}>{dept.problems.toLocaleString()}</div>
            <div className="text-xs text-slate-500">Odprti problemi</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{background:"rgba(255,255,255,0.04)"}}>
            <div className="text-2xl font-black text-green-400">{dept.builders}</div>
            <div className="text-xs text-slate-500">Aktivni graditelji</div>
          </div>
          <div className="rounded-xl p-3 text-center" style={{background:"rgba(255,255,255,0.04)"}}>
            <div className="text-2xl font-black text-blue-400">EU</div>
            <div className="text-xs text-slate-500">Primerjava benchmark</div>
          </div>
        </div>

        {/* Mini builder feed */}
        <div className="text-xs text-slate-500 mb-2">🔨 Nedavno iz graditeljev:</div>
        <div className="space-y-1.5">
          {[
            "Ana K. je objavila: 'Digitalizacija naročanja — prototip dela v 3 ambulantah'",
            "Tim pri NIJZ: 'Čakalne vrste v Mariboru zmanjšane za 18% v Q4'",
            "Citizen report #2847: 'Ambulanta Šiška — prepolna, nujno več prostora'",
          ].slice(0,2).map((t,i) => (
            <div key={i} className="rounded-lg px-3 py-2 text-xs text-slate-400"
              style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.05)"}}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE 11 — SYSTEM FLOW + INFLUENCER + THURSDAY SHOW
// ─────────────────────────────────────────────────────────
function Scene11({ active }: { active: boolean }) {
  return (
    <div className={`scene-content w-full max-w-4xl mx-auto px-6 ${active ? "visible" : ""}`}>
      <div className="text-center mb-8">
        <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">Celoten sistem</div>
        <h2 className="font-black leading-tight" style={{fontSize:"clamp(1.8rem,4vw,3rem)"}}>
          <span className="grad-white">Kako vse skupaj</span><br/>
          <span className="grad-blue">deluje.</span>
        </h2>
      </div>

      {/* Flow diagram */}
      <div className="grid grid-cols-5 gap-2 items-center mb-6">
        {[
          { icon:"📱", label:"Influencer deli", sub:"Sproži gibanje", c:"#f97316" },
          { icon:"→", label:"", sub:"", c:"#334155", arrow:true },
          { icon:"🏛️", label:"Politiki vnesejo", sub:"Obljube & poraba", c:"#fbbf24" },
          { icon:"→", label:"", sub:"", c:"#334155", arrow:true },
          { icon:"🤖", label:"AI analizira", sub:"V 4 sekundah", c:"#a78bfa" },
        ].map((node,i) => (
          node.arrow
            ? <div key={i} className="text-center text-slate-600 text-xl">→</div>
            : <div key={i} className="glass rounded-xl p-3 text-center" style={{border:`1px solid ${node.c}22`}}>
                <div className="text-2xl mb-1">{node.icon}</div>
                <div className="text-xs font-bold text-white">{node.label}</div>
                <div className="text-xs text-slate-500">{node.sub}</div>
              </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-2 items-center mb-8">
        {[
          { icon:"👥", label:"Javni scorecard", sub:"Vsi vidijo vse", c:"#60a5fa" },
          { icon:"→", label:"", sub:"", c:"#334155", arrow:true },
          { icon:"📲", label:"Moja Slovenija", sub:"Oceni · glasuj · prijavi", c:"#4ade80" },
          { icon:"→", label:"", sub:"", c:"#334155", arrow:true },
          { icon:"📺", label:"Četrtkovi šov", sub:"Živa analiza vsak teden", c:"#f472b6" },
        ].map((node,i) => (
          node.arrow
            ? <div key={i} className="text-center text-slate-600 text-xl">→</div>
            : <div key={i} className="glass rounded-xl p-3 text-center" style={{border:`1px solid ${node.c}22`}}>
                <div className="text-2xl mb-1">{node.icon}</div>
                <div className="text-xs font-bold text-white">{node.label}</div>
                <div className="text-xs text-slate-500">{node.sub}</div>
              </div>
        ))}
      </div>

      {/* Thursday show */}
      <div className="glass rounded-2xl p-5 mb-4" style={{border:"1px solid rgba(244,114,182,0.2)"}}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">📺</div>
          <div className="flex-1">
            <div className="text-xs font-mono text-pink-400 tracking-widest uppercase mb-1">Vsak četrtek · 21:00</div>
            <div className="text-white font-black text-lg mb-1">Četrtkovi šov · AI Slovenija</div>
            <p className="text-slate-400 text-sm">
              Influencer in AI skupaj predstavita tedensko analizo. Kateri politik je izpolnil obljube?
              Kateri oddelek je napredoval? Kateri Slovenec je bil graditelj meseca?
              <span className="text-pink-300 font-semibold"> Brez spin. Samo dejstva.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Impact numbers */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { n:"2.1M", l:"Slovencev v sistemu", c:"#60a5fa" },
          { n:"8", l:"Oddelkov pokritih", c:"#4ade80" },
          { n:"52", l:"Tednov na leto transparentno", c:"#a78bfa" },
          { n:"1", l:"Slovenija brez izgovorov", c:"#fb923c" },
        ].map((s,i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-black mb-0.5" style={{color:s.c}}>{s.n}</div>
            <div className="text-xs text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  SCENE LABELS
// ─────────────────────────────────────────────────────────
const SCENE_LABELS = [
  "Uvod",
  "Problem",
  "Pismo politikom 🧖",
  "Analiza podatkov",
  "Platforma",
  "Trije stebri",
  "Civic OS · Vizija",
  "Plast 1 · Portal politika 🏛️",
  "Plast 2 · AI analiza 🤖",
  "Plast 3 · Moja Slovenija 📲",
  "Plast 4 · Gradimo Slovenijo 🏗️",
  "Sistem · Četrtkovi šov 📺",
];

// ─────────────────────────────────────────────────────────
//  MAIN CINEMATIC ENGINE
// ─────────────────────────────────────────────────────────
export default function CinematicEngine() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const elapsedRef = useRef(0);
  const pausedRef = useRef(false);
  const canvasRef = useParticleCanvas(scene);

  const goTo = useCallback((n: number) => {
    setScene(Math.max(0, Math.min(TOTAL_SCENES - 1, n)));
    setElapsed(0);
    elapsedRef.current = 0;
  }, []);

  const next = useCallback(() => goTo(scene + 1), [goTo, scene]);
  const prev = useCallback(() => goTo(scene - 1), [goTo, scene]);
  const togglePause = useCallback(() => {
    setPaused(p => { pausedRef.current = !p; return !p; });
  }, []);

  // Auto-advance timer
  useEffect(() => {
    const duration = SCENE_DURATIONS[scene];
    elapsedRef.current = 0;
    setElapsed(0);

    timerRef.current = setInterval(() => {
      if (pausedRef.current) return;
      elapsedRef.current += 100;
      setElapsed(elapsedRef.current);
      if (elapsedRef.current >= duration) {
        clearInterval(timerRef.current!);
        if (scene < TOTAL_SCENES - 1) setScene(s => s + 1);
      }
    }, 100);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [scene]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") prev();
      if (e.key === "p" || e.key === "P") togglePause();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, togglePause]);

  const progress = Math.min(elapsed / SCENE_DURATIONS[scene], 1);

  // Camera transform per scene — simulate drone flying through 4D data space
  const cameraTransforms = [
    "translateZ(0px)   rotateX(0deg)    rotateY(0deg)",     // 0  hero        — straight on
    "translateZ(-80px) rotateX(1.5deg)  rotateY(-2deg)",    // 1  problem      — tilt left
    "translateZ(-40px) rotateX(-1deg)   rotateY(2.5deg)",   // 2  sauna        — tilt right warm
    "translateZ(-60px) rotateX(2deg)    rotateY(-1.5deg)",  // 3  data         — push in top
    "translateZ(-50px) rotateX(-0.5deg) rotateY(1deg)",     // 4  platform     — slight right
    "translateZ(-70px) rotateX(1deg)    rotateY(-2deg)",    // 5  pillars      — tilt left deep
    "translateZ(-30px) rotateX(0.5deg)  rotateY(3deg)",     // 6  portal       — right lean
    "translateZ(-90px) rotateX(-1.5deg) rotateY(-1deg)",    // 7  ai engine    — pull back
    "translateZ(-45px) rotateX(1deg)    rotateY(2deg)",     // 8  citizen app  — push right
    "translateZ(-55px) rotateX(-0.8deg) rotateY(-2.5deg)",  // 9  dept hubs   — left lean
    "translateZ(-35px) rotateX(0.3deg)  rotateY(1.5deg)",   // 10 system flow  — slight right
    "translateZ(30px)  rotateX(0deg)    rotateY(0deg)",     // 11 credits      — float forward
  ];

  const scenes = [Scene0, Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7, Scene8, Scene9, Scene10, Scene11];
  const CurrentScene = scenes[scene] ?? Scene0;

  // Background color shift per scene
  const bgColors = [
    "rgba(3,7,18,1)",    // 0  hero        — deep navy
    "rgba(12,3,3,1)",    // 1  problem      — dark red
    "rgba(20,7,1,1)",    // 2  sauna        — deep orange
    "rgba(2,10,4,1)",    // 3  data         — dark green
    "rgba(5,3,18,1)",    // 4  platform     — deep purple
    "rgba(2,6,16,1)",    // 5  pillars      — blue-black
    "rgba(14,11,2,1)",   // 6  politician   — dark gold
    "rgba(8,3,18,1)",    // 7  ai engine    — violet-black
    "rgba(1,12,7,1)",    // 8  citizen app  — forest
    "rgba(14,2,8,1)",    // 9  dept hubs    — deep pink
    "rgba(2,6,14,1)",    // 10 system flow  — slate blue
    "rgba(3,7,18,1)",    // 11 credits      — back to navy
  ];

  return (
    <>
      {/* Particle layer */}
      <canvas ref={canvasRef} id="particle-canvas" />

      {/* Grid overlay */}
      <div className="grid-bg fixed inset-0 pointer-events-none" style={{opacity:0.4,zIndex:1}} />

      {/* Scene viewport */}
      <div className="scene-viewport" style={{zIndex:2}}>
        <div className="scene-world" style={{transform: cameraTransforms[scene],
          background: `radial-gradient(ellipse at 50% 50%, ${bgColors[scene]} 0%, #030712 100%)`}}>

          {/* Depth / ambient floating panels behind */}
          <div className="depth-panel" style={{
            position:"fixed", top:"8%", left:"3%",
            opacity: 0.07 + (scene % 2) * 0.03,
            transform:`translateZ(-200px) rotate(-8deg)`,
            fontSize:"0.6rem", color:"#3b82f6", fontFamily:"monospace",
            lineHeight:1.6, whiteSpace:"pre",
            pointerEvents:"none", userSelect:"none",
          }}>
            {`NIJZ::čakalne_vrste\n> fetch(2024)\n> compare(EU_avg)\n> delta: +23%\n> status: PARTIAL`}
          </div>
          <div className="depth-panel" style={{
            position:"fixed", bottom:"12%", right:"4%",
            opacity: 0.06 + (scene % 3) * 0.02,
            transform:`translateZ(-300px) rotate(6deg)`,
            fontSize:"0.55rem", color:"#f97316", fontFamily:"monospace",
            lineHeight:1.8, whiteSpace:"pre",
            pointerEvents:"none", userSelect:"none",
          }}>
            {`AI_SLO::claim_check\n> input: "rekordnih 1.2 mrd"\n> verify(SURS, NIJZ)\n> confidence: 94%\n> verdict: TRUE`}
          </div>
          <div className="depth-panel" style={{
            position:"fixed", top:"40%", right:"2%",
            opacity: 0.05,
            transform:`translateZ(-150px) rotate(3deg)`,
            fontSize:"0.55rem", color:"#a78bfa", fontFamily:"monospace",
            lineHeight:1.8, whiteSpace:"pre",
            pointerEvents:"none", userSelect:"none",
          }}>
            {`zdravstvo: 61/100\nšolstvo:   74/100\ninfra:     55/100\nvarnost:   81/100\nSI index:  68.5`}
          </div>

          {/* Current scene */}
          <div className="scene-frame" style={{zIndex:5}}>
            <CurrentScene active={true} />
          </div>
        </div>
      </div>

      {/* ── HUD overlay ── */}
      {/* Top bar */}
      <div style={{
        position:"fixed", top:0, left:0, right:0, zIndex:50,
        padding:"16px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"linear-gradient(to bottom, rgba(3,7,18,0.9), transparent)",
      }}>
        <div className="font-black text-blue-400 tracking-tight" style={{fontSize:"1.1rem"}}>
          AI<span style={{color:"#f1f5f9"}}>SLO</span>
        </div>

        {/* Scene indicators */}
        <div style={{display:"flex", alignItems:"center", gap:8}}>
          {Array.from({length:TOTAL_SCENES}).map((_,i) => (
            <button key={i} onClick={() => goTo(i)}
              style={{
                width: i===scene ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i===scene ? "#3b82f6" : i<scene ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.1)",
                border:"none", cursor:"pointer",
                transition:"all 0.3s ease",
              }}
            />
          ))}
        </div>

        <div style={{fontSize:"0.7rem", color:"#475569", fontFamily:"monospace"}}>
          {String(scene+1).padStart(2,"0")} / {String(TOTAL_SCENES).padStart(2,"0")}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{position:"fixed", top:56, left:0, right:0, zIndex:50, padding:"0 24px"}}>
        <div className="scene-progress-track">
          <div className="scene-progress-fill" style={{width:`${progress*100}%`}} />
        </div>
      </div>

      {/* Scene label */}
      <div style={{
        position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
        zIndex:50,
        fontSize:"0.65rem", fontFamily:"monospace", letterSpacing:"0.15em",
        color:"rgba(148,163,184,0.6)", textTransform:"uppercase",
      }}>
        {SCENE_LABELS[scene]}
      </div>

      {/* Bottom controls */}
      <div style={{
        position:"fixed", bottom:0, left:0, right:0, zIndex:50,
        padding:"16px 24px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"linear-gradient(to top, rgba(3,7,18,0.9), transparent)",
      }}>
        {/* Left — prev */}
        <button onClick={prev} disabled={scene===0}
          style={{
            padding:"8px 16px", borderRadius:8, fontSize:"0.8rem",
            background:"rgba(255,255,255,0.06)", color: scene===0?"#334155":"#94a3b8",
            border:"1px solid rgba(255,255,255,0.08)", cursor: scene===0?"not-allowed":"pointer",
            transition:"all 0.2s",
          }}>
          ← Nazaj
        </button>

        {/* Center — play/pause */}
        <button onClick={togglePause}
          style={{
            padding:"8px 20px", borderRadius:8, fontSize:"0.8rem", fontWeight:600,
            background: paused ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.06)",
            color: paused ? "#60a5fa" : "#94a3b8",
            border:`1px solid ${paused?"rgba(59,130,246,0.4)":"rgba(255,255,255,0.08)"}`,
            cursor:"pointer",
          }}>
          {paused ? "▶ Nadaljuj" : "⏸ Pavza"}
        </button>

        {/* Right — next / skip */}
        <button onClick={next} disabled={scene===TOTAL_SCENES-1}
          style={{
            padding:"8px 16px", borderRadius:8, fontSize:"0.8rem",
            background: scene===TOTAL_SCENES-1 ? "rgba(255,255,255,0.03)" : "rgba(59,130,246,0.2)",
            color: scene===TOTAL_SCENES-1 ? "#334155" : "#60a5fa",
            border:`1px solid ${scene===TOTAL_SCENES-1?"rgba(255,255,255,0.05)":"rgba(59,130,246,0.3)"}`,
            cursor: scene===TOTAL_SCENES-1?"not-allowed":"pointer",
            transition:"all 0.2s",
          }}>
          Naprej →
        </button>
      </div>

      {/* Keyboard hint — first scene only */}
      {scene === 0 && (
        <div style={{
          position:"fixed", bottom:64, left:"50%", transform:"translateX(-50%)",
          zIndex:50, fontSize:"0.6rem", color:"rgba(71,85,105,0.8)",
          fontFamily:"monospace", letterSpacing:"0.1em",
          animation:"badge-pop 0.8s 2s both",
        }}>
          ← → PUŠČICE · PRESLEDNICA za naprej · P za pavzo
        </div>
      )}
    </>
  );
}
