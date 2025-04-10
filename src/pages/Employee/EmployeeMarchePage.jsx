
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EmployeeMarchePage = () => {
  const [marches, setMarches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load marches from localStorage
    const marchesString = localStorage.getItem('marches');
    if (marchesString) {
      try {
        const data = JSON.parse(marchesString);
        setMarches(data);
      } catch (error) {
        console.error('Error loading marches:', error);
      }
    }
  }, []);
  
  const getProjectName = (projectId) => {
    if (!projectId) return 'N/A';
    try {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        const project = projects.find((p) => p.id === projectId);
        return project ? project.name : 'N/A';
      }
    } catch (error) {
      console.error('Error getting project name:', error);
    }
    return 'N/A';
  };
  
  const handleViewMarche = (marche) => {
    navigate(`/employee/marche/${marche.id}`);
  };
  
  const filteredMarches = marches.filter(marche => 
    marche.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.numeroMarche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marche.fournisseur.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(marche.projetId).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Marchés</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un marché"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numéro marché</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Date signature</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMarches.length > 0 ? (
              filteredMarches.map((marche) => (
                <TableRow key={marche.id} className={marche.id === '2' || marche.id === '4' || marche.id === '6' || marche.id === '8' ? 'bg-gray-100' : ''}>
                  <TableCell>{marche.numeroMarche}</TableCell>
                  <TableCell>{marche.nom}</TableCell>
                  <TableCell>{marche.dateSignature}</TableCell>
                  <TableCell>{marche.type}</TableCell>
                  <TableCell>{getProjectName(marche.projetId)}</TableCell>
                  <TableCell>{marche.fournisseur}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewMarche(marche)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Aucun marché trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeMarchePage;
