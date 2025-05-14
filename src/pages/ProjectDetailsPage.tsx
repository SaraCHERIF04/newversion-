import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectDetails from '@/components/ProjectDetails';
import { Project } from '@/components/ProjectCard';
import { projetService } from '@/services/projetService';

export type ExtendedProject = Project & {
  chef?: string;
  region?: string;
  budget?: string;
  startDate?: string;
  endDate?: string;
  documents?: Array<{ id: string; title: string; url: string }>;
  subProjects?: Array<any>;
};

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<ExtendedProject | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;

      try {
        const userRole = localStorage.getItem('userRole') || 'user';
        const response = await projetService.getProjetById(id, userRole);

        if (response.success && response.data) {
          const p = response.data;

          const formattedProject: ExtendedProject = {
            id: String(p.id_projet),
            name: p.nom_projet,
            description: p.description_de_projet,
            status: p.status as 'En cours' | 'Terminé' | 'En attente', // Updated to match backend field
            deadline: p.deadline,  // Ensure backend provides this field if needed
            members: (p.members || []).map((member) => ({
                id: String(member.id_utilisateur),  // Ensure 'id_utilisateur' is correct
                name: `${member.nom} ${member.prenom}`,
                avatar: member.avatar || '/default-avatar.png'
            })),
            documentsCount: p.documents?.length || 0,
            chef: p.chef_projet?.nom || '',  // Changed to match 'chef_projet' in backend
            region: p.wilaya || '',  // Ensure backend provides 'wilaya' if needed
            budget: `${p.budget} Da`,  // Ensure backend provides 'budget' if needed
            startDate: p.date_debut_de_projet,
            endDate: p.date_fin_de_projet,
            documents: (p.documents || []).map((doc) => ({
                id: String(doc.id_document), // Ensure 'id_document' is correct
                title: doc.titre || 'Untitled Document',
                url: doc.chemin || '#'
            })),
            subProjects: p.subprojects || [] // Ensure 'subprojects' is correctly mapped
        };
        
          
          setProject(formattedProject);
        } else {
          setError(response.message || 'Projet introuvable');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du projet :', err);
        setError('Erreur serveur');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <div className="text-center">Chargement...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return <ProjectDetails project={project} />;
};

export default ProjectDetailsPage;
