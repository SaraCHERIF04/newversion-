
import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileEdit, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/types/Document';

const DocumentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [subProjectName, setSubProjectName] = useState<string>('');
  
  useEffect(() => {
    if (id) {
      // Load document
      const documentsString = localStorage.getItem('documents');
      if (documentsString) {
        try {
          const documents = JSON.parse(documentsString);
          const foundDocument = documents.find((doc: Document) => doc.id === id);
          if (foundDocument) {
            setDocument(foundDocument);
            
            // Get project name
            if (foundDocument.projectId) {
              const projectsString = localStorage.getItem('projects');
              if (projectsString) {
                const projects = JSON.parse(projectsString);
                const project = projects.find((p: any) => p.id === foundDocument.projectId);
                if (project) {
                  setProjectName(project.name);
                }
              }
            }
            
            // Get subProject name
            if (foundDocument.subProjectId) {
              const subProjectsString = localStorage.getItem('subProjects');
              if (subProjectsString) {
                const subProjects = JSON.parse(subProjectsString);
                const subProject = subProjects.find((sp: any) => sp.id === foundDocument.subProjectId);
                if (subProject) {
                  setSubProjectName(subProject.name);
                }
              }
            }
          } else {
            navigate('/documents');
          }
        } catch (error) {
          console.error('Error loading document:', error);
          navigate('/documents');
        }
      } else {
        navigate('/documents');
      }
    }
  }, [id, navigate]);
  
  const printDocument = () => {
    window.print();
  };
  
  if (!document) {
    return <div className="p-8 text-center">Chargement...</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux documents</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{document.title}</h1>
          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate(`/documents/edit/${document.id}`)}
              variant="outline"
              className="flex items-center"
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button 
              onClick={printDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimer
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-medium mb-4">Informations du document</h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <div className="font-medium">{document.type}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Date d'ajout</div>
                <div className="font-medium">{document.dateAdded}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Projet</div>
                <div className="font-medium">{projectName || 'Non associé'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Sous-projet</div>
                <div className="font-medium">{subProjectName || 'Non associé'}</div>
              </div>
=======
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {documentService} from '@/services/documentService';

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [project, setProject] = useState(null);
  const [subProject, setSubProject] = useState(null);

  useEffect( () => {
    // Load the document from localStorage
    const fetchDocument = async () => {
      const document = await documentService.getDocumentById(id,null);
      setDocument(document.data);
    };
    fetchDocument();
    
    
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
          <CardTitle>{document.titre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p>{document.type}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date d'ajout</h3>
              <p>{document.date_ajout}</p>
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
              <p>{document.project ? document.project.nom_projet : 'Aucun'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Sous-projet associé</h3>
              <p>{document.subproject ? document.subproject.nom_sous_projet : 'Aucun'}</p>
>>>>>>> upstream/main
            </div>
          </div>
          
          <div>
<<<<<<< HEAD
            <h2 className="text-lg font-medium mb-4">Description</h2>
            <div className="p-4 bg-gray-50 rounded-md min-h-[150px]">
              {document.description || 'Aucune description disponible.'}
            </div>
          </div>
        </div>
        
        {document.url && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Fichier</h2>
            <div className="flex items-center">
              <a 
                href={document.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 inline-block"
              >
                Ouvrir le document
              </a>
            </div>
          </div>
        )}
      </div>
=======
            <h3 className="text-sm font-medium text-gray-500">Fichier</h3>
            <p>{document.files ? document.files.map(file => file.chemin).join(', ') : 'Aucun'}</p>
            <div className="mt-2">
              <Button variant="outline" className="text-sm">
                Télécharger les fichiers
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                (Fonctionnalité de téléchargement simulée pour cette démo)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
>>>>>>> upstream/main
    </div>
  );
};

export default DocumentDetailsPage;
