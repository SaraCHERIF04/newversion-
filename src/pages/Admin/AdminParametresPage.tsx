import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Settings, ServerIcon, Database, Users, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import adminSettingsService from '@/services/adminSettingsService';

const AdminParametresPage: React.FC = () => {
  // System settings
  const [appName, setAppName] = useState("SONELGAZ Projects");
  const [appUrl, setAppUrl] = useState("https://projects.sonelgaz.dz");
  const [appEnvironment, setAppEnvironment] = useState("production");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [cacheClear, setCacheClear] = useState(true);

  // Database settings
  const [dbType, setDbType] = useState("mysql");
  const [dbHost, setDbHost] = useState("localhost");
  const [dbName, setDbName] = useState("sonelgaz_projects");
  const [dbUser, setDbUser] = useState("admin");
  const [dbPassword, setDbPassword] = useState("********");

  // Security settings
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [autoLogout, setAutoLogout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // User settings
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [emailVerification, setEmailVerification] = useState(true);
  const [adminApproval, setAdminApproval] = useState(true);
  const [defaultRole, setDefaultRole] = useState("employee");
  const [autoCleanup, setAutoCleanup] = useState("365");

  // Logs settings
  const [logLevel, setLogLevel] = useState("info");
  const [logRetention, setLogRetention] = useState("30");
  const [auditLogs, setAuditLogs] = useState(true);
  const [logLogin, setLogLogin] = useState(true);
  const [logUserCreation, setLogUserCreation] = useState(true);
  const [logDataModification, setLogDataModification] = useState(true);
  const [logSystemChanges, setLogSystemChanges] = useState(true);

  // Load settings from Firestore on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch all settings from Firestore
  const fetchSettings = async () => {
    try {
      // Fetch system settings
      const systemSettings = await adminSettingsService.getBySection('system');
      if (systemSettings) {
        setAppName(systemSettings.app_name || appName);
        setAppUrl(systemSettings.app_url || appUrl);
        setAppEnvironment(systemSettings.app_environment || appEnvironment);
        setMaintenanceMode(systemSettings.maintenance_mode ?? maintenanceMode);
        setDebugMode(systemSettings.debug_mode ?? debugMode);
        setCacheClear(systemSettings.cache_clear ?? cacheClear);
      }

      // Fetch database settings
      const dbSettings = await adminSettingsService.getBySection('database');
      if (dbSettings) {
        setDbType(dbSettings.db_type || dbType);
        setDbHost(dbSettings.db_host || dbHost);
        setDbName(dbSettings.db_name || dbName);
        setDbUser(dbSettings.db_user || dbUser);
        // We don't load the password for security reasons
      }

      // Fetch security settings
      const securitySettings = await adminSettingsService.getBySection('security');
      if (securitySettings) {
        setMinPasswordLength(securitySettings.min_password_length || minPasswordLength);
        setRequireSpecialChars(securitySettings.require_special_chars ?? requireSpecialChars);
        setRequireUppercase(securitySettings.require_uppercase ?? requireUppercase);
        setRequireNumbers(securitySettings.require_numbers ?? requireNumbers);
        setTwoFactorAuth(securitySettings.two_factor_auth ?? twoFactorAuth);
        setAutoLogout(securitySettings.auto_logout || autoLogout);
        setMaxLoginAttempts(securitySettings.max_login_attempts || maxLoginAttempts);
      }

      // Fetch user settings
      const userSettings = await adminSettingsService.getBySection('users');
      if (userSettings) {
        setAllowRegistration(userSettings.allow_registration ?? allowRegistration);
        setEmailVerification(userSettings.email_verification ?? emailVerification);
        setAdminApproval(userSettings.admin_approval ?? adminApproval);
        setDefaultRole(userSettings.default_role || defaultRole);
        setAutoCleanup(userSettings.auto_cleanup || autoCleanup);
      }

      // Fetch log settings
      const logSettings = await adminSettingsService.getBySection('logs');
      if (logSettings) {
        setLogLevel(logSettings.log_level || logLevel);
        setLogRetention(logSettings.log_retention || logRetention);
        setAuditLogs(logSettings.audit_logs ?? auditLogs);
        
        if (logSettings.log_actions) {
          setLogLogin(logSettings.log_actions.login ?? logLogin);
          setLogUserCreation(logSettings.log_actions.user_creation ?? logUserCreation);
          setLogDataModification(logSettings.log_actions.data_modification ?? logDataModification);
          setLogSystemChanges(logSettings.log_actions.system_changes ?? logSystemChanges);
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les paramètres"
      });
    }
  };

  // Save settings to Firestore
  const saveSettings = async (section: string) => {
    try {
      let settingsData = {};
      
      switch (section) {
        case "system":
          settingsData = {
            app_name: appName,
            app_url: appUrl,
            app_environment: appEnvironment,
            maintenance_mode: maintenanceMode,
            debug_mode: debugMode,
            cache_clear: cacheClear
          };
          break;
        
        case "database":
          settingsData = {
            db_type: dbType,
            db_host: dbHost,
            db_name: dbName,
            db_user: dbUser
            // We don't save the password for security reasons
          };
          break;
        
        case "security":
          settingsData = {
            min_password_length: minPasswordLength,
            require_special_chars: requireSpecialChars,
            require_uppercase: requireUppercase,
            require_numbers: requireNumbers,
            two_factor_auth: twoFactorAuth,
            auto_logout: autoLogout,
            max_login_attempts: maxLoginAttempts
          };
          break;
        
        case "users":
          settingsData = {
            allow_registration: allowRegistration,
            email_verification: emailVerification,
            admin_approval: adminApproval,
            default_role: defaultRole,
            auto_cleanup: autoCleanup
          };
          break;
        
        case "logs":
          settingsData = {
            log_level: logLevel,
            log_retention: logRetention,
            audit_logs: auditLogs,
            log_actions: {
              login: logLogin,
              user_creation: logUserCreation,
              data_modification: logDataModification,
              system_changes: logSystemChanges
            }
          };
          break;
      }
      
      // Save settings using the admin settings service
      const success = await adminSettingsService.save(section, settingsData);
      
      if (success) {
        toast({
          title: "Succès",
          description: "Paramètres enregistrés avec succès"
        });
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Erreur", 
        description: "Impossible d'enregistrer les paramètres"
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 mr-2 text-blue-600" />
        <h1 className="text-2xl font-bold">Paramètres administrateur</h1>
      </div>
      
      <Tabs defaultValue="system" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="system">Système</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="system">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ServerIcon className="mr-2 h-5 w-5" />
                Paramètres système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-name">Nom de l'application</Label>
                <Input 
                  id="app-name" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-url">URL de l'application</Label>
                <Input 
                  id="app-url" 
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="app-environment">Environnement</Label>
                <Select 
                  value={appEnvironment}
                  onValueChange={setAppEnvironment}
                >
                  <SelectTrigger id="app-environment">
                    <SelectValue placeholder="Sélectionner un environnement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Développement</SelectItem>
                    <SelectItem value="testing">Test</SelectItem>
                    <SelectItem value="staging">Pré-production</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="maintenance-mode" className="flex-1">Mode maintenance</Label>
                </div>
                <Switch 
                  id="maintenance-mode" 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="debug-mode" className="flex-1">Mode debug</Label>
                </div>
                <Switch 
                  id="debug-mode" 
                  checked={debugMode}
                  onCheckedChange={setDebugMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="cache-clear" className="flex-1">Vider le cache automatiquement</Label>
                </div>
                <Switch 
                  id="cache-clear" 
                  checked={cacheClear}
                  onCheckedChange={setCacheClear}
                />
              </div>
              
              <Button onClick={() => saveSettings("system")}>Appliquer les modifications</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Base de données
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="db-type">Type de base de données</Label>
                <Select
                  value={dbType}
                  onValueChange={setDbType}
                >
                  <SelectTrigger id="db-type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-host">Hôte</Label>
                <Input 
                  id="db-host" 
                  value={dbHost}
                  onChange={(e) => setDbHost(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="db-name">Nom de la base</Label>
                <Input 
                  id="db-name" 
                  value={dbName}
                  onChange={(e) => setDbName(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="db-user">Utilisateur</Label>
                  <Input 
                    id="db-user" 
                    value={dbUser}
                    onChange={(e) => setDbUser(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 flex-1">
                  <Label htmlFor="db-password">Mot de passe</Label>
                  <Input 
                    id="db-password" 
                    type="password" 
                    value={dbPassword}
                    onChange={(e) => setDbPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button>Tester la connexion</Button>
                <Button variant="outline" onClick={() => saveSettings("database")}>Sauvegarder les paramètres</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Paramètres utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Politique d'inscription</h3>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-registration" className="flex-1">Autoriser l'inscription publique</Label>
                  <Switch 
                    id="allow-registration" 
                    checked={allowRegistration}
                    onCheckedChange={setAllowRegistration}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-verification" className="flex-1">Vérification d'email obligatoire</Label>
                  <Switch 
                    id="email-verification" 
                    checked={emailVerification}
                    onCheckedChange={setEmailVerification}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="admin-approval" className="flex-1">Approbation administrateur nécessaire</Label>
                  <Switch 
                    id="admin-approval" 
                    checked={adminApproval}
                    onCheckedChange={setAdminApproval}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Paramètres par défaut</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="default-role">Rôle par défaut pour les nouveaux utilisateurs</Label>
                  <Select
                    value={defaultRole}
                    onValueChange={setDefaultRole}
                  >
                    <SelectTrigger id="default-role">
                      <SelectValue placeholder="Sélectionner le rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Invité</SelectItem>
                      <SelectItem value="employee">Employé</SelectItem>
                      <SelectItem value="responsable">Responsable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auto-cleanup">Nettoyer automatiquement les comptes inactifs après</Label>
                  <Select
                    value={autoCleanup}
                    onValueChange={setAutoCleanup}
                  >
                    <SelectTrigger id="auto-cleanup">
                      <SelectValue placeholder="Sélectionner la période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="180">180 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                      <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={() => saveSettings("users")}>Appliquer les modifications</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default AdminParametresPage;
