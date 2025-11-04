import React from 'react'

export default function OmAppen() {
  return (
    <div className="card">
      <h1>Om appen</h1>
      <p>
        <b>West Kyl & Värme-teknik</b> är ett utbildnings- och arbetsverktyg för studerande och installatörer inom värme/kylteknik.
        Resultat är förenklade och bör alltid dubbelkontrolleras mot tillverkares data och gällande standarder.
      </p>
      <h3>Kontakt</h3>
      <p>
        West Kyl & Värme-teknik<br />
        E-post: <a className="link" href="mailto:info@westkylvarme.se">info@westkylvarme.se</a>
      </p>
      <p className="helper">Denna version är en första demo och kan uppdateras över tid.</p>
    </div>
  )
}
