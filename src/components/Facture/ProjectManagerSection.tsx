
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MemberSearch from '@/components/MemberSearch';
import { User } from '@/types/User';

interface ProjectManagerSectionProps {
  selectedChef: User[];
  maitreOuvrage: string;
  maitreOeuvre: string;
  onChefSelect: (member: User) => void;
  onMaitreOuvrageChange: (value: string) => void;
  onMaitreOeuvreChange: (value: string) => void;
}

const ProjectManagerSection = ({
  selectedChef,
  maitreOuvrage,
  maitreOeuvre,
  onChefSelect,
  onMaitreOuvrageChange,
  onMaitreOeuvreChange,
}: ProjectManagerSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <Label>Chef de projet</Label>
        <MemberSearch
          onSelect={onChefSelect}
          selectedMembers={selectedChef}
        />
      </div>
      <div>
        <Label>Maître d'ouvrage</Label>
        <Input
          value={maitreOuvrage}
          onChange={(e) => onMaitreOuvrageChange(e.target.value)}
          placeholder="Rechercher ou saisir..."
          className="mb-2"
        />
      </div>
      <div>
        <Label>Maître d'œuvre</Label>
        <Input
          value={maitreOeuvre}
          onChange={(e) => onMaitreOeuvreChange(e.target.value)}
          placeholder="Rechercher ou saisir..."
          className="mb-2"
        />
      </div>
    </div>
  );
};

export default ProjectManagerSection;
