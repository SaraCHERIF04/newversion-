
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EmployeeDocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [project, setProject] = useState(null);
  const [subProject, setSubProject] = useState(null);

  useEffect(() => {
    // Load the document from localStorage
    const documentsString = localStorage.getItem('documents');
    if (documentsString && id) {
      try {
        const documents = JSON.parse(documentsString);
        const foundDocument = documents.find(doc => doc.id === id);
        if (foundDocument) {
          setDocument(foundDocument);
          
          // Load associated project
          if (foundDocument.projectId) {
            const projectsString = localStorage.getItem('projects');
            if (projectsString) {
              const projects = JSON.parse(projectsString);
              const foundProject = projects.find(p => p.id === foundDocument.projectId);
              if (foundProject) {
                setProject(foundProject);
              }
            }
          }
          
          // Load associated subproject
          if (foundDocument.subProjectId) {
            const subProjectsString = localStorage.getItem('subProjects');
            if (subProjectsString) {
              const subProjects = JSON.parse(subProjectsString);
              const foundSubProject = subProjects.find(sp => sp.id === foundDocument.subProjectId);
              if (foundSubProject) {
                setSubProject(foundSubProject);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading document:', error);
      }
    }
  }, [id]);

  if (!document) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Document non trouvé</h1>
        <p className="mb-6">Le document que vous recherchez n'existe pas ou a été supprimé.</p>
        <Button onClick={() => navigate('/employee/documents')}>
          Retourner à la liste des documents
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Détails du document</h1>
        <Button variant="outline" onClick={() => navigate('/employee/documents')}>
          Retour à la liste
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p>{document.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date d'ajout</h3>
              <p>{document.dateAdded}</p>
            </div>
          </div>
          
          {document.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{document.description}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Projet associé</h3>
              <p>{project ? project.name : 'Aucun'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sous-projet associé</h3>
              <p>{subProject ? subProject.name : 'Aucun'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fichier</h3>
            <p>{document.fileName}</p>
            <div className="mt-2">
              <Button variant="outline" disabled className="text-sm">
                Télécharger le fichier
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                (Fonctionnalité de téléchargement simulée pour cette démo)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeDocumentDetailsPage;
