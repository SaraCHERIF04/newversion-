
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Printer, Download } from 'lucide-react';

const EmployeeProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subProjects, setSubProjects] = useState([]);
  const [projectDocuments, setProjectDocuments] = useState([]);
  const [projectMeetings, setProjectMeetings] = useState([]);
  
  useEffect(() => {
    // Fetch project details
    const fetchProject = () => {
      setLoading(true);
      try {
        // Get projects from localStorage
        const projectsString = localStorage.getItem('projects');
        if (projectsString) {
          const projects = JSON.parse(projectsString);
          const foundProject = projects.find(p => p.id === id);
          if (foundProject) {
            setProject(foundProject);
            
            // Fetch sub-projects for this project
            const subProjectsString = localStorage.getItem('subProjects');
            if (subProjectsString) {
              const allSubProjects = JSON.parse(subProjectsString);
              const projectSubProjects = allSubProjects.filter(sp => sp.projectId === id);
              setSubProjects(projectSubProjects);
            }
            
            // Fetch documents for this project
            const documentsString = localStorage.getItem('documents');
            if (documentsString) {
              const allDocuments = JSON.parse(documentsString);
              const projectDocs = allDocuments.filter(doc => doc.projectId === id);
              setProjectDocuments(projectDocs);
            }
            
            // Fetch meetings for this project
            const meetingsString = localStorage.getItem('meetings');
            if (meetingsString) {
              const allMeetings = JSON.parse(meetingsString);
              const projectMeetings = allMeetings.filter(meeting => meeting.projectId === id);
              setProjectMeetings(projectMeetings);
            }
          } else {
            // Project not found
            console.error('Project not found');
          }
        }
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
  
  const handleDownload = (document) => {
    // Create a dummy anchor element to trigger download
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
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg text-gray-600 mb-4">Projet non trouvé</p>
        <Button onClick={() => navigate('/employee/projects')}>
          Retour aux projets
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
            onClick={() => navigate('/employee/projects')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <h1 className="text-2xl font-bold">{project.name}</h1>
        </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">État du projet</h3>
          </CardHeader>
          <CardContent>
            <Badge 
              className={`${
                project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                project.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                project.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status}
            </Badge>
            <p className="mt-4 text-sm text-gray-500">
              Échéance: {project.deadline || 'Non définie'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Détails</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Chef de projet:</span>
              <span className="text-sm font-medium">{project.chef || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Région:</span>
              <span className="text-sm font-medium">{project.region || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Budget:</span>
              <span className="text-sm font-medium">{project.budget || 'Non défini'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date début:</span>
              <span className="text-sm font-medium">{project.startDate || 'Non définie'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Date fin:</span>
              <span className="text-sm font-medium">{project.endDate || 'Non définie'}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Équipe</h3>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.members && project.members.length > 0 ? (
                project.members.map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Aucun membre assigné</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="sous-projets">
        <TabsList>
          <TabsTrigger value="sous-projets">Sous-projets</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="reunions">Réunions</TabsTrigger>
        </TabsList>
        <TabsContent value="sous-projets" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Sous-projets associés</h3>
              </div>
              <div className="space-y-4">
                {subProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subProjects.map((subProject) => (
                      <div 
                        key={subProject.id} 
                        className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/employee/sous-projets/${subProject.id}`)}
                      >
                        <div className="font-medium">{subProject.name}</div>
                        <div className="text-sm text-gray-500 truncate">{subProject.description}</div>
                        <div className="mt-2">
                          <Badge 
                            className={`${
                              subProject.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                              subProject.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                              subProject.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {subProject.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucun sous-projet associé à ce projet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Documents du projet</h3>
              </div>
              <div className="space-y-4">
                {projectDocuments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {projectDocuments.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between border rounded-md p-3">
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
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-gray-500">{doc.dateAdded || 'Date inconnue'}</div>
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
                  <p className="text-gray-500">Aucun document associé à ce projet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reunions" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Réunions du projet</h3>
              </div>
              <div className="space-y-4">
                {projectMeetings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectMeetings.map((meeting) => (
                      <div 
                        key={meeting.id} 
                        className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/employee/reunions/${meeting.id}`)}
                      >
                        <div className="font-medium">{meeting.title}</div>
                        <div className="text-sm text-gray-500">Date: {meeting.date}</div>
                        <div className="text-sm text-gray-500">Lieu: {meeting.location}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune réunion associée à ce projet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProjectDetailsPage;
