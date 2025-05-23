
import { z } from "zod";

// Status options
export const STATUS_OPTIONS = [
  "En poste",
  "En congé",
  "Maladie",
  "Mission",
  "Formation",
  "Disponible"
];

// Form schema with validation
export const UserFormSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  numero_de_tel: z.string().min(6, { message: "Format de téléphone invalide (indicatif pays suivi du numéro)" }),
  matricule: z.string().min(3, { message: "Le matricule doit contenir au moins 3 caractères" }),
  sexe: z.enum(["homme", "femme"], { message: "Veuillez sélectionner un genre" }),
  role_de_utilisateur: z.enum(["admin", "chef", "employee"], { message: "Veuillez sélectionner un rôle" }),
  etat: z.enum(["En poste", "En congé", "Maladie", "Mission", "Formation", "Disponible"], {
    message: "Veuillez sélectionner un état valide"
  }),
  created_at: z.date({
    required_error: "Veuillez sélectionner une date",
  })
});
