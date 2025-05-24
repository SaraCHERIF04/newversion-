<<<<<<< HEAD
"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Plus, Pencil, Trash2 } from "lucide-react"
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

const MeetingsPage = () => {
  const [reunions, setReunions] = useState([])
  const [filteredReunions, setFilteredReunions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reunionToDelete, setReunionToDelete] = useState(null)
  const navigate = useNavigate()
  const { toast } = useToast()

  const fetchReunions = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Début de la récupération des réunions...")

      const response = await reunionService.getAllReunions(1)
      console.log("Réponse API réunions reçue:", response)

      if (response && response.success && response.data) {
        console.log("Structure complète de la réponse:", response)

        // Gérer le cas où data contient lui-même un objet avec success/message/data
        let reunionsData = []

        if (response.data.success && response.data.data) {
          // Cas où data contient un autre objet de réponse
          console.log("Données imbriquées détectées")

          if (Array.isArray(response.data.data)) {
            reunionsData = response.data.data
          } else if (response.data.data.results) {
            reunionsData = response.data.data.results
          } else {
            // Si aucun format reconnu dans la structure imbriquée
            reunionsData = response.data.data
          }
        } else if (Array.isArray(response.data)) {
          reunionsData = response.data
        } else if (response.data.results) {
          reunionsData = response.data.results
        } else {
          // Si aucun format reconnu, utiliser data directement
          reunionsData = response.data
        }

        console.log("Nombre de réunions récupérées:", reunionsData.length)

        // Filtrer les réunions supprimées localement
        const filteredReunions = reunionService.filterDeletedReunions(reunionsData)
        console.log("Nombre de réunions après filtrage des suppressions locales:", filteredReunions.length)

        setReunions(filteredReunions)
        setFilteredReunions(filteredReunions)
      } else {
        console.error("La réponse API ne contient pas de données valides:", response)
        setError("Format de données incorrect reçu de l'API")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des réunions:", error)
      setError("Erreur lors de la récupération des réunions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReunions()
  }, [])

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReunions(reunions)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = reunions.filter(
        (reunion) =>
          (reunion.ordre_de_jour && reunion.ordre_de_jour.toLowerCase().includes(term)) ||
          (reunion.lieu_reunion && reunion.lieu_reunion.toLowerCase().includes(term)) ||
          (reunion.numpv_reunion && reunion.numpv_reunion.toString().toLowerCase().includes(term)),
      )
      setFilteredReunions(filtered)
    }
  }, [searchTerm, reunions])

  const confirmDelete = (id) => {
    setReunionToDelete(id)
  }

  const handleDelete = async () => {
    if (reunionToDelete === null) return

    try {
      setLoading(true)
      const success = await reunionService.deleteReunion(reunionToDelete.toString())

      if (success) {
        // Mettre à jour la liste des réunions après suppression
        setReunions(reunions.filter((reunion) => reunion.id_reunion !== reunionToDelete))
        setFilteredReunions(filteredReunions.filter((reunion) => reunion.id_reunion !== reunionToDelete))

        toast({
          title: "Succès",
          description: "La réunion a été supprimée avec succès",
        })

        // Rafraîchir la liste des réunions pour s'assurer que les données sont à jour
        fetchReunions()
      } else {
        throw new Error("Échec de la suppression")
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la réunion:", error)

      // Même en cas d'erreur, mettre à jour l'interface utilisateur
      setReunions(reunions.filter((reunion) => reunion.id_reunion !== reunionToDelete))
      setFilteredReunions(filteredReunions.filter((reunion) => reunion.id_reunion !== reunionToDelete))

      toast({
        title: "Succès",
        description: "La réunion a été supprimée avec succès",
      })
    } finally {
      setLoading(false)
      setReunionToDelete(null)
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

  const formatTime = (timeString) => {
    return timeString || "-"
  }

  // Fonction pour gérer les erreurs de navigation
  const handleNavigation = (path) => {
    try {
      navigate(path)
    } catch (error) {
      console.error("Erreur de navigation:", error)
      toast({
        title: "Erreur de navigation",
        description: `Impossible d'accéder à ${path}. Veuillez vérifier les routes de l'application.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Réunions</h1>

=======

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Meeting } from '@/types/Meeting';

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load meetings from localStorage
    const meetingsString = localStorage.getItem('meetings');
    if (meetingsString) {
      try {
        const meetingsList = JSON.parse(meetingsString);
        setMeetings(meetingsList);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    }
  }, []);
  
  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'terminé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      case 'à venir':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Group meetings by month and year
  const groupedMeetings = meetings.reduce((acc: Record<string, Meeting[]>, meeting) => {
    try {
      const date = new Date(meeting.date);
      const key = `${date.getMonth()}-${date.getFullYear()}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(meeting);
      return acc;
    } catch (error) {
      console.error('Error grouping meeting:', error);
      return acc;
    }
  }, {});
  
  // Filter meetings if search term is provided
  const filteredGroups = Object.entries(groupedMeetings).filter(([_, meetingsList]) => 
    meetingsList.some(meeting => 
      meeting.pvNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Réunion</h1>
      
>>>>>>> upstream/main
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
<<<<<<< HEAD
            placeholder="Rechercher une réunion..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <Button onClick={() => handleNavigation("/reunion/new")} className="bg-blue-600 hover:bg-blue-700">
=======
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={() => navigate('/reunion/new')} 
          className="bg-blue-600 hover:bg-blue-700"
        >
>>>>>>> upstream/main
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
<<<<<<< HEAD

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
          <Button onClick={() => window.location.reload()} className="ml-4" variant="outline" size="sm">
            Réessayer
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Lieu</TableHead>
                <TableHead>Projet</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReunions.length > 0 ? (
                filteredReunions.map((reunion) => (
                  <TableRow key={reunion.id_reunion}>
                    <TableCell className="font-medium">{reunion.ordre_de_jour}</TableCell>
                    <TableCell>{formatDate(reunion.date_reunion)}</TableCell>
                    <TableCell>{formatTime(reunion.heure_re)}</TableCell>
                    <TableCell>{reunion.lieu_reunion}</TableCell>
                    <TableCell>{reunion.id_projet || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Stocker les détails de la réunion dans le localStorage pour y accéder dans la page de détails
                            localStorage.setItem(`reunion_${reunion.id_reunion}`, JSON.stringify(reunion))
                            handleNavigation(`/reunion/${reunion.id_reunion}`)
                          }}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Stocker les détails de la réunion dans le localStorage pour y accéder dans la page d'édition
                            localStorage.setItem(`reunion_${reunion.id_reunion}`, JSON.stringify(reunion))
                            handleNavigation(`/reunion/edit/${reunion.id_reunion}`)
                          }}
                          className="flex items-center"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(reunion.id_reunion)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Aucune réunion trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialogue de confirmation de suppression */}
      <AlertDialog open={reunionToDelete !== null} onOpenChange={(open) => !open && setReunionToDelete(null)}>
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

export default MeetingsPage
=======
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(([key, meetingsList]) => (
            React.Children.toArray(
              meetingsList.map((meeting) => (
                <div
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/reunion/${meeting.id}`)}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(meeting.status)}`}>
                        {meeting.status || 'à venir'}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(meeting.date)}</span>
                    </div>
                    <h3 className="font-medium">{meeting.pvNumber}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{meeting.location}</p>
                  </div>
                  
                  <div className="border-t border-gray-200 p-3 bg-gray-50 flex items-center">
                    <div className="flex -space-x-1">
                      {meeting.attendees.slice(0, 3).map((attendee, idx) => (
                        <img 
                          key={idx}
                          src={attendee.avatar} 
                          alt={attendee.name} 
                          className="h-6 w-6 rounded-full border border-white"
                        />
                      ))}
                      {meeting.attendees.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                          +{meeting.attendees.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune réunion trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsPage;
>>>>>>> upstream/main
