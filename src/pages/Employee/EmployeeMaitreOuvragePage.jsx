
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const EmployeeMaitreOuvragePage = () => {
  const navigate = useNavigate();
  const [maitreOuvrages, setMaitreOuvrages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load maître d'ouvrage data from local storage
    const fetchData = async () => {
      setLoading(true);
      try {
        const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
        if (maitreOuvragesString) {
          const data = JSON.parse(maitreOuvragesString);
          setMaitreOuvrages(data || []);
        } else {
          setMaitreOuvrages([]);
        }
      } catch (error) {
        console.error('Error loading maître d\'ouvrage data:', error);
        setMaitreOuvrages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMaitreOuvrages = maitreOuvrages.filter(mo => 
    mo.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    mo.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Liste des Maîtres d'Ouvrage</h1>
          <p className="text-gray-500">Consultez les informations des maîtres d'ouvrage</p>
        </div>
        <div className="mt-4 md:mt-0 relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Chargement...</div>
      ) : filteredMaitreOuvrages.length === 0 ? (
        <div className="text-center py-10">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun maître d'ouvrage trouvé</h3>
          <p className="mt-1 text-gray-500">Aucun résultat ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaitreOuvrages.map((maitreOuvrage) => (
            <Card 
              key={maitreOuvrage.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/employee/maitre-ouvrage/${maitreOuvrage.id}`)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-indigo-700" />
                  {maitreOuvrage.nom}
                </CardTitle>
                <p className="text-sm text-gray-500">{maitreOuvrage.type}</p>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{maitreOuvrage.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-gray-600">{maitreOuvrage.telephone}</span>
                  </div>
                  <div className="flex items-start text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-1" />
                    <span className="text-gray-600 line-clamp-1">{maitreOuvrage.adresse}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeMaitreOuvragePage;
