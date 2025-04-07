
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from './ProjectCard';
import { Download, Printer, ArrowLeft } from 'lucide-react';
import { ExtendedProject } from '@/pages/ProjectDetailsPage';
import { SubProject } from './SubProjectCard';

// Extend the ProjectMember type with additional properties
type ProjectMember = {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  dateJoined?: string;
};

type Document = {
  id: string;
  title: string;
  url?: string;
};

type ProjectDetailsProps = {
  project?: ExtendedProject;
};

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Get project from localStorage if available
  const getProjectFromStorage = (projectId: string): ExtendedProject | undefined => {
    try {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        return projects.find((p: Project) => p.id === projectId);
      }
    } catch (error) {
      console.error('Error getting project from localStorage:', error);
    }
    return undefined;
  };
  
  // Get all subprojects for this project
  const getSubProjectsForProject = (projectId: string): SubProject[] => {
    try {
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        const subProjects = JSON.parse(subProjectsString);
        return subProjects.filter((sp: SubProject) => sp.projectId === projectId);
      }
    } catch (error) {
      console.error('Error getting subprojects:', error);
    }
    return [];
  };

  // Try to get project from localStorage, fallback to props
  const storedProject = id ? getProjectFromStorage(id) : undefined;
  const subProjects = id ? getSubProjectsForProject(id) : [];
  
  const projectDetails = storedProject || project || {
    id: id || '1',
    name: 'Construction d\'une nouvelle station gaz',
    status: 'En cours' as const,
    chef: 'amina neg',
    region: 'Alger',
    budget: '10000000000 Da',
    startDate: '20/3/2023',
    endDate: '20/3/2023',
    description: 'Description détaillée du projet ici...',
    documentsCount: 5,
    documents: [
      { id: '1', title: 'Rapport initial.pdf', url: '/documents/rapport.pdf' },
      { id: '2', title: 'Plans techniques.pdf', url: '/documents/plans.pdf' },
      { id: '3', title: 'Budget détaillé.xlsx', url: '/documents/budget.xlsx' },
      { id: '4', title: 'Contrat.pdf', url: '/documents/contrat.pdf' },
    ],
    members: [
      { 
        id: '1', 
        name: 'amina agragarwal', 
        role: 'Project Lead',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        dateJoined: '20/03/2023'
      },
      { 
        id: '2', 
        name: 'Selim Saidi', 
        role: 'Team lead/developer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        dateJoined: '20/03/2023'
      },
      { 
        id: '3', 
        name: 'Adlen developpeur', 
        role: 'developpeur',
        avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
        dateJoined: '20/03/2023'
      },
    ],
    subProjects: []
  };

  // We'll use both subProjects from the project and from localStorage
  const combinedSubProjects = [
    ...(projectDetails.subProjects || []),
    ...subProjects.filter(sp => 
      !(projectDetails.subProjects || []).some((existingSp: any) => existingSp.id === sp.id)
    )
  ];

  const printProject = () => {
    window.print();
  };

  const downloadDocument = (doc: Document) => {
    if (doc.url) {
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.title;
      
      // Append to the DOM
      document.body.appendChild(a);
      
      // Trigger a click on the element
      a.click();
      
      // Remove the element
      document.body.removeChild(a);
    } else {
      console.error('Document URL is missing');
    }
  };

  const handleBack = () => {
    navigate('/project');
  };

  // Delete functionality
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) {
      try {
        const projectsString = localStorage.getItem('projects');
        if (projectsString && projectDetails.id) {
          const projects = JSON.parse(projectsString);
          const updatedProjects = projects.filter((p: Project) => p.id !== projectDetails.id);
          localStorage.setItem('projects', JSON.stringify(updatedProjects));
          
          // Also delete related subprojects
          const subProjectsString = localStorage.getItem('subProjects');
          if (subProjectsString) {
            const subProjects = JSON.parse(subProjectsString);
            const updatedSubProjects = subProjects.filter((sp: SubProject) => sp.projectId !== projectDetails.id);
            localStorage.setItem('subProjects', JSON.stringify(updatedSubProjects));
          }
          
          navigate('/project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux projets</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Détails de projets</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main project details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{projectDetails.name}</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {projectDetails.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Chef du projet</div>
                <div className="text-sm">{projectDetails.chef || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Wilya</div>
                <div className="text-sm">{projectDetails.region || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Budget</div>
                <div className="text-sm">{projectDetails.budget || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date debut</div>
                <div className="text-sm">{projectDetails.startDate || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date fin</div>
                <div className="text-sm">{projectDetails.endDate || "Non spécifié"}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description du projet</h3>
            <div className="p-4 bg-gray-50 rounded-md min-h-[100px] text-gray-700">
              {projectDetails.description || "Aucune description disponible."}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              Supprimer
            </button>
            <button 
              onClick={() => navigate(`/project/edit/${projectDetails.id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Modifier
            </button>
            <button 
              onClick={printProject}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Document du projets</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {projectDetails.documents && projectDetails.documents.length > 0 ? (
                projectDetails.documents.map(doc => (
                  <div key={doc.id} className="p-2 bg-blue-50 text-blue-600 rounded-md flex justify-between items-center">
                    <span className="truncate">{doc.title}</span>
                    <button 
                      onClick={() => downloadDocument(doc)}
                      className="text-blue-700 hover:text-blue-900 ml-2"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Aucun document disponible</div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Membres du projet</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {projectDetails.members && projectDetails.members.length > 0 ? (
                projectDetails.members.map(member => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-gray-500">{(member as any).role || "Membre"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Aucun membre ajouté</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub Projects */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Sous projet</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {combinedSubProjects && combinedSubProjects.length > 0 ? (
            combinedSubProjects.map((subProject, index) => (
              <div key={`${subProject.id}-${index}`} className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-medium mb-1">{subProject.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{subProject.description}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{subProject.daysAgo} Jours</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {subProject.members.slice(0, 3).map((member, idx) => (
                        <img 
                          key={`${member.id || idx}`}
                          src={member.avatar} 
                          alt="member" 
                          className="h-6 w-6 rounded-full border border-white"
                        />
                      ))}
                      {subProject.members.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600 border border-white">
                          +{subProject.members.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {subProject.documentsCount}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-2 p-4">Aucun sous-projet disponible</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
