
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeeMaitreOuvrageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [maitreOuvrage, setMaitreOuvrage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load maître d'ouvrage data
    const fetchData = async () => {
      setLoading(true);
      try {
        const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
        if (maitreOuvragesString && id) {
          const maitreOuvrages = JSON.parse(maitreOuvragesString);
          const foundMaitreOuvrage = maitreOuvrages.find((mo) => mo.id === id);
          if (foundMaitreOuvrage) {
            setMaitreOuvrage(foundMaitreOuvrage);
          } else {
            console.error('Maître d\'ouvrage not found');
          }
        }
      } catch (error) {
        console.error('Error loading maître d\'ouvrage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
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
          <h1 className="text-2xl font-bold">Chargement...</h1>
        </div>
      </div>
    );
  }

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

      <Card className="shadow-md">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2 text-indigo-700" /> 
            {maitreOuvrage.nom}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-lg font-medium">{maitreOuvrage.type}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{maitreOuvrage.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <p>{maitreOuvrage.telephone}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Adresse</p>
                <div className="flex items-start mt-1">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                  <p>{maitreOuvrage.adresse}</p>
                </div>
              </div>
              
              {maitreOuvrage.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="mt-1">{maitreOuvrage.description}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeMaitreOuvrageDetailsPage;
