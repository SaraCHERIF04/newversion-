import { DocumentInterface } from "./DocumentInterface";
import { ReuinionInterface } from "./ReuinionInterface";
import { SousProjetInterface } from "./SousProjetInterface";
import { UserInterface } from "./UserInterface";

export interface ProjetInterface {
    id_projet: number;
    nom_projet: string;
    description_de_projet: string;
    date_debut_de_projet: string;
    date_fin_de_projet: string;
    statut: string;
    id_utilisateur: number;
    members : UserInterface[];
    documents : DocumentInterface[];
    chef : UserInterface;
    subprojects : SousProjetInterface[];
    reunions : ReuinionInterface[];
}

