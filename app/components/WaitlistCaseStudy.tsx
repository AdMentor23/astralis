"use client";
import { useEffect, useRef, useState } from "react";

const claims = [
  {
    politician: "Minister za zdravje",
    claim: "Do konca 2027 bomo implementirali popolno digitalno sledenje čakalnih vrst.",
    verdict: "partial",
    verdictLabel: "Delno res",
    analysis: "Sistem ZZZS beleži čakalne vrste od 2021, a le za 40% specialistov. Polna implementacija do 2027 ni zagotovljena z zakonodajo.",
    dataSource: "NIJZ poročilo 2024",
    color: "yellow",
  },
  {
    politician: "Opozicija",
    claim: "Čakalne vrste so se pod to vlado podvojile!",
    verdict: "false",
    verdictLabel: "Netočno",
    analysis: "Podatki NIJZ kažejo 23% povečanje čakalnih dob — ne 100%. Trend se je začel leta 2018, pred to vlado.",
    dataSource: "NIJZ & ZZZS statistika 2018–2024",
    color: "red",
  },
  {
    politician: "Premier",
    claim: "Vlagamo rekordnih 1.2 milijarde v zdravstvo letos.",
    verdict: "true",
    verdictLabel: "Drži",
    analysis: "Proračun za zdravje 2024: 1.19 mrd EUR. Rekordno glede na nominalne zneske, a pod EU povprečjem kot % BDP.",
    dataSource: "Ministrstvo za finance, Proračun 2024",
    color: "green",
  },
];

const waitlistData = [
  { year: "2018", avg: 42, label: "42 dni" },
  { year: "2019", avg: 48, label: "48 dni" },
  { year: "2020", avg: 71, label: "71 dni*" },
  { year: "2021", avg: 58, label: "58 dni" },
  { year: "2022", avg: 55, label: "55 dni" },
  { year: "2023", avg: 61, label: "61 dni" },
  { year: "2024", avg: 52, label: "52 dni" },
];

const maxDays = 80;

export default function WaitlistCaseStudy() {
  const [animated, setAnimated] = useState(false);
  const [activeClaimIdx, setActiveClaimIdx] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const colorMap: Record<string, string> = {
    green: "border-green-500 bg-green-500/10",
    red: "border-red-500 bg-red-500/10",
    yellow: "border-yellow-500 bg-yellow-500/10",
  };

  const badgeMap: Record<string, string> = {
    green: "bg-green-500/20 text-green-400 border border-green-500/30",
    red: "bg-red-500/20 text-red-400 border border-red-500/30",
    yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  };

  const iconMap: Record<string, string> = {
    green: "✓",
    red: "✗",
    yellow: "~",
  };

  return (
    <section id="case-study" ref={sectionRef} className="py-32 px-6 relative">
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-green-400 tracking-widest uppercase">Živý primer · Danes na TV</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="text-gradient-white">Čakalne vrste</span>
            <br />
            <span className="text-gradient-blue">vs. resnica</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Danes so se prepirali o čakalnih vrstah do 2027. Tukaj je to, kar AI vidi
            v javnih podatkih — brez politike.
          </p>
        </div>

        {/* Chart */}
        <div className="card-glass rounded-3xl p-8 mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-bold text-lg">Povprečna čakalna doba (dni)</h3>
              <p className="text-slate-500 text-sm">Specialist · 2018–2024 · Vir: NIJZ</p>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full" />
              Dejanski podatki
            </div>
          </div>

          <div className="flex items-end gap-3 h-48">
            {waitlistData.map((d, i) => (
              <div key={d.year} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg transition-all duration-1000 relative group"
                  style={{
                    height: animated ? `${(d.avg / maxDays) * 180}px` : "4px",
                    background: d.year === "2020"
                      ? "linear-gradient(to top, #ef4444, #f87171)"
                      : "linear-gradient(to top, #2563eb, #60a5fa)",
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.label}
                  </div>
                </div>
                <div className="text-xs text-slate-500">{d.year}</div>
                {animated && (
                  <div className="text-xs font-bold text-slate-300">{d.avg}d</div>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 mt-4">* 2020 — COVID učinek: odpovedani pregledi, preloženi termini</p>
        </div>

        {/* Claim analyzer */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h3 className="text-white font-bold text-lg">AI Analiza trditev iz debate</h3>
          </div>

          {/* Claim tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {claims.map((c, i) => (
              <button
                key={i}
                onClick={() => setActiveClaimIdx(i)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeClaimIdx === i
                    ? "bg-blue-600 text-white"
                    : "card-glass text-slate-400 hover:text-white"
                }`}
              >
                {c.politician}
              </button>
            ))}
          </div>

          {/* Active claim */}
          {claims.map((claim, i) => (
            <div
              key={i}
              className={`rounded-2xl p-6 border-l-4 transition-all duration-300 ${colorMap[claim.color]} ${activeClaimIdx === i ? "opacity-100" : "hidden"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-slate-500 text-sm font-mono">{claim.politician}:</span>
                  </div>
                  <blockquote className="text-white font-semibold text-lg mb-4 italic">
                    &ldquo;{claim.claim}&rdquo;
                  </blockquote>

                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 ${badgeMap[claim.color]}`}>
                    <span>{iconMap[claim.color]}</span>
                    {claim.verdictLabel}
                  </div>

                  <div className="bg-slate-900/60 rounded-xl p-4">
                    <p className="text-xs text-slate-400 font-mono mb-1">🤖 AI Analiza:</p>
                    <p className="text-slate-300 text-sm">{claim.analysis}</p>
                    <p className="text-xs text-slate-600 mt-2">Vir: {claim.dataSource}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What AI Slovenia would do */}
        <div className="card-glass rounded-3xl p-8 border-blue-500/30">
          <div className="text-center mb-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-white font-bold text-xl">Kar bi AI Slovenija naredila v živo</h3>
            <p className="text-slate-400 text-sm mt-2">Med samo debato, na javnem zaslonu</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "01", title: "Ujame trditev", desc: "Audio-to-text v realnem času zazna vsako izjavo politika", icon: "🎙️" },
              { step: "02", title: "Preveri podatke", desc: "Primerja z NIJZ, SURS, Eurostat in vladnimi bazami v 3 sekundah", icon: "🔍" },
              { step: "03", title: "Prikaže javnosti", desc: "Ocena resničnosti se prikaže na živo, da jo vidijo vsi doma", icon: "📺" },
            ].map((item) => (
              <div key={item.step} className="text-center p-4">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-xs font-mono text-blue-400 mb-1">KORAK {item.step}</div>
                <div className="text-white font-semibold mb-2">{item.title}</div>
                <div className="text-slate-400 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
