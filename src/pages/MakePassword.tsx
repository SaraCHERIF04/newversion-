import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { addPassword, login } from '@/services/authService';

const MakePassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addPassword(password, token);

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été mis à jour avec succès",
      });
      navigate('/');

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
            <CardTitle className="text-center">Création de mot de passe</CardTitle>
            <CardDescription className="text-center">
              Entrez votre nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                {loading ? 'Mise à jour en cours...' : 'Mettre à jour'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MakePassword;
