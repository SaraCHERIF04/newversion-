
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Edit, Trash, Mail, Phone, Calendar, UserCheck, BadgeCheck, Printer } from 'lucide-react';
import { User } from '@/types/User';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';

// Mock users (same data as in AdminUsersPage)
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
  }
];

const AdminUserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      // Find the user in our mock data
      const foundUser = mockUsers.find(u => u.id === id);
      
      if (foundUser) {
        setUser(foundUser);
      } else {
        // If user not found, redirect back to users list
        toast({
          title: "Utilisateur non trouvé",
          description: "L'utilisateur que vous essayez de consulter n'existe pas",
          variant: "destructive",
        });
        navigate('/admin/users');
      }
    }
  }, [id, navigate, toast]);

  const handleDelete = () => {
    // Simulate API call for deletion
    setTimeout(() => {
      toast({
        title: "Compte supprimé",
        description: `Le compte de ${user?.name} a été supprimé avec succès`,
      });
      
      navigate('/admin/users');
    }, 500);
  };
  
  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return <div className="flex justify-center items-center h-32">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/admin/users')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Information profil</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate(`/admin/users/edit/${id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Modifier le profil
          </Button>
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="mr-2 h-4 w-4" />
                Supprimer ce compte
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer le compte</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer le compte de {user.name} ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Détails du compte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full overflow-hidden mb-4">
                <img 
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="text-xl font-semibold text-center">{user.name}</h2>
              <div className="mt-2 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                  user.role === 'chef' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role === 'admin' ? 'Administrateur' :
                   user.role === 'chef' ? 'Chef de projet' :
                   'Employé'}
                </span>
                
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p>{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p>{user.telephone || 'Non renseigné'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Rôle</p>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-400" />
                    <p>
                      {user.role === 'admin' ? 'Administrateur' :
                       user.role === 'chef' ? 'Chef de projet' :
                       'Employé'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Statut</p>
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-gray-400" />
                    <p>{user.status === 'active' ? 'Actif' : 'Inactif'}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Date de création</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p>{format(new Date(user.createdAt), 'dd/MM/yyyy')}</p>
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

export default AdminUserDetailsPage;
