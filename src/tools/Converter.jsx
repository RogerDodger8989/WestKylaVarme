import React,{useEffect,useState} from 'react'
import { parseSv, saveForm, loadForm } from '../utils.js'
export default function Converter(){
  const key='form/converter'
  const [form,setForm]=useState(()=>loadForm(key,{bar:'1,0',pa:'100000',c:'20',k:'293,15',kjkg:'200',btulb:'86,04'}))
  useEffect(()=>{saveForm(key,form)},[form])
  function onBar(v){ const bar=parseSv(v); const pa=bar*1e5; setForm(f=>({...f,bar:v,pa:String(pa.toFixed(0)).replace('.',',')})) }
  function onPa(v){ const pa=parseSv(v); const bar=pa/1e5; setForm(f=>({...f,pa:v,bar:String(bar.toFixed(3)).replace('.',',')})) }
  function onC(v){ const c=parseSv(v); const k=c+273.15; setForm(f=>({...f,c:v,k:String(k.toFixed(2)).replace('.',',')})) }
  function onK(v){ const k=parseSv(v); const c=k-273.15; setForm(f=>({...f,k:v,c:String(c.toFixed(2)).replace('.',',')})) }
  function onKJkg(v){ const kj=parseSv(v); const bt=kj*0.429922614; setForm(f=>({...f,kjkg:v,btulb:String(bt.toFixed(2)).replace('.',',')})) }
  function onBtulb(v){ const bt=parseSv(v); const kj=bt/0.429922614; setForm(f=>({...f,btulb:v,kjkg:String(kj.toFixed(2)).replace('.',',')})) }
  return (<div className='card'>
    <h1>Omvandlare</h1>
    <h2>Tryck</h2>
    <div className='field-row'><div className='field'><label>bar</label><input value={form.bar} onChange={e=>onBar(e.target.value)}/></div><div className='field'><label>Pa</label><input value={form.pa} onChange={e=>onPa(e.target.value)}/></div></div>
    <h2>Temperatur</h2>
    <div className='field-row'><div className='field'><label>°C</label><input value={form.c} onChange={e=>onC(e.target.value)}/></div><div className='field'><label>K</label><input value={form.k} onChange={e=>onK(e.target.value)}/></div></div>
    <h2>Specifik energi</h2>
    <div className='field-row'><div className='field'><label>kJ/kg</label><input value={form.kjkg} onChange={e=>onKJkg(e.target.value)}/></div><div className='field'><label>Btu/lb</label><input value={form.btulb} onChange={e=>onBtulb(e.target.value)}/></div></div>
  </div>)
}