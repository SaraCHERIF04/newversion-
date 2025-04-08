
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { Document, DocumentType } from '@/types/Document';
import { Project } from '@/components/ProjectCard';
import { SubProject } from '@/components/SubProjectCard';

const DocumentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<DocumentType>('pdf');
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState<string>('');
  const [subProjectId, setSubProjectId] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [availableSubProjects, setAvailableSubProjects] = useState<SubProject[]>([]);
  
  useEffect(() => {
    // Load projects
    const projectsString = localStorage.getItem('projects');
    if (projectsString) {
      try {
        const projectsList = JSON.parse(projectsString);
        setProjects(projectsList);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }
    
    // Load subProjects
    const subProjectsString = localStorage.getItem('subProjects');
    if (subProjectsString) {
      try {
        const subProjectsList = JSON.parse(subProjectsString);
        setSubProjects(subProjectsList);
      } catch (error) {
        console.error('Error loading subProjects:', error);
      }
    }
    
    // If editing, load document data
    if (isEdit && id) {
      const documentsString = localStorage.getItem('documents');
      if (documentsString) {
        try {
          const documents = JSON.parse(documentsString);
          const document = documents.find((doc: Document) => doc.id === id);
          if (document) {
            setTitle(document.title);
            setDescription(document.description || '');
            setType(document.type);
            setDateAdded(document.dateAdded);
            setProjectId(document.projectId || '');
            setSubProjectId(document.subProjectId || '');
            setFileUrl(document.url || '');
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      }
    }
  }, [id, isEdit]);
  
  useEffect(() => {
    if (projectId) {
      // Filter subProjects by projectId
      const filtered = subProjects.filter(sp => sp.projectId === projectId);
      setAvailableSubProjects(filtered);
      
      // If the currently selected subProject doesn't belong to the new project, reset it
      if (subProjectId && !filtered.some(sp => sp.id === subProjectId)) {
        setSubProjectId('');
      }
    } else {
      setAvailableSubProjects([]);
      setSubProjectId('');
    }
  }, [projectId, subProjects, subProjectId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  
  const getDocumentType = (fileName: string): DocumentType => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) return 'autre';
    
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (extension === 'pdf') return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension)) return 'image';
    
    return 'autre';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a URL for the file (in a real app, this would upload to a server)
    let url = fileUrl;
    if (file) {
      // In a real app, upload the file to a server
      // For now, we'll just create a fake URL
      url = `/documents/${file.name}`;
    }
    
    const documentData: Document = {
      id: id || `doc-${Date.now()}`,
      title,
      type: file ? getDocumentType(file.name) : type,
      dateAdded,
      projectId: projectId || undefined,
      subProjectId: subProjectId || undefined,
      description,
      url
    };
    
    // Save document to localStorage
    const documentsString = localStorage.getItem('documents');
    let documents: Document[] = [];
    
    if (documentsString) {
      try {
        documents = JSON.parse(documentsString);
        
        if (isEdit) {
          // Update existing document
          documents = documents.map(doc => doc.id === id ? documentData : doc);
        } else {
          // Add new document - add to beginning of array to show newest first
          documents.unshift(documentData);
        }
      } catch (error) {
        console.error('Error parsing documents:', error);
        if (!isEdit) {
          documents = [documentData];
        }
      }
    } else {
      documents = [documentData];
    }
    
    localStorage.setItem('documents', JSON.stringify(documents));
    
    // If a project is selected, add/update the document to the project
    if (projectId) {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        try {
          const projects = JSON.parse(projectsString);
          const projectIndex = projects.findIndex((p: Project) => p.id === projectId);
          
          if (projectIndex !== -1) {
            if (!projects[projectIndex].documents) {
              projects[projectIndex].documents = [];
            }
            
            const docIndex = projects[projectIndex].documents.findIndex((d: any) => d.id === documentData.id);
            const documentForProject = {
              id: documentData.id,
              title: documentData.title,
              url: documentData.url
            };
            
            if (docIndex !== -1) {
              // Update existing document
              projects[projectIndex].documents[docIndex] = documentForProject;
            } else {
              // Add new document
              projects[projectIndex].documents.push(documentForProject);
            }
            
            // Update documentsCount
            projects[projectIndex].documentsCount = projects[projectIndex].documents.length;
            
            localStorage.setItem('projects', JSON.stringify(projects));
          }
        } catch (error) {
          console.error('Error updating project:', error);
        }
      }
    }
    
    // If a subProject is selected, add/update the document to the subProject
    if (subProjectId) {
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        try {
          const subProjects = JSON.parse(subProjectsString);
          const subProjectIndex = subProjects.findIndex((sp: SubProject) => sp.id === subProjectId);
          
          if (subProjectIndex !== -1) {
            if (!subProjects[subProjectIndex].documents) {
              subProjects[subProjectIndex].documents = [];
            }
            
            const docIndex = subProjects[subProjectIndex].documents.findIndex((d: any) => d.id === documentData.id);
            const documentForSubProject = {
              id: documentData.id,
              title: documentData.title,
              url: documentData.url
            };
            
            if (docIndex !== -1) {
              // Update existing document
              subProjects[subProjectIndex].documents[docIndex] = documentForSubProject;
            } else {
              // Add new document
              subProjects[subProjectIndex].documents.push(documentForSubProject);
            }
            
            // Update documentsCount
            subProjects[subProjectIndex].documentsCount = subProjects[subProjectIndex].documents.length;
            
            localStorage.setItem('subProjects', JSON.stringify(subProjects));
          }
        } catch (error) {
          console.error('Error updating subProject:', error);
        }
      }
    }
    
    navigate('/documents');
  };
  
  const handleDelete = () => {
    if (isEdit && window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      try {
        const documentsString = localStorage.getItem('documents');
        if (documentsString) {
          const documents = JSON.parse(documentsString);
          const updatedDocuments = documents.filter((doc: Document) => doc.id !== id);
          localStorage.setItem('documents', JSON.stringify(updatedDocuments));
          
          // Also remove from projects
          const projectsString = localStorage.getItem('projects');
          if (projectsString) {
            const projects = JSON.parse(projectsString);
            const updatedProjects = projects.map((project: any) => {
              if (project.documents) {
                project.documents = project.documents.filter((doc: any) => doc.id !== id);
              }
              return project;
            });
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
          }
          
          // Also remove from subProjects
          const subProjectsString = localStorage.getItem('subProjects');
          if (subProjectsString) {
            const subProjects = JSON.parse(subProjectsString);
            const updatedSubProjects = subProjects.map((subProject: any) => {
              if (subProject.documents) {
                subProject.documents = subProject.documents.filter((doc: any) => doc.id !== id);
              }
              return subProject;
            });
            localStorage.setItem('subProjects', JSON.stringify(updatedSubProjects));
          }
          
          navigate('/documents');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux documents</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-8">
        {isEdit ? 'Modifier' : 'Créer'} Document
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="title" className="mb-2 block">Titre du document</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type" className="mb-2 block">Type de document</Label>
              <Select value={type} onValueChange={(value) => setType(value as DocumentType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="word">Word</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date" className="mb-2 block">Date d'Ajout</Label>
              <Input
                id="date"
                type="date"
                value={dateAdded}
                onChange={(e) => setDateAdded(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="project" className="mb-2 block">Projet associé</Label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="sélectionnez un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="subProject" className="mb-2 block">Sous Projet associé</Label>
              <Select 
                value={subProjectId} 
                onValueChange={setSubProjectId}
                disabled={!projectId || availableSubProjects.length === 0}
              >
                <SelectTrigger id="subProject">
                  <SelectValue placeholder="sélectionnez un projet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {availableSubProjects.map((subProject) => (
                    <SelectItem key={subProject.id} value={subProject.id}>
                      {subProject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description" className="mb-2 block">Description du document</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
          </div>
          
          <div className="mb-8">
            <Label htmlFor="file" className="mb-2 block">Document</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger un document
              </Button>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              {file && <span className="text-sm text-gray-600">{file.name}</span>}
              {!file && fileUrl && <span className="text-sm text-gray-600">{fileUrl.split('/').pop()}</span>}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            {isEdit && (
              <Button 
                type="button" 
                variant="outline" 
                className="text-red-600 border-red-300 hover:bg-red-50"
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentFormPage;
