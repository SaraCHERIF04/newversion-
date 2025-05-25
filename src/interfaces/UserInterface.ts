export interface UserInterface {
    id_utilisateur: number;
    nom: string;
    email?: string;
    mot_de_passe?: string;
    role_de_utilisateur: string;
    numero_de_tel?: string;
    created_at?: Date;
    prenom?: string;
    sexe?: string;
    etat?: string;
    matricule?: string;
    fcm_token?: string;
    avatar?: string
    is_anonymous?: boolean;
    is_authenticated?: boolean;
    is_active?: boolean;
    
}