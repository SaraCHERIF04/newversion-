import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { useSearchQuery } from '@/components/Layout/EmployeeLayout';
import { projetService } from '@/services/projetService';

const EmployeeProjectsPage = () => {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projetService.getAllProjets(1, 'employee');
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error); 
        setAllProjects([]);
      }
    };
    fetchProjects();
  }, []);


  


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
            <div key={project.id} className="block">
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
    </div>
  );
};

export default EmployeeProjectsPage;
