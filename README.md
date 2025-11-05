# West Kyla & Värme

**West Kyla & Värme** är ett pedagogiskt beräkningsverktyg för studenter och yrkesverksamma inom värme- och kylteknik.  
Appen är skapad som ett **fritids- och hobbyprojekt** av Dennis West och innehåller flera interaktiva verktyg för att underlätta förståelsen av begrepp, beräkningar och samband i kyltekniska system.

---

## ⚙️ Funktioner

### 🌀 Cykelsimulering
Justera parametrar som **förångning, kondensation, överhettning** och **underkylning** för att se hur systemets prestanda och COP påverkas i realtid.

### 🔄 Omvandlare
Konvertera mellan vanliga enheter inom kyl- och värmeteknik – t.ex. **bar ↔ Pa**, **°C ↔ K**, **kJ/kg ↔ Btu/lb**.

### 🧱 Material
Jämför **värmeledningsförmåga (λ)**, **värmekapacitet (cp)** och **densitet (ρ)** för olika material i tabell- och diagramform.

### 📊 Mätdata
Mata in egna mätvärden (T1, T2, P1, P2, flöde, eleffekt) och få automatiskt **ΔT**, **värmeeffekt** och **COP** beräknade.

### 📘 Ordlista
Utforska ett stort antal centrala begrepp inom värme- och kylteknik.  
- Sök bland orden i realtid.  
- Lägg till egna begrepp.  
- Redigera eller ta bort poster.  
- Exportera eller importera ordlistan (`.json`-fil).  
- Allt sparas lokalt i din webbläsare.

### ℹ️ Om appen
Förklarar appens syfte, funktioner och begränsningar.

---

## 🧩 Teknisk information

- Byggd med **React + Vite**
- Fullt **responsiv design** (mobil, surfplatta, dator)
- Mörkt och ljust läge
- Alla data sparas lokalt i **localStorage**
- **Ingen internetuppkoppling krävs** efter första laddning

---

## 🧑‍💻 Installation och körning
Alternativ 1
1. Klona eller ladda ner projektet.
2. Öppna terminalen (CMD) i projektmappen och kör:

   npm install
   npm run dev
   
3. Öppna länken som visas i terminalen, oftast: http://localhost:5173