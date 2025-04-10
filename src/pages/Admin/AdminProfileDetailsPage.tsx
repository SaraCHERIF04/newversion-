
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types/User';
import { Edit } from 'lucide-react';
import { STATUS_OPTIONS } from '@/components/Admin/UserForm/UserFormSchema';

const AdminProfileDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the current admin user
    // For now, we'll use the first admin from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const admin = storedUsers.find((user: User) => user.role === 'admin');
    
    if (admin) {
      setAdminUser(admin);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  if (!adminUser) {
    return <div className="text-center py-10">Aucun profil administrateur trouvé</div>;
  }

  const getFormattedRoleName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'chef':
        return 'Chef de projet';
      case 'employee':
        return 'Employé';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Détails du profil</h2>
          <Button 
            onClick={() => navigate('/admin/profile/edit')}
            className="ml-auto"
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier profil
          </Button>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                {adminUser.name && adminUser.prenom 
                  ? `${adminUser.name.charAt(0)}${adminUser.prenom.charAt(0)}`
                  : 'NU'}
              </div>
              <p className="text-center mt-2 text-sm">{adminUser.email}</p>
            </div>
            
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.prenom || '-'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Matricule</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.matricule || '-'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numéro de téléphone</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.telephone || '-'}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sexe</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {adminUser.gender === 'male' ? 'Homme' : 'Femme'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">État</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {adminUser.status}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rôle</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {getFormattedRoleName(adminUser.role)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date création</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {new Date(adminUser.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileDetailsPage;
