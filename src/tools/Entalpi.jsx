import React, { useEffect, useRef, useState } from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'

const MEDIA = [
  'R134a (Tetrafluoretan)',
  'R410A (Zeotrop blandning)',
  'R32 (Difluormetan)',
  'R407C (HFC-blandning)',
  'R404A (HFC-blandning)',
  'R744 (CO₂)',
  'R290 (Propan)',
]

// Förenklade PT-värden för placering (bar abs som funktion av °C)
const PT = {
  'R134a (Tetrafluoretan)': [[-20,1.20],[-10,1.52],[0,1.91],[10,2.35],[20,2.90],[30,3.57],[40,4.31],[50,5.20]],
  'R410A (Zeotrop blandning)': [[-20,4.6],[-10,6.2],[0,8.0],[10,10.4],[20,13.6],[30,17.6],[40,22.5],[50,28.5]],
  'R32 (Difluormetan)': [[-20,5.2],[-10,7.2],[0,9.6],[10,12.7],[20,16.5],[30,21.3],[40,27.3],[50,34.6]],
  'R407C (HFC-blandning)': [[-20,2.8],[-10,3.6],[0,4.6],[10,5.8],[20,7.4],[30,9.3],[40,11.6],[50,14.2]],
  'R404A (HFC-blandning)': [[-40,0.9],[-30,1.5],[-20,2.3],[-10,3.4],[0,4.9],[10,6.9],[20,9.5],[30,12.9]],
  'R744 (CO₂)': [[-40,6.4],[-30,8.7],[-20,11.6],[-10,15.2],[0,19.9],[10,26.0],[20,33.7]],
  'R290 (Propan)': [[-40,0.9],[-30,1.3],[-20,1.9],[-10,2.7],[0,3.8],[10,5.2],[20,7.0],[30,9.3],[40,12.1]],
}

function interp(points, xC) {
  if (!points || points.length < 2) return 1
  const pts = [...points].sort((a,b) => a[0]-b[0])
  if (xC <= pts[0][0]) return pts[0][1]
  if (xC >= pts[pts.length-1][0]) return pts[pts.length-1][1]
  for (let i=0;i<pts.length-1;i++) {
    const [x1,y1] = pts[i], [x2,y2] = pts[i+1]
    if (xC >= x1 && xC <= x2) {
      const t = (xC - x1) / (x2 - x1)
      return y1 + t*(y2-y1)
    }
  }
  return 1
}

// Endast för visuell y-position
function cycle({ Te, Tc, SH, SC }) {
  const base = 200, cv = 0.8, cl = 1.2
  const h1 = base + SH*cv
  const h2 = h1 + 50
  const h3 = (h2 - base) - SC*cl
  const h4 = h3
  return [h1,h2,h3,h4]
}

