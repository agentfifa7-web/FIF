/** Affichage d'un numéro : +225 07 08 09 10 11 (utilisable côté serveur et client). */
export function formatPhone(phone: string) {
  const m = phone.match(/^\+225(\d{10})$/)
  if (m) return `+225 ${m[1].replace(/(\d{2})(?=\d)/g, '$1 ')}`
  return phone
}
