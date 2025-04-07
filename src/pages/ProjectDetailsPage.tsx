
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/components/ProjectCard';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | undefined>(undefined);
  
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
  const sampleProject: Project = {
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
  };
  
  return <ProjectDetails project={project || sampleProject} />;
};

export default ProjectDetailsPage;
