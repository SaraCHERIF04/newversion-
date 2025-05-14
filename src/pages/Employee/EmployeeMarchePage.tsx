
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Eye } from 'lucide-react';
import { Marche } from '@/types/Marche';
import { useSearchQuery } from '@/components/Layout/EmployeeLayout';

const EmployeeMarchePage: React.FC = () => {
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const { searchQuery } = useSearchQuery() as { searchQuery: string };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load marches from localStorage
    const storedMarches = localStorage.getItem('marches');
    if (storedMarches) {
      try {
        setMarches(JSON.parse(storedMarches));
      } catch (error) {
        console.error("Error loading marches:", error);
      }
    } else {
      // Demo data if none exists
      const demoData: Marche[] = Array.from({ length: 8 }, (_, i) => ({
        id: `marche-${i + 1}`,
        nom: `Marché ${i + 1}`,
        numeroMarche: `MR-${1000 + i}`,
        type: i % 2 === 0 ? 'Type A' : 'Type B',
        dateSignature: '15/01/2024',
        dateDebutProjet: '01/02/2024',
        dateVisaCME: '10/01/2024',
        numeroAppelOffre: `AO-${2000 + i}`,
        prixDinar: `${(i + 1) * 1000000} DZD`,
        prixDevise: `${(i + 1) * 5000} EUR`,
        fournisseur: `Fournisseur ${i % 5 + 1}`,
        description: `Description détaillée du marché ${i + 1}...`
      }));
      
      localStorage.setItem('marches', JSON.stringify(demoData));
      setMarches(demoData);
    }
  }, []);

  const filteredMarches = marches.filter(marche =>
    marche.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marche.numeroMarche.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marche.fournisseur.toLowerCase().includes(searchQuery.toLowerCase()) ||
    marche.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMarches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMarches.length / itemsPerPage);

  const handleViewMarcheDetails = (id: string) => {
    navigate(`/employee/marche/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Marchés</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du marché</TableHead>
              <TableHead>Numéro</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date signature</TableHead>
              <TableHead>Fournisseur</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((marche, index) => (
                <TableRow key={marche.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <TableCell>{marche.nom}</TableCell>
                  <TableCell>{marche.numeroMarche}</TableCell>
                  <TableCell>{marche.type}</TableCell>
                  <TableCell>{marche.dateSignature}</TableCell>
                  <TableCell>{marche.fournisseur}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewMarcheDetails(marche.id)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun marché trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default EmployeeMarchePage;
