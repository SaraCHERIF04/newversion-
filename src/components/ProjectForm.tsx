
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from './ProjectCard';

type ProjectFormProps = {
  project?: Project;
  isEdit?: boolean;
};

const ProjectForm: React.FC<ProjectFormProps> = ({ project, isEdit = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: project?.name || '',
    chefName: '',
    startDate: '',
    endDate: '',
    region: '',
    city: '',
    budget: '',
    status: project?.status || 'En cours',
    description: project?.description || '',
  });

  const [members, setMembers] = useState([
    { id: '1', name: 'Yasmine', role: 'Team lead' },
    { id: '2', name: 'Hassan', role: 'Dev' },
    { id: '3', name: 'Yasmine', role: 'Team lead' },
    { id: '4', name: 'Hassan', role: 'Dev' },
    { id: '5', name: 'Yasmine', role: 'Team lead' },
    { id: '6', name: 'Hassan', role: 'Dev' },
    { id: '7', name: 'Nasir', role: 'Team lead' }
  ]);

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberSelection = (id: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((memberId) => memberId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save or update project
    navigate('/');
  };

  const handleDelete = () => {
    // Logic to delete project
    navigate('/');
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 font-medium"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          <span className="text-xl">Créer /Modifier Projet</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du Projet
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Projet"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du chef
            </label>
            <input
              type="text"
              name="chefName"
              value={formData.chefName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom du chef de projet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date debut
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date fin
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wilaya
            </label>
            <div className="relative">
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="16"
              />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Alger"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Actif"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="En attente">En attente</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description du projet
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ecrire quelque chose"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ajouter/supprimer membre
            </label>
            <div className="border border-gray-300 rounded-md overflow-hidden max-h-60">
              <div className="p-2 bg-gray-50 border-b border-gray-300 flex justify-between items-center">
                <span className="text-sm font-medium">Membres de projet</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher membre..."
                    className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none"
                  />
                </div>
              </div>
              <div className="max-h-48 overflow-y-auto">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between px-3 py-2 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => handleMemberSelection(member.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`member-${member.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {member.name}
                      </label>
                    </div>
                    <span className="text-xs text-gray-500">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Documents du sous projet
            </label>
            <div className="border border-gray-300 rounded-md p-4 h-60 flex flex-col">
              <div className="flex-grow">
                {uploadedFiles.length > 0 ? (
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="text-sm">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col h-full items-center justify-center text-gray-400">
                    <span>Aucun document téléchargé</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <button
                type="button"
                onClick={handleFileUpload}
                className="w-full mt-2 bg-teal-600 text-white py-2 px-4 rounded-md flex items-center justify-center hover:bg-teal-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
                  />
                </svg>
                Télécharger document
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50"
            >
              Supprimer
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-[#192759] text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
