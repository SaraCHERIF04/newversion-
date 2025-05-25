import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Check, Download, Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { algerianWilayas } from '@/utils/algerianWilayas';
import { Project } from './ProjectCard';
import { notifyNewProject } from '@/utils/notificationHelpers';
import { userService } from '@/services/userService';
import { Label } from '@/components/ui/label';
import MemberSearch from './MemberSearch';
import { maitreOuvrage }  from '@/services/MaitreOuvrageService';
import { projetService } from '@/services/projetService';
import { documentService } from '@/services/documentService';
import ProjectMembersList from './ProjectMembersList';
import { MaitreOuvrage } from '@/interfaces/MaitreOuvrageInterface';
import { MaitreOuvrageResponse} from '@/interfaces/MaitreOuvrageInterface';
import { UserInterface } from '@/interfaces/UserInterface';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { User } from '@/types/User';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";




const ProjectForm = ({ project, isEdit = false }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const selectedProjectId = Number(projectId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');
  const [status, setStatus] = useState(project?.status || 'En attente');
  const [chefId, setChefId] = useState(project?.chef || '');
  const [wilaya, setWilaya] = useState(project?.wilaya || '');
  const [budget, setBudget] = useState(project?.budget || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [documents, setDocuments] = useState(project?.documents || []);
  const [newWilaya, setNewWilaya] = useState('');
  const [customWilayas, setCustomWilayas] = useState([]);
 const [searchMember, setSearchMember] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);
  const [availableChefs, setAvailableChefs] = useState([]);
  const [availableMaitreOuvrages, setAvailableMaitreOuvrages] = useState<MaitreOuvrage[]>([]);  
  const [maitresOuvrage, setMaitresOuvrage] = useState<MaitreOuvrage[]>([]);
  const [selectedMaitreOuvrage, setSelectedMaitreOuvrage] = useState(project?.maitreOuvrage || null);
  const [availableMembers, setAvailableMembers] = useState<UserInterface[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<UserInterface[]>(
      project?.members?.map(member => ({
        ...member,
        name: member.name || '',
        selected: true
      })) || []
  );
  
type ProjectDocument = {
  id_document: string;
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await userService.getAllUsers();
        const users = usersResponse.data || [];

        const chefs = (Array.isArray(users) ? users : users.results)
        .filter(user => ['chef', 'chef de projet'].includes(user.role_de_utilisateur?.toLowerCase()));
      
      console.log('Filtered Chefs:', chefs); // <== ADD THIS
      setAvailableChefs(chefs);

        if (chefId) {
          const chef = chefs.find(c => c.id_utilisateur === Number(chefId));
          if (chef) setSelectedChef(chef);
        }
        // Fetch maitreOuvrages
        const moResponse = await maitreOuvrage.fetchAll() as unknown as MaitreOuvrageResponse;
      const moArray =  moResponse.data || [];

       setMaitresOuvrage(moArray); // ✅ correct type: MaitreOuvrage[]

       setAvailableMaitreOuvrages(moArray);
        
        setSelectedMaitreOuvrage(project.maitreOuvrage);
      const storedWilayas = localStorage.getItem('customWilayas');
      if (storedWilayas) {
        try {
          setCustomWilayas(JSON.parse(storedWilayas));
        } catch (error) {
          console.error("Invalid JSON in localStorage for customWilayas:", error);
         
        }
      }
      
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [chefId]);
useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        // Fetch all users from the backend
        const response = await userService.getAllUsers(); // Make sure this function exists
        const users: UserInterface[] = response.data.results;
  
        setAvailableMembers(users); // or setAvailableMembers(users) depending on your logic
  
        // Filter out already selected members
        const selectedMemberIds = new Set(selectedMembers.map(m => m.id_utilisateur));
        const filteredUsers = users.filter(user => !selectedMemberIds.has(user.id_utilisateur));
  
        setAvailableMembers(filteredUsers);
      } catch (error) {
        console.error('Error fetching all users:', error);
        setAvailableMembers([]);
        setAvailableMembers([]);
      }
    };
  
    fetchAllUsers();
  }, [selectedMembers]);
  
  const handleAddWilaya = () => {
    if (newWilaya && !customWilayas.includes(newWilaya)) {
      const updated = [...customWilayas, newWilaya];
      setCustomWilayas(updated);
      localStorage.setItem('customWilayas', JSON.stringify(updated));
      setNewWilaya('');
    }
  };
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files && e.target.files.length > 0) {
       const newFile = e.target.files[0];
       const newDocument: ProjectDocument = {
         id_document: `doc-${Date.now()}`,
         title: newFile.name,
         file: newFile,
       };
       setDocuments([...documents, newDocument]);
     }
   };
 
   const removeDocument = (docId: string) => {
     setDocuments(documents.filter(doc => doc.id !== docId));
   };
  const handleChefSelect = (chef) => {
    setSelectedChef(chef);
    setChefId(chef.id);
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
            id_projet: selectedProjectId ,
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      nom_projet: name,
      description_de_projet: description,
      deadline: new Date().toISOString(), // or use a form field value
      date_debut_de_projet: startDate,
      date_fin_de_projet: endDate,
      status,
      id_utilisateur: selectedChef?.id, // or current user's ID
      members: (project.members || []).map((member) => ({
        id: member.id_utilisateur.toString(),
        name: member.nom,
        avatar: member.avatar || '',
        role: member.role_de_utilisateur || '',
      })),
      documents: documents, // Full DocumentInterface objects
      chef_projet: selectedChef, // Full UserInterface object
      subprojects: [], // If any, otherwise empty array
      reunions: [], // If any, otherwise empty array
      budget,
      wilaya,
      secteur: '', // optional
      image_url: '', // optional
      incidents: [], // optional
      incident: null, // optional
      incidentFollowUps: [], // optional
      incidentFollowUp: null, // optional
      incidentDocuments: [], // optional
      incidentDocument: null, // optional
      incidentSignalePar: null, // optional
      incidentSignaleParId: null, // optional
      incidentDate: null // optional
    };
    
    const userRole = 'chef de projet'; // or dynamically get it from context/auth    

    try {
      if (isEdit) {
        await projetService.updateProjet(project.id, projectData);


        toast({ title: 'Projet modifié', variant: 'default' });

      } else {
        await projetService.createProjet(projectData, userRole);
        toast({ title: 'Projet créé', variant: 'default' });
       
      }
      navigate('/project');
    } catch (err) {
      console.error("Save error:", err);
      toast({ title: 'Erreur', description: 'Échec de la sauvegarde', variant: 'destructive' });
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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chef de projet
        </label>
        <div className="space-y-4">
          {selectedChef && (
            <div className="flex items-center bg-blue-50 text-blue-700 rounded-full px-3 py-1 w-fit">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={selectedChef.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChef.nom)}`} />
                <AvatarFallback>{selectedChef.nom.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{selectedChef.nom}</span>
              <button
                type="button"
                onClick={() => setSelectedChef(null)}
                className="ml-2 text-blue-400 hover:text-blue-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {!selectedChef && (
            <div className="border rounded-md overflow-hidden max-h-60 overflow-y-auto">
              {availableChefs.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {availableChefs.map((chef) => (
                    <div
                      key={chef.id}
                      className="flex items-center justify-between p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={chef.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chef.nom)}`} />
                          <AvatarFallback>{chef.nom.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{chef.nom} {chef.prenom}</div>
                          <div className="text-sm text-gray-500">{chef.role_de_utilisateur}</div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleChefSelect(chef)}
                        variant="ghost"
                        className="text-[#192759] hover:text-blue-700"
                      >
                        Sélectionner
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Aucun chef disponible
                </div>
              )}
            </div>
          )}
          
         
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">
            Wilaya
          </label>
          <div className="flex gap-2">
            <Select value={wilaya} onValueChange={setWilaya}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez une wilaya" />
              </SelectTrigger>
              <SelectContent>
                {[...algerianWilayas, ...customWilayas].map((wilaya) => (
                  <SelectItem key={wilaya} value={wilaya}>
                    {wilaya}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter une nouvelle wilaya</DialogTitle>
                </DialogHeader>
                <div className="flex gap-2 mt-4">
                  <Input
                    value={newWilaya}
                    onChange={(e) => setNewWilaya(e.target.value)}
                    placeholder="Nom de la wilaya"
                  />
                  <Button type="button" onClick={handleAddWilaya}>
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

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
                        <Label htmlFor="maitreOuvrage" className="mb-2 block">Maître d'ouvrage</Label>
                        <div className="flex gap-2">
                          <Select value={selectedMaitreOuvrage} onValueChange={setSelectedMaitreOuvrage}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sélectionner un maître d'ouvrage" />
                            </SelectTrigger>
                            <SelectContent>
                           {availableMaitreOuvrages.map((mo) => (
                          <SelectItem key={mo.id_mo} value={mo.id_mo.toString()}>
                           {mo.nom_mo}
                           </SelectItem>
                     ))}
               </SelectContent>
                          </Select>
                          <Button
                            type="button"
                            onClick={() => navigate('/maitre-ouvrage')}
                            variant="outline"
                            size="icon"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
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
              {documents.map((doc) => (
                <div key={doc.id_document} className="px-4 py-3 flex justify-between items-center">
                  <span className="text-sm truncate">{doc.title}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFileChange(doc)}
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