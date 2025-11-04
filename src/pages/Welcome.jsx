import React from 'react'

export default function Welcome() {
  return (
    <div className="card">
      <h1>Välkommen</h1>
      <p>
        Detta är <b>West Kyl & Värme</b> — ett tekniskt verktyg för vanliga beräkningar inom
        värme och kyla. Välj en flik ovanför för att börja räkna.
      </p>
      <div className="helper">
        Tips: Växla tema via knappen uppe till höger (eller Ctrl/Cmd + T).
      </div>
    </div>
  )
}
