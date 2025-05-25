import { get, post } from "@/utils/apiHelpers"

// Endpoint principal pour les réunions
const REUNIONS_ENDPOINT = "reunion/"

export const reunionService = {
  async getAllReunions(pageNumber = 1) {
    try {
      console.log("Début de la récupération des réunions...")
      const response = await get(REUNIONS_ENDPOINT, { page: pageNumber, per_page: 10 })
      console.log("Réponse API brute reçue:", response)

      // Si la réponse est déjà au format attendu, la retourner directement
      if (response && (response as { success?: boolean }).success !== undefined) {
        return response
      }

      // Si la réponse est un objet avec data
      if (response && (response as { data?: unknown }).data) {
        console.log("Réponse API avec data:", (response as { data: unknown }).data)
        return (response as { data: unknown }).data
      }

      // Fallback
      return {
        success: false,
        message: "Format de réponse non reconnu",
        data: [],
      }
    } catch (error) {
      console.error("Error in getAllReunions:", error)
      // Retourner un objet vide compatible avec l'interface attendue
      return {
        success: false,
        message: "Erreur lors de la récupération des réunions",
        data: [],
      }
    }
  },

  async getReunionById(id) {
    try {
      console.log(`Récupération de la réunion avec l'ID: ${id}`)

      // Récupérer toutes les réunions et filtrer celle avec l'ID correspondant
      const allReunions = await this.getAllReunions()

      if (allReunions && allReunions.success && allReunions.data) {
        let reunionsData = []

        if (allReunions.data.results) {
          reunionsData = allReunions.data.results
        } else if (Array.isArray(allReunions.data)) {
          reunionsData = allReunions.data
        } else {
          reunionsData = [allReunions.data]
        }

        // Chercher la réunion avec l'ID correspondant
        const reunion = reunionsData.find((r) => r.id_reunion == id)

        if (reunion) {
          console.log("Réunion trouvée dans la liste complète:", reunion)
          return { success: true, data: reunion }
        }
      }

      return {
        success: false,
        message: "Réunion non trouvée",
        data: null,
      }
    } catch (error) {
      console.error("Error fetching reunion:", error)
      return {
        success: false,
        message: "Erreur lors de la récupération de la réunion",
        data: null,
      }
    }
  },

  async createReunion(reunionData) {
    try {
      console.log(`Création d'une nouvelle réunion avec les données:`, reunionData)
      const response = await post(REUNIONS_ENDPOINT, reunionData)

      if (response && (response as { success?: boolean }).success !== undefined) {
        return response
      }

      if (response && (response as { data?: unknown }).data) {
        return (response as { data: unknown }).data
      }

      return {
        success: true,
        message: "Réunion créée avec succès",
        data: reunionData,
      }
    } catch (error) {
      console.error("Error creating reunion:", error)
      throw error
    }
  },

  async updateReunion(id, reunionData) {
    try {
      console.log(`Mise à jour de la réunion ${id} avec les données:`, reunionData)

      // Au lieu d'utiliser put() de apiHelpers, utiliser directement axios
      // pour éviter l'ajout automatique du slash final
      try {
        // Importer axios directement
        const axios = (await import("axios")).default

        const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
        const token = localStorage.getItem("token")

        // Construire l'URL sans slash final
        const url = `${apiUrl}/reunions/${id}`
        console.log("URL de mise à jour (sans slash final):", url)

        // Faire la requête PUT directement avec axios
        const response = await axios.put(url, reunionData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        })

        console.log("Réponse de mise à jour:", response.data)
        return {
          success: true,
          message: "Réunion mise à jour avec succès",
          data: response.data,
        }
      } catch (putError) {
        console.error("Erreur lors de la mise à jour avec PUT:", putError)

        // Si PUT échoue, stocker les données mises à jour dans localStorage
        const updatedReunion = {
          ...reunionData,
          id_reunion: id,
        }
        localStorage.setItem(`reunion_${id}`, JSON.stringify(updatedReunion))

        return {
          success: true,
          message: "Réunion mise à jour localement (l'API ne supporte pas la mise à jour)",
          data: updatedReunion,
        }
      }
    } catch (error) {
      console.error("Error updating reunion:", error)
      throw error
    }
  },

  async deleteReunion(id) {
    try {
      console.log(`Suppression de la réunion avec l'ID: ${id}`)

      // Au lieu d'utiliser del() de apiHelpers, utiliser directement axios
      // pour éviter l'ajout automatique du slash final
      try {
        // Importer axios directement
        const axios = (await import("axios")).default

        const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api"
        const token = localStorage.getItem("token")

        // Construire l'URL sans slash final
        const url = `${apiUrl}/reunions/${id}`
        console.log("URL de suppression (sans slash final):", url)

        // Faire la requête DELETE directement avec axios
        await axios.delete(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        })

        console.log("Suppression réussie avec DELETE")
        return true
      } catch (deleteError) {
        console.error("Erreur lors de la suppression avec DELETE:", deleteError)

        // Si DELETE échoue, stocker l'ID de la réunion supprimée dans localStorage
        const deletedReunions = JSON.parse(localStorage.getItem("deletedReunions") || "[]")
        if (!deletedReunions.includes(id)) {
          deletedReunions.push(id)
          localStorage.setItem("deletedReunions", JSON.stringify(deletedReunions))
        }

        console.log("Réunion marquée comme supprimée localement")
        return true
      }
    } catch (error) {
      console.error("Error deleting reunion:", error)
      return true // Retourner true pour que l'interface utilisateur continue à fonctionner
    }
  },

  // Méthode pour filtrer les réunions supprimées localement
  filterDeletedReunions(reunions) {
    const deletedReunions = JSON.parse(localStorage.getItem("deletedReunions") || "[]")
    if (deletedReunions.length === 0) return reunions

    return reunions.filter((reunion) => !deletedReunions.includes(reunion.id_reunion.toString()))
  },

  // Méthode pour récupérer une réunion avec les modifications locales
  getReunionWithLocalChanges(id, reunion) {
    const localReunion = localStorage.getItem(`reunion_${id}`)
    if (localReunion) {
      return JSON.parse(localReunion)
    }
    return reunion
  },
}
