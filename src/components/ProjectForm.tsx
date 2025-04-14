import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Check, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Project } from './ProjectCard';
import { notifyNewProject } from '@/utils/notificationHelpers';

type ProjectFormProps = {
  project?: Project & {
    chef?: string;
    region?: string;
    budget?: string;
    startDate?: string;
    endDate?: string;
    city?: string;
    documents?: Array<{ id: string; title: string; url?: string }>;
  };
  isEdit?: boolean;
};

type ProjectDocument = {
  id: string;
  title: string;
  file?: File;
  url?: string;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState<'En attente' | 'En cours' | 'Terminé'>(
    (project?.status as any) || 'En attente'
  );
  const [chef, setChef] = useState(project?.chef || '');
  const [region, setRegion] = useState(project?.region || '');
  const [budget, setBudget] = useState(project?.budget || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [city, setCity] = useState(project?.city || '');
  const [documents, setDocuments] = useState<ProjectDocument[]>(project?.documents || []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const newDocument: ProjectDocument = {
        id: `doc-${Date.now()}`,
        title: newFile.name,
        file: newFile,
      };
      setDocuments([...documents, newDocument]);
    }
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const downloadDocument = (doc: ProjectDocument) => {
    if (doc.url) {
      const a = document.createElement('a');
      a.href = doc.url;
      a.download = doc.title;
      
      document.body.appendChild(a);
      
      a.click();
      
      document.body.removeChild(a);
    } else {
      console.error('Document URL is missing');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du projet est requis.",
        variant: "destructive",
      });
      return;
    }

    const updatedProject: Project & {
      chef?: string;
      region?: string;
      budget?: string;
      startDate?: string;
      endDate?: string;
      city?: string;
      documents?: Array<{ id: string; title: string; url?: string }>;
    } = {
      id: project?.id || `proj-${Date.now()}`,
      name,
      description,
      status,
      deadline: project?.deadline || '23 JUIN 2023',
      members: project?.members || [],
      documentsCount: documents.length,
      chef,
      region,
      budget,
      startDate,
      endDate,
      city,
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        url: doc.url || `/documents/${doc.title}`
      }))
    };

    try {
      const projectsString = localStorage.getItem('projects');
      let projects = [];

      if (projectsString) {
        projects = JSON.parse(projectsString);

        if (isEdit) {
          const index = projects.findIndex((p: Project) => p.id === updatedProject.id);
          if (index !== -1) {
            projects[index] = updatedProject;
          } else {
            projects.push(updatedProject);
          }
        } else {
          projects.push(updatedProject);
        }
      } else {
        projects = [updatedProject];
      }

      localStorage.setItem('projects', JSON.stringify(projects));

      if (!isEdit) {
        notifyNewProject(name);
      }

      toast({
        title: isEdit ? "Projet modifié" : "Projet créé",
        description: isEdit ? "Les modifications ont été enregistrées." : "Le projet a été créé avec succès.",
      });

      navigate("/project");
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du projet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/project')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux projets</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Projet</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du projet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom du projet"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'En attente' | 'En cours' | 'Terminé')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="En attente">En attente</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="chef" className="block text-sm font-medium text-gray-700 mb-1">
              Chef de projet
            </label>
            <input
              type="text"
              id="chef"
              value={chef}
              onChange={(e) => setChef(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom du chef de projet"
            />
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <input
              type="text"
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez la région"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le budget"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez la ville"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date début
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description du projet
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le projet..."
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Documents du projet
          </label>

          <div className="mb-3">
            <label
              htmlFor="fileUpload"
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="h-5 w-5 mr-2" />
              Télécharger document
            </label>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
            {documents.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {documents.map(doc => (
                  <div key={doc.id} className="px-4 py-3 flex justify-between items-center">
                    <span className="text-sm truncate">{doc.title}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => downloadDocument(doc)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                Aucun document ajouté
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            onClick={() => navigate('/project')}
            variant="outline"
          >
            Annuler
          </Button>
          <Button type="submit" className="bg-[#192759] hover:bg-blue-700">
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
