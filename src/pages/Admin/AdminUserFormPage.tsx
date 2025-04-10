
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, User } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { User as UserType } from '@/types/User';

// Mock users (same data as in AdminUsersPage)
const mockUsers: UserType[] = [
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

const AdminUserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    telephone: string;
    role: 'admin' | 'chef' | 'employee';
    status: boolean;
    password: string;
  }>({
    name: '',
    email: '',
    telephone: '',
    role: 'employee',
    status: true,
    password: '',
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      // Find the user in our mock data
      const user = mockUsers.find(u => u.id === id);
      
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          telephone: user.telephone || '',
          role: user.role,
          status: user.status === 'active',
          password: '' // We don't show the password in edit mode
        });
      } else {
        // If user not found, redirect back to users list
        toast({
          title: "Utilisateur non trouvé",
          description: "L'utilisateur que vous essayez de modifier n'existe pas",
          variant: "destructive",
        });
        navigate('/admin/users');
      }
    }
  }, [id, isEditMode, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as 'admin' | 'chef' | 'employee'
    }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Form validation
    if (!formData.name || !formData.email || (!isEditMode && !formData.password)) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Phone validation
    if (formData.telephone && !/^0\d{9}$/.test(formData.telephone)) {
      toast({
        title: "Numéro de téléphone invalide",
        description: "Veuillez entrer un numéro de téléphone valide (10 chiffres commençant par 0)",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        toast({
          title: "Utilisateur mis à jour",
          description: `L'utilisateur ${formData.name} a été mis à jour avec succès`,
        });
      } else {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${formData.name} a été créé avec succès`,
        });
      }
      
      navigate('/admin/users');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/admin/users')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Modifier un compte' : 'Ajouter un compte'}
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>Information utilisateur</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Nom <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Nom complet"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  placeholder="Numéro de téléphone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  type="tel"
                />
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Adresse Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="role">Rôle <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="chef">Chef de projet</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="password">
                  {isEditMode ? 'Nouveau mot de passe' : 'Mot de passe'} 
                  {!isEditMode && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={isEditMode ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!isEditMode}
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <Label htmlFor="status">État</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="status"
                    checked={formData.status}
                    onCheckedChange={handleStatusChange}
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status ? 'Actif' : 'Inactif'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserFormPage;
