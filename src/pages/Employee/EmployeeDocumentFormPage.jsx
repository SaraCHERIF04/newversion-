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

const DOCUMENT_TYPES = [
  { id: 'pdf', name: 'PDF' },
  { id: 'word', name: 'Word' },
  { id: 'excel', name: 'Excel' },
  { id: 'image', name: 'Image' },
  { id: 'autre', name: 'Autre' }
];

const EmployeeDocumentFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const editId = queryParams.get('edit');
  const isEdit = Boolean(editId);
  const userId = localStorage.getItem('userId') || 'default-user';
  const userName = localStorage.getItem('userName') || 'Employé';

  const [document, setDocument] = useState({
    id: uuidv4(),
    title: '',
    type: 'pdf',
    description: '',
    dateAdded: new Date().toISOString().split('T')[0],
    projectId: '',
    subProjectId: '',
    meetingId: '',
    fileUrl: '',
    fileName: '',
    createdAt: new Date().toISOString(),
    createdBy: userId,
    createdByName: userName,
    reference: '',
    version: '1.0'
  });

  const [projects, setProjects] = useState([]);
  const [subProjects, setSubProjects] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    const projectsString = localStorage.getItem('projects');
    const subProjectsString = localStorage.getItem('subProjects');
    const meetingsString = localStorage.getItem('meetings');

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
    
    if (meetingsString) {
      try {
        const loadedMeetings = JSON.parse(meetingsString);
        setMeetings(loadedMeetings);
      } catch (error) {
        console.error('Error loading meetings:', error);
      }
    }

    if (isEdit) {
      const documentsString = localStorage.getItem('documents');
      if (documentsString) {
        try {
          const documents = JSON.parse(documentsString);
          const docToEdit = documents.find(doc => doc.id === editId);
          
          if (docToEdit) {
            if (docToEdit.createdBy !== userId && userId !== 'default-user') {
              toast({
                title: "Accès refusé",
                description: "Vous ne pouvez pas modifier ce document car il ne vous appartient pas.",
                variant: "destructive"
              });
              navigate('/employee/documents');
              return;
            }
            
            setDocument(docToEdit);
            
            if (docToEdit.files && docToEdit.files.length > 0) {
              setExistingFiles(docToEdit.files);
            } else if (docToEdit.fileUrl && docToEdit.fileName) {
              setExistingFiles([{
                url: docToEdit.fileUrl,
                name: docToEdit.fileName
              }]);
            }
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
    if (document.projectId) {
      const filtered = subProjects.filter(sp => sp.projectId === document.projectId);
      setFilteredSubProjects(filtered);
      
      const filteredMtgs = meetings.filter(m => m.projectId === document.projectId);
      setFilteredMeetings(filteredMtgs);
    } else {
      setFilteredSubProjects([]);
      setFilteredMeetings(meetings);
    }
  }, [document.projectId, subProjects, meetings]);
  
  useEffect(() => {
    if (document.subProjectId) {
      const filtered = meetings.filter(m => m.subProjectId === document.subProjectId);
      setFilteredMeetings(filtered);
    } else if (document.projectId) {
      const filtered = meetings.filter(m => m.projectId === document.projectId);
      setFilteredMeetings(filtered);
    } else {
      setFilteredMeetings(meetings);
    }
  }, [document.subProjectId, document.projectId, meetings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'reference') {
      const validValue = value.replace(/[^a-zA-Z0-9-]/g, '');
      setDocument({ ...document, [name]: validValue });
    } else if (name === 'version') {
      const validValue = value.replace(/[^0-9.]/g, '');
      setDocument({ ...document, [name]: validValue });
    } else {
      setDocument({ ...document, [name]: value });
    }
  };

  const handleSelectChange = (name, value) => {
    setDocument({ ...document, [name]: value });
    
    if (name === 'projectId') {
      setDocument(prev => ({ ...prev, subProjectId: '', meetingId: '' }));
    }
    
    if (name === 'subProjectId') {
      setDocument(prev => ({ ...prev, meetingId: '' }));
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
    
    if (!document.type || document.type === 'autre') {
      const firstFile = selectedFiles[0];
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

  const handleSubmit = (e) => {
    e.preventDefault();

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

    if (!isEdit && files.length === 0 && existingFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Au moins un fichier est requis",
        variant: "destructive"
      });
      return;
    }

    const fileInfos = files.map(file => ({
      url: `data:application/octet-stream;base64,${file.name}`,
      name: file.name,
      type: document.type
    }));
    
    const allFiles = [...existingFiles, ...fileInfos];
    
    const updatedDocument = {
      ...document,
      files: allFiles,
      fileUrl: allFiles.length > 0 ? allFiles[0].url : '',
      fileName: allFiles.length > 0 ? allFiles[0].name : '',
      updatedAt: new Date().toISOString()
    };

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
      const updatedDocuments = documents.map(doc => 
        doc.id === editId ? updatedDocument : doc
      );
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      
      toast({
        title: "Document modifié",
        description: "Le document a été mis à jour avec succès"
      });
    } else {
      documents.unshift(updatedDocument);
      localStorage.setItem('documents', JSON.stringify(documents));
      
      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès"
      });
    }

    if (document.meetingId) {
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings = JSON.parse(meetingsString);
          const meetingIndex = meetings.findIndex(m => m.id === document.meetingId);
          
          if (meetingIndex !== -1) {
            if (!meetings[meetingIndex].documents) {
              meetings[meetingIndex].documents = [];
            }
            
            const docExists = meetings[meetingIndex].documents.some(d => d.id === updatedDocument.id);
            if (!docExists) {
              meetings[meetingIndex].documents.push({
                id: updatedDocument.id,
                title: updatedDocument.title,
                url: updatedDocument.fileUrl,
                type: updatedDocument.type
              });
              
              localStorage.setItem('meetings', JSON.stringify(meetings));
            }
          }
        } catch (error) {
          console.error('Error updating meeting:', error);
        }
      }
    }

    navigate('/employee/documents');
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
            <Label htmlFor="reference" className="text-sm font-medium">Référence</Label>
            <Input
              id="reference"
              name="reference"
              value={document.reference}
              onChange={handleChange}
              className="mt-1"
              placeholder="Entrez une référence (ex: DOC-2023-01)"
            />
          </div>
          
          <div>
            <Label htmlFor="version" className="text-sm font-medium">Version</Label>
            <Input
              id="version"
              name="version"
              value={document.version}
              onChange={handleChange}
              className="mt-1"
              placeholder="Entrez un numéro de version (ex: 1.0)"
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
            <Label htmlFor="projectId" className="text-sm font-medium">Projet associé</Label>
            <Select
              value={document.projectId}
              onValueChange={(value) => handleSelectChange('projectId', value)}
            >
              <SelectTrigger id="projectId" className="mt-1">
                <SelectValue placeholder="Sélectionnez un projet (optionnel)" />
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
                <SelectItem value="none">Aucun</SelectItem>
                {filteredSubProjects.map((subProject) => (
                  <SelectItem key={subProject.id} value={subProject.id}>
                    {subProject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="meetingId" className="text-sm font-medium">Réunion associée</Label>
            <Select
              value={document.meetingId}
              onValueChange={(value) => handleSelectChange('meetingId', value)}
              disabled={filteredMeetings.length === 0}
            >
              <SelectTrigger id="meetingId" className="mt-1">
                <SelectValue placeholder="Sélectionnez une réunion (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucune</SelectItem>
                {filteredMeetings.map((meeting) => (
                  <SelectItem key={meeting.id} value={meeting.id}>
                    {meeting.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

export default EmployeeDocumentFormPage;
