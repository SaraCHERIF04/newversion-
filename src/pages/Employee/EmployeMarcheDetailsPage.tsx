
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Marche } from '@/types/Marche';

const EmployeMarcheDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [marche, setMarche] = useState<Marche | null>(null);

  useEffect(() => {
    const storedMarches = localStorage.getItem('marches');
    if (storedMarches && id) {
      try {
        const marches = JSON.parse(storedMarches);
        const foundMarche = marches.find((m: Marche) => m.id === id);
        if (foundMarche) {
          setMarche(foundMarche);
        } else {
          console.error('Marché not found');
        }
      } catch (error) {
        console.error("Error loading marché:", error);
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
            onClick={() => navigate('/employee/marche')}
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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Nom du marché</h3>
            <p className="text-lg font-medium">{marche.nom}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Numéro de marché</h3>
            <p className="text-lg font-medium">{marche.numeroMarche}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Type de marché</h3>
            <p className="text-lg font-medium">{marche.type}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Fournisseur</h3>
            <p className="text-lg font-medium">{marche.fournisseur}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date de signature</h3>
            <p className="text-lg font-medium">{marche.dateSignature}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date début projet</h3>
            <p className="text-lg font-medium">{marche.dateDebutProjet}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date visa CME</h3>
            <p className="text-lg font-medium">{marche.dateVisaCME}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Numéro d'appel d'offre</h3>
            <p className="text-lg font-medium">{marche.numeroAppelOffre}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Prix (Dinar)</h3>
            <p className="text-lg font-medium">{marche.prixDinar}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Prix (Devise)</h3>
            <p className="text-lg font-medium">{marche.prixDevise}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{marche.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeMarcheDetailsPage;
