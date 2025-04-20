
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types/User';

interface MemberSearchProps {
  onSelect: (member: User) => void;
  selectedMembers: User[];
}

const MemberSearch: React.FC<MemberSearchProps> = ({ onSelect, selectedMembers }) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users when component mounts
  useEffect(() => {
    setIsLoading(true);
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

    try {
      const usersString = localStorage.getItem('users');
      if (usersString) {
        const parsedUsers = JSON.parse(usersString);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          setUsers(parsedUsers);
        } else {
          // Store default users if none exist or invalid data
          localStorage.setItem('users', JSON.stringify(defaultUsers));
          setUsers(defaultUsers);
        }
      } else {
        // Store default users if none exist
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers(defaultUsers);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter users based on search value - ensure we never filter an undefined array
  const filteredUsers = users && users.length > 0 
    ? users.filter((user) =>
        user.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        (user.prenom && user.prenom.toLowerCase().includes(searchValue.toLowerCase()))
      )
    : [];

  // Ensure we have a valid selectedMembers array
  const validSelectedMembers = Array.isArray(selectedMembers) ? selectedMembers : [];

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
        {isLoading ? (
          <div className="py-6 text-center">Chargement des utilisateurs...</div>
        ) : (
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Rechercher un membre..." 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandEmpty>Aucun membre trouvé</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">
                  Aucun utilisateur ne correspond à votre recherche
                </div>
              ) : (
                filteredUsers.map((user) => {
                  const isSelected = validSelectedMembers.some((member) => member.id === user.id);
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
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium">{user.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{user.name} {user.prenom || ''}</p>
                          <p className="text-xs text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                    </CommandItem>
                  );
                })
              )}
            </CommandGroup>
          </Command>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MemberSearch;
