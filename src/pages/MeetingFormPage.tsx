<<<<<<< HEAD
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
=======
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Download, Plus, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Meeting } from '@/types/Meeting';
import { User } from '@/types/User';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type MeetingFormProps = {
  meeting?: Meeting;
  isEdit?: boolean;
};

type MeetingDocument = {
  id: string;
  title: string;
  url: string;
};

const MeetingFormPage: React.FC<MeetingFormProps> = ({ meeting, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id: meetingId } = useParams<{ id: string }>();

  const [title, setTitle] = useState(meeting?.title || '');
  const [date, setDate] = useState(meeting?.date || '');
  const [time, setTime] = useState(meeting?.time || '');
  const [location, setLocation] = useState(meeting?.location || '');
  const [description, setDescription] = useState(meeting?.description || '');
  const [pvNumber, setPvNumber] = useState(meeting?.pvNumber || '');
  const [attendeesIds, setAttendeesIds] = useState<string[]>(meeting?.attendees?.map(attendee => attendee.id) || []);
  const [documents, setDocuments] = useState<MeetingDocument[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [openAttendeesDialog, setOpenAttendeesDialog] = useState(false);
  const [selectedAttendees, setSelectedAttendees] = useState<User[]>([]);

  useEffect(() => {
    // Load all users from localStorage
    const usersString = localStorage.getItem('users');
    if (usersString) {
      try {
        const users: User[] = JSON.parse(usersString);
        setAllUsers(users);
      } catch (error) {
        console.error('Error parsing users:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Load meeting details if in edit mode
    if (meetingId) {
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings: Meeting[] = JSON.parse(meetingsString);
          const foundMeeting = meetings.find(m => m.id === meetingId);
          if (foundMeeting) {
            setTitle(foundMeeting.title);
            setDate(foundMeeting.date);
            setTime(foundMeeting.time);
            setLocation(foundMeeting.location);
            setDescription(foundMeeting.description || '');
            setPvNumber(foundMeeting.pvNumber || '');
            setAttendeesIds(foundMeeting.attendees.map(attendee => attendee.id));
            setDocuments(foundMeeting.documents || []);
          } else {
            toast({
              title: "Erreur",
              description: "Réunion non trouvée.",
              variant: "destructive",
            });
            navigate("/reunion");
          }
        } catch (error) {
          console.error('Error parsing meetings:', error);
          toast({
            title: "Erreur",
            description: "Erreur lors du chargement de la réunion.",
            variant: "destructive",
          });
          navigate("/reunion");
        }
      }
    }
  }, [meetingId, navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !date || !time || !location.trim()) {
>>>>>>> upstream/main
      toast({
        title: "Erreur",
        description: "Tous les champs obligatoires doivent être remplis.",
        variant: "destructive",
<<<<<<< HEAD
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

=======
      });
      return;
    }

    const updatedMeeting: Meeting = {
      id: meeting?.id || `meeting-${Date.now()}`,
      title,
      date,
      time,
      location,
      description,
      pvNumber,
      attendees: attendeesIds.map(id => {
        const user = allUsers.find(u => u.id === id);
        return {
          id,
          name: user?.name || 'Unknown',
          role: user?.role,
          avatar: user?.avatar
        };
      }),
      createdAt: meeting?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: documents,
    };

    try {
      const meetingsString = localStorage.getItem('meetings');
      let meetings: Meeting[] = [];

      if (meetingsString) {
        meetings = JSON.parse(meetingsString);
        if (isEdit && meetingId) {
          const index = meetings.findIndex(m => m.id === meetingId);
          if (index !== -1) {
            meetings[index] = updatedMeeting;
          } else {
            meetings.push(updatedMeeting);
          }
        } else {
          meetings.push(updatedMeeting);
        }
      } else {
        meetings = [updatedMeeting];
      }

      localStorage.setItem('meetings', JSON.stringify(meetings));

      toast({
        title: isEdit ? "Réunion modifiée" : "Réunion créée",
        description: isEdit ? "Les modifications ont été enregistrées." : "La réunion a été créée avec succès.",
      });

      navigate("/reunion");
    } catch (error) {
      console.error('Error saving meeting:', error);
>>>>>>> upstream/main
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la réunion.",
        variant: "destructive",
<<<<<<< HEAD
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>
  }
=======
      });
    }
  };

  const handleAttendeeSelect = (attendee: User) => {
    const isSelected = attendeesIds.includes(attendee.id);
    if (!isSelected) {
      setAttendeesIds([...attendeesIds, attendee.id]);
    } else {
      setAttendeesIds(attendeesIds.filter(id => id !== attendee.id));
    }
  };
