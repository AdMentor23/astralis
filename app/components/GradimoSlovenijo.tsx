"use client";
import { useState } from "react";

const departments = [
  {
    id:"zdravstvo", e:"🏥", name:"Zdravstvo", score:61, trend:"+2.1", eu:78, color:"#3b82f6",
    desc:"Čakalne vrste, primarna zdravstvena oskrba, digitalizacija",
    openProblems:847, builders:34, weeklyUpdates:12,
    topIssue:"Čakalne vrste za specialiste > 60 dni",
    recentBuilds:[
      { who:"Ana K.", what:"Prototip digitalne naročilnice — dela v 3 ambulantah", time:"danes" },
      { who:"NIJZ Tim", what:"Čakalne vrste Maribor -18% v Q4 2024", time:"včeraj" },
      { who:"MZ Team", what:"E-napotnice integracija v 12 bolnišnicah", time:"pred 3 dnemi" },
    ],
    problems:[
      { id:3291, title:"Ambulanta Šiška — prepolna kapaciteta", votes:847, status:"V obravnavi" },
      { id:3284, title:"Pediat. ambulanta Celje — 3-mesečne čakalne vrste", votes:612, status:"Nova" },
      { id:3271, title:"Urgenca UKC LJ — premalo osebja nočna izmena", votes:934, status:"Posredovano" },
    ],
  },
  {
    id:"stanovanja", e:"🏠", name:"Stanovanja", score:48, trend:"-2.4", eu:69, color:"#fb923c",
    desc:"Dostopna stanovanja, najemnine, stanovanjska politika",
    openProblems:1891, builders:23, weeklyUpdates:5,
    topIssue:"Najemnine +40% v 2 letih — kritična dostopnost",
    recentBuilds:[
      { who:"Luka B.", what:"Projekt dostopnih stanovanj Koper — 40 enot", time:"ta teden" },
      { who:"SOS", what:"Analiza najemnega trga 2024 objavljena", time:"pred 5 dnemi" },
    ],
    problems:[
      { id:3274, title:"Najemnine Maribor +40% v 2 letih", votes:1204, status:"V obravnavi" },
      { id:3265, title:"Brezdomci Ljubljana — zimska kapaciteta", votes:891, status:"V obravnavi" },
    ],
  },
  {
    id:"infrastruktura", e:"🛣️", name:"Infrastruktura", score:55, trend:"-1.1", eu:72, color:"#fbbf24",
    desc:"Ceste, železnice, kolesarstvo, javni prevoz",
    openProblems:1204, builders:41, weeklyUpdates:9,
    topIssue:"Tretja razvojna os — kritična zamuda 18 mesecev",
    recentBuilds:[
      { who:"Miha P.", what:"Kolesarska pot Maribor-Pesnica dokončana", time:"ta teden" },
      { who:"DARS", what:"Obnova A1 Šentilj — Ljubljana napredek 60%", time:"pred 2 dnema" },
    ],
    problems:[
      { id:3287, title:"Kolesarska pot ob Savi — poplavna škoda", votes:342, status:"Nova" },
      { id:3259, title:"Vlak Ljubljana-Maribor zamude vsak dan", votes:2341, status:"V obravnavi" },
    ],
  },
  {
    id:"solstvo", e:"📚", name:"Šolstvo", score:74, trend:"+0.4", eu:81, color:"#a78bfa",
    desc:"Osnovno, srednje, visoko šolstvo, digitalizacija učenja",
    openProblems:312, builders:28, weeklyUpdates:7,
    topIssue:"Pomanjkanje učiteljev matematike in STEM predmetov",
    recentBuilds:[
      { who:"Sara Ž.", what:"Digitalni učbeniki OŠ — 3. razred prototip", time:"ta teden" },
      { who:"UL FRI", what:"AI v šolah — pilotni program 5 šol", time:"pred tednomem" },
    ],
    problems:[
      { id:3281, title:"OŠ Moste — pomanjkanje učiteljev", votes:284, status:"Nova" },
      { id:3255, title:"Šolski prevozi Koroška — ukinjene linije", votes:456, status:"Posredovano" },
    ],
  },
  {
    id:"okolje", e:"🌿", name:"Okolje", score:68, trend:"+3.2", eu:74, color:"#22c55e",
    desc:"Podnebje, odpadki, voda, zelena tranzicija",
    openProblems:203, builders:19, weeklyUpdates:6,
    topIssue:"CO2 emisije nad cilji — potrebna pospešena tranzicija",
    recentBuilds:[
      { who:"Nina K.", what:"Kompostarna mreža Kranj — 8 lokacij", time:"ta teden" },
      { who:"ARSO", what:"Kakovost zraka 2024 — izboljšanje v 6 mestih", time:"pred 4 dnemi" },
    ],
    problems:[
      { id:3268, title:"Odlagališče Celje — vonj v mestu", votes:198, status:"Posredovano" },
      { id:3248, title:"Reka Sava — onesnaženost Zagorje", votes:367, status:"V obravnavi" },
    ],
  },
  {
    id:"ekonomija", e:"💼", name:"Ekonomija", score:72, trend:"+1.8", eu:75, color:"#f472b6",
    desc:"BDP, plače, podjetništvo, startup ekosistem",
    openProblems:189, builders:55, weeklyUpdates:11,
    topIssue:"Beg možganov — visoka izobraženi odhajajo v tujino",
    recentBuilds:[
      { who:"SPS", what:"Startup sklad — 15 novih podjetij Q4 2024", time:"ta teden" },
      { who:"SPIRIT", what:"Izvozna promocija +12% YoY", time:"pred 3 dnemi" },
    ],
    problems:[
      { id:3242, title:"Beg možganov — IT sektor", votes:1456, status:"V obravnavi" },
      { id:3238, title:"Minimalna plača — realna vrednost pada", votes:892, status:"Nova" },
    ],
  },
  {
    id:"varnost", e:"👮", name:"Varnost", score:81, trend:"+0.2", eu:80, color:"#34d399",
    desc:"Policija, gasilci, civilna zaščita, kibernetska varnost",
    openProblems:98, builders:12, weeklyUpdates:3,
    topIssue:"Kibernetski napadi na javno infrastrukturo +67%",
    recentBuilds:[
      { who:"SI-CERT", what:"Nacionalna kibernetska strategija posodobljena", time:"ta teden" },
    ],
    problems:[
      { id:3235, title:"Policijska postaja Trbovlje — podkadrovanost", votes:234, status:"Nova" },
    ],
  },
  {
    id:"skupnost", e:"🤝", name:"Skupnost", score:63, trend:"+1.5", eu:71, color:"#60a5fa",
    desc:"Sociala, nevladne organizacije, prostovoljstvo, kultura",
    openProblems:445, builders:67, weeklyUpdates:14,
    topIssue:"Osamljenost starejših — socialna izolacija porast",
    recentBuilds:[
      { who:"Karitas", what:"Digitalna pismenost za 60+ — 200 udeležencev", time:"ta teden" },
      { who:"RK SLO", what:"Banka hrane — rekorden doseg Q4 2024", time:"pred 2 dnema" },
    ],
    problems:[
      { id:3229, title:"Dom starejših Trnovo — dolga čakalna lista", votes:567, status:"V obravnavi" },
      { id:3221, title:"Kulturni dom Lendava — zaprtje grozi", votes:213, status:"Nova" },
    ],
  },
];

