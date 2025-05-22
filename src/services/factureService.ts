import type { FactureInterface } from "@/interfaces/FactureInterface"
import { get, post, put, del } from "@/utils/apiHelpers"

// Utiliser l'URL correcte pour votre API - sans slash final car apiHelpers l'ajoute automatiquement
const FACTURES_ENDPOINT = "/facture/"

// Interface pour la réponse API
interface ApiResponse {
  success: boolean
  message: string
  data: any
}

export const factureService = {
  async getAllFactures(pageNumber = 1): Promise<ApiResponse> {
    try {
      console.log("Début de la récupération des factures...")
      // Utiliser la fonction get de apiHelpers.ts
      const response = await get<ApiResponse>(`${FACTURES_ENDPOINT}`, { page: pageNumber, per_page: 10 })
      console.log("Réponse API brute reçue:", response)

      // Si la réponse est déjà au format attendu, la retourner directement
      if (response && response.success !== undefined) {
        return response
      }

      // Si la réponse est un objet Axios avec data
      if (response && response.data) {
        console.log("Réponse API avec data:", response.data)
        return response.data
      }

      // Fallback
      return {
        success: false,
        message: "Format de réponse non reconnu",
        data: [],
      }
    } catch (error) {
      console.error("Error in getAllFactures:", error)
      // Retourner un objet vide compatible avec l'interface attendue
      return {
        success: false,
        message: "Erreur lors de la récupération des factures",
        data: [],
      }
    }
  },

  async getFactureById(id: string): Promise<ApiResponse> {
    try {
      console.log(`Récupération de la facture avec l'ID: ${id}`)
      // Utiliser la fonction get de apiHelpers.ts
      const response = await get<ApiResponse>(`${FACTURES_ENDPOINT}/${id}`)

      // Traiter la réponse de la même manière que getAllFactures
      if (response && response.success !== undefined) {
        return response
      }

      if (response && response.data) {
        return response.data
      }

      return {
        success: false,
        message: "Format de réponse non reconnu",
        data: null,
      }
    } catch (error) {
      console.error("Error fetching facture:", error)
      return {
        success: false,
        message: "Erreur lors de la récupération de la facture",
        data: null,
      }
    }
  },

  async createFacture(factureData: Omit<FactureInterface, "id_facture">): Promise<ApiResponse> {
    try {
      console.log("Création d'une nouvelle facture avec les données:", factureData)
      // Utiliser la fonction post de apiHelpers.ts
      const response = await post<ApiResponse>(FACTURES_ENDPOINT, factureData)

      if (response && response.success !== undefined) {
        return response
      }

      if (response && response.data) {
        return response.data
      }

      return {
        success: false,
        message: "Format de réponse non reconnu",
        data: null,
      }
    } catch (error) {
      console.error("Error creating facture:", error)
      throw error
    }
  },

  async updateFacture(id: string, factureData: Partial<FactureInterface>): Promise<ApiResponse> {
    try {
      console.log(`Mise à jour de la facture ${id} avec les données:`, factureData)
      // Utiliser la fonction put de apiHelpers.ts
      const response = await put<ApiResponse>(`${FACTURES_ENDPOINT}/${id}`, factureData)

      if (response && response.success !== undefined) {
        return response
      }

      if (response && response.data) {
        return response.data
      }

      return {
        success: false,
        message: "Format de réponse non reconnu",
        data: null,
      }
    } catch (error) {
      console.error("Error updating facture:", error)
      throw error
    }
  },

  async deleteFacture(id: string): Promise<void> {
    try {
      console.log(`Suppression de la facture avec l'ID: ${id}`)
      // Utiliser la fonction del de apiHelpers.ts
      await del(`${FACTURES_ENDPOINT}/${id}`)
    } catch (error) {
      console.error("Error deleting facture:", error)
      throw error
    }
  },
}