"use client";
import { useEffect, useState } from "react";

const typingPhrases = [
  "Zdravstveni sistem...",
  "Čakalne vrste...",
  "BDP rast...",
  "Infrastruktura...",
  "Šolstvo...",
  "Okolje...",
];

export default function HeroSection() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typingPhrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % typingPhrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, phraseIndex]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Glow */}
      <div className="absolute inset-0 hero-glow" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/6 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-blue-600/8 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full card-glass mb-8 text-sm text-blue-400 border border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Koncept platforme · 2025
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none tracking-tight">
          <span className="text-gradient-white">AI</span>
          <br />
          <span className="text-gradient-blue">SLOVENIJA</span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 mb-4 font-light max-w-2xl mx-auto">
          Nehajmo se pretvarjati. Poglejmo dejstva.
        </p>

        {/* Typewriter */}
        <div className="h-10 flex items-center justify-center mb-10">
          <span className="text-lg text-blue-400 font-mono">
            Analiziramo: {displayed}
            <span className="inline-block w-0.5 h-5 bg-blue-400 ml-1 animate-pulse" />
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#problem"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 animate-pulse-glow"
          >
            Oglej si vizijo →
          </a>
          <a
            href="#sauna"
            className="px-8 py-4 card-glass hover:border-blue-400/50 rounded-xl font-semibold text-slate-300 transition-all duration-200 hover:scale-105"
          >
            Sporočilo politikom 🧖
          </a>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { number: "2.1M", label: "Slovencev čaka na odgovor", color: "text-blue-400" },
            { number: "∞", label: "Debat brez rešitev na TV", color: "text-red-400" },
            { number: "1", label: "Platforma, ki bo spremenila igro", color: "text-green-400" },
          ].map((stat) => (
            <div key={stat.label} className="card-glass rounded-2xl p-6 text-center">
              <div className={`text-4xl font-black mb-2 ${stat.color}`}>{stat.number}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600">
        <span className="text-xs tracking-widest uppercase">Premakni navzdol</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
