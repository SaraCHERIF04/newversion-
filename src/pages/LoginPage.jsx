
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple validation
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    // Mock login logic - in real app you would authenticate against a server
    setTimeout(() => {
      setIsLoading(false);
      
      if (username.toLowerCase() === 'chef' && password === 'password') {
        // Chef login
        localStorage.setItem('userRole', 'chef');
        localStorage.setItem('userName', 'Chef Projet');
        localStorage.setItem('userId', 'chef-001');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace chef de projet"
        });
        navigate('/project');
      } else if (username.toLowerCase() === 'employee' && password === 'password') {
        // Employee login
        localStorage.setItem('userRole', 'employee');
        localStorage.setItem('userName', 'Jean Dupont');
        localStorage.setItem('userId', 'emp-001');
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace employé"
        });
        navigate('/employee/projects');
      } else {
        setError('Identifiant ou mot de passe incorrect');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 flex flex-col items-center">
        <img src="/public/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" alt="Sonelgaz Logo" className="h-16 mb-2" />
        <h1 className="text-2xl font-bold text-[#192759]">SONELGAZ</h1>
        <p className="text-gray-600">Système de gestion de projets</p>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Entrez vos identifiants pour accéder à votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Identifiant</Label>
                <Input
                  id="username"
                  placeholder="Entrez votre identifiant"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                />
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                type="submit" 
                className="w-full bg-[#192759]" 
                disabled={isLoading}
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-sm mt-4">
            <p className="text-gray-500">Utilisez les identifiants ci-dessous pour vous connecter:</p>
            <div className="mt-2 space-y-1">
              <p><strong>Chef:</strong> chef / password</p>
              <p><strong>Employé:</strong> employee / password</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
