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

/** Date (et heure si connue) d'un match, sans jamais afficher une date ou une heure non officielle. */
export function matchWhen(m: { date: string; dateConfirmed?: boolean; timeConfirmed?: boolean }, opts?: Intl.DateTimeFormatOptions) {
  if (m.dateConfirmed === false) return 'Date à confirmer'
  const d = formatDate(m.date, opts)
  return m.timeConfirmed === false ? d : `${d} · ${formatTime(m.date)}`
}

/** Match dont le coup d'envoi est passé depuis plus de 2 h sans score publié :
 *  affiché « score en attente » plutôt que « à venir ». */
export function awaitingScore(m: { status: string; date: string; dateConfirmed?: boolean }, now = Date.now()) {
  return m.status === 'À venir' && m.dateConfirmed !== false && now > new Date(m.date).getTime() + 2 * 3600 * 1000
}

/** Couleur de texte lisible (blanc ou vert très foncé) sur un fond hexadécimal. */
export function readableOn(bg?: string): string {
  const m = /^#?([0-9a-f]{6})$/i.exec((bg ?? '').trim())
  if (!m) return '#fff'
  const lin = (i: number) => { const c = parseInt(m[1].slice(i, i + 2), 16) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
  const L = 0.2126 * lin(0) + 0.7152 * lin(2) + 0.0722 * lin(4)
  return (1.05 / (L + 0.05)) >= (L + 0.05) / 0.0586 ? '#fff' : '#041b12'
}
