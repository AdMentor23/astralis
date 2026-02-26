"use client";
import { useState } from "react";

const politicians = [
  {
    id:"novak", name:"Jan Novak", dept:"Zdravstvo", party:"SDS", score:62, trend:"↗",
    avatar:"JN", lastUpdate:"danes, 14:32",
    promises: [
      { text:"Čakalne vrste pod 30 dni za specialiste", progress:38, status:"v-teku", deadline:"Q4 2025" },
      { text:"200 novih zdravnikov zaposliti", progress:44, status:"v-teku", deadline:"Q2 2026" },
      { text:"Digitalizacija NIJZ sistema", progress:100, status:"dosezeno", deadline:"Q1 2024" },
      { text:"3 nove zdravstvene ambulante", progress:20, status:"zamuda", deadline:"Q3 2024" },
      { text:"E-recepti za vse zdravnike", progress:80, status:"v-teku", deadline:"Q2 2025" },
    ],
    spending: [
      { category:"Infrastruktura bolnišnic", planned:60, spent:42 },
      { category:"Plače zdravstvenega osebja", planned:25, spent:25 },
      { category:"IT sistemi & digitalizacija", planned:15, spent:8.4 },
      { category:"Preventivni programi", planned:10, spent:6.1 },
    ],
    results: [
      { metric:"Zmanjšanje čakalnih dob",    value:"-12%",   trend:"down-good", color:"#4ade80" },
      { metric:"Novo zaposleni zdravniki",    value:"87",     trend:"up",         color:"#60a5fa" },
      { metric:"Digitalizirane ambulante",    value:"34%",    trend:"up",         color:"#a78bfa" },
      { metric:"Zadovoljstvo pacientov",      value:"6.1/10", trend:"neutral",    color:"#fbbf24" },
      { metric:"Povprečna čakalna doba",      value:"52 dni", trend:"down-good",  color:"#4ade80" },
    ],
    aiAnalysis:"Na osnovi 14 preverljivih trditev in uradnih podatkov NIJZ/ZZZS: 9 trditev delno ali v celoti podprtih, 3 nepreverljive, 2 v nasprotju s podatki. Ključna vrzel: obljuba glede 200 zdravnikov je napredovala le 44%. Poraba proračuna 62% od planiranega. Digitalizacija NIJZ je edina popolnoma dosežena obljuba.",
    citizenScore: 5.8,
    citizenVotes: 12847,
  },
  {
    id:"horvat", name:"Maja Horvat", dept:"Šolstvo", party:"SD", score:71, trend:"→",
    avatar:"MH", lastUpdate:"včeraj, 09:15",
    promises: [
      { text:"Dvigniti plače učiteljev za 15%", progress:100, status:"dosezeno", deadline:"Q1 2024" },
      { text:"Brezplačni vrtci za vse",          progress:60,  status:"v-teku",  deadline:"Q4 2025" },
      { text:"Digitalni učbeniki za OŠ",         progress:45,  status:"v-teku",  deadline:"Q3 2025" },
      { text:"Nova šola v Celju",                progress:30,  status:"zamuda",  deadline:"Q2 2024" },
    ],
    spending: [
      { category:"Plače in kadri",          planned:80, spent:80 },
      { category:"Infrastruktura šol",       planned:30, spent:18 },
      { category:"Digitalizacija",           planned:15, spent:9 },
    ],
    results: [
      { metric:"Plače učiteljev",     value:"+15.2%",  trend:"up",     color:"#4ade80" },
      { metric:"Vpis v vrtce",        value:"+8%",     trend:"up",     color:"#60a5fa" },
      { metric:"PISA rang",           value:"28/80",   trend:"neutral", color:"#fbbf24" },
      { metric:"Osip dijakov",        value:"-3.1%",   trend:"down-good", color:"#4ade80" },
    ],
    aiAnalysis:"Na osnovi 4 glavnih obljub: 1 v celoti dosežena (plače), 2 v teku z realnim napredkom, 1 z zamudo. Poraba 82% planiranega. Relativno visok indeks preglednosti — vsi dokumenti oddani v roku.",
    citizenScore: 6.9,
    citizenVotes: 8321,
  },
  {
    id:"bernik", name:"Rok Bernik", dept:"Infrastruktura", party:"NSi", score:44, trend:"↘",
    avatar:"RB", lastUpdate:"pred 3 dnevi",
    promises: [
      { text:"Tretja razvojna os dokončanje", progress:15, status:"zamuda",  deadline:"Q2 2024" },
      { text:"Kolesarska mreža Ljubljana",    progress:55, status:"v-teku",  deadline:"Q4 2025" },
      { text:"Obnova 120 km cest",            progress:40, status:"v-teku",  deadline:"Q2 2025" },
      { text:"Nov železniški sistem Maribor", progress:5,  status:"zamuda",  deadline:"Q1 2025" },
    ],
    spending: [
      { category:"Cestna infrastruktura",  planned:200, spent:98 },
      { category:"Železnice",              planned:80,  spent:12 },
      { category:"Kolesarske poti",        planned:20,  spent:14 },
    ],
    results: [
      { metric:"Obnovljene ceste",        value:"48 km",   trend:"neutral", color:"#fbbf24" },
      { metric:"Zamude projektov",         value:"67%",    trend:"bad",     color:"#f87171" },
      { metric:"Proračun porabljen",       value:"37%",    trend:"neutral", color:"#fbbf24" },
    ],
    aiAnalysis:"Najnižji scorecard v vladi. Večina investicij v zamudi brez jasnih razlogov v dokumentaciji. Železniška obljuba kritično podzaložena. Pozitivna: kolesarska infrastruktura napreduje po planu.",
    citizenScore: 3.4,
    citizenVotes: 15203,
  },
  {
    id:"kovac", name:"Eva Kovač", dept:"Ekonomija", party:"LMŠ", score:78, trend:"↗",
    avatar:"EK", lastUpdate:"danes, 08:47",
    promises: [
      { text:"BDP rast 3% letno",               progress:90, status:"v-teku",  deadline:"2026" },
      { text:"Brezposelnost pod 4%",             progress:100,status:"dosezeno",deadline:"Q2 2024" },
      { text:"Startup ekosistem — 50M€ sklad",   progress:70, status:"v-teku",  deadline:"Q3 2025" },
      { text:"Povprečna plača +8%",              progress:80, status:"v-teku",  deadline:"2025" },
    ],
    spending: [
      { category:"Startup sklad",        planned:50, spent:38 },
      { category:"Izvozna spodbuda",     planned:20, spent:19 },
      { category:"Zelena tranzicija",    planned:30, spent:22 },
    ],
    results: [
      { metric:"BDP rast 2024",          value:"+2.8%",  trend:"up",      color:"#4ade80" },
      { metric:"Brezposelnost",          value:"3.7%",   trend:"down-good",color:"#4ade80" },
      { metric:"Povprečna plača rast",   value:"+6.2%",  trend:"up",      color:"#60a5fa" },
    ],
    aiAnalysis:"Najboljši rezultati vlade. Brezposelnost rekordno nizka, BDP rast solidna. Startup sklad v teku z 38/50M€. Edina vrzel: povprečna plača raste počasneje od inflacije v Q1-Q2.",
    citizenScore: 7.4,
    citizenVotes: 9102,
  },
];

