# West Kyl & Värme (React + Vite)

En liten PWA för grundläggande beräkningar inom värme/kylteknik.

## Funktioner
- COP
- Effekt: Q = m · cp · ΔT
- Energiförbrukning (kWh/dygn och månad, valfri kostnadsberäkning)
- Värmeöverföring: Q = U · A · ΔT
- Tryck–Temperatur (förenklade mättnadsdata för några köldmedier)
- Ljus/mörkt tema
- Sparar senaste inmatningar lokalt
- Mobilanpassad (fungerar i stående/liggande läge)
- PWA: kan läggas till som app på hemskärmen

## Kör lokalt
```bash
npm install
npm run dev
```

## Bygg
```bash
npm run build
npm run preview
```

## Publicera
- Ladda upp till GitHub och koppla till Netlify eller Vercel.
- Appen fungerar som PWA: manifest och service worker ingår.