export default function Entalpi() {
  const key = 'form/entalpi'
  const [form, setForm] = useState(() => loadForm(key, { medium: 'R290 (Propan)', Te:'0', Tc:'40', SH:'5', SC:'3' }))
  const [showPts, setShowPts] = useState(true)
  const svgRef = useRef(null)
  useEffect(() => { saveForm(key, form) }, [form])

  const Te = parseSv(form.Te), Tc = parseSv(form.Tc), SH = parseSv(form.SH), SC = parseSv(form.SC)
  const pEv = interp(PT[form.medium], Te)
  const pCo = interp(PT[form.medium], Tc)
  const [h1,h2,h3,h4] = cycle({ Te, Tc, SH, SC })

  // map log p -> x, h -> y i 2560x1440
  const xFromP = (p) => {
    const logMin = Math.log(0.3), logMax = Math.log(40)
    const t = (Math.log(Math.max(0.301,p)) - logMin) / (logMax - logMin)
    return 200 + t * (2560-400)
  }
  const yFromH = (h) => {
    const hMin = 50, hMax = 500
    const t = (h - hMin) / (hMax - hMin)
    return (1440-140) - t*(1440-320)
  }

  const pts = [
    { id:1, x:xFromP(pEv), y:yFromH(h1), h:h1, p:pEv },
    { id:2, x:xFromP(pCo), y:yFromH(h2), h:h2, p:pCo },
    { id:3, x:xFromP(pCo), y:yFromH(h3), h:h3, p:pCo },
    { id:4, x:xFromP(pEv), y:yFromH(h4), h:h4, p:pEv },
  ]
  const poly = pts.map(p=>`${p.x},${p.y}`).join(' ')

  const saveAsSVG = () => {
    const svg = svgRef.current
    if (!svg) return
    const source = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `entalpi_${form.medium.replace(/[^a-z0-9]+/gi,'_').toLowerCase()}.svg`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="card">
      <h1>Entalpi – h–log p</h1>
      <div className="field-row">
        <div className="field">
          <label>Köldmedium</label>
          <select value={form.medium} onChange={e=>setForm({ ...form, medium:e.target.value })}>
            {MEDIA.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="field"><label>Förångningstemp Te (°C)</label><input value={form.Te} onChange={e=>setForm({ ...form, Te:e.target.value })} /></div>
        <div className="field"><label>Kondenseringstemp Tc (°C)</label><input value={form.Tc} onChange={e=>setForm({ ...form, Tc:e.target.value })} /></div>
        <div className="field"><label>Överhettning (K)</label><input value={form.SH} onChange={e=>setForm({ ...form, SH:e.target.value })} /></div>
        <div className="field"><label>Underkylning (K)</label><input value={form.SC} onChange={e=>setForm({ ...form, SC:e.target.value })} /></div>
      </div>

      <div className="entalpi-wrap">
        <div className="entalpi-toolbar">
          <button className="icon-btn" title="Spara diagram som bild (SVG)" onClick={saveAsSVG}>📸</button>
          <button className="icon-btn" title={showPts ? 'Dölj punkter' : 'Visa punkter'} onClick={()=>setShowPts(v=>!v)}>{showPts ? '👁️' : '🙈'}</button>
        </div>

        <svg ref={svgRef} viewBox="0 0 2560 1440" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eaf4ff"/><stop offset="100%" stopColor="#d7ebff"/>
            </linearGradient>
            <linearGradient id="cupolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8ec1ff"/><stop offset="100%" stopColor="#5aa3ff"/>
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="2560" height="1440" fill="url(#bgGrad)"/>

          {Array.from({length:18}).map((_,i)=> {
            const x = 200 + i*((2560-400)/18)
            return <line key={'vg'+i} x1={x} y1={140} x2={x} y2={1340} stroke="#c8d9ea" strokeWidth="1" opacity="0.6"/>
          })}
          {Array.from({length:12}).map((_,i)=> {
            const y = 140 + i*((1440-240)/12)
            return <line key={'hg'+i} x1={200} y1={y} x2={2360} y2={y} stroke="#c8d9ea" strokeWidth="1" opacity="0.6"/>
          })}

          <line x1="200" y1="1340" x2="2360" y2="1340" stroke="#98b3cc" strokeWidth="3"/>
          <line x1="200" y1="1340" x2="200" y2="140"  stroke="#98b3cc" strokeWidth="3"/>
          <text x="2320" y="1380" fontSize="36" textAnchor="end" fill="#6a89a6">log p (bar abs)</text>
          <text x="230"  y="160"  fontSize="36" fill="#6a89a6" transform="rotate(-90 230 160)">h (kJ/kg)</text>

          <path d="M 480 1240 C 820 300, 1740 300, 2080 1240 Z"
                fill="url(#cupolGrad)" fillOpacity="0.65" stroke="#2e7ae6" strokeWidth="3" opacity="0.9"/>

          <g transform="translate(2080,160)">
            <rect x="0" y="0" width="420" height="180" rx="16" ry="16" fill="rgba(255,255,255,0.6)" stroke="#a5c3dd"/>
            <circle cx="26" cy="34" r="6" fill="#f5c400"/><text x="44" y="40" fontSize="28" fill="#11344f">1 Förångning</text>
            <circle cx="26" cy="74" r="6" fill="#e74c3c"/><text x="44" y="80" fontSize="28" fill="#11344f">2 Kompression</text>
            <circle cx="26" cy="114" r="6" fill="#e74c3c"/><text x="44" y="120" fontSize="28" fill="#11344f">3 Kondensering</text>
            <circle cx="26" cy="154" r="6" fill="#f5c400"/><text x="44" y="160" fontSize="28" fill="#11344f">4 Expansion</text>
          </g>

          <g transform="translate(2060,1300)">
            <circle cx="36" cy="36" r="30" fill="#1f3342"/>
            <circle cx="50" cy="22" r="14" fill="#f5c400"/>
            <line x1="36" y1="10" x2="36" y2="62" stroke="#e9f1f7" strokeWidth="4"/>
            <line x1="14" y1="36" x2="58" y2="36" stroke="#e9f1f7" strokeWidth="4"/>
            <line x1="20" y1="20" x2="52" y2="52" stroke="#e9f1f7" strokeWidth="4"/>
            <line x1="20" y1="52" x2="52" y2="20" stroke="#e9f1f7" strokeWidth="4"/>
            <text x="80" y="46" fontSize="36" fill="#11344f">West Kyla & Värme</text>
          </g>

          <polyline points={poly} fill="none" stroke="#e67e22" strokeWidth="4" opacity="0.9"/>

          {showPts && pts.map(p => (
            <g key={p.id}>
              <circle cx={p.x} cy={p.y} r="10" fill={p.id===1||p.id===4 ? '#f5c400' : '#e74c3c'} stroke="#11344f" strokeWidth="2"/>
              <text x={p.x+14} y={p.y-14} fontSize="28" fill="#11344f">{p.id}</text>
            </g>
          ))}
        </svg>
      </div>

      <h3>Värden (visuella)</h3>
      <div className="result">
        <div>1: p={fmt.format(pEv)} bar, h≈{fmt.format(h1)} kJ/kg</div>
        <div>2: p={fmt.format(pCo)} bar, h≈{fmt.format(h2)} kJ/kg</div>
        <div>3: p={fmt.format(pCo)} bar, h≈{fmt.format(h3)} kJ/kg</div>
        <div>4: p={fmt.format(pEv)} bar, h≈{fmt.format(h4)} kJ/kg</div>
      </div>
      <div className="helper">Diagrammet är stiliserat och pedagogiskt. För projektering: använd tillverkares program/tabeller.</div>
    </div>
  )
}
