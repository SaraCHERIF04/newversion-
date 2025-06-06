import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubProjectCard from '@/components/SubProjectCard';
import { useSearchQuery } from '@/components/Layout/MainLayout';
import { sousProjetService } from '@/services/sousProjetService';





const SubProjectsPage = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [allSubProjects, setAllSubProjects] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
   
    const fetchSubProjects = async () => {
      try {
        const response = await sousProjetService.getAllSousProjets(1, 'admin');
        if (response.success) {
          const sorted = sortByNewest(response.data.results);
          setAllSubProjects(sorted);
        } else {
          console.warn('Failed to fetch sub-projects:', response.message);
        }
      } catch (error) {
        console.error('Error fetching sub-projects:', error);
      }
    };

    fetchSubProjects();
  }, []);

  const sortByNewest = (items) => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? 0);
      const dateB = new Date(b.createdAt ?? 0);
      return dateB.getTime() - dateA.getTime();
    });
  };

  useEffect(() => {
    const combinedSearchTerm = searchQuery || localSearchTerm;
    let results = allSubProjects;
  
    if (combinedSearchTerm) {
      results = results.filter(sp =>
        (sp.nom_sous_projet && sp.nom_sous_projet.toLowerCase().includes(combinedSearchTerm.toLowerCase())) ||
        (sp.description_sous_projet && sp.description_sous_projet.toLowerCase().includes(combinedSearchTerm.toLowerCase()))
      );
    }
  
    if (statusFilter !== 'all') {
      results = results.filter(sp => sp.statut_sous_projet === statusFilter);
    }
  
    setFilteredSubProjects(results);
  }, [searchQuery, localSearchTerm, allSubProjects, statusFilter]);
  
  const handleSearch = (e) => {
    setLocalSearchTerm(e.target.value);
  };
  
  // ✅ Corrected: statusCounts using `statut_sous_projet`
  const statusCounts = {
    'en attente': allSubProjects.filter(sp => sp.statut_sous_projet === 'en attente').length,
    'En cours': allSubProjects.filter(sp => sp.statut_sous_projet === 'En cours').length,
    'Terminé': allSubProjects.filter(sp => sp.statut_sous_projet === 'Terminé').length,
  };
  
  // ✅ Corrected filtering with correct status key
  const pendingProjects = filteredSubProjects.filter(sp => sp.statut_sous_projet=== 'en attente');
  const inProgressProjects = filteredSubProjects.filter(sp => sp.statut_sous_projet === 'En cours');
  const completedProjects = filteredSubProjects.filter(sp => sp.statut_sous_projet === 'Terminé');
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sous_projet</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un sous projet..."
              value={localSearchTerm}
              onChange={handleSearch}
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
          <Link
            to="/sous-projet/new"
            className="bg-[#192759] text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Créer nouveau
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* En attente projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">En attente <span className="text-gray-500 text-sm">({statusCounts['en attente']})</span></h2>
          </div>
          <div className="space-y-4">
            {pendingProjects.length > 0 ? (
              pendingProjects.map(subProject => (
                <Link key={subProject.id_sous_projet} to={`/sous-projet/${subProject.id_sous_projet}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet en attente</div>
            )}
          </div>
        </div>

        {/* En cours projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">En cours <span className="text-gray-500 text-sm">({statusCounts['En cours']})</span></h2>
          </div>
          <div className="space-y-4">
            {inProgressProjects.length > 0 ? (
             inProgressProjects.map(subProject => (
                <Link key={subProject.id_sous_projet} to={`/sous-projet/${subProject.id_sous_projet}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet en cours</div>
            )}
          </div>
        </div>

        {/* Terminé projects */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Terminé <span className="text-gray-500 text-sm">({statusCounts['Terminé']})</span></h2>
          </div>
          <div className="space-y-4">
            {completedProjects.length > 0 ? (
              completedProjects.map(subProject => (
                <Link key={subProject.id_sous_projet} to={`/sous-projet/${subProject.id_sous_projet}`} className="block">
                  <SubProjectCard subProject={subProject} />
                </Link>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">Aucun sous-projet terminé</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubProjectsPage;
