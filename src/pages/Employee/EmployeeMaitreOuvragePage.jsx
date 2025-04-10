
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmployeeMaitreOuvragePage = () => {
  const [maitreOuvrages, setMaitreOuvrages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load maitreOuvrages from localStorage
    const maitreOuvragesString = localStorage.getItem('maitreOuvrages');
    if (maitreOuvragesString) {
      try {
        const data = JSON.parse(maitreOuvragesString);
        setMaitreOuvrages(data);
      } catch (error) {
        console.error('Error loading maitreOuvrages:', error);
      }
    }
  }, []);
  
  const handleViewMaitreOuvrage = (mo) => {
    navigate(`/employee/maitre-ouvrage/${mo.id}`);
  };
  
  const filteredMaitreOuvrages = maitreOuvrages.filter(mo => 
    mo.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mo.adresse.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto">
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
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
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
              filteredMaitreOuvrages.map((mo, index) => (
                <TableRow key={mo.id} className={index % 2 === 1 ? 'bg-gray-50' : ''}>
                  <TableCell>{mo.nom}</TableCell>
                  <TableCell>{mo.type}</TableCell>
                  <TableCell>{mo.email}</TableCell>
                  <TableCell>{mo.telephone}</TableCell>
                  <TableCell>{mo.adresse}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewMaitreOuvrage(mo)}>
                      <Eye className="h-4 w-4" />
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

export default EmployeeMaitreOuvragePage;
