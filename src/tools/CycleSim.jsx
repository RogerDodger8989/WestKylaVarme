import React,{useEffect,useMemo,useState} from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'
function simpleCOP({Te,Tc,SH,SC}){const lift=Math.max(5,(Tc-Te));const base=3.2;return Math.max(0.5, base - lift*0.03 - SH*0.02 + SC*0.02)}
export default function Cykel(){
  const key='form/cycle'; const [form,setForm]=useState(()=>loadForm(key,{Te:'0',Tc:'40',SH:'5',SC:'3',pLow:'3.5',pHigh:'12'})); useEffect(()=>{saveForm(key,form)},[form])
  const Te=parseSv(form.Te),Tc=parseSv(form.Tc),SH=parseSv(form.SH),SC=parseSv(form.SC),pLow=parseSv(form.pLow),pHigh=parseSv(form.pHigh)
  const COP=useMemo(()=>simpleCOP({Te,Tc,SH,SC}),[Te,Tc,SH,SC])
  const logMin=Math.log(0.3),logMax=Math.log(40); const xFromP=p=>200+(Math.log(Math.max(0.301,p))-logMin)/(logMax-logMin)*1200
  const yFromT=t=>{const tMin=-30,tMax=80;return 540-((t-tMin)/(tMax-tMin))*360}
  const pts=[{x:xFromP(pLow),y:yFromT(Te+SH)},{x:xFromP(pHigh),y:yFromT(Tc+20)},{x:xFromP(pHigh),y:yFromT(Tc-SC)},{x:xFromP(pLow),y:yFromT(Te-5)}]
  const poly=pts.map(p=>`${p.x},${p.y}`).join(' ')
  return (<div className='card'><h1>Cykelsimulering</h1>
    <div className='field-row'>
      <div className='field'><label>Förångning Te (°C)</label><input value={form.Te} onChange={e=>setForm({...form,Te:e.target.value})}/></div>
      <div className='field'><label>Kondensering Tc (°C)</label><input value={form.Tc} onChange={e=>setForm({...form,Tc:e.target.value})}/></div>
      <div className='field'><label>Överhettning (K)</label><input value={form.SH} onChange={e=>setForm({...form,SH:e.target.value})}/></div>
      <div className='field'><label>Underkylning (K)</label><input value={form.SC} onChange={e=>setForm({...form,SC:e.target.value})}/></div>
      <div className='field'><label>Lågtryck p_low (bar abs)</label><input value={form.pLow} onChange={e=>setForm({...form,pLow:e.target.value})}/></div>
      <div className='field'><label>Högtryck p_high (bar abs)</label><input value={form.pHigh} onChange={e=>setForm({...form,pHigh:e.target.value})}/></div>
    </div>
    <div className='result'>Uppskattad COP (förenklad): <b>{fmt.format(COP)}</b></div>
    <div className='graph-wrap'>
      <svg viewBox='0 0 1600 600' width='100%' height='auto'>
        <defs><linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stopColor='#eaf4ff'/><stop offset='100%' stopColor='#d7ebff'/></linearGradient></defs>
        <rect x='0' y='0' width='1600' height='600' fill='url(#bg)'/>{Array.from({length:10}).map((_,i)=>(<line key={'v'+i} x1={200+i*120} y1={60} x2={200+i*120} y2={540} stroke='#c8d9ea' strokeWidth='1' opacity='0.6'/>))}{Array.from({length:6}).map((_,i)=>(<line key={'h'+i} x1={200} y1={60+i*96} x2={1400} y2={60+i*96} stroke='#c8d9ea' strokeWidth='1' opacity='0.6'/>))}
        <line x1='200' y1='540' x2='1400' y2='540' stroke='#98b3cc' strokeWidth='3'/><line x1='200' y1='540' x2='200' y2='60' stroke='#98b3cc' strokeWidth='3'/>
        <text x='1380' y='578' fontSize='20' textAnchor='end' fill='#6a89a6'>log p (bar abs)</text>
        <text x='210' y='80' fontSize='20' fill='#6a89a6' transform='rotate(-90 210 80)'>T (°C)</text>
        <polyline points={poly} fill='none' stroke='#e67e22' strokeWidth='4' opacity='0.9'/>
        {pts.map((p,i)=>(<g key={i}><circle cx={p.x} cy={p.y} r='10' fill={i===0||i===3?'#f5c400':'#e74c3c'} stroke='#11344f' strokeWidth='2'/><text x={p.x+14} y={p.y-14} fontSize='18' fill='#11344f'>{i+1}</text></g>))}
      </svg>
    </div>
    <h3>Förklaring</h3><div className='helper'>1 Förångning – värme tas upp i förångaren. 2 Kompression – tryck och temperatur stiger. 3 Kondensering – värme avges i kondensorn. 4 Expansion – tryck och temperatur sänks i expansionsventil.</div>
  </div>)
}
