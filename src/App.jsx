import React, { useState, useEffect } from "react";
import OmAppen from "./pages/OmAppen.jsx";
import Glossary from "./tools/Glossary.jsx";
import Materials from "./tools/Materials.jsx";
import Lab from "./tools/LabData.jsx";
import Converter from "./tools/Converter.jsx";
import CycleSim from "./tools/CycleSim.jsx";
import Cop from "./tools/Cop.jsx";
import Effekt from "./tools/Effekt.jsx";
import Energi from "./tools/Energi.jsx";
import PT from "./tools/PT.jsx";
import Varmeoverforing from "./tools/Varmeoverforing.jsx";
import "./styles.css";
import logo from "./assets/logo.png";

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [tab, setTab] = useState("om");

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const tabs = [
    { id: "om", title: "Start" },
    { id: "cykel", title: "Cykelsimulering" },
    { id: "converter", title: "Omvandlare" },
    { id: "glossary", title: "Ordlista" },
    { id: "materials", title: "Material" },
    { id: "lab", title: "Mätdata" },
    { id: "cop", title: "COP" },
    { id: "effekt", title: "Effekt" },
    { id: "energi", title: "Energi" },
    { id: "varme", title: "Värmeöverföring" },
    { id: "pt", title: "Tryck–Temp" },
  ];

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <img src={logo} alt="Logotyp" className="logo" />
          <div className="header-text">
            <div className="title">West Kyla & Värme</div>
            <div className="subtitle">Beräkningsverktyg för värme- och kylteknik</div>
          </div>
          <div className="grow" />
          <button
            className="btn-icon"
            title={theme === "light" ? "Mörkt läge" : "Ljust läge"}
            onClick={() => setTheme(t => (t === "light" ? "dark" : "light"))}
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>

        <nav className="tabbar">
          {tabs.map(t => (
            <div
              key={t.id}
              className={`tab ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.title}
            </div>
          ))}
        </nav>
      </header>

      {/* SIDINNEHÅLL */}
      <main className="content">
        {tab === "om" && <OmAppen />}
        {tab === "cykel" && <CycleSim />}
        {tab === "converter" && <Converter />}
        {tab === "glossary" && <Glossary />}
        {tab === "materials" && <Materials />}
        {tab === "lab" && <Lab />}
        {tab === "cop" && <Cop />}
        {tab === "effekt" && <Effekt />}
        {tab === "energi" && <Energi />}
        {tab === "varme" && <Varmeoverforing />}
        {tab === "pt" && <PT />}
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>Skapad av: Dennis West</p>
        <p>© 2025 West Kyla & Värme</p>
        <p><a href="mailto:info@westkylavarme.se">info@westkylavarme.se</a></p>
      </footer>
    </div>
  );
}
