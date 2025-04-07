
import React from 'react';
import { Camera, Check, RefreshCw, Search, Settings } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DiscoveredCamera } from '@/services/CameraDiscoveryService';

interface CameraDiscoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discoveredCameras: DiscoveredCamera[];
  isDiscovering: boolean;
  onDiscoverCameras: () => void;
  onConfigureCamera: (camera: DiscoveredCamera) => void;
}

const CameraDiscoveryDialog: React.FC<CameraDiscoveryDialogProps> = ({
  open,
  onOpenChange,
  discoveredCameras,
  isDiscovering,
  onDiscoverCameras,
  onConfigureCamera,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] dark:border-gray-700 dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Discover CCTV Cameras</DialogTitle>
          <DialogDescription>
            Automatically scan the network for compatible cameras
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {isDiscovering ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
              <p className="text-center text-gray-600 dark:text-gray-400">
                Scanning network for ONVIF-compatible cameras...
              </p>
            </div>
          ) : discoveredCameras.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {discoveredCameras.length} camera{discoveredCameras.length !== 1 ? 's' : ''} discovered on your network:
              </p>
              <div className="max-h-[300px] overflow-y-auto space-y-3">
                {discoveredCameras.map(camera => (
                  <div key={camera.id} className="flex justify-between items-center border dark:border-gray-700 rounded-md p-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                        <Camera className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                      </div>
                      <div>
                        <h4 className="font-medium dark:text-white">{camera.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{camera.ip}:{camera.port}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{camera.manufacturer} {camera.model}</p>
                      </div>
                    </div>
                    <div>
                      {camera.isConfigured ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Configured
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => onConfigureCamera(camera)}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <RefreshCw className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
              <h4 className="text-lg font-medium dark:text-white">No cameras discovered yet</h4>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Click the scan button to search for CCTV cameras on your network
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              onClick={onDiscoverCameras}
              disabled={isDiscovering}
            >
              {isDiscovering ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scan for Cameras
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraDiscoveryDialog;
