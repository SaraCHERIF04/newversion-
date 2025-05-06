
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Eye } from 'lucide-react';
import { Incident } from '@/types/Incident';
import { useSearchQuery } from '@/components/Layout/EmployeeLayout';
import { incidentService } from '@/services/incidentService';
import { IncidentInterface } from '@/interfaces/IncidentInterface';
const EmployeeIncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState<IncidentInterface[]>([]);
  const { searchQuery } = useSearchQuery() as { searchQuery: string };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load incidents from localStorage
    const fetchIncidents = async () => {
      const response = await incidentService.getAllIncidents(currentPage, 'employee');
      setIncidents(response.data);
    };
    fetchIncidents();
  }, []);

  const filteredIncidents = incidents.filter(incident =>
    incident?.type_incident?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident?.signale_par?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident?.lieu_incident?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    incident?.id_projet?.toString().includes(searchQuery)
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIncidents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const handleViewIncidentDetails = (id: string) => {
    navigate(`/employee/incidents/${id}`);
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
                <TableRow key={incident.id_incident} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                  <TableCell>{incident.type_incident}</TableCell>
                  <TableCell>{incident?.signale_par?.nom}</TableCell>
                  <TableCell>{incident?.date_incident}</TableCell>
                  <TableCell>{incident?.lheure_incident}</TableCell>
                  <TableCell>{incident?.lieu_incident}</TableCell>
                  <TableCell>{incident?.id_projet}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewIncidentDetails(incident.id_incident.toString())}
                    >
                      <Eye className="h-5 w-5" />
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

export default EmployeeIncidentsPage;
