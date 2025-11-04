import React, { useEffect, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'

export default function Energi() {
  const key = 'form/energi'
  const [form, setForm] = useState(() => loadForm(key, { p: '3,5', h: '12', dagar: '30', pris: '1,5' }))

  useEffect(() => { saveForm(key, form) }, [form])

  const p = parseSv(form.p)         // kW
  const h = parseSv(form.h)         // timmar per dygn
  const dagar = parseSv(form.dagar) // dagar
  const pris = parseSv(form.pris)   // SEK/kWh

  const kWhPerDygn = p * h
  const kWhPerManad = kWhPerDygn * dagar
  const kostDygn = pris ? kWhPerDygn * pris : 0
  const kostManad = pris ? kWhPerManad * pris : 0

  return (
    <div className="card">
      <h1>Energiförbrukning</h1>
      <div className="field-row">
        <div className="field">
          <label>Effekt P (kW)</label>
          <input value={form.p} onChange={e => setForm({ ...form, p: e.target.value })} />
        </div>
        <div className="field">
          <label>Drifttid per dygn (h)</label>
          <input value={form.h} onChange={e => setForm({ ...form, h: e.target.value })} />
        </div>
        <div className="field">
          <label>Dagar per månad</label>
          <input value={form.dagar} onChange={e => setForm({ ...form, dagar: e.target.value })} />
        </div>
        <div className="field">
          <label>Elpris (SEK/kWh) – valfritt</label>
          <input value={form.pris} onChange={e => setForm({ ...form, pris: e.target.value })} placeholder="t.ex. 1,5" />
        </div>
      </div>
      <h3>Resultat</h3>
      <div className="result">
        {fmt.format(kWhPerDygn)} kWh/dygn ({fmt.format(kWhPerManad)} kWh/månad)
        {pris ? <> — Kostnad ≈ <b>{fmt.format(kostDygn)}</b> SEK/dygn, <b>{fmt.format(kostManad)}</b> SEK/månad</> : null}
      </div>
    </div>
  )
}
