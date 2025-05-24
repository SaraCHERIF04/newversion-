import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchQuery } from '@/components/Layout/EmployeeLayout';
import { projetService } from '@/services/projetService';

const EmployeeProjectsPage = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projetService.getAllProjets(1, 'employee');
        setFilteredProjects(response.data.results);
         setTotalPages(response.data.totalPages || 1);     // Make sure this exists
         setTotalCount(response.data.totalCount || 0); 
      } catch (error) {
        console.error('Error fetching projects:', error); 
        setAllProjects([]);
      }
    };
    fetchProjects();
  }, []);

const handlePageChange = async (page) => {
  if (page < 1 || page > totalPages) return;

  setCurrentPage(page);
  setIsSearching(true);

  try {
   const response = await projetService.getAllProjets(page, 'employee');
   const pageSize = response.data.results.length || 1;
setFilteredProjects(response.data.results);
setTotalPages(Math.ceil(response.data.count / pageSize));
setTotalCount(response.data.count);

  } catch (error) {
    console.error('Error fetching projects for page change:', error);
  } finally {
    setIsSearching(false);
  }
};

  


  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projets</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un projet..." 
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <div key={project.id_projet} className="block">
              <div className="h-full transition-transform hover:scale-102 hover:shadow-lg">
                <Link to={`/employee/projects/${project.id_projet}`} className="block h-full">
                  <ProjectCard project={project} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            Aucun projet trouvé
          </div>
        )}
      </div>
       {filteredProjects.length > 0 && !isSearching && totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => {
                      // Show at most 5 page buttons centered around current page
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = idx + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = idx + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + idx;
                      } else {
                        pageNumber = currentPage - 2 + idx;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-10 h-10"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-500 ml-4">
                      Page {currentPage} sur {totalPages} ({totalCount} utilisateurs)
                    </span>
                  </div>
                )}
    </div>
  );
};

export default EmployeeProjectsPage;
