import React, { useEffect, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'

export default function Varmeoverforing() {
  const key = 'form/varme'
  const [form, setForm] = useState(() => loadForm(key, { U: '220', A: '12', dT: '8' }))

  useEffect(() => { saveForm(key, form) }, [form])

  const U = parseSv(form.U)     // W/m2K
  const A = parseSv(form.A)     // m2
  const dT = parseSv(form.dT)   // K
  const QkW = (U * A * dT) / 1000

  return (
    <div className="card">
      <h1>Värmeöverföring – Q = U · A · ΔT</h1>
      <div className="field-row">
        <div className="field">
          <label>U-värde (W/m²·K)</label>
          <input value={form.U} onChange={e => setForm({ ...form, U: e.target.value })} />
        </div>
        <div className="field">
          <label>Area (m²)</label>
          <input value={form.A} onChange={e => setForm({ ...form, A: e.target.value })} />
        </div>
        <div className="field">
          <label>Temperaturskillnad ΔT (K / °C)</label>
          <input value={form.dT} onChange={e => setForm({ ...form, dT: e.target.value })} />
        </div>
      </div>
      <h3>Resultat</h3>
      <div className="result">
        Överförd effekt Q ≈ <b>{fmt.format(QkW)}</b> kW
      </div>
      <div className="helper">Obs: Förenklad modell. Verklig effekt beror även på flöden, geometrier och ytförhållanden.</div>
    </div>
  )
}
