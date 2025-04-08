
import React from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CameraSettings from './settings/CameraSettings';
import AIRecognitionSettings from './settings/AIRecognitionSettings';
import TrainingManagement from './settings/TrainingManagement';

interface CCTVSettingsProps {
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: (enabled: boolean) => void;
}

const CCTVSettings: React.FC<CCTVSettingsProps> = ({ 
  autoAttendanceEnabled, 
  onToggleAutoAttendance 
}) => {
  return (
    <Card className="dark:border-gray-700">
      <CardHeader>
        <CardTitle>CCTV System Settings</CardTitle>
        <CardDescription>Configure camera and AI settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <CameraSettings />
          <AIRecognitionSettings 
            autoAttendanceEnabled={autoAttendanceEnabled}
            onToggleAutoAttendance={onToggleAutoAttendance}
          />
        </div>
        
        <TrainingManagement />
      </CardContent>
      <CardFooter className="border-t dark:border-gray-700 pt-4 flex justify-between">
        <Button variant="outline">Reset to Default</Button>
        <Button>
          <Check className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CCTVSettings;
