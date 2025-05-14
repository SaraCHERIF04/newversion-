import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { reunionService } from '@/services/reuinionService';

const EmployeeReunionDetailsPage = () => {
  console.log('EmployeeReunionDetailsPage');
  const { id } = useParams();
  const navigate = useNavigate();
  const [reunion, setReunion] = useState(null);
  const [documents, setDocuments] = useState([]);
  
  useEffect(() => {
    const fetchReunion = async () => {
      try {
        const response = await reunionService.getReunionById(id);
        console.log(response);
        setReunion(response.data);
        
        // Fetch documents if they exist in the response
        if (response.data.documents) {
          setDocuments(response.data.documents);
        }
      } catch (error) {
        console.error('Error fetching reunion:', error);
      }
    };
    fetchReunion();
  }, [id]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleDownload = (doc) => {
    // Create a dummy anchor element to trigger download
    const link = document.createElement('a');
    link.href = doc.url || doc.fileUrl || `/documents/${doc.fileName || 'document'}`;
    link.download = doc.title || doc.fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reunion) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Réunion non trouvée</h1>
        <p className="mb-6">La réunion que vous recherchez n'existe pas ou a été supprimée.</p>
        <Button onClick={() => navigate('/employee/reunions')}>
          Retourner à la liste des réunions
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/employee/reunions')}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
          <h1 className="text-2xl font-bold">Détails de la réunion</h1>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimer</span>
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{reunion.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p>{formatDate(reunion.date_reunion)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Heure</h3>
              <p>{reunion.heure_re || '-'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lieu</h3>
            <p>{reunion.lieu_reunion}</p>
          </div>
          
          
          {reunion.participants && reunion.participants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
              <div className="grid grid-cols-2 gap-2">
                {reunion.participants.map((participant, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded-md border border-gray-100">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={participant.avatar || ''} />
                      <AvatarFallback>{participant.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{participant.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {reunion.agenda && reunion.agenda.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Ordre du jour</h3>
              <ul className="list-disc pl-5 space-y-1">
                {reunion.agenda.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {reunion.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Notes</h3>
              <p className="mt-1 whitespace-pre-line">{reunion.notes}</p>
            </div>
          )}
          
          {/* {documents && documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Documents associés</h3>
              <div className="grid grid-cols-1 gap-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {doc.type === 'pdf' && (
                          <div className="bg-red-100 text-red-700 p-2 rounded">PDF</div>
                        )}
                        {doc.type === 'excel' && (
                          <div className="bg-green-100 text-green-700 p-2 rounded">XLS</div>
                        )}
                        {doc.type === 'word' && (
                          <div className="bg-blue-100 text-blue-700 p-2 rounded">DOC</div>
                        )}
                        {doc.type === 'image' && (
                          <div className="bg-purple-100 text-purple-700 p-2 rounded">IMG</div>
                        )}
                        {(!doc.type || doc.type === 'autre') && (
                          <div className="bg-gray-100 text-gray-700 p-2 rounded">DOC</div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{doc.title}</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDownload(doc)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Télécharger</span>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReunionDetailsPage;
