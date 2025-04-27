import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, FileEdit, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { documentService } from '@/services/documentService';
import { remoteConfigService } from '@/services/remoteConfigService';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EmployeeDocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [documentConfig, setDocumentConfig] = useState({
    maxFileSizeMB: 10,
    allowedDocumentTypes: ['pdf', 'doc', 'docx'],
    documentSharingEnabled: false
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  
  useEffect(() => {
    // Load remote config settings
    const loadRemoteConfig = () => {
      const maxFileSizeMB = remoteConfigService.getMaxFileSizeMB();
      const allowedDocumentTypes = remoteConfigService.getAllowedDocumentTypes();
      const documentSharingEnabled = remoteConfigService.isDocumentSharingEnabled();
      
      setDocumentConfig({
        maxFileSizeMB,
        allowedDocumentTypes,
        documentSharingEnabled
      });
      
      console.log('Document configuration loaded from Remote Config:', {
        maxFileSizeMB,
        allowedDocumentTypes,
        documentSharingEnabled
      });
    };
    
    loadRemoteConfig();
  }, []);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const response = await documentService.getAllDocuments(1, 'employee');
        setDocuments(response.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, []);
  

  

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
  

  
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">Documents</h1>
      
      {/* Show allowed document types info */}
      <Alert className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Restrictions de documents</AlertTitle>
        <AlertDescription>
          Taille maximale: {documentConfig.maxFileSizeMB} MB. 
          Types permis: {documentConfig.allowedDocumentTypes.join(', ')}
          {documentConfig.documentSharingEnabled ? 
            '. Le partage de documents est activé.' : 
            '. Le partage de documents est désactivé.'}
        </AlertDescription>
      </Alert>
      
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
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id_document}>
                  <TableCell>{doc.titre}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.date_ajout || new Date(doc.date_ajout || Date.now()).toISOString().split('T')[0]}</TableCell>
                  <TableCell>{doc?.project}</TableCell>
                  <TableCell>{doc?.subproject}</TableCell>
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
