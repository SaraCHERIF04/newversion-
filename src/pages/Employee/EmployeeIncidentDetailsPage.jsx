
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, MessageSquare } from 'lucide-react';

const EmployeeIncidentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    // Load incident data from localStorage
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents && id) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find(inc => inc.id === id);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }
  }, [id]);

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Chargement des données...</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Information de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="mt-1 font-medium">{incident.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Signalé par</h3>
              <p className="mt-1">{incident.signaledBy}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date et heure</h3>
              <p className="mt-1">{incident.date} à {incident.time}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
              <p className="mt-1">{incident.location}</p>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/employee/incidents/suivis/${id}`)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Voir les suivis
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Détails de l'incident</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Projet</h3>
              <p className="mt-1">{incident.projectName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sous-projet</h3>
              <p className="mt-1">{incident.subProjectName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{incident.description}</p>
            </div>
            
            {incident.documents && incident.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Documents</h3>
                <ul className="mt-2 space-y-2">
                  {incident.documents.map((doc, index) => (
                    <li key={index} className="flex items-center p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{doc.name || `Document ${index + 1}`}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeIncidentDetailsPage;
