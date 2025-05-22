export interface FactureInterface {
  id_facture: number
  numero_facture: number | null
  designation: string | null
  date_facturation: string | null
  date_reception: string | null
  brut_ht: number | null
  montant_net_ht: number | null
  montant_tva: number | null
  montant_ttc: number | null
  date_ordre_virement: string | null
  numero_ordre_virement: number | null
  id_projet: number | null
  id_sous_projet: number | null
  id_marche: number | null
  id_ap: number | null
  id_md: number | null
}