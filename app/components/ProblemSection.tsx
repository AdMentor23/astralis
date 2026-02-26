"use client";
import { useEffect, useRef, useState } from "react";

const debateLines = [
  { speaker: "Politician A", text: "Naša vlada je naredila največji napredek v zdravstvu doslej!", party: "Stranka X", color: "bg-blue-500" },
  { speaker: "Politician B", text: "To so laži! Čakalne vrste so se podvojile pod vašo vladavino!", party: "Stranka Y", color: "bg-red-500" },
  { speaker: "Politician A", text: "Investirali smo 340 milijonov evrov v bolnišnice —", party: "Stranka X", color: "bg-blue-500" },
  { speaker: "Politician B", text: "— ki še niso zgrajene! Govorite o projektih iz 2019!", party: "Stranka Y", color: "bg-red-500" },
  { speaker: "Politician C", text: "Oprostite, a smem dokončati stavek? DIGITALIZACIJA je —", party: "Stranka Z", color: "bg-purple-500" },
  { speaker: "Politician A", text: "Vaša stranka ni naredila NIČ! NIČ! Imamo dokaze —", party: "Stranka X", color: "bg-blue-500" },
  { speaker: "Moderator", text: "Gospoda, prosim... GOSPODA.", party: "Studio", color: "bg-slate-500" },
];

export default function ProblemSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let i = 0;
          const interval = setInterval(() => {
            i++;
            setVisibleLines(i);
            if (i >= debateLines.length) clearInterval(interval);
          }, 900);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="py-32 px-6 relative">
      <div className="section-divider mb-16" />

      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-red-400 tracking-widest uppercase">Problem</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="text-gradient-white">Vsak četrtek</span>
            <br />
            <span className="text-red-400">ista predstava.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Gledamo politike, ki se merijo med seboj — namesto da bi merili napredek.
            Tukaj je tipična debata v živo:
          </p>
        </div>

        {/* TV Frame */}
        <div className="relative max-w-3xl mx-auto mb-20">
          {/* TV Bezel */}
          <div className="bg-slate-900 rounded-3xl p-2 border border-slate-700 shadow-2xl">
            {/* Screen top bar */}
            <div className="bg-slate-800 rounded-t-2xl px-4 py-2 flex items-center justify-between mb-0.5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                V ŽIVO · POP TV DEBATA
              </div>
              <div className="text-xs text-slate-600 font-mono">21:03</div>
            </div>

            {/* Chat/debate area */}
            <div className="bg-slate-950 rounded-b-2xl p-6 min-h-80 space-y-3">
              {debateLines.slice(0, visibleLines).map((line, i) => (
                <div
                  key={i}
                  className="flex gap-3 animate-fadeInUp"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${line.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-slate-300">{line.speaker}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-600">{line.party}</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{line.text}</p>
                  </div>
                </div>
              ))}

              {visibleLines >= debateLines.length && (
                <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-600">
                  ...18 minut pozneje. Nobena rešitev ni bila predlagana.
                </div>
              )}
            </div>
          </div>

          {/* Noise overlay effect */}
          <div className="absolute inset-2 rounded-2xl pointer-events-none opacity-5"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        {/* The actual problem stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🗣️",
              title: "Prekinjanja na debato",
              value: "34",
              desc: "Povprečno prekinjanj v eni politični debati",
              color: "text-red-400",
            },
            {
              emoji: "✅",
              title: "Preverjenih trditev",
              value: "0",
              desc: "Trditve, ki so bile preverjene z javnimi podatki v živo",
              color: "text-yellow-400",
            },
            {
              emoji: "💡",
              title: "Konkretnih rešitev",
              value: "2",
              desc: "Od 47 trditev v povprečni debati vsebuje konkretno rešitev",
              color: "text-blue-400",
            },
          ].map((item) => (
            <div key={item.title} className="card-glass rounded-2xl p-6">
              <div className="text-3xl mb-3">{item.emoji}</div>
              <div className={`text-5xl font-black mb-2 ${item.color}`}>{item.value}</div>
              <div className="text-sm font-semibold text-white mb-1">{item.title}</div>
              <div className="text-xs text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
