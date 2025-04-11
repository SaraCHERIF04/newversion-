
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Incident } from '@/types/Incident';

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

const ResponsableIncidentFollowUpsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [followUps, setFollowUps] = useState<IncidentFollowUp[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load incident
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

    // Load follow-ups
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps && id) {
      try {
        const allFollowUps = JSON.parse(storedFollowUps);
        const incidentFollowUps = allFollowUps.filter((followUp: IncidentFollowUp) => followUp.incidentId === id);
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

  const filteredFollowUps = activeTab === 'all' 
    ? followUps 
    : followUps.filter(followUp => followUp.status.toLowerCase() === activeTab);

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

  const handleViewFollowUpDetails = (followUpId: string) => {
    navigate(`/responsable/incidents/suivis/${id}/${followUpId}`);
  };

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
        <div>
          <h1 className="text-2xl font-bold">Suivis de l'incident</h1>
          <p className="text-gray-600">{incident.type}</p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="en cours">En cours</TabsTrigger>
          <TabsTrigger value="résolu">Résolu</TabsTrigger>
          <TabsTrigger value="en attente">En attente</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {filteredFollowUps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Aucun suivi trouvé pour cet incident.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp) => (
                <Card key={followUp.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{followUp.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {followUp.assignedTo && `Assigné à: ${followUp.assignedTo}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                          {followUp.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFollowUpDetails(followUp.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-2">{followUp.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{followUp.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="en cours" className="mt-0">
          {/* Same content structure as "all" tab but with filtered data */}
          {filteredFollowUps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Aucun suivi "En cours" trouvé pour cet incident.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp) => (
                <Card key={followUp.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{followUp.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {followUp.assignedTo && `Assigné à: ${followUp.assignedTo}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                          {followUp.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFollowUpDetails(followUp.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-2">{followUp.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{followUp.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Repeat similar structure for "résolu" and "en attente" tabs */}
        <TabsContent value="résolu" className="mt-0">
          {filteredFollowUps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Aucun suivi "Résolu" trouvé pour cet incident.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp) => (
                <Card key={followUp.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{followUp.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {followUp.assignedTo && `Assigné à: ${followUp.assignedTo}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                          {followUp.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFollowUpDetails(followUp.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-2">{followUp.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{followUp.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="en attente" className="mt-0">
          {filteredFollowUps.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Aucun suivi "En attente" trouvé pour cet incident.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredFollowUps.map((followUp) => (
                <Card key={followUp.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{followUp.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {followUp.assignedTo && `Assigné à: ${followUp.assignedTo}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(followUp.status)}`}>
                          {followUp.status}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewFollowUpDetails(followUp.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4 line-clamp-2">{followUp.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{followUp.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponsableIncidentFollowUpsPage;
