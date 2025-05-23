
import React from 'react';
import { cn } from '@/lib/utils';

const getStatusColor = (status) => {
  switch (status) {
    case 'En cours':
      return 'bg-blue-50 text-blue-600';
    case 'Terminé':
      return 'bg-green-50 text-green-600';
    case 'En attente':
      return 'bg-yellow-50 text-yellow-600';
    case 'Annulé':
      return 'bg-red-50 text-red-600';
    default:
      return 'bg-gray-50 text-gray-600';
  }
};

const ProjectCard = ({ project }) => {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md h-full">
      <div className="mb-4 flex justify-between">
        <h3 className="text-lg font-medium text-gray-800">{project.nom_projet}</h3>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium',
            getStatusColor(project.status)
          )}
        >
          {project.status}
        </span>
      </div>
      <p className="mb-4 line-clamp-2 text-sm text-gray-600">{project.description_de_projet}</p>
      
      {project.deadline && (
        <div className="mb-3 text-xs text-gray-500">
          <span className="font-medium">Date limite:</span> {project.date_fin_de_projet}
        </div>
      )}

      <div className="mb-3 flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members && project.members.slice(0, 4).map((member, index) => (
            <img
              key={member.id_utilisateur || index}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.nom + (member.prenom ? ' ' + member.prenom : ''))}&background=random`} 
              alt={member.nom_utilisateur || `Avatar of ${member.nom}`}
              className="h-6 w-6 rounded-full border border-white"
              title={member.nom_utilisateur || member.nom + (member.prenom ? ' ' + member.prenom : '')}

            />
          ))}
          {project.members && project.members.length > 4 && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white bg-gray-200 text-xs text-gray-600">
              +{project.members.length - 4}
            </div>
          )}
        </div>
        
        <div className="flex items-center text-xs text-gray-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mr-1 h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          {(project.documents?.length || 0)} documents
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <div 
          className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          title="Voir les détails"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
