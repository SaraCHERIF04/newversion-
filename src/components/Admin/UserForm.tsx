import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User as UserType } from '@/types/User';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormSchema } from './UserFormSchema';
import { UserFormHeader } from './UserFormHeader';
import { UserFormFields } from './UserFormFields';
import { UserInterface } from '@/interfaces/UserInterface';
import { userService } from '@/services/userService';

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Initialize form with useForm hook
  const form = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      numero_de_tel: '',
      matricule: '',
      sexe: 'homme' as const,
      role_de_utilisateur: 'employee' as const,
      etat: 'En poste',
      created_at: new Date(),
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const user = await userService.getUserById(id);
        if (user) {
          form.reset({
            nom: user.data.nom,
            prenom: user.data.prenom || '',
            email: user.data.email,
            numero_de_tel: user.data.numero_de_tel || '',
            matricule: user.data.matricule || '',
            sexe: user.data.sexe as "homme" | "femme",
            role_de_utilisateur: user.data.role_de_utilisateur as "admin" | "chef" | "employee",
            etat: user.data.etat as "En poste" | "En congé" | "Maladie" | "Mission" | "Formation" | "Disponible",
            created_at: new Date(user.data.created_at)
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
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    if (isEditMode && id) {
      fetchUser();
    }
  }, [id, isEditMode, navigate, toast, form]);


  const addNewUser = async (values: z.infer<typeof UserFormSchema>) => {
    try {
      const newUserInterface: Omit<UserInterface, 'id'> = {
        id_utilisateur: 0,
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        numero_de_tel: values.numero_de_tel,
        matricule: values.matricule,
        sexe: values.sexe,
        role_de_utilisateur: values.role_de_utilisateur,
        etat: values.etat,
        created_at: values.created_at,
        mot_de_passe: '',
        is_anonymous: false,
        is_authenticated: true,
        is_active: true
      }
      const newUser = await userService.createUser(newUserInterface);
      toast({
        title: "Utilisateur créé",
        description: `L'utilisateur ${values.nom} ${values.prenom} a été créé avec succès`,
      });
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  }

  const updateUser = async (values: z.infer<typeof UserFormSchema>) => {
    try {
      const updatedUserInterface: UserInterface = {
        id_utilisateur: parseInt(id),
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        numero_de_tel: values.numero_de_tel,
        matricule: values.matricule,
        sexe: values.sexe,
        role_de_utilisateur: values.role_de_utilisateur,
        etat: values.etat,
        created_at: values.created_at,
        mot_de_passe: '',
        is_anonymous: false,
        is_authenticated: true,
        is_active: true
      }
      const updatedUser = await userService.updateUser(id, updatedUserInterface);
      toast({
        title: "Utilisateur mis à jour",
        description: `L'utilisateur ${values.nom} ${values.prenom} a été mis à jour avec succès`,
      });
     
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  

  const onSubmit = (values: z.infer<typeof UserFormSchema>) => {
    setLoading(true);
      if (isEditMode) {
        updateUser(values);
      } else {
        addNewUser(values);
      }
      setLoading(false);
      navigate('/admin/users');

  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <UserFormHeader 
          isEditMode={isEditMode} 
          onCancel={() => navigate('/admin/users')} 
        />
        
        <CardContent className="p-6 pt-8">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-gray-200 mx-auto bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
                {isEditMode && form.getValues("nom") && form.getValues("prenom") 
                  ? `${form.getValues("nom").charAt(0)}${form.getValues("prenom").charAt(0)}`
                  : 'NU'}
              </div>
            </div>
            
            <div className="flex-grow">
              <UserFormFields 
                form={form} 
                onSubmit={onSubmit} 
                isEditMode={isEditMode}
                loading={loading}
                userId={id}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
