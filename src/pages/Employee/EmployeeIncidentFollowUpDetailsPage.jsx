
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';

const EmployeeIncidentFollowUpDetailsPage = () => {
  const { incidentId, followUpId } = useParams();
  const navigate = useNavigate();
  const [followUp, setFollowUp] = useState(null);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    // Load incident data
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents && incidentId) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find(inc => inc.id === incidentId);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }

    // Load follow-up data
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps && followUpId) {
      try {
        const followUps = JSON.parse(storedFollowUps);
        const foundFollowUp = followUps.find(fu => fu.id === followUpId);
        if (foundFollowUp) {
          setFollowUp(foundFollowUp);
        }
      } catch (error) {
        console.error("Error loading follow-up:", error);
      }
    }
  }, [incidentId, followUpId]);

  if (!followUp || !incident) {
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
          onClick={() => navigate(`/employee/incidents/suivis/${incidentId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du suivi d'incident</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Information du suivi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type d'incident</h3>
                <p className="mt-1 font-medium">{incident.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date du signalement</h3>
                <p className="mt-1">{followUp.reportDate}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 whitespace-pre-wrap">{followUp.description}</p>
            </div>
            
            {followUp.documents && followUp.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Documents</h3>
                <ul className="mt-2 space-y-2">
                  {followUp.documents.map((doc, index) => (
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

export default EmployeeIncidentFollowUpDetailsPage;
