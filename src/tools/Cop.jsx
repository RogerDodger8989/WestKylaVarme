import React,{useEffect,useState} from 'react'
import {fmt,parseSv,saveForm,loadForm} from '../utils.js'
export default function Cop(){
  const key='form/cop'; const [form,setForm]=useState(()=>loadForm(key,{q:'5,0',w:'1,6'})); useEffect(()=>{saveForm(key,form)},[form])
  const q=parseSv(form.q), w=parseSv(form.w); const cop=w>0?q/w:0
  return (<div className='card'><h1>COP – Köldfaktor</h1>
    <div className='field-row'>
      <div className='field'><label>Avgiven effekt Q (kW)</label><input value={form.q} onChange={e=>setForm({...form,q:e.target.value})}/></div>
      <div className='field'><label>Tillförd eleffekt W (kW)</label><input value={form.w} onChange={e=>setForm({...form,w:e.target.value})}/></div>
    </div>
    <h3>Resultat</h3><div className='result'>COP = <b>{fmt.format(cop)}</b></div>
  </div>)
}