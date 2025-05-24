import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { login } from '@/services/authService';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
<<<<<<< HEAD
      const response = await login({ email, password });
      const role = response.user?.role;
=======
      await login({ email, password });
      
>>>>>>> upstream/main
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur votre tableau de bord",
      });

      // Navigate based on user role
      const userRole = localStorage.getItem('userRole');
<<<<<<< HEAD
                  
      switch (userRole) {
        case 'Chef de projet':
          navigate('/dashboard');
=======
      switch (userRole) {
        case 'chef':
          navigate('/project');
>>>>>>> upstream/main
          break;
        case 'employee':
          navigate('/employee/projects');
          break;
        case 'responsable':
          navigate('/responsable/dashboard');
          break;
        case 'admin':
          navigate('/admin/users');
          break;
        case 'financier':
          navigate('/financier/factures');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <div
      className="flex justify-start items-center min-h-screen"
      style={{
        backgroundImage: "url('/lovable-uploads/login-bg.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
=======
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
>>>>>>> upstream/main
      <div className="w-full max-w-md p-4">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" alt="Logo" className="h-12" />
<<<<<<< HEAD
            
=======
>>>>>>> upstream/main
            <div>
              <h1 className="text-2xl font-bold text-blue-900">SONELGAZ</h1>
              <p className="text-blue-800">Projects</p>
            </div>
          </div>
        </div>
        
<<<<<<< HEAD
        <div>
=======
        <Card>
>>>>>>> upstream/main
          <CardHeader>
            <CardTitle className="text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
<<<<<<< HEAD
        </div>
=======
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Credentials for testing:
              <br />
              <strong>Admin:</strong> admin@sonelgaz.dz / admin123
              <br />
              <strong>Chef:</strong> alexarowles@sonelgaz.dz / sadmin123
              <br />
              <strong>Responsable:</strong> ahmed.benali@sonelgaz.dz / responsable123
              <br />
              <strong>Employee:</strong> jeandupont@sonelgaz.dz / employee123
              <br />
              <strong>Financier:</strong> finance@sonelgaz.dz / finance123
            </p>
          </CardFooter>
        </Card>
>>>>>>> upstream/main
      </div>
    </div>
  );
};

export default LoginPage;
