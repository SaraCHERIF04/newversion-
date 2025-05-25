import { FileInterface } from "./FileInterface";
import { ProjetInterface } from "./ProjetInterface";
import { SousProjetInterface } from "./SousProjetInterface";

export interface DocumentInterface {
    id_document: number;
    titre: string;
    date_ajout: string;
    description: string;
    type: string;
    chemin: string;
    project?: string;
    subproject?: SousProjetInterface;
    files?: FileInterface[];

}

