<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { projetService } from '@/services/projetService'; // adjust path as needed
import { Project } from '@/components/ProjectCard';
import { ProjetInterface } from '@/interfaces/ProjetInterface';
import { ProjetListResponse } from '@/interfaces/ProjetListResponse';

=======

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { Project } from '@/components/ProjectCard';

// Extended Project type to include additional properties
type ExtendedProject = Project & {
  chef?: string;
  region?: string; 
  budget?: string;
  startDate?: string;
  endDate?: string;
  documents?: Array<{id: string, title: string, url: string}>;
  city?: string;
};
>>>>>>> upstream/main

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
<<<<<<< HEAD
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
              avatar: member.avatar || 'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=',
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
  
  
  if (loading) return <div>Chargement du projet...</div>;
  if (!project) return null;

  return <ProjectForm project={project} isEdit={true} />;
=======
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
            console.log("Found project to edit:", foundProject);
            setProject(foundProject);
          } else {
            console.error('Project not found');
            navigate('/project');
          }
        } catch (error) {
          console.error('Error loading project:', error);
          navigate('/project');
        }
      } else {
        // If no projects in localStorage, use sample data
        const sampleProject: ExtendedProject = {
          id: id,
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
          chef: '',
          region: '',
          budget: '',
          startDate: '',
          endDate: '',
          city: ''
        };
        setProject(sampleProject);
      }
    }
  }, [id, navigate]);
  
  return project ? <ProjectForm project={project} isEdit={true} /> : null;
>>>>>>> upstream/main
};

export default ProjectEditPage;
