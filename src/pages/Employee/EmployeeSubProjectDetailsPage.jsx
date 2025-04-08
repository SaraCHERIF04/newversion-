
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const EmployeeSubProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch subproject details
    const fetchSubProject = () => {
      setLoading(true);
      try {
        // Get subprojects from localStorage
        const subProjectsString = localStorage.getItem('subProjects');
        if (subProjectsString) {
          const subProjects = JSON.parse(subProjectsString);
          const foundSubProject = subProjects.find(sp => sp.id === id);
          if (foundSubProject) {
            setSubProject(foundSubProject);
          } else {
            // SubProject not found
            console.error('SubProject not found');
          }
        }
      } catch (error) {
        console.error('Error fetching subproject:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubProject();
  }, [id]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }
  
  if (!subProject) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">Sous-projet non trouvé</p>
        <Button onClick={() => navigate('/employee/sous-projets')}>
          Retour aux sous-projets
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{subProject.name}</h1>
          <p className="text-gray-500">{subProject.description}</p>
        </div>
        <div className="flex space-x-2">
          {/* Read-only view for employees - no edit or delete buttons */}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">État du sous-projet</h3>
          </CardHeader>
          <CardContent>
            <Badge 
              className={`${
                subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                subProject.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {subProject.status}
            </Badge>
            <p className="mt-4 text-sm text-gray-500">
              Échéance: {subProject.deadline || 'Non définie'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Détails</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Projet parent:</span>
              <span className="text-sm font-medium">{subProject.parentProjectName || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Chef de sous-projet:</span>
              <span className="text-sm font-medium">{subProject.chef || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Budget:</span>
              <span className="text-sm font-medium">{subProject.budget || 'Non défini'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date début:</span>
              <span className="text-sm font-medium">{subProject.startDate || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date fin:</span>
              <span className="text-sm font-medium">{subProject.endDate || 'Non définie'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Équipe</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {subProject.members && subProject.members.length > 0 ? (
                subProject.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun membre assigné</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reunions">Réunions</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Documents du sous-projet</h3>
              </div>
              <div className="space-y-4">
                {/* Display documents (read-only) */}
                <p className="text-gray-500">Vue des documents (lecture seule)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reunions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Réunions du sous-projet</h3>
              </div>
              <div className="space-y-4">
                {/* Display meetings (read-only) */}
                <p className="text-gray-500">Vue des réunions (lecture seule)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeSubProjectDetailsPage;
