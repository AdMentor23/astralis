"use client";
import { useState } from "react";

export default function CallToAction() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section id="cta" className="py-32 px-6 relative">
      <div className="section-divider mb-16" />

      {/* Background glow */}
      <div className="absolute inset-0 hero-glow opacity-50" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Naslednji koraki</span>

        <h2 className="text-4xl md:text-7xl font-black mt-6 mb-8 leading-none">
          <span className="text-gradient-white">Slovenija</span>
          <br />
          <span className="text-gradient-blue">si zasluži</span>
          <br />
          <span className="text-white">boljše.</span>
        </h2>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-12">
          To ni kritika politikov. To je povabilo vsem — politikom, državljanom in AI —
          da skupaj naredimo Slovenijo, ki jo zaslužimo.
        </p>

        {/* Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 text-left">
          {[
            { phase: "Faza 1", title: "Podatki", desc: "Povežemo vse javne podatkovne baze v eno platformo", status: "V razvoju", color: "blue" },
            { phase: "Faza 2", title: "AI Analiza", desc: "Fact-checking politikov v realnem času", status: "Naslednja", color: "purple" },
            { phase: "Faza 3", title: "Javni šov", desc: "Tedenski četrtkovi format + savna epizode", status: "Vizija", color: "orange" },
            { phase: "Faza 4", title: "Odprtokodni", desc: "Platforma postane javno dobro — za vse", status: "Cilj", color: "green" },
          ].map((phase, i) => (
            <div key={phase.phase} className="card-glass rounded-2xl p-5 relative">
              <div className={`text-xs font-mono tracking-widest mb-3 ${
                phase.color === "blue" ? "text-blue-400" :
                phase.color === "purple" ? "text-purple-400" :
                phase.color === "orange" ? "text-orange-400" : "text-green-400"
              }`}>
                {phase.phase}
              </div>
              <h4 className="text-white font-bold mb-2">{phase.title}</h4>
              <p className="text-slate-400 text-xs mb-3">{phase.desc}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${
                i === 0
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-800 text-slate-500"
              }`}>
                {phase.status}
              </span>
            </div>
          ))}
        </div>

        {/* Email signup */}
        <div className="card-glass rounded-3xl p-8 max-w-lg mx-auto border-blue-500/20 mb-16">
          {!submitted ? (
            <>
              <h3 className="text-white font-bold text-xl mb-2">Bodi del tega</h3>
              <p className="text-slate-400 text-sm mb-6">
                Pusti email. Obvesti te bomo ko platforma bo živa.
              </p>
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="email"
                  placeholder="tvoj@email.si"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition-all hover:scale-105 text-sm"
                >
                  Prijavim se
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">🇸🇮</div>
              <h3 className="text-white font-bold text-xl mb-2">Hvala!</h3>
              <p className="text-slate-400 text-sm">
                Skupaj bomo naredili to. Obvesti te bomo ko bo platforma živa.
              </p>
            </div>
          )}
        </div>

        {/* Final message */}
        <div className="text-slate-600 text-sm">
          <p>
            Narejen z 🇸🇮 za Slovenijo. Koncept: 2025.
          </p>
          <p className="mt-2">
            &ldquo;Ne iščemo krivcev. Iščemo rešitve.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
