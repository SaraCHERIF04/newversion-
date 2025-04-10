
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
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Mock users (same data as in AdminUsersPage)
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'Alexis Rowles',
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
    name: 'Jean Dupont',
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
    name: 'Admin Sonelgaz',
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

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(3, { message: "Le nom doit contenir au moins 3 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  telephone: z.string().regex(/^0\d{9}$/, { message: "Format de téléphone invalide (10 chiffres commençant par 0)" }),
  matricule: z.string().min(3, { message: "Le matricule doit contenir au moins 3 caractères" }),
  gender: z.enum(["male", "female"], { message: "Veuillez sélectionner un genre" }),
  role: z.enum(["admin", "chef", "employee"], { message: "Veuillez sélectionner un rôle" }),
  status: z.boolean(),
  password: z.string().optional()
});

const AdminUserFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Initialize form with useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      telephone: '',
      matricule: '',
      gender: 'male' as const,
      role: 'employee' as const,
      status: true,
      password: '',
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      // Find the user in our mock data
      const user = mockUsers.find(u => u.id === id);
      
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          telephone: user.telephone || '',
          matricule: user.matricule || '',
          gender: user.gender || 'male',
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
  }, [id, isEditMode, navigate, toast, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (isEditMode) {
        toast({
          title: "Utilisateur mis à jour",
          description: `L'utilisateur ${values.name} a été mis à jour avec succès`,
        });
      } else {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${values.name} a été créé avec succès`,
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nom complet"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="matricule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matricule <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Numéro de matricule"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse Email <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            {...field}
                            disabled={isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Numéro de téléphone"
                            type="tel"
                            {...field}
                            disabled={isEditMode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un genre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Homme</SelectItem>
                            <SelectItem value="female">Femme</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rôle <span className="text-red-500">*</span></FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un rôle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="admin">Administrateur</SelectItem>
                            <SelectItem value="chef">Chef de projet</SelectItem>
                            <SelectItem value="employee">Employé</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {isEditMode ? 'Nouveau mot de passe' : 'Mot de passe'} 
                          {!isEditMode && <span className="text-red-500">*</span>}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={isEditMode ? "Laisser vide pour ne pas changer" : "Mot de passe"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex-1 space-y-2">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>État</FormLabel>
                        <div className="flex items-center space-x-2 pt-2">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label className="cursor-pointer">
                            {field.value ? 'Actif' : 'Inactif'}
                          </Label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserFormPage;
