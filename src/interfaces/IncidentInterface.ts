import { UserInterface } from "./UserInterface";

export interface IncidentInterface {
    id_incident: number;
    description_incident: string;
    date_incident: string;
    id_projet: number;
    id_sous_projet: number;
    lieu_incident: string;
    signale_par?: UserInterface;
    lheure_incident: string;
    type_incident: string;
}
