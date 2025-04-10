
import { z } from "zod";

// Form schema with validation
export const UserFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  telephone: z.string().regex(/^0\d{9}$/, { message: "Format de téléphone invalide (10 chiffres commençant par 0)" }),
  matricule: z.string().min(3, { message: "Le matricule doit contenir au moins 3 caractères" }),
  gender: z.enum(["male", "female"], { message: "Veuillez sélectionner un genre" }),
  role: z.enum(["admin", "chef", "employee"], { message: "Veuillez sélectionner un rôle" }),
  status: z.enum(["active", "inactive"], { message: "Veuillez sélectionner un état" }),
  createdAt: z.date({
    required_error: "Veuillez sélectionner une date",
  })
});
