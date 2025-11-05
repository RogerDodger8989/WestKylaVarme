import React,{useEffect,useState} from 'react'
import {fmt,parseSv,saveForm,loadForm} from '../utils.js'
export default function Effekt(){
  const key='form/effekt'; const [form,setForm]=useState(()=>loadForm(key,{m:'0,25',cp:'4,18',dT:'7'})); useEffect(()=>{saveForm(key,form)},[form])
  const m=parseSv(form.m), cp=parseSv(form.cp), dT=parseSv(form.dT); const qkW=m*cp*dT
  return (<div className='card'><h1>Effekt – Q = m · cp · ΔT</h1>
    <div className='field-row'>
      <div className='field'><label>Massflöde m (kg/s)</label><input value={form.m} onChange={e=>setForm({...form,m:e.target.value})}/></div>
      <div className='field'><label>Specifik värmekapacitet cp (kJ/kg·K)</label><input value={form.cp} onChange={e=>setForm({...form,cp:e.target.value})}/></div>
      <div className='field'><label>Temperaturskillnad ΔT (K / °C)</label><input value={form.dT} onChange={e=>setForm({...form,dT:e.target.value})}/></div>
    </div>
    <h3>Resultat</h3><div className='result'>Effekt Q ≈ <b>{fmt.format(qkW)}</b> kW</div>
  </div>)
}