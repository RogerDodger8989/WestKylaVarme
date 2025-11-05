import React from "react";

export default function Material() {
  const materials = [
    { name: "R134a (vätska)", lambda: 0.08, cp: 1.42, rho: 1207 },
    { name: "R134a (gas)", lambda: 0.014, cp: 0.88, rho: 5.25 },
    { name: "Vatten", lambda: 0.6, cp: 4.18, rho: 998 },
    { name: "Glykol 30%", lambda: 0.42, cp: 3.6, rho: 1040 },
    { name: "Luft", lambda: 0.026, cp: 1.01, rho: 1.2 },
    { name: "Koppar", lambda: 400, cp: 0.39, rho: 8960 },
    { name: "Aluminium", lambda: 237, cp: 0.9, rho: 2700 },
    { name: "Stål", lambda: 50, cp: 0.46, rho: 7850 },
    { name: "Betong", lambda: 1.7, cp: 0.88, rho: 2300 },
    { name: "Trä (furu)", lambda: 0.12, cp: 2.3, rho: 500 },
    { name: "Glas", lambda: 1.0, cp: 0.84, rho: 2500 },
  ];

  return (
    <div>
      <h2>Material</h2>
      <p>Tabell över vanliga materials egenskaper vid rumstemperatur.</p>

      <table className="material-table" style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Material</th>
            <th style={{ textAlign: "left", padding: "8px" }}>λ [W/m·K]</th>
            <th style={{ textAlign: "left", padding: "8px" }}>cp [kJ/kg·K]</th>
            <th style={{ textAlign: "left", padding: "8px" }}>ρ [kg/m³]</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((m, index) => (
            <tr
              key={index}
              className={`material-row ${index % 2 === 0 ? "even" : "odd"}`}
            >
              <td>{m.name}</td>
              <td>{m.lambda}</td>
              <td>{m.cp}</td>
              <td>{m.rho}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p style={{ marginTop: "20px", fontSize: "0.9rem", opacity: 0.8 }}>
        Värdena är ungefärliga och avsedda för överslagsberäkningar. För noggrann projektering, använd leverantörsdata.
      </p>
    </div>
  );
}
