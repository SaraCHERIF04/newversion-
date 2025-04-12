
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUsPage = ({ userRole = 'employee' }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    switch (userRole) {
      case 'admin':
        navigate('/admin');
        break;
      case 'responsable':
        navigate('/responsable');
        break;
      default:
        navigate('/employee');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header avec image de fond */}
      <div className="relative h-[300px] bg-cover bg-center flex items-center justify-center" 
        style={{ backgroundImage: "url('/lovable-uploads/a9d64634-6787-4936-9b67-0f45093b85a4.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">À propos de nous</h1>
          <p className="text-white">SONELGAZ GROUP SPE</p>
        </div>
        <Button 
          onClick={handleBack} 
          variant="outline" 
          size="sm" 
          className="absolute top-4 left-4 bg-white hover:bg-gray-100 text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      {/* Contenu de la page */}
      <div className="max-w-6xl mx-auto py-12 px-4">
        {/* Introduction */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            Sonelgaz, créée en 1969, est le principal fournisseur d'électricité et de gaz en Algérie.
            Suite à la loi sur l'électricité et le gaz, elle est passée d'une entreprise intégrée à une
            holding gérant plusieurs filiales. Sonelgaz joue un rôle clé dans le développement
            économique du pays, avec un taux de couverture électrique de 99% et une pénétration
            du gaz de 65%. Aujourd'hui, le groupe comprend 11 filiales et 10 sociétés en
            partenariat parmi ces sociétés on a la société Sonelgaz-Production de l'Électricité
            (S-PE)
          </p>
        </div>

        {/* Siège social */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-10">
          <div>
            <img 
              src="/lovable-uploads/4d60c7f9-2d10-45dc-9f1c-a896a5790d9e.png" 
              alt="Siège Sonelgaz" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div>
            <img 
              src="/lovable-uploads/987df8d2-4f5c-41f8-ae7b-896457b502da.png" 
              alt="Bâtiment Sonelgaz 1" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <img 
              src="/lovable-uploads/f9797427-3857-44b4-ac51-2ba21026b9ba.png" 
              alt="Bâtiment Sonelgaz 2" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <img 
              src="/lovable-uploads/29c0ed59-08cd-474c-a3c5-4a3662a4432f.png" 
              alt="Bâtiment Sonelgaz 3" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Description S-PE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed text-center">
              La société Sonelgaz-Production de l'Électricité (S-PE) est un acteur 
              principal et historique sur la scène nationale de la production de 
              l'électricité, elle dispose du plus grand parc de production de plus de 
              18 GW de puissance développable à ces jours, ce qui lui confère une 
              position du premier opérateur sur le réseau interconnecté.
            </p>
          </div>
          <div>
            <img 
              src="/lovable-uploads/ddd3c963-a7ed-4ab4-8283-eed4766ac5c9.png" 
              alt="Production électricité" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <img 
              src="/lovable-uploads/6480fa79-940e-4f74-b7ee-215566d792f0.png" 
              alt="Centrale électrique" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed text-center">
              La S-PE est présente sur tout le territoire national avec ses 
              Directions Régions de Production et leurs unités rattachées, afin de faire face à 
              une demande sans cesse croissante de l'énergie électrique en utilisant et en 
              valorisant au mieux ses ressources primaires tout en préservant l'environnement en 
              produisant une énergie respectueuse de l'environnement et à moindre coût.
            </p>
          </div>
        </div>

        {/* Énergie renouvelable */}
        <div className="mb-10">
          <div className="relative">
            <img 
              src="/lovable-uploads/ee1168e6-a80c-4e11-93e4-c62ee0667237.png" 
              alt="Énergie renouvelable" 
              className="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        {/* Missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed">
              La S-PE est une société par actions au Capital Social de 35 milliards de Dinar, dont le siège 
              social est sis à la route nationale n°38 immeuble des 600 bureaux – Gué de 
              Constantine – Alger.
              <br /><br />
              Les principales missions de S-PE consistent en :
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>La production d'électricité répondant aux exigences de disponibilité, fiabilité, sécurité 
                  et protection de l'environnement ;</li>
                <li>La commercialisation de l'électricité produite ;</li>
                <li>Le développement de la ressource humaine ;</li>
                <li>Le développement des moyens de production.</li>
              </ul>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <img 
                src="/lovable-uploads/89da70f9-aba3-41bf-8ede-f678a306f557.png" 
                alt="Technicien Sonelgaz" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <div>
              <img 
                src="/lovable-uploads/83d1e85d-0a44-481a-8ee0-c20c741d7087.png" 
                alt="Centrale électrique nuit" 
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Last word for you!</h2>
          <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
            We feel so fortunate to have someone with your skills and 
            dedication at Sonelgaz! Your hard work and commitment 
            make you an essential part of our success, and your 
            presence truly makes a difference. We deeply appreciate 
            all of your contributions. Thank you!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
