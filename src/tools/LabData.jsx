import React,{useEffect,useState} from 'react'
import { fmt, parseSv, saveForm, loadForm } from '../utils.js'
const FLUIDS={'R134a (vätska)':{cp:1.42},'Vatten':{cp:4.18},'Glykol 30%':{cp:3.70},'Luft':{cp:1.00}}
export default function Lab(){
  const key='form/lab'; const [form,setForm]=useState(()=>loadForm(key,{fluid:'R134a (vätska)', T1:'30', T2:'35', P1:'2,0', P2:'8,0', mdot:'0,12', Pel:'1,2'})); useEffect(()=>{saveForm(key,form)},[form])
  const cp=FLUIDS[form.fluid].cp; const T1=parseSv(form.T1), T2=parseSv(form.T2), mdot=parseSv(form.mdot), Pel=parseSv(form.Pel)
  const dT=T2-T1; const QkW=mdot*cp*dT; const COP=Pel>0?QkW/Pel:0
  const pressureRatio=(parseSv(form.P2)+1e-6)/(parseSv(form.P1)+1e-6); const prBadge=pressureRatio<2.5?'ok':pressureRatio<4.0?'warn':'bad'
  return (<div className='card'><h1>Mätdata</h1>
    <div className='field-row'>
      <div className='field'><label>Medium</label><select value={form.fluid} onChange={e=>setForm({...form,fluid:e.target.value})}>{Object.keys(FLUIDS).map(k=><option key={k} value={k}>{k}</option>)}</select></div>
      <div className='field'><label>T1 in (°C)</label><input value={form.T1} onChange={e=>setForm({...form,T1:e.target.value})}/></div>
      <div className='field'><label>T2 ut (°C)</label><input value={form.T2} onChange={e=>setForm({...form,T2:e.target.value})}/></div>
      <div className='field'><label>P1 låg (bar)</label><input value={form.P1} onChange={e=>setForm({...form,P1:e.target.value})}/></div>
      <div className='field'><label>P2 hög (bar)</label><input value={form.P2} onChange={e=>setForm({...form,P2:e.target.value})}/></div>
      <div className='field'><label>Massflöde ṁ (kg/s)</label><input value={form.mdot} onChange={e=>setForm({...form,mdot:e.target.value})}/></div>
      <div className='field'><label>Eleffekt (kW)</label><input value={form.Pel} onChange={e=>setForm({...form,Pel:e.target.value})}/></div>
    </div>
    <h3>Resultat</h3>
    <div className='result'>ΔT = <b>{fmt.format(dT)}</b> K — Q ≈ <b>{fmt.format(QkW)}</b> kW — COP ≈ <b>{fmt.format(COP)}</b>
      <div style={{marginTop:8}}>Tryckförhållande P2/P1: <span className={'badge '+prBadge}>{prBadge==='ok'?'inom normal drift': prBadge==='warn'?'högt (kolla överhettning/underkylning)':'onormalt (felsök)'}</span></div>
    </div>
    <div className='helper'>Pedagogisk modell. För projektering: använd tillverkares verktyg och exakta mediumdata.</div>
  </div>)
}
