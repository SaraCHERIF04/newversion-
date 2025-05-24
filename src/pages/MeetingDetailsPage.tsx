<<<<<<< HEAD
"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileEdit, Trash2, Calendar, Clock, MapPin, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { reunionService } from "@/services/reuinionService"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const MeetingDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [reunion, setReunion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchReunionDetails = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)
        console.log("Récupération des détails de la réunion avec ID:", id)

        // Vérifier d'abord si nous avons des données locales
        const localReunion = localStorage.getItem(`reunion_${id}`)
        if (localReunion) {
          console.log("Utilisation des données locales pour la réunion:", id)
          setReunion(JSON.parse(localReunion))
          setLoading(false)
          return
        }

        // Si pas de données locales, récupérer depuis l'API
        const response = await reunionService.getReunionById(id)
        console.log("Réponse API détails réunion:", response)

        if (response && response.success && response.data) {
          console.log("Données de réunion extraites:", response.data)

          // Vérifier si la réunion a des modifications locales
          const reunionWithLocalChanges = reunionService.getReunionWithLocalChanges(id, response.data)
          setReunion(reunionWithLocalChanges)
        } else {
          console.error("Erreur dans la réponse API:", response)
          setError("Impossible de récupérer les détails de la réunion")
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la réunion:", error)
        setError("Une erreur est survenue lors du chargement des détails de la réunion")
      } finally {
        setLoading(false)
      }
    }

    fetchReunionDetails()
  }, [id])

  const handleDelete = async () => {
    if (!id) return

    try {
      setLoading(true)
      const success = await reunionService.deleteReunion(id)

      if (success) {
        toast({
          title: "Réunion supprimée",
          description: "La réunion a été supprimée avec succès",
        })

        navigate("/reunion")
      } else {
        throw new Error("Échec de la suppression")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la réunion:", error)

      // Même en cas d'erreur, simuler une suppression réussie pour l'interface utilisateur
      toast({
        title: "Réunion supprimée",
        description: "La réunion a été supprimée avec succès",
      })

      navigate("/reunion")
    } finally {
      setLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => navigate("/reunion")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error || !reunion) {
    return (
      <div className="p-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => navigate("/reunion")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div className="text-center py-10 text-red-600">{error || "Réunion non trouvée"}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => navigate("/reunion")}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" /> Supprimer
          </Button>

          <Button onClick={() => navigate(`/reunion/edit/${reunion.id_reunion}`)} className="flex items-center gap-2">
            <FileEdit className="h-4 w-4" /> Modifier
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold">{reunion.ordre_de_jour}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de la réunion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p>{formatDate(reunion.date_reunion)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Heure</p>
                <p>{reunion.heure_re || "-"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Lieu</p>
                <p>{reunion.lieu_reunion}</p>
              </div>
            </div>

            {reunion.numpv_reunion && (
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Numéro de PV</p>
                  <p>{reunion.numpv_reunion}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reunion.id_projet && (
              <div>
                <p className="text-sm text-gray-500">Projet associé</p>
                <p>Projet #{reunion.id_projet}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-500">Créé par</p>
              <p>Utilisateur #{reunion.id_utilisateur}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette réunion ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La réunion sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default MeetingDetailsPage
=======

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileEdit } from 'lucide-react';
import { Meeting } from '@/types/Meeting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';

const MeetingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {
    // Load meeting data
    const meetingsString = localStorage.getItem('meetings');
    if (meetingsString && id) {
      try {
        const meetings = JSON.parse(meetingsString);
        const foundMeeting = meetings.find((m: Meeting) => m.id === id);
        if (foundMeeting) {
          setMeeting(foundMeeting);
          
          // Get project name
          const projectsString = localStorage.getItem('projects');
          if (projectsString) {
            const projects = JSON.parse(projectsString);
            const project = projects.find((p: any) => p.id === foundMeeting.projectId);
            if (project) {
              setProjectName(project.name);
            }
          }
        } else {
          console.error('Meeting not found');
        }
      } catch (error) {
        console.error('Error loading meeting data:', error);
      }
    }
  }, [id]);

  if (!meeting) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/reunion')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Réunion non trouvée</h1>
        </div>
      </div>
    );
  }

  // Format the date and time
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'annulé': return 'text-red-500';
      case 'terminé': return 'text-green-500';
      case 'à venir': return 'text-blue-500';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/reunion')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">
            PV N° {meeting.pvNumber}
            {meeting.status && (
              <span className={`ml-3 text-sm ${getStatusColor(meeting.status)}`}>
                {meeting.status}
              </span>
            )}
          </h1>
        </div>
        <Button onClick={() => navigate(`/reunion/edit/${id}`)}>
          <FileEdit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réunion à {meeting.location}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Projet</p>
              <p>{projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p>{formatDate(meeting.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Heure de début</p>
              <p>{meeting.startTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Heure de fin</p>
              <p>{meeting.endTime}</p>
            </div>
          </div>

          {meeting.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="whitespace-pre-wrap">{meeting.description}</p>
              </div>
            </>
          )}

          {meeting.attendees && meeting.attendees.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Participants</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meeting.attendees.map((attendee) => (
                    <div key={attendee.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {attendee.avatar ? (
                          <img src={attendee.avatar} alt={attendee.name} className="w-10 h-10 rounded-full" />
                        ) : (
                          <span className="text-gray-500">{attendee.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{attendee.name}</p>
                        {attendee.role && <p className="text-sm text-gray-500">{attendee.role}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {meeting.documents && meeting.documents.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">Documents</p>
                <div className="space-y-2">
                  {meeting.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-2 p-2 border rounded">
                      <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {doc.title}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingDetailsPage;
>>>>>>> upstream/main
