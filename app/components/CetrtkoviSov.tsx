"use client";
import { useState } from "react";

const episodes = [
  {
    ep: 12, date:"Četrtek, 20. februar 2025", live: true,
    title:"Čakalne vrste: obljube vs. realnost",
    highlight:"AI razkril: 23% porast čakalnih dob, ne 100% kot trdijo",
    tags:["Zdravstvo","Fact-check","Jan Novak","Rok Bernik"],
    topMoment:"Minister in opozicija sta oba zmotila — AI pokazal dejanske številke v živo",
    scores:[ {name:"Jan Novak", before:59, after:62}, {name:"Rok Bernik", before:47, after:44} ],
    citizenVotes:24831,
    aiSummary:"V tej epizodi je AI analiziral 14 trditev dveh politikov o zdravstvenem sistemu. 3 trditve so bile popolnoma netočne, 6 delno točnih, 5 podprtih z dokazi. Ključna ugotovitev: nobeden od politikov ni navedel uradnih virov za svoje številke.",
  },
  {
    ep: 11, date:"Četrtek, 13. februar 2025", live: false,
    title:"Infrastruktura: denar je — projektov ni",
    highlight:"Proračun porabljen 37% — zamude pri 67% projektov",
    tags:["Infrastruktura","Rok Bernik","Proračun"],
    topMoment:"Razkritje: Železniški projekt ima samo 5% napredka kljub 18 mesec zamude",
    scores:[ {name:"Rok Bernik", before:48, after:44} ],
    citizenVotes:19204,
    aiSummary:"AI analiziral proračunske dokumente ministrstva za infrastrukturo. Ugotovljeno: večina sredstev za železnico ni bila porabljena, projekti so v zamudi brez javne razlage.",
  },
  {
    ep: 10, date:"Četrtek, 6. februar 2025", live: false,
    title:"Ekonomija: rekordni rezultati ali spin?",
    highlight:"Brezposelnost rekordno nizka — ampak realne plače padajo",
    tags:["Ekonomija","Eva Kovač","BDP","Plače"],
    topMoment:"Eva Kovač je imela najboljši scorecard v vladi — 78/100",
    scores:[ {name:"Eva Kovač", before:75, after:78} ],
    citizenVotes:16892,
    aiSummary:"AI potrdil večino ekonomskih trditev z Eurostat podatki. Opozorilo: inflacija je jedla rast nominalnih plač — realna rast je 2.1%, ne 6.2% kot je navedla ministrica.",
  },
];

const leaderboard = [
  { name:"Eva Kovač",   dept:"Ekonomija",       score:78, change:+3, color:"#4ade80" },
  { name:"Maja Horvat", dept:"Šolstvo",          score:71, change:+1, color:"#60a5fa" },
  { name:"Jan Novak",   dept:"Zdravstvo",        score:62, change:+3, color:"#60a5fa" },
  { name:"Rok Bernik",  dept:"Infrastruktura",   score:44, change:-4, color:"#f87171" },
];

