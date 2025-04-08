import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SubProjectCard from '@/components/SubProjectCard';
import { useSearchQuery } from '@/components/Layout/EmployeeLayout';

const EmployeeSubProjectsPage = () => {
  const { searchQuery } = useSearchQuery() || { searchQuery: '' };
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [allSubProjects, setAllSubProjects] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);

  // Load sub-projects from localStorage on component mount
  useEffect(() => {
    const savedSubProjects = localStorage.getItem('subProjects');
    if (savedSubProjects) {
      try {
        const parsedSubProjects = JSON.parse(savedSubProjects);
        // Sort subprojects with newest first
        const sortedSubProjects = sortByNewest(parsedSubProjects);
        setAllSubProjects(sortedSubProjects);
      } catch (error) {
        console.error('Error parsing subprojects from localStorage:', error);
        setAllSubProjects([]);
      }
    } else {
      setAllSubProjects([]);
    }
  }, []);

  // Helper function to sort items by newest first
  const sortByNewest = (items) => {
    return [...items].sort((a, b) => {
      // If items have createdAt or timestamp field, sort by that
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      // Otherwise, reverse the order to put newer items (likely those with higher IDs) first
      return b.id.localeCompare(a.id);
    });
  };

  // Effect to handle both header search and local search
  useEffect(() => {
    const combinedSearchTerm = searchQuery || localSearchTerm;
    const results = allSubProjects.filter(subProject =>
      subProject.name.toLowerCase().includes(combinedSearchTerm.toLowerCase()) ||
      (subProject.description && subProject.description.toLowerCase().includes(combinedSearchTerm.toLowerCase()))
    );
    setFilteredSubProjects(results);
  }, [searchQuery, localSearchTerm, allSubProjects]);

  const handleSearch = (e) => {
    setLocalSearchTerm(e.target.value);
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sous-projets</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un sous-projet..."
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubProjects.length > 0 ? (
          filteredSubProjects.map(subProject => (
            <div key={subProject.id} className="block">
              <Link to={`/employee/sous-projets/${subProject.id}`} className="block h-full">
                <SubProjectCard subProject={subProject} />
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            Aucun sous-projet trouvé
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeSubProjectsPage;
