
import React from 'react';
import { Camera, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface CameraListProps {
  cameras: {
    id: number;
    name: string;
    online: boolean;
    hasMotion: boolean;
  }[];
  selectedCamera: number | null;
  onSelectCamera: (id: number) => void;
  searchQuery: string;
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: () => void;
}

const CameraList: React.FC<CameraListProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  searchQuery,
  autoAttendanceEnabled,
  onToggleAutoAttendance,
}) => {
  // Filter cameras based on search query
  const filteredCameras = cameras.filter(camera => 
    camera.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Camera List</CardTitle>
        <CardDescription>Select a camera to view</CardDescription>
      </CardHeader>
      <CardContent className="h-[calc(100vh-300px)] overflow-auto">
        <div className="space-y-2">
          {filteredCameras.map(camera => (
            <div 
              key={camera.id} 
              className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                selectedCamera === camera.id 
                  ? 'bg-school-primary text-white dark:bg-gray-700' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
              }`}
              onClick={() => onSelectCamera(camera.id)}
            >
              <div className="flex items-center">
                <Camera className={`h-4 w-4 ${selectedCamera === camera.id ? 'text-white' : 'text-gray-700 dark:text-gray-300'} mr-2`} />
                <span>{camera.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {camera.hasMotion && (
                  <div className="animate-pulse-slow">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  </div>
                )}
                <Badge variant={camera.online ? "outline" : "destructive"} className="text-xs">
                  {camera.online ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="py-2 flex justify-between border-t dark:border-gray-700">
        <Button 
          variant="outline" 
          size="sm" 
          className={`${autoAttendanceEnabled ? 'bg-green-100 dark:bg-green-900/30' : ''}`}
          onClick={onToggleAutoAttendance}
        >
          {autoAttendanceEnabled ? (
            <>
              <Check className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Auto Attendance On
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Enable Auto Attendance
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CameraList;
