
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Settings, Key, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const ParametresPage: React.FC = () => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      toast({
        title: t('error'),
        description: t('passwordTooShort'),
        variant: "destructive",
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('passwordsDontMatch'),
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API
    localStorage.setItem('userPassword', newPassword);
    
    toast({
      title: t('success'),
      description: t('passwordUpdated'),
    });
    
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLanguageChange = (value: Language) => {
    setLanguage(value);
    toast({
      title: t('languageUpdated'),
      description: t('languageChangeSuccess'),
    });
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
      </div>
      
      <Tabs defaultValue="language" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="language">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              {t('language')}
            </div>
          </TabsTrigger>
          <TabsTrigger value="password">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              {t('password')}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t('language')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">{t('appLanguage')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t('french')}</SelectItem>
                    <SelectItem value="en">{t('english')}</SelectItem>
                    <SelectItem value="ar">{t('arabic')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>{t('password')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">{t('currentPassword')}</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">{t('newPassword')}</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t('confirmPassword')}</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {t('updatePassword')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParametresPage;
