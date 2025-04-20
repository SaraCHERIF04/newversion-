
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SubProject = {
  id: string;
  name: string;
  description?: string;
  status: string;
  projectId: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
};

const FinancierSubProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState<SubProject | null>(null);
  
  useEffect(() => {
    const subProjectsData = localStorage.getItem('subProjects');
    if (subProjectsData && id) {
      const subProjects = JSON.parse(subProjectsData);
      const subProjectData = subProjects.find((sp: SubProject) => sp.id === id);
      setSubProject(subProjectData || null);
    }
  }, [id]);

  if (!subProject) {
    return <div>Sous-projet non trouvé</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2"
        onClick={() => navigate('/financier/sous-projets')}
      >
        <ArrowLeft className="h-4 w-4" /> Retour
      </Button>

      <h1 className="text-2xl font-bold">{subProject.name}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Détails du sous-projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p>{subProject.description || 'Aucune description'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <p>{subProject.status}</p>
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
              <p>{subProject.budget || 'Non défini'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p>{subProject.startDate || 'Non définie'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de fin</p>
              <p>{subProject.endDate || 'Non définie'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancierSubProjectDetailsPage;
