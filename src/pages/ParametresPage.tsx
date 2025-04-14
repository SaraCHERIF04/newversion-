
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, BellRing, Mail, Shield, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParametersState {
  theme: string;
  notifications: boolean;
  emailNotifications: boolean;
  language: string;
  timezone: string;
  notifFrequency: string;
  fontSize: string;
  twoFactor: boolean;
}

const ParametresPage: React.FC = () => {
  const { toast } = useToast();
  
  // Load saved settings from localStorage or use defaults
  const loadSavedSettings = (): ParametersState => {
    const savedSettings = localStorage.getItem('parameterSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return {
      theme: 'light',
      notifications: true,
      emailNotifications: true,
      language: 'fr',
      timezone: 'africa_algiers',
      notifFrequency: 'daily',
      fontSize: 'medium',
      twoFactor: false
    };
  };
  
  const [state, setState] = useState<ParametersState>(loadSavedSettings());
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  
  // Save settings to localStorage whenever they change
  const saveSettings = () => {
    localStorage.setItem('parameterSettings', JSON.stringify(state));
    toast({
      title: "Paramètres enregistrés",
      description: "Vos paramètres ont été sauvegardés avec succès.",
    });
  };
  
  const handleLanguageChange = (value: string) => {
    setState(prev => ({ ...prev, language: value }));
  };
  
  const handleTimezoneChange = (value: string) => {
    setState(prev => ({ ...prev, timezone: value }));
  };
  
  const handleNotificationChange = (checked: boolean) => {
    setState(prev => ({ ...prev, notifications: checked }));
  };
  
  const handleEmailNotificationChange = (checked: boolean) => {
    setState(prev => ({ ...prev, emailNotifications: checked }));
  };
  
  const handleNotifFrequencyChange = (value: string) => {
    setState(prev => ({ ...prev, notifFrequency: value }));
  };
  
  const handleThemeChange = (theme: string) => {
    setState(prev => ({ ...prev, theme }));
    // Apply theme class to body/html
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  };
  
  const handleFontSizeChange = (value: string) => {
    setState(prev => ({ ...prev, fontSize: value }));
  };
  
  const handleTwoFactorChange = (checked: boolean) => {
    setState(prev => ({ ...prev, twoFactor: checked }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [id.replace('password-', '')]: value
    }));
  };
  
  const handlePasswordUpdate = () => {
    if (password.new !== password.confirm) {
      toast({
        title: "Erreur",
        description: "Le nouveau mot de passe et la confirmation ne correspondent pas.",
        variant: "destructive"
      });
      return;
    }
    
    if (password.current !== 'password123') { // Simulated check
      toast({
        title: "Erreur",
        description: "Le mot de passe actuel est incorrect.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset password fields
    setPassword({
      current: '',
      new: '',
      confirm: ''
    });
    
    toast({
      title: "Mot de passe mis à jour",
      description: "Votre mot de passe a été modifié avec succès."
    });
  };
  
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
                <Select value={state.language} onValueChange={handleLanguageChange}>
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
                <Select value={state.timezone} onValueChange={handleTimezoneChange}>
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
              
              <Button onClick={saveSettings}>Enregistrer les modifications</Button>
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
                  checked={state.notifications}
                  onCheckedChange={handleNotificationChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="email-notifications" className="flex-1">Notifications par email</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={state.emailNotifications}
                  onCheckedChange={handleEmailNotificationChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notif-frequency">Fréquence de notifications</Label>
                <Select value={state.notifFrequency} onValueChange={handleNotifFrequencyChange}>
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
              
              <Button onClick={saveSettings}>Enregistrer les modifications</Button>
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
                <Label htmlFor="password-current">Mot de passe actuel</Label>
                <Input 
                  id="password-current" 
                  type="password" 
                  value={password.current}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-new">Nouveau mot de passe</Label>
                <Input 
                  id="password-new" 
                  type="password"
                  value={password.new}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-confirm">Confirmer le mot de passe</Label>
                <Input 
                  id="password-confirm" 
                  type="password"
                  value={password.confirm}
                  onChange={handlePasswordChange}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="two-factor" className="flex-1">Authentification à deux facteurs</Label>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={state.twoFactor}
                  onCheckedChange={handleTwoFactorChange}
                />
              </div>
              
              <Button onClick={handlePasswordUpdate}>Mettre à jour le mot de passe</Button>
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
                      ${state.theme === 'light' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-200'}
                    `}
                    onClick={() => handleThemeChange('light')}
                  >
                    <Palette className="h-8 w-8 text-gray-900" />
                  </div>
                  <div
                    className={`
                      cursor-pointer w-20 h-20 rounded-md flex items-center justify-center bg-gray-900 border 
                      ${state.theme === 'dark' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-700'}
                    `}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <div
                    className={`
                      cursor-pointer w-20 h-20 rounded-md flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 border 
                      ${state.theme === 'system' ? 'border-blue-600 ring-2 ring-blue-400' : 'border-gray-700'}
                    `}
                    onClick={() => handleThemeChange('system')}
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
                <Select value={state.fontSize} onValueChange={handleFontSizeChange}>
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
              
              <Button onClick={saveSettings}>Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParametresPage;
