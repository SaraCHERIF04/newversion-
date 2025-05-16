import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { addNotification } from '@/types/User';
import { projetService } from '@/services/projetService';
import { documentService } from '@/services/documentService';
import { sousProjetService } from '@/services/sousProjetService';

const DOCUMENT_TYPES = [
  { id: 'pdf', name: 'PDF' },
{ id: 'word', name: 'Word' },
  { id: 'excel', name: 'Excel' },
  { id: 'image', name: 'Image' },
  { id: 'autre', name: 'Autre' }
];

const DocumentFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const isEdit = Boolean(editId);
  const userId = localStorage.getItem('userId') || 'default-user';
  const userName = localStorage.getItem('userName') || 'Employé';

  const [document, setDocument] = useState({
    id: uuidv4(),
    titre: '',
    type: 'pdf',
    description: '',
    date_ajout: new Date().toISOString().split('T')[0],
    id_projet: '',
    id_sous_projet: '',
    nom_projet: '',
    nom_sous_projet: '',
  });

  const [projects, setProjects] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await projetService.getAllProjets(1, 'chef');
      setProjects(response.data);
    };

    const fetchDocument = async () => {
      const response = await documentService.getDocumentById(editId, 'chef');
      // Transform the API response to match the expected document structure
      const documentData = response.data as any;
      setDocument({
        id: documentData.id || uuidv4(),
        titre: documentData.titre || '',
        type: documentData.type || 'pdf',
        description: documentData.description || '',
        date_ajout: documentData.date_ajout || new Date().toISOString().split('T')[0],
        id_projet: documentData.id_projet || '',
        id_sous_projet: documentData.id_sous_projet || '',
        nom_projet: documentData.nom_projet || '',
        nom_sous_projet: documentData.nom_sous_projet || '',
      });
    };
    fetchProjects();
    if (isEdit) {
      fetchDocument();
    }
  }, [editId, isEdit, userId]);

  useEffect(() => {
    const fetchSubProjects = async () => {
      const response = await sousProjetService.getSousProjetsByProjetId(document.id_projet);
      // Use type assertion to handle the unexpected structure
      setFilteredSubProjects((response.data as any).results || []);
    };
    fetchSubProjects();
  }, [document.id_projet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument({ ...document, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    if (name === 'id_projet') {
      const selectedProject = projects.find(project => project.id_projet == value);
      setDocument(prev => ({ 
        ...prev, 
        [name]: value,
        nom_projet: selectedProject ? selectedProject.nom_projet : null,
        id_sous_projet: ''
      }));
    } else if(name === 'id_sous_projet'){
      console.log(value);
      const selectedSubProject = filteredSubProjects.find(project => project.id_sous_projet == value);
      setDocument(prev => ({ 
        ...prev, 
        [name]: value,
        nom_sous_projet: selectedSubProject ? selectedSubProject.nom_sous_projet : null ,
        id_sous_projet: selectedSubProject ? selectedSubProject.id_sous_projet : null
      }));
    }else{
      setDocument(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    
    if (!document.type || document.type === 'autre') {
      const firstFile = selectedFiles[0] as File;
      const fileExtension = firstFile.name.split('.').pop()?.toLowerCase();
      
      let documentType = 'autre';
      if (fileExtension === 'pdf') documentType = 'pdf';
      else if (['doc', 'docx'].includes(fileExtension)) documentType = 'word';
      else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) documentType = 'excel';
      else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) documentType = 'image';
      
      setDocument({
        ...document,
        type: documentType
      });
    }
  };
  
  const handleRemoveFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleRemoveExistingFile = (index) => {
    const newExistingFiles = [...existingFiles];
    newExistingFiles.splice(index, 1);
    setExistingFiles(newExistingFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!document.titre.trim()) {
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

    if (!isEdit && files.length === 0 && existingFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Au moins un fichier est requis",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    
    // Add document metadata
    formData.append('titre', document.titre);
    formData.append('type', document.type);
    formData.append('description', document.description);
    formData.append('date_ajout', document.date_ajout);
    formData.append('id_projet', document.id_projet || '');
    formData.append('id_sous_projet', document.id_sous_projet || '');

    // Add files
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    try {
      if (isEdit) {
        await documentService.updateDocument(editId, formData, 'employee');
        toast({
          title: "Document modifié",
          description: "Le document a été mis à jour avec succès"
        });
      } else {
        await documentService.createDocument(formData,'');
        toast({
          title: "Document ajouté",
          description: "Le document a été ajouté avec succès"
        });
      }
      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde du document",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/employee/documents')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
        <h1 className="text-2xl font-bold ml-2">{isEdit ? 'Modifier' : 'Ajouter'} un document</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titre" className="text-sm font-medium">Titre du document</Label>
            <Input
              id="titre"
              name="titre"
              value={document.titre}
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
                <SelectValue placeholder="Sélectionnez un type"  />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
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
            <Label htmlFor="id_projet" className="text-sm font-medium">Projet associé</Label>
            <Select
              value={document.id_projet}
              onValueChange={(value) => handleSelectChange('id_projet', value)}
            >
              <SelectTrigger id="id_projet" className="mt-1">
                <SelectValue placeholder="Sélectionnez un projet (optionnel)">
                  {document.nom_projet || null}
                </SelectValue>
              </SelectTrigger>
              
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id_projet} value={project.id_projet}>
                    {project.nom_projet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {document.nom_projet && (
              <p className="mt-2 text-sm text-gray-600">
                Projet sélectionné: <span className="font-medium">{document.nom_projet}</span>
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="id_sous_projet" className="text-sm font-medium">Sous-projet associé</Label>
            <Select
              value={document.id_sous_projet}
              onValueChange={(value) => handleSelectChange('id_sous_projet', value)}
              disabled={!document.id_projet || filteredSubProjects.length === 0}
            >
              <SelectTrigger id="id_sous_projet" className="mt-1">
                <SelectValue placeholder={document.id_projet ? "Sélectionnez un sous-projet (optionnel)" : "Veuillez d'abord sélectionner un projet"} >
                  {document.nom_sous_projet || null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                {filteredSubProjects.map((subProject) => (
                  <SelectItem key={subProject.id_sous_projet} value={subProject.id_sous_projet}>
                    {subProject.nom_sous_projet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {document.nom_sous_projet && (
              <p className="mt-2 text-sm text-gray-600">
                Sous-projet sélectionné: <span className="font-medium">{document.nom_sous_projet}</span>
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="file" className="text-sm font-medium">Fichiers</Label>
            <Input
              id="file"
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1"
            />
            
            {existingFiles.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Fichiers existants ({existingFiles.length}):</p>
                <div className="space-y-2">
                  {existingFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExistingFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-1">Nouveaux fichiers ({files.length}):</p>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Vous pouvez télécharger plusieurs fichiers à la fois. 
              Maintenez la touche Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs fichiers.
            </p>
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
          <Button type="submit" variant="default">
            {isEdit ? 'Mettre à jour' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentFormPage;
