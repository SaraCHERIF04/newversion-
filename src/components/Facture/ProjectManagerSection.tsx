
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
        <div className="space-y-4">
          <MemberSearch
            onSelect={onChefSelect}
            selectedMembers={selectedChef}
            roles={['chef', 'admin']} 
          />
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/employee/new'}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouveau chef
            </Button>
          </div>
        </div>
      </div>
      <div>
        <Label>Maître d'ouvrage</Label>
        <div className="flex gap-2">
          <Input
            value={maitreOuvrage}
            onChange={(e) => onMaitreOuvrageChange(e.target.value)}
            placeholder="Rechercher ou saisir..."
            className="mb-2"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => window.location.href = '/maitre-ouvrage'}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label>Maître d'œuvre</Label>
        <div className="flex gap-2">
          <Input
            value={maitreOeuvre}
            onChange={(e) => onMaitreOeuvreChange(e.target.value)}
            placeholder="Rechercher ou saisir..."
            className="mb-2"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => window.location.href = '/maitre-oeuvre'}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManagerSection;
