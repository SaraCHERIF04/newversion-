
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ResponsableAboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/responsable/dashboard')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour</span>
        </Button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[300px] mb-12 rounded-lg overflow-hidden">
          <img 
            src="/public/lovable-uploads/810f1821-f09f-42b9-9bb6-e751fb529264.png" 
            alt="About Us Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center">
            <h1 className="text-4xl font-bold text-white mb-2">About us</h1>
            <p className="text-white text-xl">SONELGAZ Projects</p>
          </div>
        </div>
        
        {/* Company Introduction */}
        <div className="bg-gray-100 p-6 rounded-lg mb-10">
          <p className="text-gray-800 leading-relaxed">
            Sonelgaz, créée en 1969, est le principal fournisseur d'électricité et de gaz en Algérie. 
            Suite à la loi sur l'électricité et le gaz, elle est passée d'une entreprise intégrée à une 
            holding gérant plusieurs filiales. Sonelgaz joue un rôle clé dans le développement 
            économique du pays, avec un taux de couverture électrique de 99% et une pénétration 
            du gaz de 65%. Aujourd'hui, le groupe comprend 11 filiales et 10 sociétés en 
            partenariat.Et parmi ces sociétés on a la société Sonelgaz-Production de l'Electricité 
            (S-PE)
          </p>
        </div>
        
        {/* Building Images */}
        <div className="mb-10">
          <div className="w-full mb-4">
            <img 
              src="/public/lovable-uploads/ceebaf66-2341-4fef-bfa5-643ea1c543c2.png" 
              alt="Sonelgaz Building" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
        
        {/* Details Sections with Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-800 leading-relaxed">
              La société Sonelgaz-Production de l'Electricité (S-PE) est un acteur principal et historique sur la scène 
              nationale de la production de l'électricité, elle dispose du plus grand parc de production de plus de 
              18 GW de puissance développable à ces jours, ce qui lui confère une position du premier opérateur sur le 
              réseau interconnecté.
            </p>
          </div>
          
          <div className="flex justify-center items-center">
            <img 
              src="/public/lovable-uploads/e96fac7f-c584-4a85-8aee-db1aa6dccf38.png" 
              alt="Electricity Production" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="flex justify-center items-center md:order-3">
            <img 
              src="/public/lovable-uploads/c1a47f83-4ed6-4310-afa6-dab450e56eb0.png" 
              alt="Renewable Energy" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg md:order-4">
            <p className="text-gray-800 leading-relaxed">
              La S-PE est présente sur tout le territoire national avec ses Directions Régions de 
              Production et leurs unités rattachées, afin de faire face à une demande sans cesse 
              croissante de l'énergie électrique en utilisant et en valorisant au mieux ses 
              ressources primaires tout en préservant l'environnement en produisant une énergie 
              respectueuse de l'environnement et à moindre coût.
            </p>
          </div>
        </div>
        
        {/* Mission and Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-[#192759]">Notre Mission</h2>
            <p className="text-gray-800 leading-relaxed mb-4">
              La S-PE est une société par actions au Capital Social de 35 milliards de Dinar, dont le siège 
              social est sis à la route nationale n°38 immeuble des 600 bureaux - Gué de Constantine - Alger.
            </p>
            <p className="text-gray-800 font-medium mb-2">Les principales missions de S-PE consistent en :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>La production d'électricité répondant aux exigences de disponibilité, fiabilité, sécurité et protection de l'environnement;</li>
              <li>La commercialisation de l'électricité produite;</li>
              <li>Le développement de la ressource humaine;</li>
              <li>Le développement des moyens de production.</li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e" 
              alt="Wind turbines" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1509391366360-2e959784a276" 
              alt="Solar panels" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1470723710355-95304d8aece4" 
              alt="Power plant" 
              className="w-full h-48 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9" 
              alt="Electricity grid" 
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        </div>
        
        {/* Testimonial / Appreciation */}
        <div className="bg-[#192759] text-white p-8 rounded-lg mb-10">
          <h2 className="text-xl font-bold mb-4 text-center">Last word for you!</h2>
          <p className="text-center leading-relaxed">
            We feel so fortunate to have someone with your skills and dedication at Sonelgaz! Your hard work and commitment 
            make you an essential part of our success, and your presence truly makes a difference. We deeply appreciate 
            all of your contributions. Thank you!
          </p>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-[#192759]">Contactez-nous</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-[#192759]">Informations de contact</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center">
                  <span className="font-semibold mr-2">Adresse:</span> 
                  <span>Route nationale n°38 immeuble des 600 bureaux - Gué de Constantine - Alger</span>
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
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" 
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

export default ResponsableAboutPage;
