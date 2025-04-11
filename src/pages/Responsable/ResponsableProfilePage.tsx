
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ResponsableProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    name: '',
    email: '',
    telephone: '',
    role: 'Responsable',
    status: 'En poste',
    matricule: '',
    profileImage: ''
  });

  useEffect(() => {
    // Get profile data from localStorage if it exists
    const savedProfile = localStorage.getItem('userProfileResponsable');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setFormData({
          ...formData,
          ...parsedProfile
        });
      } catch (error) {
        console.error("Error parsing profile:", error);
      }
    } else {
      // Set default values
      setFormData({
        firstName: 'Ahmed',
        name: 'Benali',
        email: 'ahmed.benali@sonelgaz.dz',
        telephone: '0551234567',
        role: 'Responsable',
        status: 'En poste',
        matricule: 'RS-12345',
        profileImage: 'https://randomuser.me/api/portraits/men/36.jpg'
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile to localStorage
    localStorage.setItem('userProfileResponsable', JSON.stringify(formData));
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été mises à jour avec succès."
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Votre Profil</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage 
                src={formData.profileImage} 
                alt={`${formData.firstName} ${formData.name}`} 
              />
              <AvatarFallback>
                {formData.firstName?.charAt(0)}{formData.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" className="w-full">
              Changer l'image
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2">
            <div>
              <CardTitle className="text-base">{formData.firstName} {formData.name}</CardTitle>
              <CardDescription>{formData.role}</CardDescription>
            </div>
            <div className="text-sm">
              <p className="mb-1"><strong>Email:</strong> {formData.email}</p>
              <p className="mb-1"><strong>Téléphone:</strong> {formData.telephone}</p>
              <p><strong>Statut:</strong> {formData.status}</p>
            </div>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Modifiez vos informations de profil</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    disabled
                    value={formData.role} 
                    onValueChange={(value) => handleSelectChange('role', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Responsable">Responsable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En poste">En poste</SelectItem>
                      <SelectItem value="En congé">En congé</SelectItem>
                      <SelectItem value="Maladie">Maladie</SelectItem>
                      <SelectItem value="Mission">Mission</SelectItem>
                      <SelectItem value="Formation">Formation</SelectItem>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matricule">Matricule</Label>
                  <Input
                    id="matricule"
                    name="matricule"
                    value={formData.matricule}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  Enregistrer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsableProfilePage;
