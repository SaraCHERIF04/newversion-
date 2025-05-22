import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MaitreOuvrage } from '@/interfaces/MaitreOuvrageInterface';
import { MaitreOuvrageResponse} from '@/interfaces/MaitreOuvrageInterface';
import { maitreOuvrage }  from '@/services/MaitreOuvrageService';

const MaitreOuvragePage = () => {
  const [maitreOuvrages, setMaitreOuvrages] = useState<MaitreOuvrage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const moResponse = await maitreOuvrage.fetchAll() as unknown as MaitreOuvrageResponse;
        const maitreOuvragesData = moResponse.data || [];
        console.log('Données maîtres d’ouvrage:', maitreOuvragesData);
        setMaitreOuvrages(maitreOuvragesData);
      } catch (error) {
        console.error('Erreur lors du chargement des maîtres d’ouvrage:', error);
      }
    };

    fetchData(); // Call the async function
  }, []);

  
  const handleViewMaitreOuvrage = (mo: MaitreOuvrage) => {
    navigate(`/maitre-ouvrage/${mo.id_mo}`);
  };
  
  const handleEditMaitreOuvrage = (mo: MaitreOuvrage) => {
    navigate(`/maitre-ouvrage/edit/${mo.id_mo}`);
  };
  
  const notifyUpdate = () => {
    window.dispatchEvent(new Event('maitreOuvragesUpdated'));
  };
  
  const handleDeleteMaitreOuvrage = async (moId: string) => {
  if (window.confirm('Êtes-vous sûr de vouloir supprimer ce MaitreOuvrage?')) {
    try {
      const userRole = 'chef de projet'; // replace this with the actual user role variable
      await maitreOuvrage.delete(moId, userRole); 

      alert('MaitreOuvrage supprimé avec succès.');
      window.location.reload();

    } catch (error) {
      console.error('Error deleting MaitreOuvrage:', error);
      alert("Une erreur s'est produite lors de la suppression du MaitreOuvrage.");
    }
  }
};

  const filteredMaitreOuvrages = maitreOuvrages.filter(mo => 
    mo.nom_mo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.email_mo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.description_mo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Maître d'ouvrage</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un maître d'ouvrage"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={() => navigate('/maitre-ouvrage/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Créer nouveau
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaitreOuvrages.length > 0 ? (
              filteredMaitreOuvrages.map((mo) => (
                <TableRow key={mo.id_mo} className={mo.id === '2' || mo.id === '4' || mo.id === '6' || mo.id === '8' ? 'bg-gray-100' : ''}>
                  <TableCell>{mo.nom_mo}</TableCell>
                  <TableCell>{mo.type_mo}</TableCell>
                  <TableCell>{mo.email_mo}</TableCell>
                  <TableCell>{mo.tel_mo}</TableCell>
                  <TableCell>{mo.adress_mo}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewMaitreOuvrage(mo)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditMaitreOuvrage(mo)}>
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteMaitreOuvrage(mo.id_mo)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun maître d'ouvrage trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MaitreOuvragePage;
