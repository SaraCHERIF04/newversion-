
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface IncidentFollowUp {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  status: 'En cours' | 'Résolu' | 'En attente';
  assignedTo?: string;
  date: string;
  createdAt: string;
  documents?: any[];
}

const ResponsableIncidentFollowUpDetailsPage: React.FC = () => {
  const { incidentId, followUpId } = useParams<{ incidentId: string; followUpId: string }>();
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState<IncidentFollowUp | null>(null);

  useEffect(() => {
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps && followUpId) {
      try {
        const followUps = JSON.parse(storedFollowUps);
        const foundFollowUp = followUps.find((fu: IncidentFollowUp) => fu.id === followUpId);
        if (foundFollowUp) {
          setFollowUp(foundFollowUp);
        } else {
          console.error('Follow-up not found');
        }
      } catch (error) {
        console.error("Error loading follow-up:", error);
      }
    }
  }, [followUpId]);

  if (!followUp) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/responsable/incidents/suivis/${incidentId}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Suivi non trouvé</h1>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Résolu':
        return 'bg-green-100 text-green-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/responsable/incidents/suivis/${incidentId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du suivi</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-semibold mb-2">{followUp.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(followUp.status)}`}>
              {followUp.status}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{followUp.date}</span>
            </div>
            {followUp.assignedTo && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{followUp.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{followUp.description}</p>
          </div>
        </div>

        {followUp.documents && followUp.documents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
            <ul className="space-y-2">
              {followUp.documents.map((doc, index) => (
                <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
                  <span>{doc.name || `Document ${index + 1}`}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsableIncidentFollowUpDetailsPage;
