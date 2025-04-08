
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '@/components/ProjectDetails';

const EmployeeProjectDetailsPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(undefined);
  
  useEffect(() => {
    if (id) {
      // Try to get the project from localStorage
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const foundProject = projects.find((p) => p.id === id);
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
  const sampleProject = {
    id: id || '1',
    name: 'Projet introuvable',
    description: 'Ce projet n\'existe pas ou a été supprimé',
    status: 'Inconnu',
    members: [],
    documentsCount: 0
  };
  
  return (
    <div>
      <ProjectDetails project={project || sampleProject} isEmployee={true} />
    </div>
  );
};

export default EmployeeProjectDetailsPage;
