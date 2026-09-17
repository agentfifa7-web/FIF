export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }) {
  return new Intl.DateTimeFormat('fr-FR', opts).format(new Date(iso))
}

export function formatDateLong(iso: string) {
  return formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat('fr-FR', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

export function age(birthdate: string, reference = '2026-09-17') {
  const b = new Date(birthdate)
  const r = new Date(reference)
  let a = r.getFullYear() - b.getFullYear()
  const m = r.getMonth() - b.getMonth()
  if (m < 0 || (m === 0 && r.getDate() < b.getDate())) a--
  return a
}
