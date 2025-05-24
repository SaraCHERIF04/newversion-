import { DocumentInterface } from "./DocumentInterface";
import { ReuinionInterface } from "./ReuinionInterface";
import { SousProjetInterface } from "./SousProjetInterface";
import { UserInterface } from "./UserInterface";
<<<<<<< HEAD
import { IncidentInterface } from "./IncidentInterface";
import { MaitreOuvrage } from "./MaitreOuvrageInterface";

=======
>>>>>>> upstream/main

export interface ProjetInterface {
    id_projet: number;
    nom_projet: string;
    description_de_projet: string;
<<<<<<< HEAD
    deadline: string;
    date_debut_de_projet: string;
    date_fin_de_projet: string;
    status: string;
    id_utilisateur: number;
    members: UserInterface[];
    documents: DocumentInterface[];
    chef_projet: UserInterface;
    subprojects: SousProjetInterface[];
    reunions: ReuinionInterface[];
    

    // 🔽 Added fields
    budget: number;                // budget of the project
    wilaya: string;               // region or location
    secteur?: string;             // optional: domain/sector of the project
    image_url?: string;           // optional: image of the project
    maitreOuvrage?: MaitreOuvrage; // optional: project owner
    incidents?: IncidentInterface[]; // optional: list of incidents related to the project
    incident?: IncidentInterface; // optional: single incident related to the project
    incidentFollowUps?: IncidentInterface[]; // optional: list of follow-ups for the incident
    incidentFollowUp?: IncidentInterface; // optional: single follow-up for the incident
    incidentDocuments?: DocumentInterface[]; // optional: documents related to the incident
    incidentDocument?: DocumentInterface; // optional: single document related to the incident
    incidentSignalePar?: UserInterface; // optional: user who reported the incident
    incidentSignaleParId?: number; // optional: ID of the user who reported the incident
    incidentDate?: string; // optional: date of the incident
    
}


=======
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

>>>>>>> upstream/main
