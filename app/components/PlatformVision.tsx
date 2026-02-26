"use client";

const departments = [
  { name: "Zdravstvo", emoji: "🏥", score: 61, trend: "↗", color: "blue", metrics: ["Čakalne vrste", "Število zdravnikov", "Zadovoljstvo"] },
  { name: "Šolstvo", emoji: "📚", score: 74, trend: "→", color: "green", metrics: ["PISA rezultati", "Vpis", "Financiranje"] },
  { name: "Okolje", emoji: "🌿", score: 68, trend: "↗", color: "emerald", metrics: ["CO2 emisije", "Recikliranje", "Zelene površine"] },
  { name: "Infrastruktura", emoji: "🛣️", score: 55, trend: "↘", color: "yellow", metrics: ["Cestno omrežje", "Javni prevoz", "Investicije"] },
  { name: "Ekonomija", emoji: "📈", score: 72, trend: "↗", color: "purple", metrics: ["BDP rast", "Brezposelnost", "Plače"] },
  { name: "Varnost", emoji: "🛡️", score: 81, trend: "→", color: "slate", metrics: ["Kriminal", "Požarna varnost", "Kibernet."] },
];

const colorMap: Record<string, string> = {
  blue: "from-blue-600 to-blue-400",
  green: "from-green-600 to-green-400",
  emerald: "from-emerald-600 to-emerald-400",
  yellow: "from-yellow-600 to-yellow-400",
  purple: "from-purple-600 to-purple-400",
  slate: "from-slate-600 to-slate-400",
};

const trendColor: Record<string, string> = {
  "↗": "text-green-400",
  "→": "text-yellow-400",
  "↘": "text-red-400",
};

export default function PlatformVision() {
  return (
    <section id="platform" className="py-32 px-6 relative">
      <div className="section-divider mb-16" />
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">Vizija platforme</span>
          <h2 className="text-4xl md:text-6xl font-black mt-4 mb-6">
            <span className="text-gradient-white">AI Slovenija</span>
            <br />
            <span className="text-gradient-blue">Kako bi izgledalo</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            En javni dashboard. Vsi podatki. Vsak Slovenec vidi, kje smo — in kdo drži obljube.
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="card-glass rounded-3xl p-6 mb-16 border-blue-500/20">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-blue-400 font-black text-lg tracking-tight">AI<span className="text-white">SLO</span></div>
              <div className="w-px h-5 bg-slate-700" />
              <div className="text-slate-400 text-sm">Stanje države · Januar 2025</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Posodobljeno v realnem času
            </div>
          </div>

          {/* Department grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {departments.map((dept) => (
              <div key={dept.name} className="bg-slate-900/60 rounded-2xl p-4 hover:border-blue-500/30 border border-transparent transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{dept.emoji}</span>
                  <span className={`font-bold text-lg ${trendColor[dept.trend]}`}>{dept.trend}</span>
                </div>
                <div className="text-white font-semibold text-sm mb-2">{dept.name}</div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colorMap[dept.color]}`}
                      style={{ width: `${dept.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300">{dept.score}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {dept.metrics.map((m) => (
                    <span key={m} className="text-xs text-slate-600 bg-slate-800 rounded-full px-2 py-0.5">{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="bg-slate-900/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Skupni indeks</div>
                <div className="text-3xl font-black text-white">68.5 <span className="text-green-400 text-lg">↗</span></div>
              </div>
              <div className="w-px h-10 bg-slate-700" />
              <div>
                <div className="text-xs text-slate-500 mb-0.5">EU povprečje</div>
                <div className="text-2xl font-bold text-slate-400">71.2</div>
              </div>
            </div>
            <div className="text-xs text-slate-600">Vir: SURS · NIJZ · Eurostat · Ministrstva</div>
          </div>
        </div>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              num: "01",
              title: "Podatkovni temelj",
              desc: "Vsak vladni oddelek. Vsaka številka. Posodobljeno samodejno iz uradnih virov — brez filtrov.",
              items: ["SURS statistike", "EU Eurostat", "Vladni proračuni", "NIJZ zdravstveni podatki"],
              color: "blue",
            },
            {
              num: "02",
              title: "AI Fact-checker",
              desc: "Vsaka trditev na TV ali v parlamentu se analizira v realnem času in primerja z bazami podatkov.",
              items: ["Audio-to-text analiza", "Claude AI verificiranje", "Javni scorecard politikov", "Zgodovinski kontekst"],
              color: "purple",
            },
            {
              num: "03",
              title: "Javni dashboard",
              desc: "Ena stran. Vsak Slovenec jo razume. Brez žargona, brez spin — samo resnica v številkah.",
              items: ["Mobilna aplikacija", "Tedensko poročilo", "Primerjava obljub", "Glasovanje javnosti"],
              color: "green",
            },
          ].map((pillar) => (
            <div key={pillar.num} className="card-glass rounded-2xl p-6">
              <div className={`text-xs font-mono tracking-widest mb-4 ${
                pillar.color === "blue" ? "text-blue-400" :
                pillar.color === "purple" ? "text-purple-400" : "text-green-400"
              }`}>
                STEBER {pillar.num}
              </div>
              <h3 className="text-white font-bold text-xl mb-3">{pillar.title}</h3>
              <p className="text-slate-400 text-sm mb-5">{pillar.desc}</p>
              <ul className="space-y-2">
                {pillar.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      pillar.color === "blue" ? "bg-blue-400" :
                      pillar.color === "purple" ? "bg-purple-400" : "bg-green-400"
                    }`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Know your politician */}
        <div className="card-glass rounded-3xl p-8 border-blue-500/20 text-center">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="text-white font-black text-2xl mb-4">Spoznaj svojega politika</h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">
            Ne samo njihove politike. Kdo so kot ljudje? Kaj jim je všeč? Zakaj so stopili v politiko?
            Vsak teden en politik — njegova/njena zgodba, ne samo njena stranka.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["🧖 Skupna savna", "☕ Kava z glasovalci", "📊 Moja pot v politiki", "🎯 Moje obljube · moj record"].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-sm text-blue-300">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
