
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeeMaitreOuvrageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maitreOuvrage, setMaitreOuvrage] = useState(null);

  useEffect(() => {
    // Load maître d'ouvrage data
    const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
    if (maitreOuvragesString && id) {
      try {
        const maitreOuvrages = JSON.parse(maitreOuvragesString);
        const foundMaitreOuvrage = maitreOuvrages.find((mo) => mo.id === id);
        if (foundMaitreOuvrage) {
          setMaitreOuvrage(foundMaitreOuvrage);
        } else {
          console.error('Maître d\'ouvrage not found');
        }
      } catch (error) {
        console.error('Error loading maître d\'ouvrage data:', error);
      }
    }
  }, [id]);

  if (!maitreOuvrage) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/employee/maitre-ouvrage')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Maître d'ouvrage non trouvé</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/employee/maitre-ouvrage')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Détails du Maître d'ouvrage</h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{maitreOuvrage.nom}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Type</p>
              <p>{maitreOuvrage.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{maitreOuvrage.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Téléphone</p>
              <p>{maitreOuvrage.telephone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Adresse</p>
              <p>{maitreOuvrage.adresse}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeMaitreOuvrageDetailsPage;
