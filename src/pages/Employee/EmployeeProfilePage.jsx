
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Remove the incorrect import
// import { User } from '@/types/User';

const EmployeeProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage
    const currentUserId = localStorage.getItem('currentUserId');
    const storedUsers = localStorage.getItem('users');
    
    if (currentUserId && storedUsers) {
      try {
        const users = JSON.parse(storedUsers);
        const currentUser = users.find(user => user.id === currentUserId);
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    } else {
      // Demo user for display
      const demoUser = {
        id: "user-1",
        name: "John",
        prenom: "Doe",
        email: "john.doe@example.com",
        telephone: "+213 555 123 456",
        matricule: "EMP123456",
        gender: "male",
        role: "employee",
        status: "En poste",
        createdAt: new Date().toISOString(),
        avatar: ""
      };
      setUser(demoUser);
    }
  }, []);

  if (!user) {
    return <div className="flex justify-center items-center h-64">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="h-24 w-24">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : (
                <AvatarFallback className="text-xl">
                  {user.name?.charAt(0)}{user.prenom?.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <CardTitle className="mt-4">{user.name} {user.prenom}</CardTitle>
            <CardDescription>{user.role === 'employee' ? 'Employé' : user.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="inline-flex items-center justify-center h-8 w-full px-4 py-2 text-sm font-medium rounded-md bg-blue-100 text-blue-800">
                {user.status}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Informations Personnelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1">{user.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1">{user.telephone || 'Non spécifié'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Matricule</h3>
                <p className="mt-1">{user.matricule || 'Non spécifié'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Genre</h3>
                <p className="mt-1">{user.gender === 'male' ? 'Homme' : user.gender === 'female' ? 'Femme' : 'Non spécifié'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date d'inscription</h3>
                <p className="mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
