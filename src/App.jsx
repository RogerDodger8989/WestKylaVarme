import React, { useEffect, useState } from 'react'
import Welcome from './pages/Welcome.jsx'
import OmAppen from './pages/OmAppen.jsx'
import Cop from './tools/Cop.jsx'
import Effekt from './tools/Effekt.jsx'
import Energi from './tools/Energi.jsx'
import Varmeoverforing from './tools/Varmeoverforing.jsx'
import PT from './tools/PT.jsx'
import Entalpi from './tools/Entalpi.jsx'

const tabs = [
  { id: 'welcome', title: 'Start' },
  { id: 'cop', title: 'COP' },
  { id: 'effekt', title: 'Effekt' },
  { id: 'energi', title: 'Energi' },
  { id: 'varme', title: 'Värmeöverföring' },
  { id: 'pt', title: 'Tryck–Temp' },
  { id: 'om', title: 'Om appen' },
]

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [tab, setTab] = useState('welcome')

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const handle = (e) => {
      if (e.key === 't' && (e.ctrlKey || e.metaKey)) setTheme(t => t === 'light' ? 'dark' : 'light')
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand-mark" />
          <div>
            <div className="title">West Kyl & Värme</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>West Kyl & Värme-teknik</div>
          </div>
          <div className="grow" />
          <div className="toolbar">
            <button className="btn" onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? 'Mörkt läge' : 'Ljust läge'}
            </button>
          </div>
        </div>
        <div className="tabbar">
          {tabs.map(t => (
            <div key={t.id} className={'tab ' + (tab === t.id ? 'active' : '')} onClick={() => setTab(t.id)}>
              {t.title}
            </div>
          ))}
        </div>
      </header>

      <main className="content">
        {tab === 'welcome' && <Welcome />}
        {tab === 'cop' && <Cop />}
        {tab === 'effekt' && <Effekt />}
        {tab === 'energi' && <Energi />}
        {tab === 'varme' && <Varmeoverforing />}
        {tab === 'pt' && <PT />}
        {tab === 'entalpi' && <Entalpi />}
        {tab === 'om' && <OmAppen />}
      </main>

      <div className="footer">
        © {new Date().getFullYear()} West Kyl & Värme-teknik — Byggd för studerande & installatörer.
      </div>
    </div>
  )
}
