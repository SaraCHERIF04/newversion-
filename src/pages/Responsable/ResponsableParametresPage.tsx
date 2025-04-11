
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Settings, BellRing, Shield, Globe } from 'lucide-react';

const ResponsableParametresPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres</h1>
      </div>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="account">Compte</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Informations du compte</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" defaultValue="Ali Mohammed" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="ali.mohammed@sonelgaz.dz" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" defaultValue="+213 555 789 123" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input id="role" defaultValue="Responsable technique" readOnly />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea 
                    id="bio" 
                    rows={3} 
                    placeholder="Décrivez votre expérience et vos qualifications..."
                    defaultValue="Responsable technique chez Sonelgaz depuis 5 ans. Spécialisé dans la supervision des projets d'électrification et de distribution du gaz."
                  />
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
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Types de notifications</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="incident-notifs" className="flex-1">Nouveaux incidents</Label>
                  <Switch id="incident-notifs" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="project-updates" className="flex-1">Mises à jour de projets</Label>
                  <Switch id="project-updates" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="approval-requests" className="flex-1">Demandes d'approbation</Label>
                  <Switch id="approval-requests" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="security-alerts" className="flex-1">Alertes de sécurité</Label>
                  <Switch id="security-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="team-updates" className="flex-1">Mises à jour d'équipe</Label>
                  <Switch id="team-updates" defaultChecked />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Fréquence des résumés</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="notification-frequency">
                    <SelectValue placeholder="Sélectionner la fréquence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instant">Instantané</SelectItem>
                    <SelectItem value="hourly">Toutes les heures</SelectItem>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
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
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="two-factor" className="flex-1">Authentification à deux facteurs</Label>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <Button>Mettre à jour la sécurité</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences d'affichage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Sélectionner la langue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="ar">Arabe</SelectItem>
                    <SelectItem value="en">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select defaultValue="alger">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Sélectionner un fuseau horaire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alger">Alger (GMT+1)</SelectItem>
                    <SelectItem value="paris">Paris (GMT+2)</SelectItem>
                    <SelectItem value="london">Londres (GMT+0)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <Label htmlFor="date-format" className="flex-1">Format de date</Label>
                </div>
                <Select defaultValue="dd-mm-yyyy">
                  <SelectTrigger id="date-format" className="w-[180px]">
                    <SelectValue placeholder="Format de date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button>Enregistrer les préférences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResponsableParametresPage;
