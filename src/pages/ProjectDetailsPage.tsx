<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { projetService } from '@/services/projetService'; // adjust path as needed
import { Project } from '@/components/ProjectCard';
import { ProjetInterface } from '@/interfaces/ProjetInterface';
import { ProjetListResponse } from '@/interfaces/ProjetListResponse';
import  ProjectDetails  from '@/components/ProjectDetails'; // adjust path as needed


const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
    
   
  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (id) {
          const response = await projetService.getProjetById(id, 'chef de projet');
          const p: ProjetInterface = response.data;
  
          const transformedProject: Project = {
            id: p.id_projet.toString(),
            name: p.nom_projet,
            description: p.description_de_projet,
            documentsCount: p.documents?.length || 0,
            status: (p.status as 'En attente' | 'En cours' | 'Terminé') || 'En attente',
            members: (p.members || []).map((member) => ({
              id: member.id_utilisateur.toString(),
              name: member.nom,
              avatar: member.avatar || '',
              role: member.role_de_utilisateur || '',
            })),
          };
  
          setProject(transformedProject);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setLoading(false); // <- ✅ IMPORTANT
      }
    };
  
    fetchProject();
  }, [id]);

  if (loading) return <div className="text-center">Chargement...</div>;
  <div className="text-red-500 text-center">{Error instanceof Error ? Error.message : 'An unknown error occurred'}</div>;

  return <ProjectDetails project={project} />;
=======

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/components/ProjectCard';

// Extended Project type to include additional properties
export type ExtendedProject = Project & {
  chef?: string;
  region?: string; 
  budget?: string;
  startDate?: string;
  endDate?: string;
  documents?: Array<{id: string, title: string, url: string}>;
  subProjects?: Array<any>;
};

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ExtendedProject | undefined>(undefined);
  
  useEffect(() => {
    if (id) {
      // Try to get the project from localStorage
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const foundProject = projects.find((p: Project) => p.id === id);
          if (foundProject) {
            setProject(foundProject);
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    }
  }, [id]);
  
  // Fallback sample project if not found in localStorage
  const sampleProject: ExtendedProject = {
    id: id || '1',
    name: 'Construction d\'une nouvelle station gaz',
    description: 'Description détaillée du projet ici...',
    status: 'En cours',
    deadline: '23 JUIN 2023',
    members: [
      { id: '1', name: 'User 1', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
      { id: '2', name: 'User 2', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { id: '3', name: 'User 3', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    ],
    documentsCount: 5,
    chef: 'amina neg',
    region: 'Alger',
    budget: '10000000000 Da',
    startDate: '20/3/2023',
    endDate: '20/3/2023',
    documents: [
      { id: '1', title: 'Rapport initial.pdf', url: '/documents/rapport.pdf' },
      { id: '2', title: 'Plans techniques.pdf', url: '/documents/plans.pdf' }
    ],
    subProjects: []
  };
  
  return <ProjectDetails project={project || sampleProject} />;
>>>>>>> upstream/main
};

export default ProjectDetailsPage;
