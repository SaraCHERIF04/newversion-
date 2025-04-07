
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileEdit, Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Meeting } from '@/types/Meeting';

const MeetingDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      // Load meeting
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings = JSON.parse(meetingsString);
          const foundMeeting = meetings.find((meeting: Meeting) => meeting.id === id);
          if (foundMeeting) {
            setMeeting(foundMeeting);
            
            // Get project name
            if (foundMeeting.projectId) {
              const projectsString = localStorage.getItem('projects');
              if (projectsString) {
                const projects = JSON.parse(projectsString);
                const project = projects.find((p: any) => p.id === foundMeeting.projectId);
                if (project) {
                  setProjectName(project.name);
                }
              }
            }
          } else {
            navigate('/reunion');
          }
        } catch (error) {
          console.error('Error loading meeting:', error);
          navigate('/reunion');
        }
      } else {
        navigate('/reunion');
      }
    }
  }, [id, navigate]);
  
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
  
  const printMeeting = () => {
    window.print();
  };
  
  const downloadDocument = (doc: {id: string, title: string, url: string}) => {
    if (doc.url) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error('Document URL is missing');
    }
  };
  
  if (!meeting) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/reunion')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux réunions</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Numéro PV réunion</h1>
            <p className="text-lg mt-1">{meeting.pvNumber}</p>
          </div>
          <div className="flex space-x-3">
            <span className={`px-3 py-1 ${getStatusClass(meeting.status)} rounded-full text-sm font-medium`}>
              {meeting.status || 'à venir'}
            </span>
            <Button 
              onClick={() => navigate(`/reunion/edit/${meeting.id}`)}
              variant="outline"
              className="flex items-center"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button 
              onClick={printMeeting}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-medium mb-4">Informations de la réunion</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Lieu</div>
                <div className="font-medium">{meeting.location}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Projet</div>
                <div className="font-medium">{projectName || 'Non associé'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">{formatDate(meeting.date)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Heure</div>
                <div className="font-medium">{meeting.startTime} - {meeting.endTime}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium mb-4">Description</h2>
            <div className="p-4 bg-gray-50 rounded-md min-h-[150px]">
              {meeting.description || 'Aucune description disponible.'}
            </div>
          </div>
        </div>
        
        {/* Membres présents */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Membres du projet</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {meeting.attendees && meeting.attendees.length > 0 ? (
              meeting.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-md">
                  <img 
                    src={attendee.avatar} 
                    alt={attendee.name} 
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{attendee.name}</div>
                    {attendee.role && <div className="text-xs text-gray-500">{attendee.role}</div>}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Aucun membre présent
              </div>
            )}
          </div>
        </div>
        
        {/* Documents */}
        {meeting.documents && meeting.documents.length > 0 && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Documents</h2>
            <div className="space-y-2">
              {meeting.documents.map((doc, index) => (
                <div key={index} className="p-3 bg-blue-50 text-blue-600 rounded-md flex justify-between items-center">
                  <span>{doc.title}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => downloadDocument(doc)}
                    className="text-blue-700 hover:text-blue-900"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetailsPage;
