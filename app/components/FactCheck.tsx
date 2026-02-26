"use client";
import { useState, useRef } from "react";

const liveClaims = [
  {
    id:1, politician:"Jan Novak", dept:"Zdravstvo", time:"pred 8 min",
    claim:"Do konca 2027 bomo implementirali popolno digitalno sledenje čakalnih vrst za vse specialiste.",
    verdict:"partial", verdictLabel:"Delno res", verdictColor:"#fbbf24",
    analysis:"ZZZS digitalno beleži čakalne vrste od 2021, a le za 40% specialistov. Polna implementacija do 2027 ni zagotovljena z nobeno zakonodajno podlago. Projekt digitalizacije je v teku (40% napredek).",
    sources:["NIJZ poročilo Q3 2024","ZZZS letno poročilo 2023","Ministrstvo za zdravje proračun 2024"],
    confidence:87,
  },
  {
    id:2, politician:"Rok Bernik", dept:"Infrastruktura", time:"pred 22 min",
    claim:"Čakalne vrste so se pod to vlado podvojile!",
    verdict:"false", verdictLabel:"Netočno", verdictColor:"#ef4444",
    analysis:"Podatki NIJZ kažejo 23% povečanje povprečnih čakalnih dob, ne 100%. Trend se je začel leta 2018 (pred to vlado) in se je 2023–2024 delno obrnil. Trditev je zavajajoča glede vzročnosti.",
    sources:["NIJZ statistike čakalnih dob 2018–2024","ZZZS mesečna poročila"],
    confidence:94,
  },
  {
    id:3, politician:"Eva Kovač", dept:"Ekonomija", time:"pred 41 min",
    claim:"Vlagamo rekordnih 1.2 milijarde evrov v zdravstvo letos.",
    verdict:"true", verdictLabel:"Drži", verdictColor:"#22c55e",
    analysis:"Proračun za zdravje 2024: 1.19 mrd EUR — rekorden v absolutnih zneskih. Opomba: kot delež BDP (6.2%) ostaja pod EU povprečjem (7.0%). Trditev je nominalno točna.",
    sources:["Ministrstvo za finance — Proračun RS 2024","Eurostat Health Expenditure 2023"],
    confidence:96,
  },
  {
    id:4, politician:"Maja Horvat", dept:"Šolstvo", time:"pred 1 uro",
    claim:"Slovenija je med top 10 v EU po kakovosti šolstva.",
    verdict:"partial", verdictLabel:"Delno res", verdictColor:"#fbbf24",
    analysis:"PISA 2022: Slovenija 28. od 81 držav (globalno), 12. v EU. V matematiki nad EU povprečjem, v bralni pismenosti pod. 'Top 10 v EU' je netočno — smo v zgornji tretjini.",
    sources:["PISA 2022 Results (OECD)","Eurostat Education Statistics 2023"],
    confidence:89,
  },
];

const verdictConfig: Record<string, { cls:string; icon:string }> = {
  true:    { cls:"claim-true",    icon:"✓" },
  false:   { cls:"claim-false",   icon:"✗" },
  partial: { cls:"claim-partial", icon:"~" },
};

export default function FactCheck() {
  const [input, setInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [userClaim, setUserClaim] = useState<null | { text: string; status: "analyzing"|"done" }>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setUserClaim({ text: input, status:"analyzing" });
    setInput("");
    setAnalyzing(true);
    setTimeout(() => {
      setUserClaim(c => c ? { ...c, status:"done" } : null);
      setAnalyzing(false);
    }, 3200);
  };

  return (
    <div className="p-7 anim-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">AI Fact-Check</h1>
          <p className="section-sub mt-1">Vsaka trditev politikov preverjena z javnimi podatki v realnem času</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span style={{ fontSize:"0.72rem", color:"#4ade80" }}>Aktivno poslušanje</span>
        </div>
      </div>

      {/* ── Input: submit a claim ── */}
      <div className="card p-5 mb-6">
        <div className="text-xs font-mono mb-3" style={{ color:"#64748b" }}>
          🎙️ Preverite katero koli trditev politika
        </div>
        <div className="flex gap-3">
          <input
            ref={inputRef}
            className="app-input flex-1"
            placeholder="Vnesite trditev politika za AI analizo..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
          />
          <button className="btn-primary" onClick={handleAnalyze} disabled={analyzing || !input.trim()}>
            {analyzing ? "Analiziram..." : "Preveri →"}
          </button>
        </div>
        {userClaim && (
          <div className="mt-4 card-sm p-4" style={{ borderColor: userClaim.status === "done" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)" }}>
            {userClaim.status === "analyzing" ? (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" style={{ animation:"pulse-dot 1s infinite" }} />
                <span className="text-sm" style={{ color:"#94a3b8" }}>
                  Analiziram: <em style={{ color:"white" }}>&ldquo;{userClaim.text}&rdquo;</em>
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-yellow">~ Delno preverljivo</span>
                  <span className="text-xs" style={{ color:"#64748b" }}>Zaupanje AI: 72%</span>
                </div>
                <p className="text-sm" style={{ color:"#cbd5e1" }}>
                  Na osnovi razpoložljivih javnih podatkov trditev delno drži. Za popolno analizo bi potreboval dostop do uradnih dokumentov ministrstva. Priporočam preveritev na SURS.si ali NIJZ.si.
                </p>
                <p className="text-xs mt-2" style={{ color:"#334155" }}>Viri: SURS · NIJZ · Eurostat — posodobljeno danes</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Live claims ── */}
      <div className="text-xs font-bold mb-3" style={{ color:"#64748b", letterSpacing:"0.1em", textTransform:"uppercase" }}>
        Zadnje preverbe · V živo
      </div>
      <div className="space-y-4">
        {liveClaims.map((c) => {
          const cfg = verdictConfig[c.verdict];
          return (
            <div key={c.id} className={`card p-5 ${cfg.cls}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge badge-blue text-xs">{c.politician}</span>
                  <span className="text-xs" style={{ color:"#475569" }}>· {c.dept} · {c.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge" style={{ color:c.verdictColor, background:`${c.verdictColor}15`, border:`1px solid ${c.verdictColor}33` }}>
                    {cfg.icon} {c.verdictLabel}
                  </span>
                  <span className="text-xs font-mono" style={{ color:"#475569" }}>zaup: {c.confidence}%</span>
                </div>
              </div>

              <blockquote className="text-sm font-semibold text-white mb-3 italic leading-relaxed">
                &ldquo;{c.claim}&rdquo;
              </blockquote>

              <div className="card-sm p-4 mb-3">
                <div className="text-xs font-mono mb-2" style={{ color:"#64748b" }}>🤖 AI analiza:</div>
                <p className="text-sm leading-relaxed" style={{ color:"#cbd5e1" }}>{c.analysis}</p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs" style={{ color:"#475569" }}>Viri:</span>
                {c.sources.map((s, i) => (
                  <span key={i} className="badge badge-blue" style={{ fontSize:"0.62rem" }}>{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
