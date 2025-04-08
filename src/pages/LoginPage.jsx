
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('chef');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'chef') {
      navigate('/project');
    } else if (userRole === 'employee') {
      navigate('/employee/projects');
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Hard-coded credentials for demo purposes
    // In a real app, you would validate against a backend
    if (role === 'chef') {
      // Check default chef credentials or stored password
      const storedPassword = localStorage.getItem('chefPassword');
      if (email === 'alexarowles@sonelgaz.dz' && (password === 'admin123' || password === storedPassword)) {
        localStorage.setItem('userRole', 'chef');
        navigate('/project');
      } else {
        setError('Email ou mot de passe invalide pour le chef');
      }
    } else {
      // Check default employee credentials or stored password
      const storedPassword = localStorage.getItem('employeePassword');
      if (email === 'jeandupont@sonelgaz.dz' && (password === 'employee123' || password === storedPassword)) {
        localStorage.setItem('userRole', 'employee');
        navigate('/employee/projects');
      } else {
        setError('Email ou mot de passe invalide pour l\'employé');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-20"
          src="https://apua-asea.org/wp-content/uploads/2023/01/sonelgaz.png"
          alt="Sonelgaz Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Connexion à votre compte
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse e-mail
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border px-3 py-2 shadow-sm focus:outline-none sm:text-sm"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Se connecter en tant que
              </Label>
              <div className="mt-1">
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="chef"
                      name="role"
                      type="radio"
                      checked={role === 'chef'}
                      onChange={() => setRole('chef')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="chef" className="ml-2 block text-sm text-gray-700">
                      Chef de projet
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="employee"
                      name="role"
                      type="radio"
                      checked={role === 'employee'}
                      onChange={() => setRole('employee')}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="employee" className="ml-2 block text-sm text-gray-700">
                      Employé
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                  Mot de passe oublié?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Se connecter
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <Button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  variant="outline"
                >
                  <span className="sr-only">Sign in with Google</span>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.981-2.981c-1.758-1.653-4.139-2.673-6.902-2.673-5.468 0-9.894 4.427-9.894 9.895 0 5.468 4.426 9.895 9.894 9.895 5.468 0 9.895-4.427 9.895-9.895 0-0.858-0.125-1.684-0.354-2.465h-9.541z"
                      fill="#4285F4"
                    />
                  </svg>
                </Button>
              </div>

              <div>
                <Button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                  variant="outline"
                >
                  <span className="sr-only">Sign in with Microsoft</span>
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                      fill="#F25022"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
