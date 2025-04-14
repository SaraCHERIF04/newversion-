import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, BellRing, Mail, User, Save } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const EmployeeParametresPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectNotifs, setProjectNotifs] = useState(true);
  const [taskNotifs, setTaskNotifs] = useState(true);
  const [incidentNotifs, setIncidentNotifs] = useState(true);
  const [meetingNotifs, setMeetingNotifs] = useState(true);
  
  const [profileData, setProfileData] = useState({
    name: 'Dupont',
    firstName: 'Jean',
    email: 'jean.dupont@sonelgaz.dz',
    phone: '+213 555 123 456',
    department: 'it',
    position: 'Ingénieur'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData(prev => ({ ...prev, [id]: value }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({ ...prev, [id.replace('-', '')]: value }));
  };
  
  const handleSaveProfile = () => {
    localStorage.setItem('userProfileEmployee', JSON.stringify({
      name: profileData.name,
      firstName: profileData.firstName,
      email: profileData.email,
      phone: profileData.phone,
      department: profileData.department,
      position: profileData.position
    }));
    
    toast({
      title: "Profil mis à jour",
      description: "Vos informations de profil ont été enregistrées",
      variant: "default"
    });
  };
  
  const handleSaveNotifications = () => {
    localStorage.setItem('notificationSettings', JSON.stringify({
      notifications,
      emailNotifications,
      projectNotifs,
      taskNotifs,
      incidentNotifs,
      meetingNotifs
    }));
    
    toast({
      title: "Paramètres de notification mis à jour",
      description: "Vos préférences de notification ont été enregistrées",
      variant: "default"
    });
  };
  
  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe et la confirmation ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    if (passwordData.currentPassword !== 'password123') {
      toast({
        title: "Erreur",
        description: "Le mot de passe actuel est incorrect",
        variant: "destructive"
      });
      return;
    }
    
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès",
      variant: "default"
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Mot de passe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <Button size="sm" onClick={() => {
                  toast({
                    title: "Fonctionnalité en développement",
                    description: "Le changement de photo sera disponible prochainement"
                  });
                }}>Changer la photo</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" value={profileData.name} onChange={handleProfileChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" value={profileData.firstName} onChange={handleProfileChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={handleProfileChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" value={profileData.phone} onChange={handleProfileChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select 
                    value={profileData.department}
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">Informatique</SelectItem>
                      <SelectItem value="hr">Ressources Humaines</SelectItem>
                      <SelectItem value="ops">Opérations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="position">Poste</Label>
                  <Input id="position" value={profileData.position} onChange={handleProfileChange} />
                </div>
              </div>
              
              <Button onClick={handleSaveProfile} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BellRing className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="notifications" className="flex-1">Notifications push</Label>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="email-notifications" className="flex-1">Notifications par email</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Types de notifications</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-notifs" className="flex-1">Modifications de projets</Label>
                  <Switch 
                    id="project-notifs" 
                    checked={projectNotifs}
                    onCheckedChange={setProjectNotifs}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="task-notifs" className="flex-1">Tâches assignées</Label>
                  <Switch 
                    id="task-notifs" 
                    checked={taskNotifs}
                    onCheckedChange={setTaskNotifs}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="incident-notifs" className="flex-1">Nouveaux incidents</Label>
                  <Switch 
                    id="incident-notifs" 
                    checked={incidentNotifs}
                    onCheckedChange={setIncidentNotifs}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="meeting-notifs" className="flex-1">Réunions planifiées</Label>
                  <Switch 
                    id="meeting-notifs" 
                    checked={meetingNotifs}
                    onCheckedChange={setMeetingNotifs}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveNotifications} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input 
                  id="confirm-password" 
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <Button onClick={handleUpdatePassword} className="flex items-center">
                <Save className="h-4 w-4 mr-2" />
                Mettre à jour le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeParametresPage;
