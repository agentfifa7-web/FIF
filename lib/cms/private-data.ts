// Collections réservées à l'administration : vides par défaut, alimentées
// uniquement par le back-office.

export interface Licence {
  id: string
  number: string
  holderName: string
  type: 'Joueur' | 'Entraîneur' | 'Arbitre' | 'Agent' | 'Dirigeant' | 'Médecin / Kiné' | 'Autre'
  clubId: string
  season: string
  issuedAt: string
  expiresAt: string
  status: 'Valide' | 'En attente' | 'Suspendue' | 'Expirée' | 'Refusée'
  phone: string
  notes: string
}

export interface FinanceEntry {
  id: string
  date: string
  label: string
  type: 'Recette' | 'Dépense'
  category: string
  amount: number
  method: string
  reference: string
  notes: string
}

export const licences: Licence[] = []
export const finances: FinanceEntry[] = []
