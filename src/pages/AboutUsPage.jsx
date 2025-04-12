
import React from 'react';
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
    <div className="bg-gray-200 min-h-screen">
      {/* Header avec image de fond et poignée de main */}
      <div className="relative h-[320px] bg-cover bg-center" 
        style={{ backgroundImage: "url('/lovable-uploads/02dacca4-f631-4e64-9101-ca7dd56b2880.png')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-white mb-2">About us</h1>
          <p className="text-white opacity-80">SONELGAZ GROUP SPE</p>
        </div>
        <button 
          onClick={handleBack} 
          className="absolute top-4 right-4 bg-transparent text-white flex items-center"
        >
          Return back <ArrowLeft className="h-4 w-4 ml-2 transform rotate-180" />
        </button>
      </div>

      {/* Contenu de la page */}
      <div className="max-w-6xl mx-auto py-6 px-4">
        {/* Introduction */}
        <div className="bg-gray-200 p-6 rounded-lg mb-8">
          <p className="text-base md:text-lg text-center text-gray-800 leading-relaxed">
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
        <div className="mb-8">
          <div>
            <img 
              src="/lovable-uploads/549dd4d1-f727-4cfd-a66e-915e0c142ed6.png" 
              alt="Siège Sonelgaz" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div>
            <img 
              src="/lovable-uploads/549dd4d1-f727-4cfd-a66e-915e0c142ed6.png" 
              alt="Bâtiment Sonelgaz 1" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div>
            <img 
              src="/lovable-uploads/801ed7d1-6edc-46a5-b785-e4ba325df412.png" 
              alt="Bâtiment Sonelgaz 2" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div>
            <img 
              src="/lovable-uploads/5f5547c8-a301-4332-a529-bcd9ae747703.png" 
              alt="Bâtiment Sonelgaz 3" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Description S-PE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col justify-center">
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
              src="/lovable-uploads/6d499fde-a3e3-44bb-8048-d1bd6dc87be9.png" 
              alt="Production électricité" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <img 
              src="/lovable-uploads/6d499fde-a3e3-44bb-8048-d1bd6dc87be9.png" 
              alt="Centrale électrique" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div className="bg-gray-100 p-6 rounded-lg flex flex-col justify-center">
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
        <div className="mb-8">
          <div>
            <img 
              src="/lovable-uploads/6d499fde-a3e3-44bb-8048-d1bd6dc87be9.png" 
              alt="Énergie renouvelable" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>

        {/* Missions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-base md:text-lg text-gray-800 leading-relaxed text-center">
              La S-PE est une société par actions au Capital Social de 35 milliards de Dinar, dont le siège 
              social est sis à la route nationale n°38 immeuble des 600 bureaux – Gué de 
              Constantine – Alger.
              <br /><br />
              Les principales missions de S-PE consistent en :
              <ul className="list-disc pl-6 mt-3 space-y-2 text-left">
                <li>La production d'électricité répondant aux exigences de disponibilité, fiabilité, sécurité 
                  et protection de l'environnement ;</li>
                <li>La commercialisation de l'électricité produite ;</li>
                <li>Le développement de la ressource humaine ;</li>
                <li>Le développement des moyens de production.</li>
              </ul>
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <img 
                src="/lovable-uploads/6d499fde-a3e3-44bb-8048-d1bd6dc87be9.png" 
                alt="Technicien Sonelgaz" 
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div>
              <img 
                src="/lovable-uploads/6d499fde-a3e3-44bb-8048-d1bd6dc87be9.png" 
                alt="Centrale électrique nuit" 
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Message de remerciement */}
        <div className="bg-gray-100 p-8 rounded-lg text-center">
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
