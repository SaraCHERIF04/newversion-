
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SubProjectForm from '@/components/SubProjectForm';
import { SubProject } from '@/components/SubProjectCard';
import { sousProjetService } from '@/services/sousProjetService';
import { SousProjetInterface } from './SousProjetInterface';

const SubProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState<SubProject | undefined>(undefined);
  
  useEffect(() => {
    const fetchSousProject = async () => {
      try {
        if (id) {
          const response = await sousProjetService.getSousProjetById(id, 'chef de projet');
          const p: SousProjetInterface = response.data;
  
          const transformedProject: SousProjetInterface = {
  id_sous_projet: p.id_sous_projet,
  nom_sous_projet: p.nom_sous_projet,
  description_sous_projet: p.description_sous_projet,
  statut_sous_projet: p.statut_sous_projet,
  date_debut_sousprojet: p.date_debut_sousprojet,
  date_finsousprojet: p.date_finsousprojet,
  project: p.id_projet,

  chef_projet: p.chef_projet
  ? {
      id_utilisateur: p.chef_projet.id_utilisateur,
      nom: p.chef_projet.nom,
      avatar: p.chef_projet.avatar || '',
      role_de_utilisateur: p.chef_projet.role_de_utilisateur || '',
      // Add other fields from UserInterface if needed
    }
  : null,

  members: (p.members || []).map((member: any) => ({
    id_utilisateur: member.id_utilisateur,
    nom: member.nom,
    avatar: member.avatar || '',
    role_de_utilisateur: member.role_de_utilisateur || '',
    // Add other fields from UserInterface if required
  })),

  documents: p.documents || []
};

          setSubProject(transformedProject);
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } 
    };
  
    fetchSousProject();
  }, [id]);
  
  
  
  return subProject ? <SubProjectForm subProject={subProject} isEdit={true} /> : null;
};

export default SubProjectEditPage;
