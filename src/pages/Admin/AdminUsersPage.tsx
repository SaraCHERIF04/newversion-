
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserCog, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/User';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alexis',
    prenom: 'Rowles',
    email: 'alexarowles@sonelgaz.dz',
    telephone: '0666666666',
    matricule: 'EMP001',
    gender: 'male',
    role: 'chef',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Alexis+Rowles&background=random`
  },
  {
    id: '2',
    name: 'Jean',
    prenom: 'Dupont',
    email: 'jeandupont@sonelgaz.dz',
    telephone: '0777777777',
    matricule: 'EMP002',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Jean+Dupont&background=random`
  },
  {
    id: '3',
    name: 'Admin',
    prenom: 'Sonelgaz',
    email: 'admin@sonelgaz.dz',
    telephone: '0555555555',
    matricule: 'ADM001',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Admin+Sonelgaz&background=random`
  },
  {
    id: '4',
    name: 'Marie',
    prenom: 'Lambert',
    email: 'marielambert@sonelgaz.dz',
    telephone: '0666666668',
    matricule: 'EMP003',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Marie+Lambert&background=random`
  },
  {
    id: '5',
    name: 'Ahmed',
    prenom: 'Kader',
    email: 'ahmedkader@sonelgaz.dz',
    telephone: '0666666669',
    matricule: 'EMP004',
    role: 'chef',
    status: 'inactive',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Ahmed+Kader&background=random`
  }
];

const AdminUsersPage: React.FC = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter users based on search query from context and local search
    const query = (searchQuery || localSearchQuery).toLowerCase();
    if (query) {
      const filtered = users.filter(
        user => 
          (user.name?.toLowerCase().includes(query)) || 
          (user.prenom?.toLowerCase().includes(query)) || 
          user.email.toLowerCase().includes(query) ||
          (user.telephone && user.telephone.includes(query)) ||
          (user.matricule && user.matricule.toLowerCase().includes(query))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, localSearchQuery, users]);

  const handleLocalSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(e.target.value);
  };
  
  // Function to get a color class based on the role
  const getRoleColorClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'chef': return 'bg-blue-100 text-blue-800';
      case 'employee': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Listes des utilisateurs</h2>
          <Button 
            onClick={() => navigate('/admin/users/new')}
            className="ml-auto"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter compte
          </Button>
        </div>
        
        <CardContent className="p-6">
          <div className="mb-6 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher un utilisateur..."
                className="pl-10"
                value={localSearchQuery}
                onChange={handleLocalSearch}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredUsers.map(user => (
              <Link 
                key={user.id} 
                to={`/admin/users/${user.id}`}
                className="block"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6 flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full overflow-hidden mb-4">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name + (user.prenom ? ' ' + user.prenom : ''))}&background=random`} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-center">
                      {user.name} {user.prenom}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 text-center">{user.email}</p>
                    
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColorClass(user.role)}`}>
                        {user.role === 'chef' ? 'Chef de projet' : 
                         user.role === 'admin' ? 'Administrateur' : 'Employé'}
                      </span>
                      
                      <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {user.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserCog className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-2 text-sm text-gray-500">
                Essayez avec une autre recherche ou ajoutez un nouveau compte.
              </p>
              <Button 
                onClick={() => navigate('/admin/users/new')} 
                className="mt-6"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un compte
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
