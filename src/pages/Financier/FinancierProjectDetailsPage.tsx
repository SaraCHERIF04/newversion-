
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Project = {
  id: string;
  name: string;
  description?: string;
  status: string;
  chef?: string;
  region?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
};

const FinancierProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  
  useEffect(() => {
    const projectsData = localStorage.getItem('projects');
    if (projectsData && id) {
      const projects = JSON.parse(projectsData);
      const projectData = projects.find((p: Project) => p.id === id);
      setProject(projectData || null);
    }
  }, [id]);

  if (!project) {
    return <div>Projet non trouvé</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={() => navigate('/financier/projects')}
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <h1 className="text-2xl font-bold">{project.name}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails du projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{project.description || 'Aucune description'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p>{project.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chef de projet</p>
              <p>{project.chef || 'Non assigné'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Information financière</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p>{project.budget || 'Non défini'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p>{project.startDate || 'Non définie'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de fin</p>
              <p>{project.endDate || 'Non définie'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancierProjectDetailsPage;