export default function CetrtkoviSov() {
  const [selectedEp, setSelectedEp] = useState(0);
  const ep = episodes[selectedEp];

  return (
    <div className="p-7 anim-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Četrtkovi šov</h1>
          <p className="section-sub mt-1">Tedenski AI pregled · Vsak četrtek ob 21:00 · Transparentnost v živo</p>
        </div>
        {ep.live && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.25)" }}>
            <span className="live-dot" style={{ background:"#ef4444" }} />
            <span className="text-sm font-bold text-red-400">V ŽIVO NOCOJ</span>
          </div>
        )}
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns:"1fr 280px" }}>
        {/* Main panel */}
        <div className="space-y-4">
          {/* Episode selector */}
          <div className="flex gap-2">
            {episodes.map((e, i) => (
              <button key={e.ep}
                className={`card card-hover px-4 py-3 text-left flex-1 transition-all ${selectedEp===i?"glow-blue":""}`}
                style={{ borderColor: selectedEp===i ? "rgba(59,130,246,0.4)" : undefined, cursor:"pointer" }}
                onClick={() => setSelectedEp(i)}>
                <div className="flex items-center gap-2 mb-1">
                  {e.live && <span className="live-dot" style={{ background:"#ef4444" }} />}
                  <span className="text-xs font-mono" style={{ color:"#64748b" }}>EP. {e.ep}</span>
                </div>
                <div className="text-xs font-bold text-white leading-tight">{e.title}</div>
                <div className="text-xs mt-1" style={{ color:"#334155" }}>{e.date}</div>
              </button>
            ))}
          </div>

          {/* Episode detail */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-purple">Epizoda {ep.ep}</span>
                  {ep.live && <span className="badge badge-red" style={{ background:"rgba(239,68,68,0.12)", color:"#f87171", border:"1px solid rgba(239,68,68,0.25)" }}>🔴 V ŽIVO</span>}
                </div>
                <h2 className="text-xl font-black text-white mb-1">{ep.title}</h2>
                <p className="text-xs" style={{ color:"#64748b" }}>{ep.date}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-white">{ep.citizenVotes.toLocaleString()}</div>
                <div className="text-xs" style={{ color:"#64748b" }}>glasov gledalcev</div>
              </div>
            </div>

            {/* Highlight */}
            <div className="card-sm p-4 mb-4" style={{ borderColor:"rgba(251,191,36,0.2)", background:"rgba(251,191,36,0.04)" }}>
              <div className="text-xs font-mono mb-1" style={{ color:"#fbbf24" }}>🏆 Ključna ugotovitev:</div>
              <p className="text-sm font-semibold text-white">{ep.highlight}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {ep.tags.map(t => (
                <span key={t} className="badge badge-blue">{t}</span>
              ))}
            </div>

            {/* Top moment */}
            <div className="card-sm p-4 mb-4">
              <div className="text-xs font-mono mb-1" style={{ color:"#64748b" }}>💥 Vrhunec epizode:</div>
              <p className="text-sm" style={{ color:"#cbd5e1" }}>{ep.topMoment}</p>
            </div>

            {/* Score changes */}
            <div className="mb-4">
              <div className="text-xs font-bold mb-3" style={{ color:"#64748b" }}>Sprememba scorecardov po epizodi:</div>
              <div className="flex gap-3">
                {ep.scores.map((s, i) => (
                  <div key={i} className="card-sm p-4 flex-1">
                    <div className="text-xs font-bold text-white mb-2">{s.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black" style={{ color:"#64748b" }}>{s.before}</span>
                      <span style={{ color:"#475569" }}>→</span>
                      <span className="text-lg font-black" style={{ color: s.after > s.before ? "#4ade80" : "#f87171" }}>{s.after}</span>
                      <span className="badge ml-1" style={{
                        color: s.after > s.before ? "#4ade80" : "#f87171",
                        background: s.after > s.before ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        border: `1px solid ${s.after > s.before ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                      }}>
                        {s.after > s.before ? "+" : ""}{s.after - s.before}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="card-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" style={{ animation:"pulse-dot 1.5s infinite" }} />
                <span className="text-xs font-mono" style={{ color:"#64748b" }}>AI povzetek epizode · Claude</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color:"#cbd5e1" }}>{ep.aiSummary}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Leaderboard */}
          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-4">🏆 Lestvica politikov</div>
            <div className="space-y-3">
              {leaderboard.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm font-black w-5 text-right flex-shrink-0" style={{ color:i===0?"#fbbf24":i===1?"#94a3b8":i===2?"#fb923c":"#475569" }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{p.name}</div>
                    <div className="text-xs" style={{ color:"#475569" }}>{p.dept}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black" style={{ color:p.color }}>{p.score}</div>
                    <div className="text-xs" style={{ color: p.change > 0 ? "#4ade80" : "#f87171" }}>
                      {p.change > 0 ? "+" : ""}{p.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next episode */}
          <div className="card p-5" style={{ borderColor:"rgba(244,114,182,0.2)", background:"rgba(244,114,182,0.03)" }}>
            <div className="text-xs font-mono text-pink-400 mb-2 tracking-widest uppercase">Naslednja epizoda</div>
            <div className="text-sm font-bold text-white mb-1">Četrtek, 27. feb · 21:00</div>
            <p className="text-xs mb-4" style={{ color:"#64748b" }}>
              Tema: Stanovanja — kdo je odgovoren za najemniško krizo?
            </p>
            <div className="space-y-2">
              <div className="text-xs font-semibold" style={{ color:"#64748b" }}>Nastopijo:</div>
              {["Eva Kovač · Ekonomija", "Rok Bernik · Infrastruktura"].map(n => (
                <div key={n} className="badge badge-blue w-full justify-center">{n}</div>
              ))}
            </div>
          </div>

          {/* Stat of the week */}
          <div className="card p-5">
            <div className="text-xs font-mono mb-3" style={{ color:"#64748b" }}>Stat tega tedna</div>
            <div className="text-4xl font-black mb-1" style={{ color:"#f87171" }}>67%</div>
            <p className="text-sm text-white font-semibold mb-1">infrastrukturnih projektov z zamudo</p>
            <p className="text-xs" style={{ color:"#475569" }}>Vir: Min. za infrastrukturo · Q4 2024 poročilo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
