
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, BellRing, Mail, User } from 'lucide-react';

const EmployeeParametresPage: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
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
                <Button size="sm">Changer la photo</Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input id="name" defaultValue="Dupont" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="firstname">Prénom</Label>
                  <Input id="firstname" defaultValue="Jean" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="jean.dupont@sonelgaz.dz" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+213 555 123 456" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Département</Label>
                  <Select defaultValue="it">
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
                  <Input id="position" defaultValue="Ingénieur" />
                </div>
              </div>
              
              <Button>Enregistrer les modifications</Button>
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
                  <Switch id="project-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="task-notifs" className="flex-1">Tâches assignées</Label>
                  <Switch id="task-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="incident-notifs" className="flex-1">Nouveaux incidents</Label>
                  <Switch id="incident-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="meeting-notifs" className="flex-1">Réunions planifiées</Label>
                  <Switch id="meeting-notifs" defaultChecked />
                </div>
              </div>
              
              <Button>Enregistrer les modifications</Button>
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
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
              
              <Button>Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeParametresPage;
