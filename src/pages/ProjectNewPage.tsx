
import React from 'react';
import ProjectForm from '@/components/ProjectForm';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const ProjectNewPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (data: any) => {
    // Create a new project with the form data
    const newProject = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    
    // Save to localStorage
    try {
      const projectsString = localStorage.getItem('projects');
      const projects = projectsString ? JSON.parse(projectsString) : [];
      projects.unshift(newProject);
      localStorage.setItem('projects', JSON.stringify(projects));
      navigate('/project');
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };
  
  return <ProjectForm onSubmit={handleSubmit} />;
};

export default ProjectNewPage;
