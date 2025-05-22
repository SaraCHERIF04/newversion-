"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { reunionService } from "@/services/reuinionService"
import { Input } from "@/components/ui/input"
import { projetService } from "@/services/projetService"

const MeetingFormPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { id: meetingId } = useParams()

  const [ordre_de_jour, setOrdreDeJour] = useState("")
  const [date_reunion, setDateReunion] = useState("")
  const [heure_re, setHeureRe] = useState("")
  const [lieu_reunion, setLieuReunion] = useState("")
  const [numpv_reunion, setNumPvReunion] = useState("")
  const [id_projet, setIdProjet] = useState(null)
  const [id_utilisateur, setIdUtilisateur] = useState("1") // Valeur par défaut
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [projets, setProjets] = useState([])
  const [isApiAvailable, setIsApiAvailable] = useState(true)
  const isEditing = Boolean(meetingId)

  // Récupérer l'ID utilisateur connecté
  useEffect(() => {
    // Simuler la récupération de l'ID utilisateur connecté
    // Dans un cas réel, cela viendrait d'un service d'authentification ou d'un contexte
    setIdUtilisateur("1") // ID utilisateur par défaut
  }, [])

  // Ajouter une fonction utilitaire pour extraire les données de projet
  const extractProjectsData = (response) => {
    if (!response) return []

    let projetsData = []

    if (response.data) {
      // Si response.data est un tableau
      if (Array.isArray(response.data)) {
        projetsData = response.data
      }
      // Si response.data est un objet qui contient count, next, previous (format DRF)
      else if (response.data.count !== undefined && (response.data.results || response.data.data)) {
        projetsData = response.data.results || response.data.data || []
      }
      // Si response.data est un objet simple
      else {
        projetsData = [response.data]
      }
    } else if (Array.isArray(response)) {
      projetsData = response
    }

    return projetsData
  }

  // Fetch projects for dropdown
  useEffect(() => {
    // Modifier la fonction fetchProjets pour utiliser cette fonction utilitaire
    const fetchProjets = async () => {
      try {
        setLoading(true)

        // Vérifier si l'API est disponible
        if (!isApiAvailable) {
          console.log("API non disponible, utilisation des données de secours")
          const fallbackProjets = [
            { id_projet: 1, nom_projet: "Projet A" },
            { id_projet: 2, nom_projet: "Projet B" },
            { id_projet: 3, nom_projet: "Projet C" },
          ]
          setProjets(fallbackProjets)
          return
        }

        // Essayer différents endpoints
        const endpoints = ["", "chef", "employee", "financier"]
        let success = false

        for (const endpoint of endpoints) {
          if (success) break

          try {
            console.log(`Tentative avec l'endpoint: ${endpoint}`)
            const response = await projetService.getAllProjets(1, endpoint)

            // Vérifier la structure de la réponse et extraire les données correctement
            if (response) {
              console.log("Structure de la réponse:", response)

              // Utiliser la fonction utilitaire pour extraire les données
              const projetsData = extractProjectsData(response)

              console.log("Données extraites:", projetsData)

              // Si nous avons des données, les transformer pour correspondre à l'interface Projet
              if (projetsData && projetsData.length > 0) {
                const projetsFromApi = projetsData.map((projet) => ({
                  id_projet: projet.id_projet,
                  nom_projet: projet.nom_projet,
                }))

                setProjets(projetsFromApi)
                success = true
                console.log(`Succès avec l'endpoint: ${endpoint}`)
              }
            }
          } catch (endpointError) {
            console.error(`Erreur avec l'endpoint ${endpoint}:`, endpointError)
          }
        }

        // Si aucun endpoint n'a fonctionné
        if (!success) {
          console.log("Tous les endpoints ont échoué, utilisation des données de secours")
          setIsApiAvailable(false)

          // Utiliser des données de secours
          const fallbackProjets = [
            { id_projet: 1, nom_projet: "Projet A" },
            { id_projet: 2, nom_projet: "Projet B" },
            { id_projet: 3, nom_projet: "Projet C" },
          ]
          setProjets(fallbackProjets)
        }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setError("Impossible de charger les projets. Utilisation des données de secours.")
        setIsApiAvailable(false)

        // Utiliser des données de secours en cas d'erreur
        const fallbackProjets = [
          { id_projet: 1, nom_projet: "Projet A" },
          { id_projet: 2, nom_projet: "Projet B" },
          { id_projet: 3, nom_projet: "Projet C" },
        ]
        setProjets(fallbackProjets)
      } finally {
        setLoading(false)
      }
    }

    fetchProjets()
  }, [isApiAvailable])

  // Fetch meeting details if in edit mode
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      if (!meetingId) return

      setLoading(true)
      setError(null)

      try {
        console.log("Fetching meeting details for ID:", meetingId)

        // Vérifier d'abord si nous avons des données locales
        const localReunion = localStorage.getItem(`reunion_${meetingId}`)
        if (localReunion) {
          console.log("Utilisation des données locales pour la réunion:", meetingId)
          const meetingData = JSON.parse(localReunion)
          setOrdreDeJour(meetingData.ordre_de_jour || "")
          setDateReunion(meetingData.date_reunion || "")
          setHeureRe(meetingData.heure_re || "")
          setLieuReunion(meetingData.lieu_reunion || "")
          setNumPvReunion(meetingData.numpv_reunion || "")
          setIdProjet(meetingData.id_projet || null)
          setIdUtilisateur(meetingData.id_utilisateur || "1")
          setLoading(false)
          return
        }

        // Si pas de données locales, récupérer depuis l'API
        const response = await reunionService.getReunionById(meetingId)
        console.log("Meeting details response:", response)

        if (response && response.success && response.data) {
          const meetingData = response.data
          setOrdreDeJour(meetingData.ordre_de_jour || "")
          setDateReunion(meetingData.date_reunion || "")
          setHeureRe(meetingData.heure_re || "")
          setLieuReunion(meetingData.lieu_reunion || "")
          setNumPvReunion(meetingData.numpv_reunion || "")
          setIdProjet(meetingData.id_projet || null)
          setIdUtilisateur(meetingData.id_utilisateur || "1")
        } else {
          setError("Réunion non trouvée")
        }
      } catch (error) {
        console.error("Error fetching meeting details:", error)
        setError("Erreur lors du chargement de la réunion")
      } finally {
        setLoading(false)
      }
    }

    if (isEditing && meetingId) {
      fetchMeetingDetails()
    }
  }, [meetingId, isEditing])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!ordre_de_jour.trim() || !date_reunion || !lieu_reunion.trim()) {
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Créer l'objet avec tous les champs requis par l'API
      const meetingData = {
        ordre_de_jour,
        date_reunion,
        heure_re,
        lieu_reunion,
        numpv_reunion,
        id_utilisateur,
        id_projet: id_projet || 1, // Utiliser une valeur par défaut si non sélectionné
      }

      console.log("Submitting meeting data:", meetingData)

      let response
      if (isEditing && meetingId) {
        response = await reunionService.updateReunion(meetingId, meetingData)
        console.log("Update response:", response)
      } else {
        response = await reunionService.createReunion(meetingData)
        console.log("Create response:", response)
      }

      // Stocker les données dans localStorage pour les récupérer plus tard
      if (isEditing && meetingId) {
        localStorage.setItem(
          `reunion_${meetingId}`,
          JSON.stringify({
            ...meetingData,
            id_reunion: meetingId,
          }),
        )
      }

      toast({
        title: isEditing ? "Réunion modifiée" : "Réunion créée",
        description: isEditing ? "Les modifications ont été enregistrées." : "La réunion a été créée avec succès.",
      })

      navigate("/reunion")
    } catch (error) {
      console.error("Error saving meeting:", error)

      // Afficher les détails de l'erreur pour le débogage
      if (error.response && error.response.data) {
        const apiError = error.response.data
        console.error("API error details:", apiError)

        if (apiError.message) {
          setError(`Erreur: ${apiError.message}`)
        } else if (apiError.errors) {
          const errorMessages = Object.values(apiError.errors).flat().join(", ")
          setError(`Erreur: ${errorMessages}`)
        } else {
          setError(`Erreur: ${JSON.stringify(apiError)}`)
        }
      } else {
        setError("Une erreur est survenue lors de l'enregistrement de la réunion")
      }

      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la réunion.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/reunion")}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux réunions</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-8">{isEditing ? "Modifier" : "Créer"} Réunion</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {!isApiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          Mode hors ligne: Utilisation de données simulées. Les modifications ne seront pas enregistrées sur le serveur.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="ordre_de_jour" className="block text-sm font-medium text-gray-700 mb-1">
              Ordre du jour
            </label>
            <Input
              type="text"
              id="ordre_de_jour"
              value={ordre_de_jour}
              onChange={(e) => setOrdreDeJour(e.target.value)}
              className="w-full"
              placeholder="Entrez l'ordre du jour"
              required
            />
          </div>

          <div>
            <label htmlFor="lieu_reunion" className="block text-sm font-medium text-gray-700 mb-1">
              Lieu de la réunion
            </label>
            <Input
              type="text"
              id="lieu_reunion"
              value={lieu_reunion}
              onChange={(e) => setLieuReunion(e.target.value)}
              className="w-full"
              placeholder="Entrez le lieu de la réunion"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="date_reunion" className="block text-sm font-medium text-gray-700 mb-1">
              Date de la réunion
            </label>
            <Input
              type="date"
              id="date_reunion"
              value={date_reunion}
              onChange={(e) => setDateReunion(e.target.value)}
              className="w-full"
              required
            />
          </div>

          <div>
            <label htmlFor="heure_re" className="block text-sm font-medium text-gray-700 mb-1">
              Heure de la réunion
            </label>
            <Input
              type="time"
              id="heure_re"
              value={heure_re}
              onChange={(e) => setHeureRe(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="numpv_reunion" className="block text-sm font-medium text-gray-700 mb-1">
            Numéro de PV
          </label>
          <Input
            type="text"
            id="numpv_reunion"
            value={numpv_reunion}
            onChange={(e) => setNumPvReunion(e.target.value)}
            className="w-full"
            placeholder="Entrez le numéro de PV"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="id_projet" className="block text-sm font-medium text-gray-700 mb-1">
            Projet associé
          </label>
          <select
            id="id_projet"
            value={id_projet || ""}
            onChange={(e) => setIdProjet(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner un projet</option>
            {projets.map((projet) => (
              <option key={projet.id_projet} value={projet.id_projet}>
                {projet.nom_projet}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button type="button" onClick={() => navigate("/reunion")} variant="outline" disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" className="bg-[#192759] hover:bg-blue-700" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default MeetingFormPage