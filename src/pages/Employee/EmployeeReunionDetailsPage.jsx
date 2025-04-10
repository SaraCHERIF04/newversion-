
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Clock, Calendar, MapPin, User, ArrowLeft } from 'lucide-react';

const EmployeeReunionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reunion, setReunion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReunion = () => {
      setLoading(true);
      try {
        // Load from localStorage
        const reunionsString = localStorage.getItem('meetings');
        if (reunionsString) {
          const reunions = JSON.parse(reunionsString);
          const foundReunion = reunions.find(r => r.id === id);
          if (foundReunion) {
            setReunion(foundReunion);
          } else {
            toast({
              title: "Réunion non trouvée",
              description: "La réunion que vous cherchez n'existe pas ou a été supprimée.",
              variant: "destructive"
            });
            navigate('/employee/reunions');
          }
        } else {
          toast({
            title: "Données non disponibles",
            description: "Impossible de charger les données des réunions.",
            variant: "destructive"
          });
          navigate('/employee/reunions');
        }
      } catch (error) {
        console.error("Error loading reunion:", error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite lors du chargement des données.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadReunion();
  }, [id, navigate, toast]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
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

  const formatTime = (timeString) => {
    return timeString || '-';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!reunion) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Réunion non trouvée
        </div>
        <Button asChild className="mt-4">
          <Link to="/employee/reunions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex items-center justify-between">
        <Button asChild variant="outline">
          <Link to="/employee/reunions">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{reunion.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">Date:</span>
                <span className="ml-2">{formatDate(reunion.date)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">Heure:</span>
                <span className="ml-2">{formatTime(reunion.time)}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                <span className="text-gray-700 font-medium">Lieu:</span>
                <span className="ml-2">{reunion.location || '-'}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <span className="text-gray-700 font-medium flex items-center">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  Participants:
                </span>
                {reunion.participants && reunion.participants.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {reunion.participants.map((participant, index) => (
                      <div key={`${participant.id || index}-${index}`} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={participant.avatar || 'https://via.placeholder.com/40'} alt={participant.name} />
                          <AvatarFallback>{participant.name?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <span>{participant.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-2">Aucun participant</div>
                )}
              </div>
            </div>
          </div>

          {reunion.description && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                {reunion.description}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReunionDetailsPage;
