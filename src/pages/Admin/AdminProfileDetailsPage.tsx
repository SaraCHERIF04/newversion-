import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil } from 'lucide-react';

const AdminProfileDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<{
    id: string;
<<<<<<< HEAD
    nom: string;
=======
    name: string;
>>>>>>> upstream/main
    email: string;
    imageUrl: string;
  } | null>(null);

  useEffect(() => {
    // Fetch admin details from localStorage
<<<<<<< HEAD
    const adminString = localStorage.getItem('admin'); 
=======
    const adminString = localStorage.getItem('admin');
>>>>>>> upstream/main
    if (adminString) {
      try {
        const adminData = JSON.parse(adminString);
        setAdmin(adminData);
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    }
  }, []);
<<<<<<< HEAD
   if (!admin) {
    return (
      <div className="container mx-auto py-10 text-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }
=======

  if (!admin) {
    return <div>Loading...</div>;
  }

>>>>>>> upstream/main
  return (
    <div className="container mx-auto py-10">
      <Card className="w-[500px] mx-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Profile Details</CardTitle>
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => navigate('/admin/profile/edit')}
          >
            <Pencil className="h-4 w-4" />
            <span>Modifier profil</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
<<<<<<< HEAD
              <AvatarImage src={admin.imageUrl} alt={admin.nom} />
              <AvatarFallback>{admin?.nom?.charAt(0) ?? "A"}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
            <h4 className="text-xl font-semibold">{admin?.nom ?? "Nom inconnu"}</h4>
            <p className="text-gray-500">{admin?.email ?? "Email non disponible"}</p>



=======
              <AvatarImage src={admin.imageUrl} alt={admin.name} />
              <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <h4 className="text-xl font-semibold">{admin.name}</h4>
              <p className="text-gray-500">{admin.email}</p>
>>>>>>> upstream/main
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfileDetailsPage;
