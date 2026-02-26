"use client";
import { useState } from "react";

const priorities = [
  { id:"zdravstvo",      label:"Zdravstvo & čakalne vrste", votes:34821, pct:38, color:"#3b82f6" },
  { id:"stanovanja",     label:"Stanovanja & najemnine",    votes:28104, pct:31, color:"#f472b6" },
  { id:"infrastruktura", label:"Infrastruktura & prevoz",   votes:14203, pct:16, color:"#fbbf24" },
  { id:"solstvo",        label:"Šolstvo & plače učiteljev", votes:9847,  pct:11, color:"#a78bfa" },
  { id:"okolje",         label:"Okolje & podnebje",         votes:3621,  pct:4,  color:"#22c55e" },
];

const builders = [
  { name:"Ana Kovačič",   region:"Ljubljana",  dept:"🏥 Zdravstvo",   role:"Produktna managerka — digitalizacija naročanja", followers:1247, updates:14, verified:true },
  { name:"Miha Petek",    region:"Maribor",    dept:"🛣️ Infrastr.",   role:"Inženir — obnova kolesarskih poti MB", followers:847, updates:8, verified:true },
  { name:"Sara Žnidar",   region:"Celje",      dept:"📚 Šolstvo",     role:"Učiteljica — digitalni učbeniki prototip", followers:612, updates:21, verified:false },
  { name:"Luka Breznik",  region:"Koper",      dept:"🏠 Stanovanja",  role:"Arhitekt — dostopna stanovanja projekt", followers:389, updates:6, verified:false },
  { name:"Nina Krajnc",   region:"Kranj",      dept:"🌿 Okolje",      role:"Ekologinja — lokalna kompostarna mreža", followers:1103, updates:19, verified:true },
];

const problems = [
  { id:3291, title:"Ambulanta Šiška — prepolna, nujno razširitev", dept:"🏥 Zdravstvo", region:"Ljubljana", status:"V obravnavi", votes:847, time:"pred 2 uri" },
  { id:3287, title:"Kolesarska pot ob Savi uničena po poplavah", dept:"🛣️ Infrastr.", region:"Ljubljana", status:"Nova", votes:342, time:"pred 5 ur" },
  { id:3281, title:"Osnovna šola Moste — pomanjkanje učiteljev", dept:"📚 Šolstvo", region:"Ljubljana", status:"Nova", votes:284, time:"včeraj" },
  { id:3274, title:"Najemnine Maribor — +40% v 2 letih", dept:"🏠 Stanovanja", region:"Maribor", status:"V obravnavi", votes:1204, time:"pred 2 dnema" },
  { id:3268, title:"Odlagališče odpadkov Celje — vonj v mestu", dept:"🌿 Okolje", region:"Celje", status:"Posredovano", votes:198, time:"pred 3 dnemi" },
];

const statusCls: Record<string,string> = {
  "Nova": "badge-blue", "V obravnavi":"badge-yellow", "Posredovano":"badge-green"
};