>>>>>>> upstream/main

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center mb-6">
        <button
<<<<<<< HEAD
          onClick={() => navigate("/reunion")}
=======
          onClick={() => navigate('/reunion')}
>>>>>>> upstream/main
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux réunions</span>
        </button>
      </div>

<<<<<<< HEAD
      <h1 className="text-2xl font-bold mb-8">{isEditing ? "Modifier" : "Créer"} Réunion</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      {!isApiAvailable && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          Mode hors ligne: Utilisation de données simulées. Les modifications ne seront pas enregistrées sur le serveur.
        </div>
      )}
=======
      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Réunion</h1>
>>>>>>> upstream/main

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
<<<<<<< HEAD
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
=======
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Titre de la réunion
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le titre de la réunion"
>>>>>>> upstream/main
              required
            />
          </div>

          <div>
<<<<<<< HEAD
            <label htmlFor="lieu_reunion" className="block text-sm font-medium text-gray-700 mb-1">
=======
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> upstream/main
              Lieu de la réunion
            </label>
            <Input
              type="text"
<<<<<<< HEAD
              id="lieu_reunion"
              value={lieu_reunion}
              onChange={(e) => setLieuReunion(e.target.value)}
              className="w-full"
=======
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> upstream/main
              placeholder="Entrez le lieu de la réunion"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
<<<<<<< HEAD
            <label htmlFor="date_reunion" className="block text-sm font-medium text-gray-700 mb-1">
=======
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> upstream/main
              Date de la réunion
            </label>
            <Input
              type="date"
<<<<<<< HEAD
              id="date_reunion"
              value={date_reunion}
              onChange={(e) => setDateReunion(e.target.value)}
              className="w-full"
=======
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> upstream/main
              required
            />
          </div>

          <div>
<<<<<<< HEAD
            <label htmlFor="heure_re" className="block text-sm font-medium text-gray-700 mb-1">
=======
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> upstream/main
              Heure de la réunion
            </label>
            <Input
              type="time"
<<<<<<< HEAD
              id="heure_re"
              value={heure_re}
              onChange={(e) => setHeureRe(e.target.value)}
              className="w-full"
=======
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
>>>>>>> upstream/main
            />
          </div>
        </div>

        <div className="mb-6">
<<<<<<< HEAD
          <label htmlFor="numpv_reunion" className="block text-sm font-medium text-gray-700 mb-1">
=======
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description de la réunion
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez la réunion..."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="pvNumber" className="block text-sm font-medium text-gray-700 mb-1">
>>>>>>> upstream/main
            Numéro de PV
          </label>
          <Input
            type="text"
<<<<<<< HEAD
            id="numpv_reunion"
            value={numpv_reunion}
            onChange={(e) => setNumPvReunion(e.target.value)}
            className="w-full"
=======
            id="pvNumber"
            value={pvNumber}
            onChange={(e) => setPvNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
>>>>>>> upstream/main
            placeholder="Entrez le numéro de PV"
          />
        </div>

        <div className="mb-6">
<<<<<<< HEAD
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
=======
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Participants à la réunion
          </label>
          <div className="space-y-4">
            <Dialog open={openAttendeesDialog} onOpenChange={setOpenAttendeesDialog}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter des participants
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[475px]">
                <DialogHeader>
                  <DialogTitle>Sélectionner les participants</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {allUsers.map(user => (
                    <div key={user.id} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`attendee-${user.id}`}
                        checked={attendeesIds.includes(user.id)}
                        onChange={() => handleAttendeeSelect(user)}
                      />
                      <label
                        htmlFor={`attendee-${user.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {user.name}
                      </label>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => setOpenAttendeesDialog(false)}>
                  Fermer
                </Button>
              </DialogContent>
            </Dialog>

            {attendeesIds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {attendeesIds.map(attendeeId => {
                  const attendee = allUsers.find(user => user.id === attendeeId);
                  return attendee ? (
                    <div key={attendee.id} className="flex items-center space-x-2 bg-gray-100 p-3 rounded-md">
                      <img
                        src={attendee.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={attendee.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{attendee.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Aucun participant sélectionné
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            onClick={() => navigate('/reunion')}
            variant="outline"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-[#192759] hover:bg-blue-700">
            Enregistrer
>>>>>>> upstream/main
          </Button>
        </div>
      </form>
    </div>
<<<<<<< HEAD
  )
}

export default MeetingFormPage
=======
  );
};

export default MeetingFormPage;
>>>>>>> upstream/main
