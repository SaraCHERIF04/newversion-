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
};

export default ProjectDetailsPage;
