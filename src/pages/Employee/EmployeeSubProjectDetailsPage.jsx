import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Printer, Download, BarChart } from 'lucide-react';
import { sousProjetService } from '@/services/sousProjetService';
const EmployeeSubProjectDetailsPage = () => {
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
    navigate(`/employee/sous-projets/dashboard/${id}`);
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/employee/sous-projets')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <h1 className="text-2xl font-bold">{subProject.name}</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDashboard}
            className="flex items-center gap-1"
          >
            <BarChart className="h-4 w-4" />
            <span>Tableau de bord</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="flex items-center gap-1"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimer</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">État du sous-projet</h3>
          </CardHeader>
          <CardContent>
            <Badge 
              className={`${
                subProject.statut_sous_projet === 'Terminé' ? 'bg-green-100 text-green-800' :
                subProject.statut_sous_projet === 'En cours' ? 'bg-blue-100 text-blue-800' :
                subProject.statut_sous_projet === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {subProject.statut_sous_projet}
            </Badge>
            <p className="mt-4 text-sm text-gray-500">
              Échéance: {subProject.date_finsousprojet || 'Non définie'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Détails</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Projet parent:</span>
              <span className="text-sm font-medium">{subProject.project.nom_projet || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Chef de projet:</span>
              <span className="text-sm font-medium">{subProject?.hef_projet?.nom_utilisateur || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Budget:</span>
              <span className="text-sm font-medium">{subProject.budget || 'Non défini'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date début:</span>
              <span className="text-sm font-medium">{subProject.date_debut_sousprojet || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date fin:</span>
              <span className="text-sm font-medium">{subProject.date_finsousprojet || 'Non définie'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Équipe</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
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
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="documents">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Documents du sous-projet</h3>
              </div>
              <div className="space-y-4">
                {subProject.documents.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {subProject.documents.map((doc) => (
                      <div key={doc.id_document} className="flex items-center justify-between border rounded-md p-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {doc.type === 'pdf' && (
                              <div className="bg-red-100 text-red-700 p-2 rounded">PDF</div>
                            )}
                            {doc.type === 'excel' && (
                              <div className="bg-green-100 text-green-700 p-2 rounded">XLS</div>
                            )}
                            {doc.type === 'word' && (
                              <div className="bg-blue-100 text-blue-700 p-2 rounded">DOC</div>
                            )}
                            {doc.type === 'image' && (
                              <div className="bg-purple-100 text-purple-700 p-2 rounded">IMG</div>
                            )}
                            {(!doc.type || doc.type === 'autre') && (
                              <div className="bg-gray-100 text-gray-700 p-2 rounded">DOC</div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{doc.titre}</div>
                            <div className="text-sm text-gray-500">{doc.date_ajout || 'Date inconnue'}</div>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownload(doc)}
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          <span>Télécharger</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun document associé à ce sous-projet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeSubProjectDetailsPage;
