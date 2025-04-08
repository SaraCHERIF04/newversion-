import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const DOCUMENT_TYPES = [
  'Rapport',
  'Plan',
  'Contrat',
  'Facture',
  'Documentation technique',
  'Correspondance',
  'Autre'
];

const EmployeeDocumentFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const isEdit = Boolean(editId);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const [document, setDocument] = useState({
    id: uuidv4(),
    title: '',
    type: '',
    description: '',
    dateAdded: new Date().toISOString().split('T')[0],
    projectId: '',
    subProjectId: '',
    fileUrl: '',
    fileName: '',
    createdAt: new Date().toISOString(),
    createdBy: userId,
    createdByName: userName
  });

  const [projects, setProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Load projects and subprojects from localStorage
    const projectsString = localStorage.getItem('projects');
    const subProjectsString = localStorage.getItem('subProjects');

    if (projectsString) {
      try {
        const loadedProjects = JSON.parse(projectsString);
        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    if (subProjectsString) {
      try {
        const loadedSubProjects = JSON.parse(subProjectsString);
        setSubProjects(loadedSubProjects);
      } catch (error) {
        console.error('Error loading subprojects:', error);
      }
    }

    // If editing, load document data
    if (isEdit) {
      const documentsString = localStorage.getItem('documents');
      if (documentsString) {
        try {
          const documents = JSON.parse(documentsString);
          const docToEdit = documents.find(doc => doc.id === editId);
          
          if (docToEdit) {
            // Check if this document belongs to the current user
            if (docToEdit.createdBy !== userId) {
              toast({
                title: "Accès refusé",
                description: "Vous ne pouvez pas modifier ce document car il ne vous appartient pas.",
                variant: "destructive"
              });
              navigate('/employee/documents');
              return;
            }
            
            setDocument(docToEdit);
          } else {
            toast({
              title: "Document introuvable",
              description: "Le document que vous essayez de modifier n'existe pas.",
              variant: "destructive"
            });
            navigate('/employee/documents');
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      }
    }
  }, [editId, isEdit, navigate, userId]);

  useEffect(() => {
    // Filter subprojects based on selected project
    if (document.projectId) {
      const filtered = subProjects.filter(sp => sp.projectId === document.projectId);
      setFilteredSubProjects(filtered);
    } else {
      setFilteredSubProjects([]);
    }
  }, [document.projectId, subProjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument({ ...document, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setDocument({ ...document, [name]: value });
    
    // Reset subProjectId if projectId changes
    if (name === 'projectId') {
      setDocument(prev => ({ ...prev, subProjectId: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setDocument({
      ...document,
      fileName: selectedFile.name
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!document.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du document est requis",
        variant: "destructive"
      });
      return;
    }

    if (!document.type) {
      toast({
        title: "Erreur",
        description: "Le type de document est requis",
        variant: "destructive"
      });
      return;
    }

    if (!isEdit && !file) {
      toast({
        title: "Erreur",
        description: "Un fichier est requis",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would upload the file to a server
    // For this demo, we'll simulate a file URL
    const simulatedFileUrl = file ? 
      `data:application/octet-stream;base64,${document.fileName}` : 
      document.fileUrl;
    
    const updatedDocument = {
      ...document,
      fileUrl: simulatedFileUrl,
      createdBy: userId, // Ensure this is always set
      createdByName: userName,
      updatedAt: new Date().toISOString()
    };

    // Load existing documents
    const documentsString = localStorage.getItem('documents');
    let documents = [];
    
    if (documentsString) {
      try {
        documents = JSON.parse(documentsString);
      } catch (error) {
        console.error('Error parsing documents:', error);
      }
    }

    if (isEdit) {
      // Update existing document
      const updatedDocuments = documents.map(doc => 
        doc.id === editId ? updatedDocument : doc
      );
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document modifié",
        description: "Le document a été mis à jour avec succès"
      });
    } else {
      // Add new document at the beginning of the array
      documents.unshift(updatedDocument);
      localStorage.setItem('documents', JSON.stringify(documents));
      
      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès"
      });
    }

    // Navigate back to documents list
    navigate('/employee/documents');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Ajouter'} un document</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-sm font-medium">Titre du document</Label>
            <Input
              id="title"
              name="title"
              value={document.title}
              onChange={handleChange}
              className="mt-1"
              placeholder="Entrez le titre du document"
            />
          </div>
          
          <div>
            <Label htmlFor="type" className="text-sm font-medium">Type de document</Label>
            <Select
              value={document.type}
              onValueChange={(value) => handleSelectChange('type', value)}
            >
              <SelectTrigger id="type" className="mt-1">
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={document.description}
              onChange={handleChange}
              className="mt-1"
              placeholder="Entrez une description du document"
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="projectId" className="text-sm font-medium">Projet associé</Label>
            <Select
              value={document.projectId}
              onValueChange={(value) => handleSelectChange('projectId', value)}
            >
              <SelectTrigger id="projectId" className="mt-1">
                <SelectValue placeholder="Sélectionnez un projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subProjectId" className="text-sm font-medium">Sous-projet associé</Label>
            <Select
              value={document.subProjectId}
              onValueChange={(value) => handleSelectChange('subProjectId', value)}
              disabled={!document.projectId || filteredSubProjects.length === 0}
            >
              <SelectTrigger id="subProjectId" className="mt-1">
                <SelectValue placeholder={document.projectId ? "Sélectionnez un sous-projet (optionnel)" : "Veuillez d'abord sélectionner un projet"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {filteredSubProjects.map((subProject) => (
                  <SelectItem key={subProject.id} value={subProject.id}>
                    {subProject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="file" className="text-sm font-medium">Fichier</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="mt-1"
            />
            {document.fileName && (
              <p className="text-sm text-gray-500 mt-1">
                Fichier sélectionné: {document.fileName}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end pt-4 space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/employee/documents')}
          >
            Annuler
          </Button>
          <Button type="submit">
            {isEdit ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeDocumentFormPage;
