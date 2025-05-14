import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@/types/Meeting';

const FinancierReunionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  
  useEffect(() => {
    const meetingsData = localStorage.getItem('meetings');
    if (meetingsData && id) {
      const meetings = JSON.parse(meetingsData);
      const meetingData = meetings.find((m: Meeting) => m.id === id);
      setMeeting(meetingData || null);
    }
  }, [id]);

  if (!meeting) {
    return <div>Réunion non trouvée</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={() => navigate('/financier/reunions')}
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <h1 className="text-2xl font-bold">{meeting.title}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails de la réunion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Date et heure</p>
              <p>{meeting.date} à {meeting.time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Lieu</p>
              <p>{meeting.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Numéro PV</p>
              <p>{meeting.pvNumber || 'Non défini'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations complémentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{meeting.description || 'Aucune description'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              {Array.isArray(meeting.attendees) ? 
                meeting.attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center space-x-2">
                    <img 
                      src={attendee.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                      alt={attendee.name} 
                      className="h-8 w-8 rounded-full"
                    />
                    <span>{attendee.name}</span>
                    {attendee.role && <span className="text-sm text-gray-500">({attendee.role})</span>}
                  </div>
                ))
                : meeting.attendees
              }
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancierReunionDetailsPage;
