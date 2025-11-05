import React, { useState, useEffect } from "react";

export default function Glossary() {
  const [terms, setTerms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("glossary");
    if (saved) setTerms(JSON.parse(saved));
    else {
      setTerms([
        { term: "COP", definition: "Coefficient of Performance – förhållandet mellan avgiven värmeeffekt och tillförd eleffekt." },
        { term: "ΔT", definition: "Temperaturskillnad – används för att beräkna värmeöverföring, ΔT = T2 - T1." },
        { term: "Entalpi", definition: "Ett mått på energiinnehåll per massenhet, ofta kJ/kg. Symbol h." },
        { term: "Entropi", definition: "Ett mått på oordning i ett system. Symbol s." },
        { term: "Förångningstryck", definition: "Trycket vid vilket köldmediet övergår från vätska till gas." },
        { term: "Kondenseringstryck", definition: "Trycket vid vilket köldmediet övergår från gas till vätska." },
        { term: "Mättnadstemperatur", definition: "Temperaturen där vätska och gas existerar samtidigt vid ett visst tryck." },
        { term: "Underkylning", definition: "Temperaturen hos vätskan sänks under mättnadstemperaturen för att förhindra ångbildning." },
        { term: "Överhettning", definition: "Temperaturen hos ångan höjs över mättnadstemperaturen, vilket förhindrar vätskepartiklar i ångan." },
        { term: "Expansionsventil", definition: "Ventil som sänker trycket på köldmediet så att det kan förångas i förångaren." },
        { term: "Flashgas", definition: "Den del av vätskan som omedelbart förångas efter expansionsventilen." },
        { term: "Köldmedium", definition: "Ämne som transporterar värme i ett kylsystem. Exempel: R134a, R290 (propan)." },
        { term: "Kondensor", definition: "Värmeväxlare där köldmediet avger värme och kondenseras." },
        { term: "Förångare", definition: "Värmeväxlare där köldmediet upptar värme och förångas." },
        { term: "Värmeväxlare", definition: "Enhet där värme överförs mellan två medier utan att de blandas." },
        { term: "EER", definition: "Energy Efficiency Ratio – effektivitetstal för kylmaskiner, likt COP." },
        { term: "Värmepump", definition: "System som flyttar värme från en kallare till en varmare plats med hjälp av arbete." },
        { term: "Termostatisk ventil", definition: "Ventil som reglerar flödet baserat på temperatur." },
        { term: "Kylfaktor", definition: "Ett mått på kylsystemets effektivitet, ibland inverterat jämfört med COP." },
        { term: "Energi", definition: "Förmågan att utföra arbete eller producera värme. Mäts i joule (J) eller kWh." },
        { term: "Effekt", definition: "Energimängd per tidsenhet (Watt)." },
        { term: "Energibalans", definition: "Summan av tillförd och avgiven energi i ett system, används för att förstå förluster." },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("glossary", JSON.stringify(terms));
  }, [terms]);

  const addTerm = () => {
    const term = prompt("Ange nytt begrepp:");
    if (!term) return;
    const definition = prompt(`Ange definition för ${term}:`);
    if (!definition) return;
    const updated = [...terms, { term, definition }];
    setTerms(updated.sort((a, b) => a.term.localeCompare(b.term)));
  };

  const editTerm = (item) => {
    const index = terms.findIndex((t) => t.term === item.term);
    if (index === -1) return;
    const newDef = prompt("Redigera definition:", terms[index].definition);
    if (newDef !== null) {
      const updated = [...terms];
      updated[index].definition = newDef;
      setTerms(updated);
    }
  };

  const deleteTerm = (item) => {
    const index = terms.findIndex((t) => t.term === item.term);
    if (index === -1) return;
    if (window.confirm(`Vill du verkligen ta bort "${terms[index].term}"?`)) {
      const updated = [...terms];
      updated.splice(index, 1);
      setTerms(updated);
    }
  };

  const exportTerms = () => {
    const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
    const filename = `west-kyla-varme-ordlista-${timestamp}.json`;
    const blob = new Blob([JSON.stringify(terms, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const importTerms = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        setTerms(imported.sort((a, b) => a.term.localeCompare(b.term)));
      } catch {
        alert("Fel: Ogiltig JSON-fil.");
      }
    };
    reader.readAsText(file);
  };

  const filteredTerms = terms.filter((t) =>
    t.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Ordlista</h2>
      <div className="glossary-controls">
        <button className="add-btn" onClick={addTerm}>
          + Lägg till begrepp
        </button>
        <input
          type="text"
          placeholder="Sök begrepp..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, marginRight: "8px" }}
        />
        <button className="btn" onClick={exportTerms}>Exportera</button>
        <label className="btn" style={{ cursor: "pointer" }}>
          Importera
          <input
            type="file"
            accept=".json"
            onChange={importTerms}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="glossary-list" style={{ marginTop: "20px" }}>
        {filteredTerms.map((item, index) => (
          <div
            key={index}
            className={`glossary-row ${index % 2 === 0 ? "even" : "odd"}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              padding: "8px 10px",
              borderRadius: "6px",
              transition: "background 0.2s ease",
            }}
          >
            <div style={{ flex: 1, fontWeight: "600" }}>{item.term}</div>
            <div style={{ flex: 4, marginLeft: "10px" }}>{item.definition}</div>
            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={() => editTerm(item)} title="Redigera" style={{ padding: "2px 6px" }}>✏️</button>
              <button onClick={() => deleteTerm(item)} title="Radera" style={{ padding: "2px 6px" }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
