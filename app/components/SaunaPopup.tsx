"use client";
import { useEffect, useRef, useState } from "react";

export default function SaunaPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !dismissed) {
          setTimeout(() => setVisible(true), 400);
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [dismissed]);

  const handleDismiss = () => {
    setVisible(false);
    setDismissed(true);
  };

  return (
    <section id="sauna" ref={sectionRef} className="py-32 px-6 relative">
      <div className="sauna-divider mb-16" />
      <div className="sauna-bg absolute inset-0" />

      <div className="relative max-w-4xl mx-auto text-center">
        <span className="text-xs font-mono text-orange-400 tracking-widest uppercase">Posebno sporočilo</span>
        <h2 className="text-4xl md:text-6xl font-black mt-4 mb-8">
          <span className="text-gradient-orange">Prekinitev programa.</span>
        </h2>
        <p className="text-slate-400 text-lg mb-8">
          Preden nadaljujemo z vizijo platforme, imamo posebno sporočilo.
        </p>

        {/* Steam decorations */}
        <div className="flex justify-center gap-8 mb-8 text-4xl">
          <span className="animate-float" style={{ animationDelay: "0s" }}>🧖</span>
          <span className="animate-float" style={{ animationDelay: "0.5s" }}>💬</span>
          <span className="animate-float" style={{ animationDelay: "1s" }}>🇸🇮</span>
        </div>

        <div className="card-glass-orange rounded-3xl p-8 md:p-12 animate-sauna-pulse">
          <div className="text-orange-400 text-sm font-mono tracking-widest uppercase mb-6">
            📺 Odprto pismo · Vsem politikom danes na TV
          </div>

          <div className="text-left space-y-5 text-slate-300 text-lg leading-relaxed">
            <p>
              <span className="text-orange-300 font-bold">Hej, vsi ste bili danes odlični.</span>
            </p>
            <p>
              Resno. Vsak od vas govori dejstva. Vsak od vas ima vizijo.
              Vsak od vas ljubi Slovenijo — tega nihče ne dvomi.
            </p>
            <p>
              Samo malo nas utrujate. 😅
            </p>
            <p>
              Zato imamo predlog:
            </p>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 my-6">
              <p className="text-orange-200 font-semibold text-xl mb-3">
                🧖 Greste vsi skupaj v savno.
              </p>
              <p className="text-slate-300">
                Ni kamer. Ni mikrofona. Samo para, toplo in morda kakšna
                dobra beseda med Slovenci.
              </p>
              <p className="text-slate-300 mt-3">
                Potem pa se usedete za skupno mizo.
                Z vsemi podatki pred sabo — ne z vašimi podatki, ne z njihovimi —
                ampak z <span className="text-orange-300 font-semibold">resničnimi slovenskimi podatki.</span>
              </p>
              <p className="text-slate-300 mt-3">
                In skupaj naredite Slovenijo najboljšo državo na svetu.
              </p>
            </div>
            <p>
              Mi hočemo AI nad vami — da nas ne bi mogli zavajati.
              Ampak <span className="text-orange-300 font-bold">vas še vedno hočemo.</span> Resnično.
            </p>
            <p>
              Ne kot nasprotnike. Kot <span className="text-white font-bold">Slovence.</span>
            </p>
            <p className="text-slate-400 text-base">
              To je tisti četrtkovi šov, ki bi ga vsi gledali.
              Ne zato, ker bi se kdo klal — ampak ker bi prvič videli,
              da ste tudi vi samo ljudje. In to bi nam bilo všeč.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-orange-400 font-semibold">Z spoštovanjem,</p>
              <p className="text-white font-bold text-lg">2.1 milijona Slovencev 🇸🇮</p>
            </div>
            <div className="flex gap-2 text-2xl">
              <span>🧖</span><span>🫂</span><span>🌍</span>
            </div>
          </div>
        </div>

        {/* Weekly show concept */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="card-glass rounded-2xl p-6">
            <div className="text-2xl mb-3">📺</div>
            <h3 className="text-white font-bold mb-2">Četrtkovi šov: Spoznaj svojega politika</h3>
            <p className="text-slate-400 text-sm">
              Ne samo debate. Kdo so? Kaj jim je všeč? Zakaj so stopili v politiko?
              Vsak teden en politik — kot človek, ne kot stranka.
            </p>
          </div>
          <div className="card-glass rounded-2xl p-6">
            <div className="text-2xl mb-3">🤝</div>
            <h3 className="text-white font-bold mb-2">Skupna miza z AI</h3>
            <p className="text-slate-400 text-sm">
              Vsi politiki. Vsi podatki na mizi. AI analizira vsako obljubo.
              Javnost glasuje o predlogih. Brez maskote — samo rešitve.
            </p>
          </div>
        </div>
      </div>

      {/* Popup overlay */}
      {visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm">
          <div className="card-glass-orange rounded-3xl p-8 max-w-lg w-full relative animate-fadeInUp border-orange-400/40 shadow-2xl"
            style={{ boxShadow: "0 0 80px rgba(251,146,60,0.3)" }}>
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="text-5xl mb-3">🧖</div>
              <div className="text-xs font-mono text-orange-400 tracking-widest uppercase mb-2">
                Prekinitev programa
              </div>
              <h3 className="text-2xl font-black text-white mb-1">
                Hej, politiki.
              </h3>
              <p className="text-orange-300 font-semibold">Vsi ste bili danes odlični.</p>
            </div>

            <div className="space-y-3 text-slate-300 text-sm mb-6">
              <p>Vsak od vas govori dejstva. Vsak ljubi Slovenijo.</p>
              <p className="bg-orange-500/10 border border-orange-400/20 rounded-xl p-4 text-center">
                <span className="text-orange-200 font-bold">Predlog:</span> Greste skupaj v savno. 🧖<br />
                Potem sedete za mizo z resničnimi podatki.<br />
                In skupaj naredite Slovenijo <span className="text-white font-bold">najboljšo na svetu.</span>
              </p>
              <p className="text-center text-slate-400">
                Mi hočemo AI nad vami — ampak <span className="text-orange-300 font-semibold">vas še vedno hočemo.</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 rounded-xl font-semibold text-white transition-all"
              >
                Razumem 🇸🇮
              </button>
              <button
                onClick={handleDismiss}
                className="flex-1 py-3 card-glass hover:border-orange-400/50 rounded-xl font-semibold text-slate-300 transition-all"
              >
                Nadaljuj →
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
