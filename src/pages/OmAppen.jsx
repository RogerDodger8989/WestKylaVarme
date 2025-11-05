import React from "react";

export default function OmAppen() {
  return (
    <div className="card">
      <h1>Om appen</h1>
      <p>
        <strong>West Kyla & Värme</strong> är ett beräkningsverktyg utvecklat för studenter och
        yrkesverksamma inom värme- och kylteknik. Appen är skapad som ett
        fritidsprojekt och hobby, i syfte att underlätta förståelsen av begrepp,
        samband och beräkningar.
      </p>

      <h2>Funktioner</h2>
      <ul>
        <li><b>Cykelsimulering</b> – justera förångning, kondensation, överhettning och underkylning för att se hur systemets prestanda förändras.</li>
        <li><b>Omvandlare</b> – konvertera snabbt mellan tryck, temperatur och energi-enheter.</li>
        <li><b>Material</b> – jämför värmeledningsförmåga, värmekapacitet och densitet för vanliga ämnen.</li>
        <li><b>Mätdata</b> – mata in temperaturer, tryck och flöde för att beräkna effekt, ΔT och COP i realtid.</li>
        <li><b>Ordlista</b> – slå upp och redigera begrepp inom kyl- och värmeteknik. Exportera och importera egna listor.</li>
      </ul>

      <h2>Viktigt</h2>
      <p>
        Alla beräkningar är <strong>förenklade och pedagogiska</strong>.
        Resultat kan skilja sig från verkliga mätvärden och ska inte användas för
        dimensionering eller yrkesmässiga beslut. Fel kan förekomma – använd
        appen som ett hjälpmedel för lärande, inte som ett mätinstrument.
      </p>
    </div>
  );
}
