"use client";
import { useState } from "react";

const departments = [
  { id:"zdravstvo",     e:"🏥", name:"Zdravstvo",       score:61, trend:"+2.1", eu:78, color:"#3b82f6", problems:847  },
  { id:"solstvo",       e:"📚", name:"Šolstvo",          score:74, trend:"+0.4", eu:81, color:"#a78bfa", problems:312  },
  { id:"okolje",        e:"🌿", name:"Okolje",           score:68, trend:"+3.2", eu:74, color:"#22c55e", problems:203  },
  { id:"infrastruktura",e:"🛣️", name:"Infrastruktura",  score:55, trend:"-1.1", eu:72, color:"#fbbf24", problems:1204 },
  { id:"ekonomija",     e:"💼", name:"Ekonomija",        score:72, trend:"+1.8", eu:75, color:"#f472b6", problems:189  },
  { id:"varnost",       e:"👮", name:"Varnost",          score:81, trend:"+0.2", eu:80, color:"#34d399", problems:98   },
  { id:"stanovanja",    e:"🏠", name:"Stanovanja",       score:48, trend:"-2.4", eu:69, color:"#fb923c", problems:1891 },
  { id:"skupnost",      e:"🤝", name:"Skupnost",         score:63, trend:"+1.5", eu:71, color:"#60a5fa", problems:445  },
];

const recentActivity = [
  { time:"pred 12 min", type:"fact-check", text:"AI preveril trditev Ministra za zdravje o čakalnih vrstah", verdict:"partial", color:"#fbbf24" },
  { time:"pred 34 min", type:"problem",    text:"Nova prijava #3291: Ambulanta Šiška — prepolna kapaciteta", verdict:"nova",    color:"#60a5fa" },
  { time:"pred 1 uro",  type:"portal",     text:"Minister Novak posodobil portal: +€8.4M IT investicij", verdict:"update",   color:"#4ade80" },
  { time:"pred 2 uri",  type:"vote",       text:"6.847 Slovencev glasovalo: Stanovanja prioriteta meseca", verdict:"result",   color:"#a78bfa" },
  { time:"pred 3 ure",  type:"builder",    text:"Ana K. objavila: prototip digitalne naročilnice dela v 3 ambulantah", verdict:"build", color:"#34d399" },
];

const politicians = [
  { name:"Jan Novak",      dept:"Zdravstvo",       score:62, trend:"↗", lastUpdate:"danes"   },
  { name:"Maja Horvat",    dept:"Šolstvo",          score:71, trend:"→", lastUpdate:"včeraj"  },
  { name:"Rok Bernik",     dept:"Infrastruktura",  score:44, trend:"↘", lastUpdate:"3 dni"   },
  { name:"Eva Kovač",      dept:"Ekonomija",        score:78, trend:"↗", lastUpdate:"danes"   },
];

function ScoreRing({ score, color, size = 64 }: { score: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </svg>
  );
}

export default function Dashboard({ onNav }: { onNav: (v: string, id?: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const avg = Math.round(departments.reduce((s, d) => s + d.score, 0) / departments.length);

  return (
    <div className="p-7 space-y-6 anim-up">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="section-title">Stanje Slovenije</h1>
          <p className="section-sub mt-1">Posodobljeno v realnem času · Vir: SURS · NIJZ · Eurostat · Ministrstva</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span style={{ fontSize:"0.72rem", color:"#4ade80" }}>V živo</span>
        </div>
      </div>

      {/* ── Top KPIs ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label:"SI Index", value: avg, sub:"EU povprečje: 75.1", color:"#3b82f6", suffix:"/100" },
          { label:"Odprti problemi", value:"4.990", sub:"↑ 124 ta teden", color:"#f87171", suffix:"" },
          { label:"Aktivni politiki", value:"12/24", sub:"portali posodobljeni", color:"#fbbf24", suffix:"" },
          { label:"Aktivni graditelji", value:"279", sub:"v 8 oddelkih", color:"#4ade80", suffix:"" },
        ].map((k, i) => (
          <div key={i} className="card p-5" style={{ animationDelay: `${i * 0.07}s` }}>
            <div className="text-xs font-mono mb-2" style={{ color:"#64748b" }}>{k.label}</div>
            <div className="text-3xl font-black mb-1" style={{ color:k.color }}>
              {k.value}{k.suffix}
            </div>
            <div className="text-xs" style={{ color:"#475569" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Department grid ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-white">Oddelki · Zdravje sistema</span>
          <button className="btn-ghost text-xs" onClick={() => onNav("gradimo")}>Vsi oddelki →</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {departments.map((d) => (
            <div key={d.id} className="card card-hover p-4 cursor-pointer transition-all"
              style={{ borderColor: hovered === d.id ? d.color + "44" : undefined }}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onNav("gradimo", d.id)}>
              <div className="flex items-start justify-between mb-3">
                <span style={{ fontSize:"1.4rem" }}>{d.e}</span>
                <span className="badge" style={{
                  color: d.trend.startsWith("+") ? "#4ade80" : "#f87171",
                  background: d.trend.startsWith("+") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                  border: `1px solid ${d.trend.startsWith("+") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  fontSize:"0.65rem",
                }}>
                  {d.trend}
                </span>
              </div>
              <div className="text-xs font-semibold text-white mb-1">{d.name}</div>
              <div className="flex items-center gap-2 mb-2">
                <div className="progress-track flex-1">
                  <div className="progress-fill anim-bar" style={{ width:`${d.score}%`, background:d.color }} />
                </div>
                <span className="text-xs font-black" style={{ color:d.color }}>{d.score}</span>
              </div>
              <div style={{ fontSize:"0.65rem", color:"#475569" }}>
                EU: {d.eu} · {d.problems.toLocaleString()} problemov
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom split: politicians + activity ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Politicians quick view */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white">Politiki · Scorecards</span>
            <button className="btn-ghost text-xs" onClick={() => onNav("politiki")}>Vsi →</button>
          </div>
          <div className="space-y-3">
            {politicians.map((p, i) => (
              <div key={i} className="flex items-center gap-3 cursor-pointer group"
                onClick={() => onNav("politiki", p.name)}>
                <div className="relative flex-shrink-0">
                  <ScoreRing score={p.score} color={p.score >= 70 ? "#22c55e" : p.score >= 50 ? "#fbbf24" : "#ef4444"} size={40} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-black text-white">{p.score}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">{p.name}</div>
                  <div className="text-xs" style={{ color:"#475569" }}>{p.dept} · {p.lastUpdate}</div>
                </div>
                <span style={{ color: p.trend === "↗" ? "#4ade80" : p.trend === "↘" ? "#f87171" : "#fbbf24", fontSize:"1.1rem" }}>{p.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live activity feed */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-white">Aktivnost · V živo</span>
            <span className="live-dot" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background:a.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-300 leading-relaxed">{a.text}</p>
                  <span className="text-xs" style={{ color:"#334155" }}>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
