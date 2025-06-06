import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, X, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { SubProject } from './SubProjectCard';
import { Project } from './ProjectCard';
import { notifyNewSubProject } from '@/utils/notificationHelpers';
import { sousProjetService } from '@/services/sousProjetService';
import { projetService } from '@/services/projetService';
import { ProjetInterface } from '@/interfaces/ProjetInterface';
import { userService } from "@/services/userService";
import { UserInterface } from "@/interfaces/UserInterface";
import { SousProjetInterface } from "@/interfaces/SousProjetInterface";
import { documentService } from '@/services/documentService';
import { DocumentInterface } from '@/interfaces/DocumentInterface';
import { ProjetListResponse } from '@/interfaces/ProjetListResponse';


type SubProjectFormProps = {
  subProject?: SubProject;
  isEdit?: boolean;
};

type SubProjectDocument = {
  id: string;
  title: string;
  file?: File;
  url?: string;
  description?: string; // Added description property
  type?: string; // Added type property
  project?: string; // Added project property
};

type ProjectMember = {
  id: string;
  name: string;
  avatar: string;
  selected?: boolean;
  role: string; // Made role a required property
};

const SubProjectForm: React.FC<SubProjectFormProps> = ({ subProject, isEdit = false }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState(subProject?.name || '');
  const [description, setDescription] = useState(subProject?.description || '');
  const [status, setStatus] = useState<'En attente' | 'En cours' | 'Terminé'>(
    (subProject?.status as any) || 'En attente'
  );
  const [startDate, setStartDate] = useState(subProject?.startDate || '');
  const [endDate, setEndDate] = useState(subProject?.endDate || '');
  const [projectId, setProjectId] = useState(subProject?.projectId || '');
  const [documents, setDocuments] = useState<SubProjectDocument[]>(
    subProject?.documents?.map(doc => ({ ...doc })) || []
  );
  const [availableMembers, setAvailableMembers] = useState<UserInterface[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<UserInterface[]>(
    subProject?.members?.map(member => ({
      ...member,
      name: member.name || '',
      selected: true
    })) || []
  );
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [searchMember, setSearchMember] = useState('');
  const [projectMembers, setProjectMembers] = useState<UserInterface[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projetService.getAllProjets(1, 'chef');
       
       const data = response.data as unknown as ProjetListResponse;
      const projets: ProjetInterface[] = data.results;
       

        const transformedProjects: Project[] = projets.map((p) => ({
          id: p.id_projet.toString(),
          name: p.nom_projet,
          description: p.description_de_projet,
          documentsCount: p.documents?.length || 0,
          status: (p.status as 'En attente' | 'En cours' | 'Terminé') || 'En attente',
          members: (p.members || []).map((member) => ({
            id: member.id_utilisateur.toString(),
            name: member.nom,
            avatar: member.avatar || '',
            role: member.role_de_utilisateur || '',
          })),
        }));

        setAvailableProjects(transformedProjects);

        if (!projectId && transformedProjects.length > 0) {
          setProjectId(transformedProjects[0].id);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setAvailableProjects([]);
      }
    };

    fetchProjects();
  }, [projectId]);

  // 2️⃣ Load members for selected project using userService
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch all users from the backend
        const response = await userService.getAllUsers(); // Make sure this function exists
        const users: UserInterface[] = response.data.results;
  
        setProjectMembers(users); // or setAvailableMembers(users) depending on your logic
  
        // Filter out already selected members
        const selectedMemberIds = new Set(selectedMembers.map(m => m.id_utilisateur));
        const filteredUsers = users.filter(user => !selectedMemberIds.has(user.id_utilisateur));
  
        setAvailableMembers(filteredUsers);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setProjectMembers([]);
        setAvailableMembers([]);
      }
    };
  
    fetchAllUsers();
  }, [selectedMembers]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFile = e.target.files[0];
      const newDocument: SubProjectDocument = {
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
  const toggleMemberSelection = (member: ProjectMember) => {
    const isAlreadySelected = selectedMembers.some(
      (m) => m.id_utilisateur === Number(member.id)
    );

    if (isAlreadySelected) {
      setSelectedMembers(
        selectedMembers.filter(
          (m) => m.id_utilisateur !== Number(member.id)
        )
      );

      setAvailableMembers([
        ...availableMembers,
        {
          id_utilisateur: Number(member.id),
          nom: member.name,
          avatar: member.avatar,
          role_de_utilisateur: member.role,
          email: '',                // Add defaults for required fields
          mot_de_passe: '',
          numero_de_tel: '',
          is_anonymous: false,
          created_at: new Date(),
          is_authenticated: false,  // Add missing property
          is_active: true,          // Add missing property
        },
      ]);
    } else {
      setSelectedMembers([
        ...selectedMembers,
        {
          ...member,
          selected: true,
          id_utilisateur: Number(member.id), // ensure ID is correct type
          nom: member.name,
          avatar: member.avatar,
          role_de_utilisateur: member.role || '',
          email: '',
          mot_de_passe: '',
          numero_de_tel: '',
          is_anonymous: false,
          created_at: new Date(),
          updated_at: new Date(),
          is_authenticated: false, // Add missing property
          is_active: true,         // Add missing property
        } as UserInterface,
      ]);

      setAvailableMembers(
        availableMembers.filter(
          (m) => m.id_utilisateur !== Number(member.id)
        )
      );
    }
  };

  const removeMember = (memberId: string) => {
    const removedMember = selectedMembers.find(m => m.id_utilisateur === Number(memberId));
    if (removedMember) {
      setSelectedMembers(selectedMembers.filter(m => m.id_utilisateur !== Number(memberId)));
      setAvailableMembers([...availableMembers, { ...removedMember }]);
    }
  };

  const filteredAvailableMembers = availableMembers.filter(member =>
    member.nom.toLowerCase().includes(searchMember.toLowerCase())
  );
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du sous-projet est requis.",
        variant: "destructive",
      });
      return;
    }
  
    const selectedProject = availableProjects.find(p => p.id === projectId);
    if (!selectedProject) {
      toast({
        title: "Erreur",
        description: "Projet principal non trouvé.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const uploadedDocuments: DocumentInterface[] = await Promise.all(
        documents.map(async (doc) => {
          if (doc.file) {
            const formData = new FormData();
            formData.append("file", doc.file);
            // You might still need to upload the file somewhere separately here
            
            const documentData = {
              titre: doc.title,
              description: doc.description || '',
              type: doc.file.type || 'pdf',
              date_ajout: new Date().toISOString(),
              chemin: `/uploads/${doc.title}`,
              project: projectId,
              subproject: null, // Set to null or a valid SousProjetInterface object if available
            };
      
            const createdDoc = await documentService.createDocument(documentData, 'chef');
            return createdDoc;
          }
      
          throw new Error("Missing file in document");
        })
      );
      
     // 1. Get the current user ID from localStorage
const currentUserId = localStorage.getItem('userId');

// 2. Optional: parse it if needed (e.g., if your backend expects a number)
const currentUser = currentUserId ? await userService.getUserById(currentUserId).then(res => res.data) : null;

// 3. Now use it in your sousProjetData
const sousProjetData: Omit<SousProjetInterface, 'id_sous_projet'> = {
  nom_sous_projet: name,
  description_sous_projet: description,
  statut_sous_projet: status,
  date_debut_sousprojet: startDate,
  date_finsousprojet: endDate,
  members: selectedMembers,
  chef_projet: currentUser, // This should now be the current user's UserInterface object
  project: Number(selectedProject.id),
  id_projet: selectedProject.id, // Ensure this is a string as required by the interface
  documents: uploadedDocuments,
};

// 4. Send the request
await sousProjetService.createSousProjet(sousProjetData, 'chef');
      toast({
        title: "Sous-projet créé",
        description: "Le sous-projet a été créé avec succès.",
      });
  
      navigate("/sous-projet");
    } catch (error) {
      console.error('Error saving subProject:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du sous-projet.",
        variant: "destructive",
      });
    }
  };
  
  
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/sous-projet')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          <span>Retour aux sous-projets</span>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? 'Modifier' : 'Créer'} Sous projet</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom du sous_projet
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez le nom du sous-projet"
              required
            />
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Projet principal
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un projet</option>
              {availableProjects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
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
            Description du sous projet
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Décrivez le sous-projet..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ajouter/supprimer membre
            </label>

            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher membres..."
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md max-h-64 overflow-y-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Membre de projet</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAvailableMembers.length > 0 ? (
                    filteredAvailableMembers.map(member => (
                      <tr key={member.id_utilisateur}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8">
                              <img src={'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='} alt="" className="h-8 w-8 rounded-full" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.nom}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => toggleMemberSelection({
                              id: member.id_utilisateur.toString(),
                              name: member.nom,
                              avatar: member.avatar,
                              selected: false,
                              role: member.role_de_utilisateur
                            })}
                            className="text-[#192759] hover:text-blue-700"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun membre disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Documents du sous projet
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

            <div className="border border-gray-200 rounded-md max-h-[172px] overflow-y-auto">
              {documents.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {documents.map(doc => (
                    <div key={doc.id} className="px-4 py-3 flex justify-between items-center">
                      <span className="text-sm truncate">{doc.title}</span>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
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
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Membres sélectionnés</h3>
          <div className="flex flex-wrap gap-2">
            {selectedMembers.length > 0 ? (
              selectedMembers.map(member => (
                <div
                  key={member.id_utilisateur}
                  className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1"
                >
                  <img
                    src={'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='}
                    alt={member.nom}
                    className="h-6 w-6 rounded-full mr-2"
                  />
                  <span className="text-sm">{member.nom}</span>
                  <button
                    type="button"
                    onClick={() => removeMember(member.id_utilisateur.toString())}
                    className="ml-2 text-blue-400 hover:text-blue-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">Aucun membre sélectionné</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            type="button"
            onClick={() => navigate('/sous-projet')}
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

export default SubProjectForm;