
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubProject } from '@/components/SubProjectCard';
import { ArrowLeft, Printer, Download, BarChart } from 'lucide-react';
import SubProjectMembersList from '@/components/SubProjectMembersList';
import { SousProjetInterface } from './SousProjetInterface';
import { DocumentInterface } from './DocumentInterface';
import { UserInterface } from './UserInterface';
import { sousProjetService } from '@/services/sousProjetService';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SubProjectEditPage from '@/pages/SubProjectDetailsPage';

type Document = {
  id: string;
  title: string;
  url?: string;
};

type SubProjectMember = {
  id: string;
  name: string;
  role?: string;
  avatar: string;
};

const SubProjectDetailsPage: React.FC = () => {
   const { id } = useParams();
  const navigate = useNavigate();
  const [subProject, setSubProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subProjectDocuments, setSubProjectDocuments] = useState([]);
  const [subProjectMeetings, setSubProjectMeetings] = useState([]);
  
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const response = await sousProjetService.getSousProjetById(id);
        setSubProject(response.data);
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [id]);
  
  const handlePrint = () => {
    window.print();
  };
  
 
  const handleDashboard = () => {
    navigate(`/sous-projet/dashboard/${subProject.id}`);
  };
  
  
  const handleBack = () => {
    navigate('/sous-projet');
  };

  const handleDownload = (document) => {
    const link = document.createElement('a');
    link.href = document.fileUrl || `/documents/${document.fileName || 'document'}`;
    link.download = document.fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement...</div>;
  }
  
  if (!subProject) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">Sous-projet non trouvé</p>
        <Button onClick={() => navigate('/employee/sous-projets')}>
          Retour aux sous-projets
        </Button>
      </div>
    );
  }
  

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce sous-projet?')) {
      try {
        
        const userRole = 'chef de projet'; // replace this with the actual user role variable
  
        await sousProjetService.deleteSousProjet(id, userRole);
  
        // Optionally: refresh the list or give user feedback
        alert('Sous-projet supprimé avec succès.');
        // e.g., refreshProjects(); or navigate away
        navigate('/sous-projet');
      } catch (error) {
        console.error('Error deleting sub-project:', error);
        alert("Une erreur s'est produite lors de la suppression du sous-projet.");
      }
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En cours':
        return 'bg-blue-100 text-blue-800';
      case 'Terminé':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-6">
        <button 
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux sous-projets</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">Détails du sous-projet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main subProject details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">{subProject.nom_sous_projet}</h2>
            <span className={`px-3 py-1 ${getStatusColor(subProject.statut_sous_projet)} rounded-full text-sm font-medium`}>
              {subProject.statut_sous_projet}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Projet principal</div>
                <div className="text-sm">Projet {subProject.project.id_projet}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date de fin de projet </div>
                <div className="text-sm">{subProject.project.date_fin_de_projet} </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date début de sous projet </div>
                <div className="text-sm">{subProject.date_debut_sousprojet || "Non spécifié"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="text-xs text-gray-500">Date fin</div>
                <div className="text-sm">{subProject.date_finsousprojet || "Non spécifié"}</div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description du sous-projet</h3>
            <div className="p-4 bg-gray-50 rounded-md min-h-[100px] text-gray-700">
              {subProject.description_sous_projet || "Aucune description disponible."}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button 
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50"
            >
              Supprimer
            </button>
            <button 
              onClick={() =>{
    console.log('Navigate to:', `/sous-projet/edit/${subProject.id_sous_projet}`);
    navigate(`/sous-projet/edit/${ subProject.id_sous_projet}`);
  }}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Modifier
            </button>
            <button 
              onClick={handleDashboard}
              className="px-4 py-2 border border-[#192759] text-[#192759] rounded-md hover:bg-blue-50 flex items-center"
            >
              <BarChart className="mr-2 h-4 w-4" />
              Tableau de bord
            </button>
            
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Documents du sous-projet</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {subProject.documents && subProject.documents.length > 0 ? (
                subProject.documents.map(doc => (
                  <div key={doc.id} className="p-2 bg-blue-50 text-blue-600 rounded-md flex justify-between items-center">
                    <span className="truncate">{doc.title}</span>
                    <button 
                      onClick={() => downloadDocument(doc)}
                      className="text-blue-700 hover:text-blue-900 ml-2"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500">Aucun document disponible</div>
              )}
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-medium mb-3">Membres du sous-projet</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
               {subProject.members && subProject.members.length > 0 ? (
                subProject.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.nom} />
                      <AvatarFallback>{member.nom?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.nom}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun membre assigné</p>
              )}
             
            </div>
          </div>
        </div>
      </div>

      {/* Members in grid format */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Membres du sous-projet</h3>
        <SubProjectMembersList members={subProject.members} />
      </div>
    </div>
  );
};

export default SubProjectDetailsPage;
