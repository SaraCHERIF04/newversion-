
import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types/User';

interface MemberSearchProps {
  onSelect: (member: User) => void;
  selectedMembers: User[];
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onSelect, selectedMembers }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Simulating users from localStorage with default empty array to avoid undefined
  const getUsers = (): User[] => {
    try {
      const usersString = localStorage.getItem('users');
      if (usersString) {
        const parsedUsers = JSON.parse(usersString);
        return Array.isArray(parsedUsers) ? parsedUsers : [];
      }
    } catch (error) {
      console.error('Error parsing users:', error);
    }
    // If we reach this point, create some default users for testing
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        role: "employee",
        status: "En poste",
        createdAt: new Date().toISOString(),
        prenom: "John"
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        role: "chef",
        status: "En poste",
        createdAt: new Date().toISOString(),
        prenom: "Jane"
      }
    ];
    
    // Store default users if none exist
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  };

  const users = getUsers();
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    (user.prenom && user.prenom.toLowerCase().includes(searchValue.toLowerCase()))
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[475px]">
        <DialogHeader>
          <DialogTitle>Ajouter un membre au projet</DialogTitle>
          <DialogDescription>
            Recherchez et sélectionnez les membres à ajouter au projet
          </DialogDescription>
        </DialogHeader>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Rechercher un membre..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandEmpty>Aucun membre trouvé</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {filteredUsers.map((user) => {
              const isSelected = selectedMembers.some((member) => member.id === user.id);
              return (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    onSelect(user);
                    setOpen(false);
                    setSearchValue('');
                  }}
                  className="flex items-center gap-2 py-2"
                >
                  <div className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border",
                    isSelected ? "bg-primary border-primary" : "border-input"
                  )}>
                    {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {user.avatar && (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium">{user.name} {user.prenom}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default MemberSearch;
