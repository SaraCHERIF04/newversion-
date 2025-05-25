import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectForm from '@/components/ProjectForm';
import { projetService } from '@/services/projetService'; // adjust path as needed
import { Project } from '@/components/ProjectCard';
import { ProjetInterface } from '@/interfaces/ProjetInterface';
import { ProjetListResponse } from '@/interfaces/ProjetListResponse';


const ProjectEditPage: React.FC = () => {
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
};

export default ProjectEditPage;
