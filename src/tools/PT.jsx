import React, { useEffect, useMemo, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'

const DATA = {
  R134a: { unit: 'bar(abs)', points: [[-20,1.20],[-10,1.52],[0,1.91],[10,2.35],[20,2.90],[30,3.57],[40,4.31],[50,5.20]] },
  R410A: { unit: 'bar(abs)', points: [[-20,4.6],[-10,6.2],[0,8.0],[10,10.4],[20,13.6],[30,17.6],[40,22.5],[50,28.5]] },
  R32:   { unit: 'bar(abs)', points: [[-20,5.2],[-10,7.2],[0,9.6],[10,12.7],[20,16.5],[30,21.3],[40,27.3],[50,34.6]] },
  R1234yf:{unit: 'bar(abs)', points: [[-20,1.1],[-10,1.4],[0,1.8],[10,2.2],[20,2.7],[30,3.3],[40,3.9],[50,4.6]] }
}

function interp(points, x) {
  if (!points || points.length < 2) return 0
  points = [...points].sort((a,b) => a[0]-b[0])
  if (x <= points[0][0]) return points[0][1]
  if (x >= points[points.length-1][0]) return points[points.length-1][1]
  for (let i=0;i<points.length-1;i++) {
    const [x1,y1] = points[i]
    const [x2,y2] = points[i+1]
    if (x >= x1 && x <= x2) {
      const t = (x - x1) / (x2 - x1)
      return y1 + t*(y2-y1)
    }
  }
  return 0
}

export default function PT() {
  const key = 'form/pt'
  const [form, setForm] = useState(() => loadForm(key, { medium: 'R134a', temp: '5' }))
  useEffect(() => { saveForm(key, form) }, [form])

  const medium = form.medium
  const temp = parseSv(form.temp)
  const p = useMemo(() => interp(DATA[medium].points, temp), [medium, temp])

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
          <label>Temperatur (°C)</label>
          <input value={form.temp} onChange={e => setForm({ ...form, temp: e.target.value })} />
        </div>
      </div>
      <h3>Resultat</h3>
      <div className="result">
        Vid {fmt.format(temp)} °C: p_sat ≈ <b>{fmt.format(p)}</b> {DATA[medium].unit}
      </div>
      <div className="helper">Obs: Förenklade data för utbildningsbruk. Verifiera alltid mot tillverkarens PT-tabeller.</div>
    </div>
  )
}
