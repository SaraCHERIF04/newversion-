
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {documentService} from '@/services/documentService';

const EmployeeDocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [project, setProject] = useState(null);
  const [subProject, setSubProject] = useState(null);

  useEffect( () => {
    // Load the document from localStorage
    const fetchDocument = async () => {
      const document = await documentService.getDocumentById(id);
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
            </div>
          </div>
          
          <div>
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
    </div>
  );
};

export default EmployeeDocumentDetailsPage;