const statusCls: Record<string,string> = {
  "Nova":"badge-blue", "V obravnavi":"badge-yellow", "Posredovano":"badge-green"
};

export default function GradimoSlovenijo({ initId }: { initId?: string }) {
  const [selected, setSelected] = useState(
    initId ? departments.findIndex(d => d.id === initId) : 0
  );
  const [tab, setTab] = useState<"overview"|"problems"|"builders">("overview");
  const dept = departments[selected];

  return (
    <div className="p-7 anim-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Gradimo Slovenijo</h1>
          <p className="section-sub mt-1">8 oddelkov · skupnost · graditelji · transparentnost</p>
        </div>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns:"200px 1fr" }}>
        {/* Dept list */}
        <div className="space-y-1.5">
          {departments.map((d, i) => (
            <div key={d.id}
              className="nav-item"
              style={{
                background: selected===i ? `${d.color}12` : undefined,
                borderColor: selected===i ? `${d.color}33` : undefined,
                color: selected===i ? d.color : undefined,
              }}
              onClick={() => { setSelected(i); setTab("overview"); }}>
              <span className="icon">{d.e}</span>
              <span>{d.name}</span>
              <span className="ml-auto text-xs font-black" style={{ color:d.color }}>{d.score}</span>
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="space-y-4">
          {/* Header */}
          <div className="card p-5">
            <div className="flex items-start gap-4">
              <span style={{ fontSize:"2.5rem" }}>{dept.e}</span>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-black text-white">{dept.name}</h2>
                  <span className="badge" style={{
                    color: dept.trend.startsWith("+") ? "#4ade80" : "#f87171",
                    background: dept.trend.startsWith("+") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${dept.trend.startsWith("+") ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}>{dept.trend}%</span>
                </div>
                <p className="text-xs mb-3" style={{ color:"#64748b" }}>{dept.desc}</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="progress-track flex-1" style={{ maxWidth:200 }}>
                    <div className="progress-fill" style={{ width:`${dept.score}%`, background:dept.color }} />
                  </div>
                  <span className="text-sm font-black" style={{ color:dept.color }}>{dept.score}/100</span>
                  <span className="text-xs" style={{ color:"#475569" }}>EU: {dept.eu}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 flex-shrink-0">
                {[
                  { v:dept.openProblems.toLocaleString(), l:"Problemi", c:"#f87171" },
                  { v:dept.builders, l:"Graditelji", c:"#4ade80" },
                  { v:dept.weeklyUpdates, l:"Posod./teden", c:"#60a5fa" },
                ].map((s,i) => (
                  <div key={i} className="card-sm p-3 text-center">
                    <div className="text-xl font-black mb-0.5" style={{ color:s.c }}>{s.v}</div>
                    <div className="text-xs" style={{ color:"#475569" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-sm p-3 mt-3 flex items-start gap-2">
              <span className="text-yellow-400 text-sm">⚠</span>
              <p className="text-xs" style={{ color:"#94a3b8" }}>
                <span className="font-semibold text-white">Ključni izziv:</span> {dept.topIssue}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar" style={{ maxWidth:360 }}>
            <button className={`tab-btn ${tab==="overview"?"active":""}`} onClick={() => setTab("overview")}>📊 Pregled</button>
            <button className={`tab-btn ${tab==="problems"?"active":""}`} onClick={() => setTab("problems")}>🚨 Problemi</button>
            <button className={`tab-btn ${tab==="builders"?"active":""}`} onClick={() => setTab("builders")}>🔨 Graditelji</button>
          </div>

          {/* Tab content */}
          {tab === "overview" && (
            <div className="card p-5 space-y-4">
              <div className="text-sm font-bold text-white mb-3">Zadnje iz skupnosti</div>
              {dept.recentBuilds.map((b, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-xs font-black text-white flex-shrink-0">
                    {b.who[0]}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">{b.who}</span>
                    <span className="text-xs mx-1" style={{ color:"#334155" }}>·</span>
                    <span className="text-xs" style={{ color:"#64748b" }}>{b.time}</span>
                    <p className="text-sm mt-0.5" style={{ color:"#cbd5e1" }}>{b.what}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "problems" && (
            <div className="space-y-3">
              {dept.problems.map(p => (
                <div key={p.id} className="card card-hover p-4 cursor-pointer">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white mb-1">{p.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono" style={{ color:"#334155" }}>#{p.id}</span>
                        <span className="text-xs" style={{ color:"#334155" }}>▲ {p.votes} glasov</span>
                      </div>
                    </div>
                    <span className={`badge ${statusCls[p.status]} flex-shrink-0`}>{p.status}</span>
                  </div>
                </div>
              ))}
              <button className="btn-ghost w-full text-xs">+ Prijavi nov problem v tem oddelku</button>
            </div>
          )}

          {tab === "builders" && (
            <div className="card p-5">
              <div className="text-sm font-bold text-white mb-4">
                Aktivni graditelji · {dept.name}
              </div>
              <div className="card-sm p-4 text-center" style={{ borderStyle:"dashed" }}>
                <div className="text-2xl mb-2">{dept.e}</div>
                <p className="text-sm text-white font-semibold mb-1">{dept.builders} aktivnih graditeljev</p>
                <p className="text-xs mb-4" style={{ color:"#64748b" }}>
                  Pridružite se skupnosti in delajte na resničnih problemih v oddelku {dept.name}.
                </p>
                <button className="btn-primary text-xs">Postani graditelj →</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
