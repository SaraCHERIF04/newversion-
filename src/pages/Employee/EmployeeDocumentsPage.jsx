
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const EmployeeDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    // Load documents from localStorage
    const docsString = localStorage.getItem('documents');
    if (docsString) {
      try {
        const docs = JSON.parse(docsString);
        // Sort documents by dateAdded in descending order (newest first)
        const sortedDocs = [...docs].sort((a, b) => {
          return new Date(b.dateAdded || b.createdAt || 0).getTime() - 
                 new Date(a.dateAdded || a.createdAt || 0).getTime();
        });
        setDocuments(sortedDocs);
      } catch (error) {
        console.error('Error loading documents:', error);
      }
    }
  }, []);
  
  const getProjectName = (projectId) => {
    if (!projectId) return 'N/A';
    try {
      const projectsString = localStorage.getItem('projects');
      if (projectsString) {
        const projects = JSON.parse(projectsString);
        const project = projects.find((p) => p.id === projectId);
        return project ? project.name : 'N/A';
      }
    } catch (error) {
      console.error('Error getting project name:', error);
    }
    return 'N/A';
  };
  
  const getSubProjectName = (subProjectId) => {
    if (!subProjectId) return 'N/A';
    try {
      const subProjectsString = localStorage.getItem('subProjects');
      if (subProjectsString) {
        const subProjects = JSON.parse(subProjectsString);
        const subProject = subProjects.find((sp) => sp.id === subProjectId);
        return subProject ? subProject.name : 'N/A';
      }
    } catch (error) {
      console.error('Error getting subproject name:', error);
    }
    return 'N/A';
  };
  
  const handleViewDocument = (doc) => {
    navigate(`/employee/documents/${doc.id}`);
  };

  const handleEditDocument = (doc) => {
    navigate(`/employee/documents/new?edit=${doc.id}`);
  };

  const handleDeleteDocument = (doc) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce document?')) {
      const updatedDocuments = documents.filter(d => d.id !== doc.id);
      localStorage.setItem('documents', JSON.stringify(updatedDocuments));
      setDocuments(updatedDocuments);
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    }
  };
  
  // Helper function to check if a document was created by the current user
  const isOwnDocument = (doc) => {
    return doc.createdBy === userId;
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectName(doc.projectId).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSubProjectName(doc.subProjectId).toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Documents</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-80">
          <Input
            type="text"
            placeholder="Rechercher un document"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Button onClick={() => navigate('/employee/documents/new')} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date d'ajout</TableHead>
              <TableHead>Projet</TableHead>
              <TableHead>Sous projet</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.dateAdded || new Date(doc.createdAt || Date.now()).toISOString().split('T')[0]}</TableCell>
                  <TableCell>{getProjectName(doc.projectId)}</TableCell>
                  <TableCell>{getSubProjectName(doc.subProjectId)}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {/* Only show edit/delete for documents created by this user */}
                    {isOwnDocument(doc) && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleEditDocument(doc)}>
                          <FileEdit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(doc)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Aucun document trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeDocumentsPage;
