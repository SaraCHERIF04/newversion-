
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { ArrowLeft, Eye, FileText } from 'lucide-react';

const EmployeeIncidentFollowUpsPage = () => {
  const { id: incidentId } = useParams();
  const navigate = useNavigate();
  const [incident, setIncident] = useState(null);
  const [followUps, setFollowUps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // Load incident data
    const storedIncidents = localStorage.getItem('incidents');
    if (storedIncidents && incidentId) {
      try {
        const incidents = JSON.parse(storedIncidents);
        const foundIncident = incidents.find(inc => inc.id === incidentId);
        if (foundIncident) {
          setIncident(foundIncident);
        }
      } catch (error) {
        console.error("Error loading incident:", error);
      }
    }

    // Load follow-ups data
    const storedFollowUps = localStorage.getItem('incidentFollowUps');
    if (storedFollowUps && incidentId) {
      try {
        const allFollowUps = JSON.parse(storedFollowUps);
        const filteredFollowUps = allFollowUps.filter(fu => fu.incidentId === incidentId);
        // Sort by date (newest first)
        const sortedFollowUps = filteredFollowUps.sort((a, b) => 
          new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
        );
        setFollowUps(sortedFollowUps);
      } catch (error) {
        console.error("Error loading follow-ups:", error);
      }
    }
  }, [incidentId]);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = followUps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(followUps.length / itemsPerPage);

  if (!incident) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">Chargement des données...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/employee/incidents/${incidentId}`)}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Suivis de l'incident</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Détails de l'incident</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p className="mt-1 font-medium">{incident.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="mt-1">{incident.date}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Heure</h3>
              <p className="mt-1">{incident.time}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
              <p className="mt-1">{incident.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date de rapport</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((followUp) => (
                <TableRow key={followUp.id}>
                  <TableCell>{followUp.reportDate}</TableCell>
                  <TableCell>
                    {followUp.description.length > 100
                      ? `${followUp.description.substring(0, 100)}...`
                      : followUp.description}
                  </TableCell>
                  <TableCell>
                    {followUp.documents && followUp.documents.length > 0 ? (
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{followUp.documents.length} document(s)</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Aucun document</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/employee/incidents/suivis/${incidentId}/${followUp.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Aucun suivi trouvé pour cet incident
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

export default EmployeeIncidentFollowUpsPage;
