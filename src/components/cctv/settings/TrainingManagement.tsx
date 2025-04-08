
import React from 'react';
import { RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TrainingManagement: React.FC = () => {
  return (
    <div className="pt-4 border-t dark:border-gray-700">
      <h3 className="text-lg font-medium mb-4 dark:text-white">Training & Management</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <Button className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Upload Training Images
        </Button>
        <Button variant="outline" className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retrain AI Model
        </Button>
      </div>
    </div>
  );
};

export default TrainingManagement;
