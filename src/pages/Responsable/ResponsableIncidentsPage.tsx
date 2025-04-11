
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Eye } from 'lucide-react';
import { Incident } from '@/types/Incident';
import { useSearchQuery } from '@/components/Layout/ResponsableLayout';

const ResponsableIncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const { searchQuery } = useSearchQuery() as { searchQuery: string };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load incidents from localStorage
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents) {
      try {
        setIncidents(JSON.parse(storedIncidents));
      } catch (error) {
        console.error("Error loading incidents:", error);
      }
    } else {
      // Demo data if none exists
      const demoData: Incident[] = Array.from({ length: 8 }, (_, i) => ({
        id: `inc-${i + 1}`,
        type: "Incident de type " + (i + 1),
        signaledBy: "Employé " + (i % 3 + 1),
        date: "15/01/2024",
        time: "14H30",
        location: "ALGER",
        projectName: "Project A",
        subProjectName: "Sub Project 1",
        description: "Description de l'incident...",
        documents: [],
        createdAt: new Date().toISOString()
      }));
      
      localStorage.setItem('incidents', JSON.stringify(demoData));
      setIncidents(demoData);
    }
  }, []);

  const filteredIncidents = incidents.filter(incident =>
    incident.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.signaledBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident.projectName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const handleViewIncidentDetails = (id: string) => {
    navigate(`/responsable/incidents/${id}`);
  };

  const handleViewIncidentFollowUps = (id: string) => {
    navigate(`/responsable/incidents/suivis/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des Incidents</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Signalé par</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>L'heure</TableHead>
              <TableHead>Lieu</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((incident, index) => (
                <TableRow key={incident.id} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.signaledBy}</TableCell>
                  <TableCell>{incident.date}</TableCell>
                  <TableCell>{incident.time}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>{incident.projectName}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewIncidentDetails(incident.id)}
                    >
                      <Eye className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewIncidentFollowUps(incident.id)}
                    >
                      Suivis
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Aucun incident trouvé
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

export default ResponsableIncidentsPage;
