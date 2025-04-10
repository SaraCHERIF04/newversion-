
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { User } from '@/types/User';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from '@/hooks/use-toast';

const profileFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  telephone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 caractères"),
  matricule: z.string().min(1, "Le matricule est requis"),
  gender: z.enum(["male", "female"]),
  role: z.enum(["admin", "chef", "employee"]),
  status: z.enum(["active", "inactive"]),
  createdAt: z.date(),
});

const AdminProfilePage: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adminUser, setAdminUser] = useState<User | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      prenom: '',
      email: '',
      telephone: '',
      matricule: '',
      gender: 'male' as const,
      role: 'admin' as const,
      status: 'active' as const,
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    // In a real app, this would fetch the current admin user
    // For now, we'll use the first admin from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const admin = storedUsers.find((user: User) => user.role === 'admin');
    
    if (admin) {
      setAdminUser(admin);
      
      form.reset({
        name: admin.name,
        prenom: admin.prenom || '',
        email: admin.email,
        telephone: admin.telephone || '',
        matricule: admin.matricule || '',
        gender: admin.gender || 'male',
        role: admin.role,
        status: admin.status,
        createdAt: new Date(admin.createdAt)
      });
    }
  }, [form]);

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!adminUser) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Get stored users
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Generate avatar URL
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name + ' ' + values.prenom)}&background=random`;
      
      // Update the user
      const updatedUser: User = {
        ...adminUser,
        name: values.name,
        prenom: values.prenom,
        email: values.email,
        telephone: values.telephone,
        matricule: values.matricule,
        gender: values.gender,
        role: values.role,
        status: values.status,
        createdAt: values.createdAt.toISOString(),
        avatar: avatarUrl
      };
      
      // Update in localStorage
      const updatedUsers = storedUsers.map((user: User) => 
        user.id === adminUser.id ? updatedUser : user
      );
      
      localStorage.setItem('mockUsers', JSON.stringify(updatedUsers));
      setAdminUser(updatedUser);
      
      toast({
        title: "Profil mis à jour",
        description: "Votre profil a été mis à jour avec succès",
      });
      
      setLoading(false);
    }, 800);
  };

  if (!adminUser) {
    return <div className="text-center py-10">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Ajouter compte</h2>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
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
                            <Input 
                              type="tel" 
                              placeholder="Téléphone" 
                              {...field} 
                            />
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
                                className={cn("p-3 pointer-events-auto")}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="px-6"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer
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

export default AdminProfilePage;
