
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeMarcheDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marche, setMarche] = useState(null);
  const [projectName, setProjectName] = useState('N/A');
  
  useEffect(() => {
    // Load marché data
    const marchesString = localStorage.getItem('marches');
    if (marchesString && id) {
      try {
        const marches = JSON.parse(marchesString);
        const foundMarche = marches.find(m => m.id === id);
        if (foundMarche) {
          setMarche(foundMarche);
          
          // Get associated project name
          if (foundMarche.projetId) {
            const projectsString = localStorage.getItem('projects');
            if (projectsString) {
              const projects = JSON.parse(projectsString);
              const project = projects.find(p => p.id === foundMarche.projetId);
              if (project) {
                setProjectName(project.name);
              }
            }
          }
        } else {
          console.error("Marché not found");
          navigate('/employee/marche');
        }
      } catch (error) {
        console.error("Error loading marché:", error);
      }
    }
  }, [id, navigate]);
  
  if (!marche) {
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
          onClick={() => navigate('/employee/marche')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Détails du marché</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nom du marché</h3>
                <p className="mt-1 text-lg font-medium">{marche.nom}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Numéro du marché</h3>
                <p className="mt-1 text-lg">{marche.numeroMarche}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type du marché</h3>
                <p className="mt-1">{marche.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fournisseur</h3>
                <p className="mt-1">{marche.fournisseur}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de signature</h3>
                <p className="mt-1">{marche.dateSignature}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Projet associé</h3>
                <p className="mt-1">{projectName}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Numéro d'Appel d'Offre</h3>
                <p className="mt-1">{marche.numeroAppelOffre || 'Non spécifié'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date début projet</h3>
                <p className="mt-1">{marche.dateDebutProjet || 'Non spécifié'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Détails financiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prix (Dinar)</h3>
              <p className="mt-1 text-lg font-medium">{marche.prixDinar || 'Non spécifié'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prix (Devise)</h3>
              <p className="mt-1">{marche.prixDevise || 'Non spécifié'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date Visa CME</h3>
              <p className="mt-1">{marche.dateVisaCME || 'Non spécifié'}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{marche.description || 'Aucune description disponible'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeMarcheDetailsPage;
