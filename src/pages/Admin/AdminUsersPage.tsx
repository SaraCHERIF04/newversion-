
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Search, UserCog } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useSearchQuery } from '@/components/Layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/User';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alexis Rowles',
    email: 'alexarowles@sonelgaz.dz',
    telephone: '0666666666',
    role: 'chef',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Alexis+Rowles&background=random`
  },
  {
    id: '2',
    name: 'Jean Dupont',
    email: 'jeandupont@sonelgaz.dz',
    telephone: '0777777777',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Jean+Dupont&background=random`
  },
  {
    id: '3',
    name: 'Admin Sonelgaz',
    email: 'admin@sonelgaz.dz',
    telephone: '0555555555',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Admin+Sonelgaz&background=random`
  },
  {
    id: '4',
    name: 'Marie Lambert',
    email: 'marielambert@sonelgaz.dz',
    telephone: '0666666668',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Marie+Lambert&background=random`
  },
  {
    id: '5',
    name: 'Ahmed Kader',
    email: 'ahmedkader@sonelgaz.dz',
    telephone: '0666666669',
    role: 'chef',
    status: 'inactive',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Ahmed+Kader&background=random`
  },
  {
    id: '6',
    name: 'Sophie Martin',
    email: 'sophiemartin@sonelgaz.dz',
    telephone: '0666666670',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Sophie+Martin&background=random`
  },
  {
    id: '7',
    name: 'Karim Benz',
    email: 'karimbenz@sonelgaz.dz',
    telephone: '0666666671',
    role: 'employee',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Karim+Benz&background=random`
  },
  {
    id: '8',
    name: 'Julie Masson',
    email: 'juliemasson@sonelgaz.dz',
    telephone: '0666666672',
    role: 'chef',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Julie+Masson&background=random`
  }
];

const AdminUsersPage: React.FC = () => {
  const { searchQuery } = useSearchQuery();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Filter users based on search query from context and local search
    const query = (searchQuery?.searchQuery || localSearchQuery).toLowerCase();
    if (query) {
      const filtered = users.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          (user.telephone && user.telephone.includes(query))
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Listes des utilisateurs</h1>
        <Link to="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un compte
          </Button>
        </Link>
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Rechercher un utilisateur..."
          className="pl-8"
          value={localSearchQuery}
          onChange={handleLocalSearch}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredUsers.map(user => (
              <Link 
                key={user.id} 
                to={`/admin/users/${user.id}`}
                className="block"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-4 flex flex-col items-center">
                    <div className="h-16 w-16 rounded-full overflow-hidden mb-3">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold text-lg text-center">{user.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 text-center">{user.email}</p>
                    
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
            <div className="text-center py-8">
              <UserCog className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun utilisateur trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                Essayez avec une autre recherche ou ajoutez un nouveau compte.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsersPage;
