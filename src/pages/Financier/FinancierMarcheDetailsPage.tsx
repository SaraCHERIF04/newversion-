
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import { Marche } from '@/types/Marche';

const FinancierMarcheDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marche, setMarche] = useState<Marche | null>(null);
  const [projectName, setProjectName] = useState<string>('N/A');

  useEffect(() => {
    const marchesString = localStorage.getItem('marches');
    if (marchesString && id) {
      try {
        const marches = JSON.parse(marchesString);
        const foundMarche = marches.find((m: Marche) => m.id === id);
        if (foundMarche) {
          setMarche(foundMarche);
          
          if (foundMarche.projetId) {
            const projectsString = localStorage.getItem('projects');
            if (projectsString) {
              const projects = JSON.parse(projectsString);
              const project = projects.find((p: any) => p.id === foundMarche.projetId);
              if (project) {
                setProjectName(project.name);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading marché:', error);
      }
    }
  }, [id]);

  if (!marche) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/financier/marche')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Marché non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/financier/marche')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Détails du marché</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{marche.nom}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{marche.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Projet</p>
              <p>{projectName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Numéro de marché</p>
              <p>{marche.numeroMarche}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fournisseur</p>
              <p>{marche.fournisseur}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Prix (Dinar)</p>
              <p>{marche.prixDinar}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Prix (Devise)</p>
              <p>{marche.prixDevise}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Date de signature</p>
              <p>{marche.dateSignature}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date Visa CME</p>
              <p>{marche.dateVisaCME}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date début projet</p>
              <p>{marche.dateDebutProjet}</p>
            </div>
          </div>

          {marche.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                <p className="whitespace-pre-wrap">{marche.description}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancierMarcheDetailsPage;
