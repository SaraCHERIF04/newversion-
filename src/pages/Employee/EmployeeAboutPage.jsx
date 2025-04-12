
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const EmployeeAboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/employee/dashboard')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-[#192759]">À propos de Sonelgaz</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <img 
              src="/public/lovable-uploads/58530a94-5d90-46f6-a581-d78a21f82b7a.png" 
              alt="Sonelgaz Logo" 
              className="w-full h-auto mb-4"
            />
            <p className="text-gray-700 leading-relaxed">
              Sonelgaz est une entreprise publique algérienne fondée en 1969. Elle est chargée de la production, du transport et de la distribution d'électricité et de gaz naturel en Algérie. Elle assure l'approvisionnement énergétique sur l'ensemble du territoire national.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
              alt="Siège Sonelgaz" 
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="text-gray-700 leading-relaxed">
              Avec plus de 50 ans d'expérience, Sonelgaz joue un rôle essentiel dans le développement économique et social de l'Algérie. L'entreprise s'engage à fournir une énergie fiable et durable pour tous les Algériens.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6 text-[#192759]">Notre mission</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
              alt="Innovation" 
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-medium mb-2 text-[#192759]">Innovation</h3>
            <p className="text-gray-600">Investir dans les technologies modernes pour améliorer nos services et réduire notre impact environnemental.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
              alt="Service" 
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-medium mb-2 text-[#192759]">Service</h3>
            <p className="text-gray-600">Fournir un service de qualité supérieure pour satisfaire les besoins de tous nos clients dans toutes les régions d'Algérie.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1472396961693-142e6e269027" 
              alt="Durabilité" 
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-medium mb-2 text-[#192759]">Durabilité</h3>
            <p className="text-gray-600">S'engager dans des pratiques durables pour protéger l'environnement et assurer un avenir énergétique propre pour l'Algérie.</p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6 text-[#192759]">Notre équipe</h2>
        <div className="mb-12">
          <img 
            src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
            alt="Notre équipe" 
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <p className="text-gray-700 leading-relaxed mb-4">
            Chez Sonelgaz, notre force réside dans notre équipe diversifiée et hautement qualifiée. Nos ingénieurs, techniciens et personnel administratif travaillent ensemble pour fournir des services énergétiques de qualité à tous les Algériens.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Nous investissons continuellement dans la formation et le développement de nos employés pour maintenir les plus hauts standards de qualité et d'innovation dans notre secteur.
          </p>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6 text-[#192759]">Contactez-nous</h2>
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#192759]">Informations de contact</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Adresse:</span> 
                  <span>2 Boulevard Krim Belkacem, Alger 16000, Algérie</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Téléphone:</span> 
                  <span>+213 21 XX XX XX</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Email:</span> 
                  <span>contact@sonelgaz.dz</span>
                </li>
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Heures d'ouverture:</span> 
                  <span>Dimanche - Jeudi: 8h00 - 16h30</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1496307653780-42ee777d4833" 
                alt="Notre bâtiment" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAboutPage;