const statusConfig: Record<string, { label:string; cls:string }> = {
  "dosezeno": { label:"Doseženo ✓",  cls:"badge-green" },
  "v-teku":   { label:"V teku",      cls:"badge-blue"  },
  "zamuda":   { label:"Zamuda ⚠",   cls:"badge-red"   },
};

function ScoreRing({ score, color, size = 56 }: { score:number; color:string; size?:number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)", flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeDasharray={circ} strokeDashoffset={fill} strokeLinecap="round"
        style={{ transition:"stroke-dashoffset 1.2s ease" }} />
    </svg>
  );
}

export default function PoliticianPortals({ initId }: { initId?: string }) {
  const [selected, setSelected] = useState(initId ? politicians.findIndex(p => p.name === initId) : 0);
  const [tab, setTab] = useState<"promises"|"spending"|"results"|"ai">("promises");
  const [userRating, setUserRating] = useState<number|null>(null);

  const pol = politicians[selected];
  const scoreColor = pol.score >= 70 ? "#22c55e" : pol.score >= 50 ? "#fbbf24" : "#ef4444";

  return (
    <div className="p-7 anim-up">
      <div className="section-header" style={{ padding:0, marginBottom:20 }}>
        <div>
          <h1 className="section-title">Portali politikov</h1>
          <p className="section-sub mt-1">Vsak politik · enak template · javno preverljivo</p>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns:"240px 1fr" }}>
        {/* ── Politician list ── */}
        <div className="space-y-2">
          {politicians.map((p, i) => {
            const sc = p.score >= 70 ? "#22c55e" : p.score >= 50 ? "#fbbf24" : "#ef4444";
            return (
              <div key={p.id}
                className="card card-hover p-4 cursor-pointer transition-all"
                style={{ borderColor: selected === i ? "rgba(59,130,246,0.35)" : undefined,
                         background: selected === i ? "rgba(59,130,246,0.06)" : undefined }}
                onClick={() => { setSelected(i); setTab("promises"); setUserRating(null); }}>
                <div className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <ScoreRing score={p.score} color={sc} size={44} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-black" style={{ color:sc }}>{p.score}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white truncate">{p.name}</div>
                    <div className="text-xs" style={{ color:"#64748b" }}>{p.dept}</div>
                    <div className="text-xs mt-0.5" style={{ color:"#334155" }}>{p.lastUpdate}</div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="card p-4 text-center" style={{ borderStyle:"dashed", borderColor:"rgba(255,255,255,0.06)" }}>
            <div className="text-xs" style={{ color:"#334155" }}>+ 20 politikov čaka na aktivacijo portala</div>
          </div>
        </div>

        {/* ── Detail panel ── */}
        <div className="space-y-4">
          {/* Header */}
          <div className="card p-6">
            <div className="flex items-start gap-5">
              <div className="relative flex-shrink-0">
                <ScoreRing score={pol.score} color={scoreColor} size={72} />
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-lg font-black" style={{ color:scoreColor }}>{pol.score}</span>
                  <span className="text-xs" style={{ color:"#64748b", lineHeight:1 }}>/100</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-black text-white">{pol.name}</h2>
                  <span className="badge badge-blue">{pol.party}</span>
                  <span style={{ color: pol.trend === "↗" ? "#4ade80" : pol.trend === "↘" ? "#f87171" : "#fbbf24", fontSize:"1.2rem" }}>{pol.trend}</span>
                </div>
                <div className="text-sm mb-3" style={{ color:"#64748b" }}>{pol.dept} · Posodobljeno {pol.lastUpdate}</div>
                {/* Citizen rating */}
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-xs mb-1" style={{ color:"#64748b" }}>Ocena državljanov</div>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <div key={n} className="cursor-pointer transition-all"
                          onClick={() => setUserRating(n)}
                          style={{
                            width:16, height:16, borderRadius:3,
                            background: (userRating ?? pol.citizenScore) >= n
                              ? pol.score >= 70 ? "#22c55e" : pol.score >= 50 ? "#fbbf24" : "#ef4444"
                              : "rgba(255,255,255,0.08)",
                            transition:"all 0.1s",
                          }} />
                      ))}
                      <span className="text-sm font-bold ml-2" style={{ color:"#94a3b8" }}>
                        {userRating ?? pol.citizenScore}/10
                      </span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color:"#334155" }}>
                      {pol.citizenVotes.toLocaleString()} glasov {userRating && "· vaša ocena shranjena"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar">
            {(["promises","spending","results","ai"] as const).map(t => (
              <button key={t} className={`tab-btn ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
                { t === "promises" ? "📋 Obljube" : t === "spending" ? "💰 Poraba" : t === "results" ? "📊 Rezultati" : "🤖 AI Analiza" }
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="card p-5">
            {tab === "promises" && (
              <div className="space-y-4">
                <div className="text-xs font-mono" style={{ color:"#64748b" }}>
                  {pol.promises.filter(p => p.status === "dosezeno").length} doseženih ·{" "}
                  {pol.promises.filter(p => p.status === "v-teku").length} v teku ·{" "}
                  {pol.promises.filter(p => p.status === "zamuda").length} z zamudo
                </div>
                {pol.promises.map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-white flex-1">{p.text}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs" style={{ color:"#334155" }}>rok: {p.deadline}</span>
                        <span className={`badge ${statusConfig[p.status].cls}`}>{statusConfig[p.status].label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="progress-track flex-1">
                        <div className="progress-fill"
                          style={{
                            width:`${p.progress}%`,
                            background: p.status === "dosezeno" ? "#22c55e" : p.status === "zamuda" ? "#ef4444" : "#3b82f6",
                          }} />
                      </div>
                      <span className="text-xs font-bold w-8 text-right" style={{ color:"#94a3b8" }}>{p.progress}%</span>
                    </div>
                    {i < pol.promises.length - 1 && <div className="divider mt-2" />}
                  </div>
                ))}
              </div>
            )}

            {tab === "spending" && (
              <div className="space-y-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">Načrtovano vs. Porabljeno (M€)</span>
                  <span className="badge badge-yellow">
                    {Math.round(pol.spending.reduce((s,x) => s+x.spent,0) / pol.spending.reduce((s,x) => s+x.planned,0) * 100)}% porabe
                  </span>
                </div>
                {pol.spending.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white">{s.category}</span>
                      <span className="text-xs font-mono" style={{ color:"#64748b" }}>€{s.spent}M / €{s.planned}M</span>
                    </div>
                    <div className="relative h-2 rounded-full" style={{ background:"rgba(255,255,255,0.06)" }}>
                      {/* Planned */}
                      <div className="absolute inset-0 rounded-full opacity-20" style={{ background:"#3b82f6" }} />
                      {/* Spent */}
                      <div className="absolute left-0 top-0 h-2 rounded-full"
                        style={{ width:`${(s.spent/s.planned)*100}%`, background: s.spent >= s.planned ? "#22c55e" : "#3b82f6" }} />
                    </div>
                  </div>
                ))}
                <div className="card-sm p-4 mt-4">
                  <div className="text-xs font-mono mb-1" style={{ color:"#64748b" }}>SKUPAJ</div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-white">€{pol.spending.reduce((s,x) => s+x.spent,0).toFixed(1)}M</span>
                    <span className="text-sm mb-0.5" style={{ color:"#64748b" }}>/ €{pol.spending.reduce((s,x) => s+x.planned,0).toFixed(1)}M načrtovanih</span>
                  </div>
                </div>
              </div>
            )}

            {tab === "results" && (
              <div className="grid grid-cols-2 gap-3">
                {pol.results.map((r, i) => (
                  <div key={i} className="card-sm p-4">
                    <div className="text-xs mb-1" style={{ color:"#64748b" }}>{r.metric}</div>
                    <div className="text-2xl font-black" style={{ color:r.color }}>{r.value}</div>
                  </div>
                ))}
              </div>
            )}

            {tab === "ai" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" style={{ animation:"pulse-dot 1.5s infinite" }} />
                  <span className="text-xs font-mono" style={{ color:"#64748b" }}>Claude AI · Analiza na osnovi javnih podatkov</span>
                </div>
                <div className="card-sm p-4">
                  <p className="text-sm leading-relaxed" style={{ color:"#cbd5e1" }}>{pol.aiAnalysis}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l:"Preverljive trditve", v: pol.promises.length, c:"#60a5fa" },
                    { l:"Podprtih z dokazi",   v: Math.round(pol.promises.length * pol.score/100), c:"#4ade80" },
                    { l:"Zaupanje AI modela",  v:"94%", c:"#a78bfa" },
                  ].map((s,i) => (
                    <div key={i} className="card-sm p-3 text-center">
                      <div className="text-xl font-black mb-0.5" style={{ color:s.c }}>{s.v}</div>
                      <div className="text-xs" style={{ color:"#475569" }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div className="text-xs" style={{ color:"#334155" }}>
                  Viri: NIJZ poročilo 2024 · SURS statistike · Min. za finance proračun · ZZZS podatki · Eurostat
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
