import React, { useEffect, useMemo, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceDot, Label } from 'recharts'

// Återanvänd PT-data (förenklat) för tryckuppskattning från temperatur
const PT = {
  'R134a (Tetrafluoretan)': [[-20,1.20],[-10,1.52],[0,1.91],[10,2.35],[20,2.90],[30,3.57],[40,4.31],[50,5.20]],
  'R410A (Zeotrop blandning)': [[-20,4.6],[-10,6.2],[0,8.0],[10,10.4],[20,13.6],[30,17.6],[40,22.5],[50,28.5]],
  'R32 (Difluormetan)': [[-20,5.2],[-10,7.2],[0,9.6],[10,12.7],[20,16.5],[30,21.3],[40,27.3],[50,34.6]],
  'R1234yf (HFO-1234yf)': [[-20,1.1],[-10,1.4],[0,1.8],[10,2.2],[20,2.7],[30,3.3],[40,3.9],[50,4.6]],
  'R22 (Klorfluorkolväte)': [[-20,2.6],[-10,3.3],[0,4.2],[10,5.3],[20,6.7],[30,8.3],[40,10.2],[50,12.5]],
  'R407C (HFC-blandning)': [[-20,2.8],[-10,3.6],[0,4.6],[10,5.8],[20,7.4],[30,9.3],[40,11.6],[50,14.2]],
  'R404A (HFC-blandning)': [[-40,0.9],[-30,1.5],[-20,2.3],[-10,3.4],[0,4.9],[10,6.9],[20,9.5],[30,12.9]],
  'R290 (Propan)': [[-40,0.9],[-30,1.3],[-20,1.9],[-10,2.7],[0,3.8],[10,5.2],[20,7.0],[30,9.3],[40,12.1]],
  'R600a (Isobutan)': [[-40,0.3],[-30,0.4],[-20,0.6],[-10,0.8],[0,1.1],[10,1.5],[20,2.0],[30,2.7],[40,3.6]],
  'R744 (CO₂)': [[-40,6.4],[-30,8.7],[-20,11.6],[-10,15.2],[0,19.9],[10,26.0],[20,33.7]]
}

function interp(points, xC) {
  if (!points || points.length < 2) return 1
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
  return 1
}

// Förenklad entalpiuppskattning (endast utbildningsbruk!)
// h1 ~ h_g(evap) + överhettning * cp_vap, h3 ~ h_l(cond) - underkylning * cp_liq
// h2 antas högre än h1 med schablon +50 kJ/kg (kompression). h4 ≈ h3 (strypning).
function cyclePoints({ medium, Te, Tc, SH, SC }) {
  const cp_vap = 0.8
  const cp_liq = 1.2
  const baseLatent = { 'R290 (Propan)': 350, 'R600a (Isobutan)': 340, 'R744 (CO₂)': 200, 'R410A (Zeotrop blandning)': 180, 'R32 (Difluormetan)': 170, 'R404A (HFC-blandning)': 200, 'R407C (HFC-blandning)': 190, 'R22 (Klorfluorkolväte)': 200, 'R134a (Tetrafluoretan)': 200 }[medium] || 200

  const pEvap = interp(PT[medium], Te) // bar abs
  const pCond = interp(PT[medium], Tc) // bar abs

  const h1 = baseLatent + SH*cp_vap
  const h2 = h1 + 50 // schablon för kompressionens arbete
  const h3 = (h2 - baseLatent) - SC*cp_liq
  const h4 = h3 // trottling, entalpi ~ konstant

  return [
    { name: '1', p: pEvap, h: h1 },
    { name: '2', p: pCond, h: h2 },
    { name: '3', p: pCond, h: h3 },
    { name: '4', p: pEvap, h: h4 },
    { name: '1', p: pEvap, h: h1 }, // stäng loopen
  ]
}

export default function Entalpi() {
  const key = 'form/entalpi'
  const [form, setForm] = useState(() => loadForm(key, {
    medium: 'R290 (Propan)',
    Te: '0', Tc: '40', SH: '5', SC: '3'
  }))
  useEffect(() => { saveForm(key, form) }, [form])

  const Te = parseSv(form.Te)
  const Tc = parseSv(form.Tc)
  const SH = parseSv(form.SH)
  const SC = parseSv(form.SC)
  const data = useMemo(() => cyclePoints({ medium: form.medium, Te, Tc, SH, SC }), [form.medium, Te, Tc, SH, SC])

  return (
    <div className="card">
      <h1>Entalpi – h–log p (förenklad)</h1>
      <div className="field-row">
        <div className="field">
          <label>Köldmedium</label>
          <select value={form.medium} onChange={e => setForm({ ...form, medium: e.target.value })}>
            {Object.keys(PT).map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Förångningstemp Te (°C)</label>
          <input value={form.Te} onChange={e => setForm({ ...form, Te: e.target.value })} />
        </div>
        <div className="field">
          <label>Kondenseringstemp Tc (°C)</label>
          <input value={form.Tc} onChange={e => setForm({ ...form, Tc: e.target.value })} />
        </div>
        <div className="field">
          <label>Överhettning (K)</label>
          <input value={form.SH} onChange={e => setForm({ ...form, SH: e.target.value })} />
        </div>
        <div className="field">
          <label>Underkylning (K)</label>
          <input value={form.SC} onChange={e => setForm({ ...form, SC: e.target.value })} />
        </div>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="p" type="number" scale="log" domain={['dataMin', 'dataMax']} tickFormatter={(v)=>fmt.format(v)} label={{ value: 'log p (bar abs)', position: 'insideBottom', offset: -4 }} />
            <YAxis dataKey="h" type="number" domain={['auto','auto']} label={{ value: 'h (kJ/kg, förenklad)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [fmt.format(value), name === 'h' ? 'h (kJ/kg)' : 'p (bar)']} />
            <Line dataKey="h" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3>Värden (förenklade)</h3>
      <div className="result">
        <div>1: p={fmt.format(data[0].p)} bar, h={fmt.format(data[0].h)} kJ/kg</div>
        <div>2: p={fmt.format(data[1].p)} bar, h={fmt.format(data[1].h)} kJ/kg</div>
        <div>3: p={fmt.format(data[2].p)} bar, h={fmt.format(data[2].h)} kJ/kg</div>
        <div>4: p={fmt.format(data[3].p)} bar, h={fmt.format(data[3].h)} kJ/kg</div>
      </div>
      <div className="helper">Denna sida är pedagogisk/schematisk. För riktiga projekteringstal: använd tillverkares datablad och program.</div>
    </div>
  )
}
