import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Meeting } from '@/types/Meeting';

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Le titre doit contenir au moins 2 caractères.',
  }),
  date: z.string().min(1, {
    message: 'La date est requise.',
  }),
  time: z.string().min(1, {
    message: 'L\'heure est requise.',
  }),
  location: z.string().min(2, {
    message: 'Le lieu doit contenir au moins 2 caractères.',
  }),
  description: z.string().optional(),
  projectId: z.string().optional(),
  subProjectId: z.string().optional(),
  attendees: z.string().optional(),
  pvNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MeetingFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [subProjects, setSubProjects] = useState<any[]>([]);
  const [filteredSubProjects, setFilteredSubProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isEditMode = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      location: '',
      description: '',
      projectId: '',
      subProjectId: '',
      attendees: '',
      pvNumber: '',
    },
  });

  useEffect(() => {
    const projectsData = localStorage.getItem('projects');
    if (projectsData) {
      try {
        const parsedProjects = JSON.parse(projectsData);
        setProjects(parsedProjects);
      } catch (error) {
        console.error('Error parsing projects:', error);
      }
    }

    const subProjectsData = localStorage.getItem('subProjects');
    if (subProjectsData) {
      try {
        const parsedSubProjects = JSON.parse(subProjectsData);
        setSubProjects(parsedSubProjects);
      } catch (error) {
        console.error('Error parsing subProjects:', error);
      }
    }

    if (isEditMode) {
      const meetingsData = localStorage.getItem('meetings');
      if (meetingsData) {
        try {
          const meetings = JSON.parse(meetingsData);
          const meeting = meetings.find((m: Meeting) => m.id === id);
          
          if (meeting) {
            form.reset({
              title: meeting.title || '',
              date: meeting.date || new Date().toISOString().split('T')[0],
              time: meeting.time || '10:00',
              location: meeting.location || '',
              description: meeting.description || '',
              projectId: meeting.projectId || '',
              subProjectId: meeting.subProjectId || '',
              attendees: meeting.attendees || '',
              pvNumber: meeting.pvNumber || '',
            });

            if (meeting.projectId) {
              filterSubProjects(meeting.projectId);
            }
          }
        } catch (error) {
          console.error('Error loading meeting data:', error);
        }
      }
    }
  }, [id, form, isEditMode]);

  const filterSubProjects = (projectId: string) => {
    if (!projectId) {
      setFilteredSubProjects([]);
      return;
    }
    
    const filtered = subProjects.filter(sp => sp.projectId === projectId);
    setFilteredSubProjects(filtered);
  };

  const onSubmit = async (formData: FormValues) => {
    setIsLoading(true);
    
    try {
      const meetingsData = localStorage.getItem('meetings');
      let meetings = meetingsData ? JSON.parse(meetingsData) : [];
      
      if (isEditMode) {
        meetings = meetings.map((meeting: Meeting) => {
          if (meeting.id === id) {
            return {
              ...meeting,
              title: formData.title,
              date: formData.date,
              time: formData.time,
              location: formData.location,
              description: formData.description,
              projectId: formData.projectId,
              subProjectId: formData.subProjectId,
              attendees: formData.attendees || '',
              pvNumber: formData.pvNumber,
              updatedAt: new Date().toISOString(),
            };
          }
          return meeting;
        });
        
        toast({
          title: 'Réunion mise à jour',
          description: 'La réunion a été mise à jour avec succès.',
        });
      } else {
        const newMeeting: Meeting = {
          id: uuidv4(),
          title: formData.title,
          date: formData.date,
          time: formData.time,
          location: formData.location,
          description: formData.description || '',
          projectId: formData.projectId || '',
          subProjectId: formData.subProjectId || '',
          attendees: formData.attendees || '',
          pvNumber: formData.pvNumber || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        meetings.push(newMeeting);
        
        toast({
          title: 'Réunion créée',
          description: 'La réunion a été créée avec succès.',
        });
      }
      
      localStorage.setItem('meetings', JSON.stringify(meetings));
      navigate('/reunion');
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement de la réunion.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Modifier la réunion' : 'Créer une nouvelle réunion'}
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de la réunion</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de la réunion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pvNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de PV</FormLabel>
                  <FormControl>
                    <Input placeholder="Numéro de PV" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu</FormLabel>
                  <FormControl>
                    <Input placeholder="Lieu de la réunion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Projet associé</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      filterSubProjects(value);
                      form.setValue('subProjectId', '');
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un projet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subProjectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sous-projet associé</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!form.getValues('projectId')}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un sous-projet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {filteredSubProjects.map((subProject) => (
                        <SelectItem key={subProject.id} value={subProject.id}>
                          {subProject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="attendees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participants</FormLabel>
                <FormControl>
                  <Input placeholder="Liste des participants (séparés par des virgules)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / Ordre du jour</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description ou ordre du jour de la réunion"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/reunion')}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Enregistrement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MeetingFormPage;
