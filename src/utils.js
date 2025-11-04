export const fmt = new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 3 })

export function parseSv(value) {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  const s = String(value).replace('\u00A0', '').trim().replace(',', '.')
  const n = parseFloat(s)
  return isNaN(n) ? 0 : n
}

export function saveForm(key, obj) {
  try { localStorage.setItem(key, JSON.stringify(obj)) } catch {}
}
export function loadForm(key, fallback = {}) {
  try {
    const s = localStorage.getItem(key)
    return s ? { ...fallback, ...JSON.parse(s) } : fallback
  } catch { return fallback }
}
