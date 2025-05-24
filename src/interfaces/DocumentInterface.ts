<<<<<<< HEAD
=======
import { FileInterface } from "./FileInterface";
import { ProjetInterface } from "./ProjetInterface";
import { SousProjetInterface } from "./SousProjetInterface";
>>>>>>> upstream/main

export interface DocumentInterface {
    id_document: number;
    titre: string;
    date_ajout: string;
    description: string;
    type: string;
<<<<<<< HEAD
    chemin: string;
    project?: string;
    subproject?: string;
=======
    project?: ProjetInterface;
    subproject?: SousProjetInterface;
    files?: FileInterface[];

>>>>>>> upstream/main
}

