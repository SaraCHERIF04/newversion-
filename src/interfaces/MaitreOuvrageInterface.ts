export interface MaitreOuvrage {
  id_mo: number;
  nom_mo: string;
  id_projet: number;
  adress_mo?: string;
  email_mo?: string;
  created_at?: string;
  updated_at?: string;
  description_mo?: string;
  tel_mo?: string;
  type_mo?: string;
  nom_projet?: string;

}
export interface MaitreOuvrageResponse {
  success: boolean;
  message: string;
  moArray: MaitreOuvrage[];
  data: MaitreOuvrage[];
}