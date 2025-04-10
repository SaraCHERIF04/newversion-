
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types/User';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Key, PenLine } from 'lucide-react';

const AdminProfileDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch the current admin user
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const admin = storedUsers.find((user: User) => user.role === 'admin');
    
    if (admin) {
      setAdminUser(admin);
    }
  }, []);

  if (!adminUser) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Information profil</h2>
          <Button 
            onClick={() => navigate('/admin/profile/edit')}
            className="ml-auto"
          >
            <PenLine className="mr-2 h-4 w-4" />
            Modifier le profil
          </Button>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                {adminUser.avatar ? (
                  <img 
                    src={adminUser.avatar} 
                    alt={`${adminUser.name} ${adminUser.prenom}`} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                    {adminUser.name && adminUser.prenom 
                      ? `${adminUser.name.charAt(0)}${adminUser.prenom.charAt(0)}`
                      : 'AD'}
                  </div>
                )}
              </div>
              <p className="text-center mt-2 text-sm font-medium">{adminUser.email}</p>
            </div>
            
            <div className="flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">{adminUser.prenom}</div>
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
                    {adminUser.role === 'admin' ? 'Administrateur' : 
                     adminUser.role === 'chef' ? 'Chef de projet' : 'Employé'}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date création</label>
                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                    {format(new Date(adminUser.createdAt), "dd MMMM yyyy", { locale: fr })}
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  variant="outline" 
                  className="w-full md:w-auto"
                  onClick={() => setShowPasswordSection(!showPasswordSection)}
                >
                  <Key className="mr-2 h-4 w-4" />
                  Changer le mot de passe
                </Button>
                
                {showPasswordSection && (
                  <div className="mt-6 border rounded-md p-6">
                    <h3 className="text-lg font-medium mb-4">Modification du mot de passe</h3>
                    <p className="text-sm mb-6">
                      Votre mot de passe doit comporter au moins 8 caractères et inclure une combinaison de chiffres,
                      de lettres et de caractères spéciaux (!@#$%).
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Mot de passe actuel</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nouveau mot de passe</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Répéter le nouveau mot de passe</label>
                        <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3" />
                      </div>
                      
                      <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                        Mot de passe oublié?
                      </div>
                      
                      <Button className="w-full sm:w-auto">
                        Enregistrer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileDetailsPage;
