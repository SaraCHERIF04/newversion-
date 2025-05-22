export interface MaitreOuvrage {
  id_mo: number;
  nom_mo: string;
  id_projet: number;
  address?: string;
  contact_email?: string;
  created_at?: string;
  updated_at?: string;
}
export interface MaitreOuvrageResponse {
  success: boolean;
  message: string;
  moArray: MaitreOuvrage[];
  data: MaitreOuvrage[];
}