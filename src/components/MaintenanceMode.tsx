import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { remoteConfigService } from '@/services/remoteConfigService';

interface MaintenanceModeProps {
  onRetry: () => void;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ onRetry }) => {
  // Get custom message from remote config if available
  const message = remoteConfigService.getString(
    'maintenance_message', 
    'Notre application est actuellement en maintenance. Nous travaillons à la rendre meilleure et serons de retour bientôt.'
  );
  
  // Get estimated completion time from remote config if available
  const estimatedCompletionTime = remoteConfigService.getString(
    'maintenance_estimated_completion',
    'Merci de réessayer dans quelques minutes.'
  );
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-100 p-3 rounded-full">
            <AlertTriangle className="h-12 w-12 text-yellow-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Maintenance en cours</h1>
        
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        <p className="text-sm text-gray-500 mb-8">
          {estimatedCompletionTime}
        </p>
        
        <Button 
          onClick={onRetry}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          Réessayer
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceMode; 