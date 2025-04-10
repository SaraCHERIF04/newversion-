
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EmployeeMarcheAndMaitreOuvragePage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const isMarche = type === 'marche';
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load data from localStorage
    const storageKey = isMarche ? 'marches' : 'maitreOuvrages';
    const savedItems = localStorage.getItem(storageKey);
    
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // Sort by newest first
        const sortedItems = [...parsedItems].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return 0;
        });
        setItems(sortedItems);
      } catch (error) {
        console.error(`Error loading ${isMarche ? 'marches' : 'maitre ouvrages'}:`, error);
      }
    }
  }, [isMarche]);

  const filteredItems = items.filter(item => 
    (item.name?.toLowerCase() || item.nom?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (isMarche && (item.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())) ||
    (isMarche && (item.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())) ||
    (!isMarche && (item.address?.toLowerCase() || item.adresse?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/employee')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">
          {isMarche ? 'Marchés' : 'Maîtres d\'ouvrage'}
        </h1>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <input
            type="text"
            placeholder={`Rechercher un ${isMarche ? 'marché' : 'maître d\'ouvrage'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {isMarche ? (
                <>
                  <TableHead>Numéro marché</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Date signature</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Fournisseur</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Nom</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Téléphone</TableHead>
                </>
              )}
              <TableHead>Date d'ajout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  {isMarche ? (
                    <>
                      <TableCell>{item.numeroMarche}</TableCell>
                      <TableCell>{item.nom}</TableCell>
                      <TableCell>{item.dateSignature}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{item.fournisseur}</TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{item.name || item.nom}</TableCell>
                      <TableCell>{item.address || item.adresse}</TableCell>
                      <TableCell>{item.phone || item.telephone}</TableCell>
                    </>
                  )}
                  <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isMarche ? 6 : 4} className="text-center py-4">
                  Aucun {isMarche ? 'marché' : 'maître d\'ouvrage'} trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeMarcheAndMaitreOuvragePage;
