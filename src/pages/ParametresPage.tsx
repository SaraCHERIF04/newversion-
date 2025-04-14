
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, BellRing, Mail, Shield, Palette } from 'lucide-react';

const ParametresPage: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('fr');
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionner une langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                    <SelectItem value="ar">Arabe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select defaultValue="africa_algiers">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Sélectionner un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="africa_algiers">Afrique/Alger (GMT+1)</SelectItem>
                    <SelectItem value="europe_paris">Europe/Paris (GMT+1)</SelectItem>
                    <SelectItem value="europe_london">Europe/London (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <div className="space-y-2">
                <Label htmlFor="notif-frequency">Fréquence de notifications</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="notif-frequency">
                    <SelectValue placeholder="Sélectionner la fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Temps réel</SelectItem>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Enregistrer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité et confidentialité</CardTitle>
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
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="two-factor" className="flex-1">Authentification à deux facteurs</Label>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <Button>Mettre à jour le mot de passe</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Apparence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Thème</Label>
                <div className="flex space-x-4">
                  <div
                    className={`
                      cursor-pointer w-20 h-20 rounded-md flex items-center justify-center bg-white border 
                      ${theme === 'light' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'}
                    `}
                    onClick={() => setTheme('light')}
                  >
                    <Palette className="h-8 w-8 text-gray-900" />
                  </div>
                  <div
                    className={`
                      cursor-pointer w-20 h-20 rounded-md flex items-center justify-center bg-gray-900 border 
                      ${theme === 'dark' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-700'}
                    `}
                    onClick={() => setTheme('dark')}
                  >
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <div
                    className={`
                      cursor-pointer w-20 h-20 rounded-md flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 border 
                      ${theme === 'system' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-700'}
                    `}
                    onClick={() => setTheme('system')}
                  >
                    <div className="flex flex-col items-center">
                      <Palette className="h-6 w-6 text-white" />
                      <span className="text-xs text-white mt-1">Système</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="font-size">Taille de police</Label>
                <Select defaultValue="medium">
                  <SelectTrigger id="font-size">
                    <SelectValue placeholder="Sélectionner la taille" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Petite</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="large">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParametresPage;
