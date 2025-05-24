import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '@/components/ProjectCard';
import { useSearchQuery } from '@/components/Layout/MainLayout';
import { projetService } from '@/services/projetService';

const ProjectsPage = () => { 
  const { searchQuery } = useSearchQuery();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔐 Change this dynamically based on your user auth context
  const userRole = localStorage.getItem('userRole') || 'user';

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await projetService.getAllProjets(page, userRole);
        if (response.success) {
          const sortedProjects = sortByNewest(response.data.results);
          setAllProjects(sortedProjects);
          setTotalPages(response.pagination?.total_pages || 1);// depends on backend response
        } else {
          setError(response.message || 'Une erreur est survenue.');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des projets.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [page, userRole]);

  function sortByNewest(items) {
    if (!Array.isArray(items)) {
        console.error("Expected 'items' to be an array, but got:", items);
        return [];
    }
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
}

  useEffect(() => {
    const combinedSearchTerm = searchQuery || localSearchTerm;
    const results = allProjects.filter(project =>
      (project.nom_projet && project.nom_projet.toLowerCase().includes(combinedSearchTerm.toLowerCase())) ||
      (project.description_de_projet && project.description_de_projet.toLowerCase().includes(combinedSearchTerm.toLowerCase()))
    );
    
    setFilteredProjects(results);
  }, [searchQuery, localSearchTerm, allProjects]);

  const handleSearch = (e) => setLocalSearchTerm(e.target.value);

  const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage(prev => Math.min(prev + 1, totalPages));

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
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <Link to="/project/new" className="bg-[#192759] text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Créer nouveau
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Chargement des projets...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project.id_projet}>
                <Link to={`/project/${project.id_projet}`}>
                  <ProjectCard project={project} />
                </Link>
              </div>
            ))}
          </div>
      )}
    </div>
  );
};

export default ProjectsPage;
