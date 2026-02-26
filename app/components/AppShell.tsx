"use client";
import { useState } from "react";
import Dashboard from "./Dashboard";
import PoliticianPortals from "./PoliticianPortals";
import FactCheck from "./FactCheck";
import MojaSlovenija from "./MojaSlovenija";
import GradimoSlovenijo from "./GradimoSlovenijo";
import CetrtkoviSov from "./CetrtkoviSov";
import Survey from "./Survey";

type View = "dashboard" | "politiki" | "factcheck" | "moja" | "gradimo" | "cetrtkov" | "anketa";

const nav: { id: View; icon: string; label: string; badge?: string }[] = [
  { id:"dashboard",  icon:"📊", label:"Dashboard" },
  { id:"politiki",   icon:"🏛️", label:"Politiki",     badge:"12" },
  { id:"factcheck",  icon:"🤖", label:"AI Fact-Check", badge:"4" },
  { id:"moja",       icon:"📲", label:"Moja Slovenija" },
  { id:"gradimo",    icon:"🏗️", label:"Gradimo SLO" },
  { id:"cetrtkov",   icon:"📺", label:"Četrtkovi šov", badge:"🔴" },
  { id:"anketa",     icon:"📋", label:"Anketa 🇸🇮",    badge:"Nova" },
];

export default function AppShell() {
  const [view, setView] = useState<View>("dashboard");
  const [subId, setSubId] = useState<string|undefined>(undefined);

  const handleNav = (v: string, id?: string) => {
    setView(v as View);
    setSubId(id);
  };

  return (
    <div id="app-shell">
      {/* ── Sidebar ── */}
      <aside id="sidebar">
        {/* Logo */}
        <div style={{ padding:"20px 16px 16px", borderBottom:"1px solid rgba(59,130,246,0.1)" }}>
          <div style={{ fontSize:"1.2rem", fontWeight:900, letterSpacing:"-0.03em" }}>
            <span style={{ color:"#3b82f6" }}>AI</span>
            <span style={{ color:"#f1f5f9" }}>SLO</span>
          </div>
          <div style={{ fontSize:"0.65rem", color:"#334155", marginTop:2, fontFamily:"monospace", letterSpacing:"0.1em" }}>
            CIVIC OS · v0.1
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 10px", overflowY:"auto" }}>
          <div style={{ fontSize:"0.62rem", color:"#334155", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", padding:"4px 6px 8px" }}>
            Sistem
          </div>
          {nav.map(item => (
            <div key={item.id}
              className={`nav-item ${view === item.id ? "active" : ""}`}
              onClick={() => { setView(item.id); setSubId(undefined); }}>
              <span className="icon">{item.icon}</span>
              <span style={{ flex:1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize:"0.62rem", fontWeight:700, padding:"1px 6px", borderRadius:10,
                  background: item.badge === "🔴" ? "rgba(239,68,68,0.15)" : "rgba(59,130,246,0.15)",
                  color: item.badge === "🔴" ? "#f87171" : "#60a5fa",
                  border: `1px solid ${item.badge === "🔴" ? "rgba(239,68,68,0.25)" : "rgba(59,130,246,0.2)"}`,
                }}>
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:"12px 10px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ fontSize:"0.65rem", color:"#1e293b", textAlign:"center", lineHeight:1.6 }}>
            Made by{" "}
            <a href="https://instagram.com/node.after" target="_blank" rel="noopener noreferrer"
              style={{ color:"#3b82f6", fontWeight:700, textDecoration:"none" }}>
              @node.after
            </a>
            <br />
            Slovenija · 2025
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main id="main-content" className="grid-bg">
        {/* Top bar */}
        <div style={{
          position:"sticky", top:0, zIndex:20,
          background:"rgba(3,11,24,0.92)",
          backdropFilter:"blur(12px)",
          borderBottom:"1px solid rgba(59,130,246,0.08)",
          padding:"12px 28px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          <div style={{ fontSize:"0.78rem", color:"#334155", fontFamily:"monospace" }}>
            AISLO / {nav.find(n => n.id === view)?.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.72rem", color:"#4ade80" }}>
              <span className="live-dot" />
              Podatki v živo
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80" }} />
              <span style={{ fontSize:"0.72rem", color:"#64748b" }}>SI Index: 68.5 / 100</span>
            </div>
          </div>
        </div>

        {/* Views */}
        {view === "dashboard"  && <Dashboard onNav={handleNav} />}
        {view === "politiki"   && <PoliticianPortals initId={subId} />}
        {view === "factcheck"  && <FactCheck />}
        {view === "moja"       && <MojaSlovenija />}
        {view === "gradimo"    && <GradimoSlovenijo initId={subId} />}
        {view === "cetrtkov"   && <CetrtkoviSov />}
        {view === "anketa"     && <Survey />}
      </main>
    </div>
  );
}
