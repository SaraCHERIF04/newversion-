
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, FileText } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Incident } from '@/types/Incident';
import { useSearchQuery } from '@/components/Layout/MainLayout';

interface IncidentFollowUp {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  status: 'En cours' | 'Résolu' | 'En attente';
  assignedTo?: string;
  date: string;
  reportDate?: string;
  createdAt: string;
  documents?: any[];
}

const ResponsableIncidentFollowUpsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [followUps, setFollowUps] = useState<IncidentFollowUp[]>([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState<IncidentFollowUp[]>([]);
  const { searchQuery } = useSearchQuery();

  useEffect(() => {
    // Load incident data
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents && id) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find((inc: Incident) => inc.id === id);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }

    // Load follow-ups data
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps && id) {
      try {
        const allFollowUps = JSON.parse(storedFollowUps);
        const incidentFollowUps = allFollowUps.filter(
          (followUp: IncidentFollowUp) => followUp.incidentId === id
        );
        setFollowUps(incidentFollowUps);
      } catch (error) {
        console.error("Error loading follow-ups:", error);
      }
    } else if (id) {
      // Create demo data if none exists
      const demoFollowUps: IncidentFollowUp[] = [
        {
          id: `follow-1-${id}`,
          incidentId: id,
          title: "Première intervention",
          description: "Nous avons commencé à analyser l'incident et à identifier les causes potentielles.",
          status: "En cours",
          assignedTo: "Jean Martin",
          date: "20/01/2024",
          reportDate: "20/01/2024",
          createdAt: new Date().toISOString(),
        },
        {
          id: `follow-2-${id}`,
          incidentId: id,
          title: "Mise à jour de l'intervention",
          description: "Nous avons identifié la source du problème et commencé à mettre en œuvre une solution.",
          status: "En cours",
          assignedTo: "Marie Dupont",
          date: "25/01/2024",
          reportDate: "25/01/2024",
          createdAt: new Date().toISOString(),
        },
        {
          id: `follow-3-${id}`,
          incidentId: id,
          title: "Résolution de l'incident",
          description: "Le problème a été résolu et nous avons mis en place des mesures pour éviter qu'il ne se reproduise.",
          status: "Résolu",
          assignedTo: "Jean Martin",
          date: "01/02/2024",
          reportDate: "01/02/2024",
          createdAt: new Date().toISOString(),
        }
      ];
      
      // Get all follow-ups if they exist
      const allFollowUps = storedFollowUps ? JSON.parse(storedFollowUps) : [];
      const updatedFollowUps = [...allFollowUps, ...demoFollowUps];
      
      localStorage.setItem('incidentFollowUps', JSON.stringify(updatedFollowUps));
      setFollowUps(demoFollowUps);
    }
  }, [id]);

  // Filter follow-ups based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredFollowUps(followUps);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = followUps.filter(followUp => 
      followUp.title.toLowerCase().includes(lowerCaseQuery) ||
      followUp.description.toLowerCase().includes(lowerCaseQuery) ||
      followUp.status.toLowerCase().includes(lowerCaseQuery) ||
      (followUp.assignedTo && followUp.assignedTo.toLowerCase().includes(lowerCaseQuery))
    );
    
    setFilteredFollowUps(filtered);
  }, [searchQuery, followUps]);

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/responsable/incidents')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Incident non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/responsable/incidents/${id}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          Suivis d'incident - {incident.type}
        </h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Liste des suivis</h2>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Assigné à</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFollowUps.length > 0 ? (
                filteredFollowUps.map((followUp, index) => (
                  <TableRow key={followUp.id} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <TableCell>{followUp.reportDate || followUp.date}</TableCell>
                    <TableCell className="font-medium">{followUp.title}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          followUp.status === 'Résolu' 
                            ? 'bg-green-100 text-green-800' 
                            : followUp.status === 'En attente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {followUp.status}
                      </span>
                    </TableCell>
                    <TableCell>{followUp.assignedTo || 'Non assigné'}</TableCell>
                    <TableCell>
                      {followUp.documents && followUp.documents.length ? (
                        <div className="flex items-center text-blue-600">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{followUp.documents.length}</span>
                        </div>
                      ) : (
                        'Aucun'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/responsable/incidents/suivis/${id}/${followUp.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    {searchQuery ? 'Aucun suivi ne correspond à votre recherche' : 'Aucun suivi d\'incident trouvé'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ResponsableIncidentFollowUpsPage;
