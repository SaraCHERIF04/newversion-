
import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { Project } from '@/components/ProjectCard';

// Sample data - in a real app this would come from an API
const sampleProject: Project = {
  id: '1',
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

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, you would fetch the project data based on the id
  const project = sampleProject;
  
  return <ProjectForm project={project} isEdit={true} />;
};

export default ProjectEditPage;
