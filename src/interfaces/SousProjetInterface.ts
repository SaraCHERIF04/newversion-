import { DocumentInterface } from "./DocumentInterface";
import { ProjetInterface } from "./ProjetInterface";
import { UserInterface } from "./UserInterface";


export interface SousProjetInterface {
    chef_projet: UserInterface;
    date_debut_sousprojet: string;
    date_finsousprojet: string;
    description_sous_projet: string;
    id_sous_projet: number;
    nom_sous_projet: string;
    statut_sous_projet: string;
    members: UserInterface[];
    project: ProjetInterface;
    documents: DocumentInterface[];
}

