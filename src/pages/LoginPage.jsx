
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chef');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Check credentials for each role
    if (role === 'chef' && email === 'alexarowles@sonelgaz.dz' && password === 'admin123') {
      setTimeout(() => {
        localStorage.setItem('userRole', 'chef');
        localStorage.setItem('userId', '1');
        localStorage.setItem('userName', 'Alexis Rowles');
        localStorage.setItem('userEmail', email);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord chef de projet",
        });
        navigate('/employee'); // Changed from '/project' to '/employee' as that's a valid route
        setLoading(false);
      }, 1000);
    } else if (role === 'employee' && email === 'jeandupont@sonelgaz.dz' && password === 'employee123') {
      setTimeout(() => {
        localStorage.setItem('userRole', 'employee');
        localStorage.setItem('userId', '2');
        localStorage.setItem('userName', 'Jean Dupont');
        localStorage.setItem('userEmail', email);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord employé",
        });
        navigate('/employee/projects');
        setLoading(false);
      }, 1000);
    } else if (role === 'responsable' && email === 'ahmed.benali@sonelgaz.dz' && password === 'responsable123') {
      setTimeout(() => {
        localStorage.setItem('userRole', 'responsable');
        localStorage.setItem('userId', '4');
        localStorage.setItem('userName', 'Ahmed Benali');
        localStorage.setItem('userEmail', email);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord responsable",
        });
        navigate('/responsable'); // Changed to just '/responsable' which is the base route
        setLoading(false);
      }, 1000);
    } else if (role === 'admin' && email === 'admin@sonelgaz.dz' && password === 'admin123') {
      setTimeout(() => {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userId', '3');
        localStorage.setItem('userName', 'Admin Sonelgaz');
        localStorage.setItem('userEmail', email);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur le tableau de bord administrateur",
        });
        navigate('/admin/users');
        setLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" alt="Logo" className="h-12" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">SONELGAZ</h1>
              <p className="text-blue-800">Projects</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="chef">Chef de projet</SelectItem>
                    <SelectItem value="responsable">Responsable</SelectItem>
                    <SelectItem value="employee">Employé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Credentials for testing:
              <br />
              <strong>Admin:</strong> admin@sonelgaz.dz / admin123
              <br />
              <strong>Chef:</strong> alexarowles@sonelgaz.dz / admin123
              <br />
              <strong>Responsable:</strong> ahmed.benali@sonelgaz.dz / responsable123
              <br />
              <strong>Employee:</strong> jeandupont@sonelgaz.dz / employee123
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
