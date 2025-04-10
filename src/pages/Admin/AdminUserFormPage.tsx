
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { User as UserType } from '@/types/User';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';

// Mock users (same data as in AdminUsersPage)
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

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  telephone: z.string().regex(/^0\d{9}$/, { message: "Format de téléphone invalide (10 chiffres commençant par 0)" }),
  matricule: z.string().min(3, { message: "Le matricule doit contenir au moins 3 caractères" }),
  gender: z.enum(["male", "female"], { message: "Veuillez sélectionner un genre" }),
  role: z.enum(["admin", "chef", "employee"], { message: "Veuillez sélectionner un rôle" }),
  status: z.enum(["active", "inactive"], { message: "Veuillez sélectionner un état" }),
  createdAt: z.date({
    required_error: "Veuillez sélectionner une date",
  }),
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
      prenom: '',
      email: '',
      telephone: '',
      matricule: '',
      gender: 'male' as const,
      role: 'employee' as const,
      status: 'active' as const,
      createdAt: new Date(),
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
          prenom: user.prenom || '',
          email: user.email,
          telephone: user.telephone || '',
          matricule: user.matricule || '',
          gender: user.gender || 'male',
          role: user.role,
          status: user.status,
          createdAt: new Date(user.createdAt),
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
          description: `L'utilisateur ${values.name} ${values.prenom} a été mis à jour avec succès`,
        });
      } else {
        toast({
          title: "Utilisateur créé",
          description: `L'utilisateur ${values.name} ${values.prenom} a été créé avec succès`,
        });
      }
      
      navigate('/admin/users');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{isEditMode ? 'Modifier compte' : 'Ajouter compte'}</h2>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/users')}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
        </div>
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto">
                <img 
                  src={isEditMode && id 
                    ? mockUsers.find(u => u.id === id)?.avatar 
                    : "https://ui-avatars.com/api/?name=New+User&background=random"} 
                  alt="User Avatar" 
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            
            <div className="flex-grow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="prenom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="matricule"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matricule</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Matricule" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="telephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro de téléphone</FormLabel>
                          <FormControl>
                            <div className="flex">
                              <span className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md">
                                +213
                              </span>
                              <Input 
                                type="tel" 
                                placeholder="Téléphone" 
                                className="rounded-l-none" 
                                {...field} 
                                disabled={isEditMode}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sexe</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le sexe" />
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
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adresse Email</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>État</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner l'état" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Actif</SelectItem>
                              <SelectItem value="inactive">Inactif</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rôle</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner le rôle" />
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
                    
                    <FormField
                      control={form.control}
                      name="createdAt"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Date création</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "P", { locale: fr })
                                  ) : (
                                    <span>Choisir une date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!isEditMode && (
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Mot de passe"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="px-6"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? 'Enregistrer' : 'Enregistrer'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUserFormPage;
