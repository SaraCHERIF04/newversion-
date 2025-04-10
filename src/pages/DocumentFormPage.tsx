
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Download } from 'lucide-react';
import { Document } from '@/types/Document';
import { Project } from '@/components/ProjectCard';
import { SubProject } from '@/components/SubProjectCard';
import { toast } from '@/components/ui/use-toast';

interface FileInfo {
  url: string;
  name: string;
  type?: string;
}

const DocumentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('pdf');
  const [dateAdded, setDateAdded] = useState(new Date().toISOString().split('T')[0]);
  const [projectId, setProjectId] = useState<string>('');
  const [subProjectId, setSubProjectId] = useState<string>('');
  const [meetingId, setMeetingId] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<FileInfo[]>([]);
  const [reference, setReference] = useState('');
  const [version, setVersion] = useState('1.0');
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [subProjects, setSubProjects] = useState<SubProject[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [availableSubProjects, setAvailableSubProjects] = useState<SubProject[]>([]);
  const [availableMeetings, setAvailableMeetings] = useState<any[]>([]);
  
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
    
    // Load meetings
    const meetingsString = localStorage.getItem('meetings');
    if (meetingsString) {
      try {
        const meetingsList = JSON.parse(meetingsString);
        setMeetings(meetingsList);
      } catch (error) {
        console.error('Error loading meetings:', error);
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
            setType(document.type || 'pdf');
            setDateAdded(document.dateAdded);
            setProjectId(document.projectId || '');
            setSubProjectId(document.subProjectId || '');
            setMeetingId(document.meetingId || '');
            setReference(document.reference || '');
            setVersion(document.version || '1.0');
            
            // Handle files
            if (document.files && document.files.length > 0) {
              setExistingFiles(document.files);
            } else if (document.url) {
              setExistingFiles([{ 
                url: document.url, 
                name: document.url.split('/').pop() || 'document' 
              }]);
            }
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      }
    }
  }, [id, isEdit]);
  
  useEffect(() => {
    // Filter subProjects by projectId
    if (projectId && projectId !== 'none') {
      const filtered = subProjects.filter(sp => sp.projectId === projectId);
      setAvailableSubProjects(filtered);
      
      // Filter meetings related to this project
      const filteredMtgs = meetings.filter((m: any) => m.projectId === projectId);
      setAvailableMeetings(filteredMtgs);
      
      // If the currently selected subProject doesn't belong to the new project, reset it
      if (subProjectId && !filtered.some(sp => sp.id === subProjectId)) {
        setSubProjectId('');
      }
      
      // If the currently selected meeting doesn't belong to the new project, reset it
      if (meetingId && !filteredMtgs.some((m: any) => m.id === meetingId)) {
        setMeetingId('');
      }
    } else {
      setAvailableSubProjects([]);
      setAvailableMeetings(meetings);
    }
  }, [projectId, subProjects, meetings, subProjectId, meetingId]);
  
  useEffect(() => {
    // Further filter meetings if a subproject is selected
    if (subProjectId && subProjectId !== 'none') {
      const filtered = meetings.filter((m: any) => m.subProjectId === subProjectId);
      setAvailableMeetings(filtered);
      
      // If the currently selected meeting doesn't belong to the new subproject, reset it
      if (meetingId && !filtered.some((m: any) => m.id === meetingId)) {
        setMeetingId('');
      }
    } else if (projectId && projectId !== 'none') {
      // If only project is selected, filter by project
      const filtered = meetings.filter((m: any) => m.projectId === projectId);
      setAvailableMeetings(filtered);
    } else {
      // If neither project nor subproject is selected, show all meetings
      setAvailableMeetings(meetings);
    }
  }, [subProjectId, projectId, meetings, meetingId]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      
      // Determine document type from the first file
      if (selectedFiles.length > 0) {
        const firstFile = selectedFiles[0];
        const fileExtension = firstFile.name.split('.').pop()?.toLowerCase();
        
        if (fileExtension === 'pdf') setType('pdf');
        else if (fileExtension === 'doc' || fileExtension === 'docx') setType('word');
        else if (fileExtension === 'xls' || fileExtension === 'xlsx' || fileExtension === 'csv') setType('excel');
        else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension || '')) setType('image');
        else setType('autre');
      }
    }
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleRemoveExistingFile = (index: number) => {
    const newExistingFiles = [...existingFiles];
    newExistingFiles.splice(index, 1);
    setExistingFiles(newExistingFiles);
  };
  
  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and letters for reference
    const value = e.target.value.replace(/[^a-zA-Z0-9-]/g, '');
    setReference(value);
  };
  
  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only valid version format (e.g. 1.0, 2.3.1)
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setVersion(value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre du document est requis"
      });
      return;
    }
    
    if (!isEdit && files.length === 0 && existingFiles.length === 0) {
      toast({
        title: "Erreur",
        description: "Au moins un fichier est requis"
      });
      return;
    }
    
    // Create file info objects for new files
    const fileInfos: FileInfo[] = files.map(file => ({
      url: `/documents/${file.name}`,
      name: file.name,
      type
    }));
    
    // Combine existing files with new files
    const allFiles = [...existingFiles, ...fileInfos];
    
    // Create a URL for the main file (for backward compatibility)
    const url = allFiles.length > 0 ? allFiles[0].url : '';
    
    const documentData: any = {
      id: id || `doc-${Date.now()}`,
      title,
      type,
      dateAdded,
      projectId: projectId !== 'none' ? projectId : undefined,
      subProjectId: subProjectId !== 'none' ? subProjectId : undefined,
      meetingId: meetingId !== 'none' ? meetingId : undefined,
      description,
      url,
      files: allFiles,
      reference,
      version,
      updatedAt: new Date().toISOString()
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
    
    // If a meeting is selected, add the document reference to the meeting
    if (meetingId && meetingId !== 'none') {
      const meetingsString = localStorage.getItem('meetings');
      if (meetingsString) {
        try {
          const meetings = JSON.parse(meetingsString);
          const meetingIndex = meetings.findIndex((m: any) => m.id === meetingId);
          
          if (meetingIndex !== -1) {
            if (!meetings[meetingIndex].documents) {
              meetings[meetingIndex].documents = [];
            }
            
            const docExists = meetings[meetingIndex].documents.some((d: any) => d.id === documentData.id);
            if (!docExists) {
              meetings[meetingIndex].documents.push({
                id: documentData.id,
                title: documentData.title,
                url: documentData.url,
                type: documentData.type
              });
              
              localStorage.setItem('meetings', JSON.stringify(meetings));
            }
          }
        } catch (error) {
          console.error('Error updating meeting:', error);
        }
      }
    }
    
    toast({
      title: isEdit ? "Document modifié" : "Document ajouté",
      description: isEdit ? "Le document a été mis à jour avec succès" : "Le document a été ajouté avec succès"
    });
    
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
          
          // Also remove from meetings
          const meetingsString = localStorage.getItem('meetings');
          if (meetingsString) {
            const meetings = JSON.parse(meetingsString);
            const updatedMeetings = meetings.map((meeting: any) => {
              if (meeting.documents) {
                meeting.documents = meeting.documents.filter((doc: any) => doc.id !== id);
              }
              return meeting;
            });
            localStorage.setItem('meetings', JSON.stringify(updatedMeetings));
          }
          
          toast({
            title: "Document supprimé",
            description: "Le document a été supprimé avec succès"
          });
          
          navigate('/documents');
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };
  
  const documentTypes = [
    { id: 'pdf', name: 'PDF' },
    { id: 'word', name: 'Word' },
    { id: 'excel', name: 'Excel' },
    { id: 'image', name: 'Image' },
    { id: 'autre', name: 'Autre' }
  ];
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button 
          onClick={() => navigate('/documents')}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux documents</span>
        </Button>
        <h1 className="text-2xl font-bold ml-2">
          {isEdit ? 'Modifier' : 'Créer'} Document
        </h1>
      </div>
      
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
              <Label htmlFor="reference" className="mb-2 block">Référence</Label>
              <Input
                id="reference"
                value={reference}
                onChange={handleReferenceChange}
                placeholder="Entrez une référence (ex: DOC-2023-01)"
              />
            </div>
            
            <div>
              <Label htmlFor="version" className="mb-2 block">Version</Label>
              <Input
                id="version"
                value={version}
                onChange={handleVersionChange}
                placeholder="Entrez un numéro de version (ex: 1.0)"
              />
            </div>
            
            <div>
              <Label htmlFor="type" className="mb-2 block">Type de document</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((docType) => (
                    <SelectItem key={docType.id} value={docType.id}>
                      {docType.name}
                    </SelectItem>
                  ))}
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
                  <SelectValue placeholder={projectId ? "Sélectionnez un sous-projet" : "Veuillez d'abord sélectionner un projet"} />
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
            
            <div>
              <Label htmlFor="meeting" className="mb-2 block">Réunion associée</Label>
              <Select 
                value={meetingId} 
                onValueChange={setMeetingId}
                disabled={availableMeetings.length === 0}
              >
                <SelectTrigger id="meeting">
                  <SelectValue placeholder="Sélectionnez une réunion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune</SelectItem>
                  {availableMeetings.map((meeting: any) => (
                    <SelectItem key={meeting.id} value={meeting.id}>
                      {meeting.title}
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
            <Label htmlFor="file" className="mb-2 block">Documents</Label>
            <div className="flex items-center gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center"
                onClick={() => document.getElementById('file')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger des documents
              </Button>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
            </div>
            
            {/* Display existing files */}
            {existingFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Fichiers existants:</h3>
                <div className="space-y-2">
                  {existingFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {file.type === 'pdf' && (
                            <div className="bg-red-100 text-red-700 p-2 rounded">PDF</div>
                          )}
                          {file.type === 'excel' && (
                            <div className="bg-green-100 text-green-700 p-2 rounded">XLS</div>
                          )}
                          {file.type === 'word' && (
                            <div className="bg-blue-100 text-blue-700 p-2 rounded">DOC</div>
                          )}
                          {file.type === 'image' && (
                            <div className="bg-purple-100 text-purple-700 p-2 rounded">IMG</div>
                          )}
                          {(!file.type || file.type === 'autre') && (
                            <div className="bg-gray-100 text-gray-700 p-2 rounded">DOC</div>
                          )}
                        </div>
                        <span className="text-sm">{file.name}</span>
                      </div>
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
            
            {/* Display new files */}
            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Nouveaux fichiers:</h3>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {type === 'pdf' && (
                            <div className="bg-red-100 text-red-700 p-2 rounded">PDF</div>
                          )}
                          {type === 'excel' && (
                            <div className="bg-green-100 text-green-700 p-2 rounded">XLS</div>
                          )}
                          {type === 'word' && (
                            <div className="bg-blue-100 text-blue-700 p-2 rounded">DOC</div>
                          )}
                          {type === 'image' && (
                            <div className="bg-purple-100 text-purple-700 p-2 rounded">IMG</div>
                          )}
                          {(type === 'autre') && (
                            <div className="bg-gray-100 text-gray-700 p-2 rounded">DOC</div>
                          )}
                        </div>
                        <span className="text-sm">{file.name}</span>
                      </div>
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
