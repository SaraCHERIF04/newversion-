
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/User';
import { Trash, Save } from 'lucide-react';

// Mock users data (same as in AdminUserFormPage)
const mockUsers: UserType[] = [
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
    gender: 'male',
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
    gender: 'male',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString(),
    avatar: `https://ui-avatars.com/api/?name=Admin+Sonelgaz&background=random`
  }
];

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find user in mock data
  const user = mockUsers.find(u => u.id === id);
  
  const [userData, setUserData] = useState<UserType | undefined>(user);
  const [loading, setLoading] = useState(false);
  
  if (!userData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h2>
        <Button onClick={() => navigate('/admin/users')}>
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        toast({
          title: "Utilisateur supprimé",
          description: `L'utilisateur ${userData.name} ${userData.prenom} a été supprimé avec succès`,
        });
        
        navigate('/admin/users');
      }, 800);
    }
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Utilisateur mis à jour",
        description: `L'utilisateur ${userData.name} ${userData.prenom} a été mis à jour avec succès`,
      });
      
      setLoading(false);
    }, 800);
  };
  
  const handleChange = (field: keyof UserType, value: string) => {
    if (userData) {
      setUserData({ ...userData, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Information profil</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate(`/admin/users/edit/${id}`)}
            className="ml-auto"
          >
            Modifier le profil
          </Button>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                <img 
                  src={userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=random`} 
                  alt={userData.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="text-center mt-2 text-sm">{userData.email}</p>
            </div>
            
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input 
                    id="matricule" 
                    value={userData.matricule || ''} 
                    onChange={(e) => handleChange('matricule', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="gender">Sexe</Label>
                  <Select 
                    value={userData.gender || 'male'} 
                    onValueChange={(value) => handleChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Sélectionner le sexe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Homme</SelectItem>
                      <SelectItem value="female">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="status">État</Label>
                  <Select 
                    value={userData.status} 
                    onValueChange={(value) => handleChange('status', value as 'active' | 'inactive')}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner l'état" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={userData.role} 
                    onValueChange={(value) => handleChange('role', value as 'admin' | 'chef' | 'employee')}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Sélectionner le rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="chef">Chef de projet</SelectItem>
                      <SelectItem value="employee">Employé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <Button 
                  variant="destructive" 
                  onClick={handleDelete} 
                  disabled={loading}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Supprimer ce compte
                </Button>
                
                <Button 
                  onClick={handleSave} 
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserDetailsPage;
