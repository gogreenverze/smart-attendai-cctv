
import React, { useState } from 'react';
import { RefreshCw, Upload, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const TrainingManagement: React.FC = () => {
  const [isTraining, setIsTraining] = useState(false);
  
  const handleTrainModel = () => {
    setIsTraining(true);
    // Simulate training completion after 3 seconds
    setTimeout(() => {
      setIsTraining(false);
    }, 3000);
  };

  return (
    <div className="pt-4 border-t dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Training & Management</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Training Images
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Upload student images for facial recognition training</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleTrainModel}
                disabled={isTraining}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isTraining ? 'animate-spin' : ''}`} />
                {isTraining ? 'Training in Progress...' : 'Retrain AI Model'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Retrain the AI with the latest uploaded images</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default TrainingManagement;