export default function MojaSlovenija() {
  const [tab, setTab] = useState<"vote"|"report"|"builders"|"my">("vote");
  const [voted, setVoted] = useState<string|null>(null);
  const [following, setFollowing] = useState<string[]>([]);
  const [reportText, setReportText] = useState("");
  const [reportDept, setReportDept] = useState("");
  const [reportRegion, setReportRegion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [myRatings, setMyRatings] = useState<Record<string,number>>({});

  const handleVote = (id:string) => setVoted(id);
  const toggleFollow = (name:string) =>
    setFollowing(f => f.includes(name) ? f.filter(x => x !== name) : [...f, name]);

  const handleReport = () => {
    if (!reportText.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setReportText(""); setReportDept(""); setReportRegion(""); }, 2000);
  };

  return (
    <div className="p-7 anim-up">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="section-title">Moja Slovenija</h1>
          <p className="section-sub mt-1">Tvoj glas · tvoj vpliv · tvoja Slovenija</p>
        </div>
        <div className="card-sm px-4 py-2 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black text-white">J</div>
          <div>
            <div className="text-xs font-bold text-white">Janez Novak</div>
            <div className="text-xs" style={{ color:"#4ade80" }}>✓ Verificiran Slovenec</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar mb-6" style={{ maxWidth:480 }}>
        <button className={`tab-btn ${tab==="vote"?"active":""}`} onClick={() => setTab("vote")}>🗳️ Glasuj</button>
        <button className={`tab-btn ${tab==="report"?"active":""}`} onClick={() => setTab("report")}>📍 Prijavi</button>
        <button className={`tab-btn ${tab==="builders"?"active":""}`} onClick={() => setTab("builders")}>🔨 Graditelji</button>
        <button className={`tab-btn ${tab==="my"?"active":""}`} onClick={() => setTab("my")}>⭐ Moje ocene</button>
      </div>

      {/* ── VOTE ── */}
      {tab === "vote" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-1">Glasovanje tega meseca</div>
            <div className="text-xs mb-5" style={{ color:"#64748b" }}>
              Kateri problem je za vas prioriteta? · {priorities.reduce((s,p) => s+p.votes,0).toLocaleString()} glasov skupaj
            </div>
            <div className="space-y-4">
              {priorities.map(p => (
                <div key={p.id} className="cursor-pointer group" onClick={() => handleVote(p.id)}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          border:`2px solid ${p.color}`,
                          background: voted === p.id ? p.color : "transparent",
                          transition:"all 0.15s",
                        }}>
                        {voted === p.id && <span style={{ fontSize:"0.6rem", color:"#000", fontWeight:900 }}>✓</span>}
                      </div>
                      <span className="text-sm text-white group-hover:text-blue-300 transition-colors">{p.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono" style={{ color:"#64748b" }}>{p.votes.toLocaleString()}</span>
                      <span className="text-xs font-black" style={{ color:p.color }}>{p.pct}%</span>
                    </div>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width:`${voted ? (p.id===voted ? p.pct+1 : p.pct) : p.pct}%`, background:p.color }} />
                  </div>
                </div>
              ))}
            </div>
            {voted && (
              <div className="card-sm p-3 mt-5 flex items-center gap-2" style={{ borderColor:"rgba(34,197,94,0.2)" }}>
                <span className="text-green-400">✓</span>
                <span className="text-sm text-green-400 font-semibold">Vaš glas je bil zabeležen. Hvala!</span>
              </div>
            )}
          </div>
          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-3">Ocenite politike ta teden</div>
            {[
              { name:"Jan Novak", dept:"Zdravstvo" },
              { name:"Eva Kovač", dept:"Ekonomija" },
              { name:"Maja Horvat", dept:"Šolstvo" },
            ].map(pol => (
              <div key={pol.name} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="text-sm font-semibold text-white">{pol.name}</div>
                  <div className="text-xs" style={{ color:"#64748b" }}>{pol.dept}</div>
                </div>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n}
                      onClick={() => setMyRatings(r => ({...r, [pol.name]: n}))}
                      style={{
                        width:28, height:28, borderRadius:6, border:"none", cursor:"pointer",
                        background: (myRatings[pol.name] ?? 0) >= n ? "#f59e0b" : "rgba(255,255,255,0.06)",
                        fontSize:"0.75rem", transition:"all 0.1s",
                      }}>
                      ★
                    </button>
                  ))}
                  {myRatings[pol.name] && (
                    <span className="text-xs ml-1 self-center font-bold" style={{ color:"#fbbf24" }}>
                      {myRatings[pol.name]}/5
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── REPORT ── */}
      {tab === "report" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-4">Prijavi lokalni problem</div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color:"#64748b" }}>Opis problema *</label>
                <textarea
                  className="app-input"
                  rows={4}
                  placeholder="Opišite problem čim bolj natančno — lokacija, čas, vpliv na vas..."
                  value={reportText}
                  onChange={e => setReportText(e.target.value)}
                  style={{ resize:"none" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color:"#64748b" }}>Oddelek</label>
                  <select className="app-input" value={reportDept} onChange={e => setReportDept(e.target.value)}
                    style={{ appearance:"none", cursor:"pointer" }}>
                    <option value="">Izberite oddelek...</option>
                    <option>🏥 Zdravstvo</option>
                    <option>📚 Šolstvo</option>
                    <option>🛣️ Infrastruktura</option>
                    <option>🌿 Okolje</option>
                    <option>🏠 Stanovanja</option>
                    <option>💼 Ekonomija</option>
                    <option>👮 Varnost</option>
                    <option>🤝 Skupnost</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold mb-1 block" style={{ color:"#64748b" }}>Regija</label>
                  <select className="app-input" value={reportRegion} onChange={e => setReportRegion(e.target.value)}
                    style={{ appearance:"none", cursor:"pointer" }}>
                    <option value="">Izberite regijo...</option>
                    <option>Ljubljana</option>
                    <option>Maribor</option>
                    <option>Celje</option>
                    <option>Koper</option>
                    <option>Kranj</option>
                    <option>Novo Mesto</option>
                    <option>Murska Sobota</option>
                    <option>Drugo</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary w-full" onClick={handleReport} disabled={!reportText.trim()}>
                {submitted ? "✓ Prijava oddana!" : "Oddaj prijavo →"}
              </button>
            </div>
          </div>

          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-4">Aktivne prijave skupnosti</div>
            <div className="space-y-3">
              {problems.map(p => (
                <div key={p.id} className="card-sm p-4 card-hover cursor-pointer">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm text-white leading-snug flex-1">{p.title}</p>
                    <span className={`badge ${statusCls[p.status]} flex-shrink-0`}>{p.status}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge badge-blue" style={{ fontSize:"0.62rem" }}>{p.dept}</span>
                    <span className="text-xs" style={{ color:"#334155" }}>{p.region}</span>
                    <span className="text-xs" style={{ color:"#334155" }}>▲ {p.votes} glasov</span>
                    <span className="text-xs" style={{ color:"#334155" }}>{p.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── BUILDERS ── */}
      {tab === "builders" && (
        <div className="space-y-4">
          <div className="card p-5">
            <div className="text-sm font-bold text-white mb-1">Graditelji Slovenije</div>
            <p className="text-xs mb-5" style={{ color:"#64748b" }}>
              Navadni Slovenci, ki gradijo rešitve. Ne politiki — pravi doers.
            </p>
            <div className="space-y-4">
              {builders.map((b, i) => (
                <div key={i} className="card-sm p-4 card-hover">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-sm font-black text-white flex-shrink-0">
                        {b.name.split(" ").map(w => w[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-bold text-white">{b.name}</span>
                          {b.verified && <span className="badge badge-blue" style={{ fontSize:"0.6rem" }}>✓ Verificiran</span>}
                        </div>
                        <div className="text-xs mb-0.5" style={{ color:"#64748b" }}>{b.dept} · {b.region}</div>
                        <div className="text-xs" style={{ color:"#94a3b8" }}>{b.role}</div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs" style={{ color:"#475569" }}>👥 {b.followers} sledilcev</span>
                          <span className="text-xs" style={{ color:"#475569" }}>📝 {b.updates} posodobitev</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={following.includes(b.name) ? "btn-primary" : "btn-ghost"}
                      style={{ fontSize:"0.75rem", padding:"6px 14px", flexShrink:0 }}
                      onClick={() => toggleFollow(b.name)}>
                      {following.includes(b.name) ? "Sledim ✓" : "Sledi"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MY RATINGS ── */}
      {tab === "my" && (
        <div className="card p-6">
          <div className="text-sm font-bold text-white mb-4">Moja aktivnost</div>
          <div className="space-y-4">
            <div className="card-sm p-4">
              <div className="text-xs mb-2" style={{ color:"#64748b" }}>Glasoval sem za:</div>
              {voted
                ? <p className="text-sm text-white">{priorities.find(p => p.id===voted)?.label}</p>
                : <p className="text-xs" style={{ color:"#334155" }}>Še niste glasovali ta mesec</p>
              }
            </div>
            <div className="card-sm p-4">
              <div className="text-xs mb-2" style={{ color:"#64748b" }}>Moje ocene politikov:</div>
              {Object.keys(myRatings).length > 0
                ? Object.entries(myRatings).map(([name, rating]) => (
                    <div key={name} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor:"rgba(255,255,255,0.06)" }}>
                      <span className="text-sm text-white">{name}</span>
                      <span className="text-sm font-black" style={{ color:"#fbbf24" }}>{"★".repeat(rating)}{"☆".repeat(5-rating)}</span>
                    </div>
                  ))
                : <p className="text-xs" style={{ color:"#334155" }}>Še niste ocenili nobenega politika</p>
              }
            </div>
            <div className="card-sm p-4">
              <div className="text-xs mb-2" style={{ color:"#64748b" }}>Sledim graditeljem ({following.length}):</div>
              {following.length > 0
                ? <div className="flex flex-wrap gap-2">{following.map(n => <span key={n} className="badge badge-blue">{n}</span>)}</div>
                : <p className="text-xs" style={{ color:"#334155" }}>Še ne sledite nobenemu graditelju</p>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
