
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EmployeeReunionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reunion, setReunion] = useState(null);

  useEffect(() => {
    // Load the reunion from localStorage
    const reunionsString = localStorage.getItem('meetings');
    if (reunionsString && id) {
      try {
        const reunions = JSON.parse(reunionsString);
        const foundReunion = reunions.find(r => r.id === id);
        if (foundReunion) {
          setReunion(foundReunion);
        }
      } catch (error) {
        console.error('Error loading reunion:', error);
      }
    }
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (!reunion) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Réunion non trouvée</h1>
        <p className="mb-6">La réunion que vous recherchez n'existe pas ou a été supprimée.</p>
        <Button onClick={() => navigate('/employee/reunions')}>
          Retourner à la liste des réunions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Détails de la réunion</h1>
        <Button variant="outline" onClick={() => navigate('/employee/reunions')}>
          Retour à la liste
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{reunion.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p>{formatDate(reunion.date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Heure</h3>
              <p>{reunion.time || '-'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
            <p>{reunion.location}</p>
          </div>
          
          {reunion.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1 whitespace-pre-line">{reunion.description}</p>
            </div>
          )}
          
          {reunion.participants && reunion.participants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
              <div className="grid grid-cols-2 gap-2">
                {reunion.participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md border border-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar || ''} />
                      <AvatarFallback>{participant.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {reunion.agenda && reunion.agenda.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Ordre du jour</h3>
              <ul className="list-disc pl-5 space-y-1">
                {reunion.agenda.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {reunion.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 whitespace-pre-line">{reunion.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReunionDetailsPage;
