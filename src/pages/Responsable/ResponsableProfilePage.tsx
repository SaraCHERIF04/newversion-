
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

const ResponsableProfilePage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Ahmed',
    name: 'Benali',
    email: 'ahmed.benali@sonelgaz.dz',
    telephone: '0551234567',
    role: 'Responsable',
    status: 'En poste',
    matricule: 'RS-12345',
    profileImage: 'https://randomuser.me/api/portraits/men/36.jpg',
    gender: 'male',
    createdAt: '2023-02-15',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');

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
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleSaveProfile = () => {
    // Save profile to localStorage
    localStorage.setItem('userProfileResponsable', JSON.stringify(formData));
    setIsEditMode(false);
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été mises à jour avec succès."
    });
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Votre mot de passe doit comporter au moins 8 caractères et inclure une combinaison de chiffres, de lettres et de caractères spéciaux (Ex:#.*)');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Save password (in a real app this would call an API)
    localStorage.setItem('responsablePassword', passwordData.newPassword);
    
    // Reset fields
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été changé avec succès."
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'info' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('info')}
            >
              Information profil
            </button>
            <button
              className={`px-4 py-2 font-medium ${activeTab === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('password')}
            >
              Changer le mot de passe
            </button>
          </div>
          {activeTab === 'info' && !isEditMode && (
            <Button 
              variant="ghost" 
              className="text-blue-600"
              onClick={() => setIsEditMode(true)}
            >
              Modifier le profil
            </Button>
          )}
        </div>

        {activeTab === 'info' && (
          <div className="p-6">
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-3">
                <AvatarImage src={formData.profileImage} alt={`${formData.firstName} ${formData.name}`} />
                <AvatarFallback>{formData.firstName?.[0]}{formData.name?.[0]}</AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-500">{formData.email}</p>
            </div>

            {isEditMode ? (
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="matricule">Matricule</Label>
                    <Input
                      id="matricule"
                      name="matricule"
                      value={formData.matricule}
                      onChange={handleInputChange}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telephone">Numéro de téléphone</Label>
                    <Input
                      id="telephone"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      name="role"
                      value={formData.role}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdAt">Date d'ajout</Label>
                    <Input
                      id="createdAt"
                      name="createdAt"
                      type="date"
                      value={formData.createdAt}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsEditMode(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="button"
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSaveProfile}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Nom</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.name}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Prénom</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.firstName}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Matricule</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.matricule}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Numéro de téléphone</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.telephone}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Adresse Email</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.email}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Rôle</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.role}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">État</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.status}</div>
                </div>
                <div>
                  <Label className="block text-sm text-gray-500 mb-1">Date d'ajout</Label>
                  <div className="p-2 border border-gray-200 rounded-md bg-gray-50">{formData.createdAt}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'password' && (
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col items-center mb-6">
                <Avatar className="h-24 w-24 mb-3">
                  <AvatarImage src={formData.profileImage} alt={`${formData.firstName} ${formData.name}`} />
                  <AvatarFallback>{formData.firstName?.[0]}{formData.name?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-lg font-medium">{formData.firstName} {formData.name}</h2>
              </div>
              
              <p className="mb-6 text-sm text-gray-600">
                Votre mot de passe doit comporter au moins 8 caractères et inclure une combinaison de chiffres, 
                de lettres et de caractères spéciaux (Ex:#.*).
              </p>
              
              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
                  {passwordError}
                </div>
              )}
              
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <Input
                    id="current-password"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Retapez le nouveau mot de passe</Label>
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponsableProfilePage;
