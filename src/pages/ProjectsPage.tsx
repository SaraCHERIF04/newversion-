
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard, { Project } from '@/components/ProjectCard';
import { useSearchQuery } from '@/components/Layout/MainLayout';
import { Eye } from 'lucide-react';

// Sample data for projects
const sampleProjects: Project[] = [
  {
    id: '1',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'En cours',
    deadline: '23 JUIN 2023',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
      { id: '4', name: 'User 4', avatar: 'https://randomuser.me/api/portraits/women/58.jpg' },
    ],
    documentsCount: 1,
  },
  {
    id: '2',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'Terminé',
    deadline: '14 JUIN 2023',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 13,
  },
  {
    id: '3',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'En cours',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
  },
  {
    id: '4',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'Annulé',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
  },
  {
    id: '5',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'En attente',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
  },
  {
    id: '6',
    name: 'Nom projet',
    description: 'Petite description du projet',
    status: 'Terminé',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
  },
];

const ProjectsPage: React.FC = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(sampleProjects);

  // Effect to handle both header search and local search
  useEffect(() => {
    const combinedSearchTerm = searchQuery || localSearchTerm;
    const results = sampleProjects.filter(project =>
      project.name.toLowerCase().includes(combinedSearchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(combinedSearchTerm.toLowerCase())
    );
    setFilteredProjects(results);
  }, [searchQuery, localSearchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
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
            to="/project/new"
            className="bg-[#192759] text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Créer nouveau
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project.id} className="relative group">
            <ProjectCard project={project} />
            <Link 
              to={`/project/${project.id}`} 
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-5 w-5 text-[#192759]" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
