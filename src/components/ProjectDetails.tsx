import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProjectDetailsPage from '@/pages/ProjectDetailsPage';
import ProjectMembersList from './ProjectMembersList';
import { projetService } from '@/services/projetService';
import { ProjetInterface } from '@/interfaces/ProjetInterface';


const ProjectDetails: React.FC = () => {
  
   const { id } = useParams();
   const [project, setProject] = useState<ProjetInterface | null>(null);
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-projet?')) {
      try {
        const id = project?.id_projet; // replace with the actual project ID
        const userRole = 'chef de projet'; // replace this with the actual user role variable
  
        await projetService.deleteProjet(String(id), userRole);
  
        // Optionally: refresh the list or give user feedback
        alert('projet supprimé avec succès.');
        // e.g., refreshProjects(); or navigate away
      } catch (error) {
        console.error('Error deleting project:', error);
        alert("Une erreur s'est produite lors de la suppression du sous-projet.");
      }
    }
  };
  useEffect(() => {
     if (!id) {
    console.error("No project ID provided.");
    return;
  }
    const fetchProject = async () => {
      try {
        const response = await projetService.getProjetById(id, 'chef de projet');
        setProject(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
      }
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>Chargement...</div>;
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.nom_projet}</h1>
          <p className="text-gray-500">ID: {project.id_projet}</p>
          <p className="text-gray-500"> {project.nom_projet}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to={`/project/dashboard/${project.id_projet}`}>
              Tableau de bord
            </Link>
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to={`/project/budget/${project.id_projet}`}>
              Gestion Budgétaire IA
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/project/edit/${project.id_projet}`}>
              Modifier
            </Link>
          </Button>
           <button 
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              Supprimer
            </button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Informations du projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Description:</strong> {project.description_de_projet || 'Aucune description fournie.'}</p>
              <p><strong>Statut:</strong> {project.status}</p>
              <p><strong>Chef de projet:</strong> {project.chef_projet?.nom ?? 'Non défini'}</p>
              <p><strong>wilaya:</strong> {project.wilaya ?? 'Non défini'}</p>

  <div>
    <p><strong>Maître d'ouvrage:</strong></p>
    <ul>
      <li>
         <strong>Nom:</strong> {project.maitreOuvrage?.nom_mo ?? 'Non défini'}
      </li>

      <li><strong>Description:</strong> {project.maitreOuvrage?.description_mo?? 'Non défini'}</li>
      <li><strong>Type:</strong> {project.maitreOuvrage?.type_mo?? 'Non défini'}</li>
      <li><strong>Adresse:</strong> {project.maitreOuvrage?.adress_mo?? 'Non défini'}</li>
      <li><strong>Email:</strong> {project.maitreOuvrage?.email_mo?? 'Non défini'}</li>
      <li><strong>Téléphone:</strong> {project.maitreOuvrage?.tel_mo?? 'Non défini'}</li>
    </ul>
  </div>

              {Array.isArray(project.budget) && project.budget.length > 0 ? (
                project.budget.map((item, index) => (
                  <div key={index}>
                    <p><strong>Montant AP:</strong>  {item.montant_ap}</p>
                  </div>
                ))
              ) : typeof project.budget === 'number' ? (
                <div>
                  <p><strong>Montant AP:</strong>  {project.budget}</p>
                </div>
              ) : (
                <p>Aucun budget disponible.</p>
              )}
              <p><strong>Date de début:</strong> {project.date_debut_de_projet}</p>
              <p><strong>Date de fin:</strong> {project.date_fin_de_projet}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Membres du projet</CardTitle>
            </CardHeader>
            <CardContent>
              {project.members && project.members.length > 0 ? (
          <ul className="list-disc pl-5">
            {project.members.map((member) => (
              <li key={member.id_utilisateur}>{member.nom} ({member.email})</li>
            ))}
          </ul>
        ) : (
          <p>Aucun membre assigné.</p>
        )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents du projet</CardTitle>
            </CardHeader>
            <CardContent>
             {project.documents && project.documents.length > 0 ? (
  <ul className="list-disc pl-5">
    {project.documents.map((doc) => (
      <li key={doc.id_document}>
        <a
          href={doc.chemin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {doc.titre}
        </a>
      </li>
    ))}
  </ul>
) : (
  <p>Aucun document disponible.</p>
)}

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
