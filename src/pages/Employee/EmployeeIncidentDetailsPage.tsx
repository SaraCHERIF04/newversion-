
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Incident } from '@/types/Incident';

const EmployeeIncidentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);

  useEffect(() => {
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents && id) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find((inc: Incident) => inc.id === id);
        if (foundIncident) {
          setIncident(foundIncident);
        } else {
          console.error('Incident not found');
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }
  }, [id]);

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/employee/incidents')}
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
          onClick={() => navigate('/employee/incidents')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails de l'incident</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Type d'incident</h3>
            <p className="text-lg font-medium">{incident.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Signalé par</h3>
            <p className="text-lg font-medium">{incident.signaledBy}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Projet</h3>
            <p className="text-lg font-medium">{incident.projectName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Sous-projet</h3>
            <p className="text-lg font-medium">{incident.subProjectName}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Lieu</h3>
            <p className="text-lg font-medium">{incident.location}</p>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
              <p className="text-lg font-medium">{incident.date}</p>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Heure</h3>
              <p className="text-lg font-medium">{incident.time}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{incident.description}</p>
          </div>
        </div>

        {incident.documents && incident.documents.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Documents</h3>
            <ul className="space-y-2">
              {incident.documents.map((doc: any, index: number) => (
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

export default EmployeeIncidentDetailsPage;
