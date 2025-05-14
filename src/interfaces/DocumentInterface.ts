
export interface DocumentInterface {
    id_document: number;
    titre: string;
    date_ajout: string;
    description: string;
    type: string;
    chemin: string;
    project?: string;
    subproject?: string;
}

