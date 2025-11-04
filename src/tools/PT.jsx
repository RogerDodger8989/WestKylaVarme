import React, { useEffect, useMemo, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'

// Förenklade mättnadstabeller (bar abs) som funktion av °C (endast utbildningsbruk)
// Värdena är ungefärliga och ska verifieras mot tillverkarens data vid verklig dimensionering.
const DATA = {
  'R134a (Tetrafluoretan)': { key: 'R134a', unit: 'bar(abs)', points: [[-20,1.20],[-10,1.52],[0,1.91],[10,2.35],[20,2.90],[30,3.57],[40,4.31],[50,5.20]] },
  'R410A (Zeotrop blandning)': { key: 'R410A', unit: 'bar(abs)', points: [[-20,4.6],[-10,6.2],[0,8.0],[10,10.4],[20,13.6],[30,17.6],[40,22.5],[50,28.5]] },
  'R32 (Difluormetan)': { key: 'R32', unit: 'bar(abs)', points: [[-20,5.2],[-10,7.2],[0,9.6],[10,12.7],[20,16.5],[30,21.3],[40,27.3],[50,34.6]] },
  'R1234yf (HFO-1234yf)': { key: 'R1234yf', unit: 'bar(abs)', points: [[-20,1.1],[-10,1.4],[0,1.8],[10,2.2],[20,2.7],[30,3.3],[40,3.9],[50,4.6]] },
  'R22 (Klorfluorkolväte)': { key: 'R22', unit: 'bar(abs)', points: [[-20,2.6],[-10,3.3],[0,4.2],[10,5.3],[20,6.7],[30,8.3],[40,10.2],[50,12.5]] },
  'R407C (HFC-blandning)': { key: 'R407C', unit: 'bar(abs)', points: [[-20,2.8],[-10,3.6],[0,4.6],[10,5.8],[20,7.4],[30,9.3],[40,11.6],[50,14.2]] },
  'R404A (HFC-blandning)': { key: 'R404A', unit: 'bar(abs)', points: [[-40,0.9],[-30,1.5],[-20,2.3],[-10,3.4],[0,4.9],[10,6.9],[20,9.5],[30,12.9]] },
  'R290 (Propan)': { key: 'R290', unit: 'bar(abs)', points: [[-40,0.9],[-30,1.3],[-20,1.9],[-10,2.7],[0,3.8],[10,5.2],[20,7.0],[30,9.3],[40,12.1]] },
  'R600a (Isobutan)': { key: 'R600a', unit: 'bar(abs)', points: [[-40,0.3],[-30,0.4],[-20,0.6],[-10,0.8],[0,1.1],[10,1.5],[20,2.0],[30,2.7],[40,3.6]] },
  'R744 (CO₂)': { key: 'R744', unit: 'bar(abs)', points: [[-40,6.4],[-30,8.7],[-20,11.6],[-10,15.2],[0,19.9],[10,26.0],[20,33.7]] } // Obs: transkritisk över 31°C
}

// Linjär interpolation mellan punkter (på °C)
function interp(points, xC) {
  if (!points || points.length < 2) return 0
  const pts = [...points].sort((a,b) => a[0]-b[0])
  if (xC <= pts[0][0]) return pts[0][1]
  if (xC >= pts[pts.length-1][0]) return pts[pts.length-1][1]
  for (let i=0;i<pts.length-1;i++) {
    const [x1,y1] = pts[i]
    const [x2,y2] = pts[i+1]
    if (xC >= x1 && xC <= x2) {
      const t = (xC - x1) / (x2 - x1)
      return y1 + t*(y2-y1)
    }
  }
  return 0
}

export default function PT() {
  const key = 'form/pt'
  const [form, setForm] = useState(() => loadForm(key, { medium: 'R290 (Propan)', temp: '5', tScale: 'C' }))
  useEffect(() => { saveForm(key, form) }, [form])

  const medium = form.medium
  const tempInput = parseSv(form.temp)
  const tC = form.tScale === 'K' ? (tempInput - 273.15) : tempInput
  const p = useMemo(() => interp(DATA[medium].points, tC), [medium, tC])

  return (
    <div className="card">
      <h1>Tryck–Temperatur (mättnad)</h1>
      <div className="field-row">
        <div className="field">
          <label>Köldmedium</label>
          <select value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })}>
            {Object.keys(DATA).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Temperatur ({form.tScale === 'K' ? 'K' : '°C'})</label>
          <input value={form.temp} onChange={e => setForm({ ...form, temp: e.target.value })} />
        </div>
        <div className="field">
          <label>Skala</label>
          <select value={form.tScale} onChange={e => setForm({ ...form, tScale: e.target.value })}>
            <option value="C">°C</option>
            <option value="K">K</option>
          </select>
        </div>
      </div>
      <h3>Resultat</h3>
      <div className="result">
        Vid {fmt.format(form.tScale === 'K' ? (tC + 273.15) : tC)} {form.tScale === 'K' ? 'K' : '°C'}:
        p_sat ≈ <b>{fmt.format(p)}</b> {DATA[medium].unit}
      </div>
      <div className="helper">Obs: Förenklade data för utbildningsbruk. Verifiera alltid mot tillverkarens PT-tabeller.</div>
    </div>
  )
}
