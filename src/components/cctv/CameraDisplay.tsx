
import React from 'react';
import { Camera, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Clock } from 'lucide-react';

// Function to generate a "static" looking image to simulate CCTV feed
const generateCCTVPlaceholder = (id: number, refreshKey: number) => {
  const seed = id * 100;
  const date = new Date();
  const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `https://picsum.photos/seed/${seed}/350/200?grayscale`;
};

interface CameraDisplayProps {
  cameras: {
    id: number;
    name: string;
    online: boolean;
    hasMotion: boolean;
  }[];
  selectedCamera: number | null;
  viewMode: string;
  setViewMode: (mode: string) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  refreshKey: number;
  zoomLevel: number[];
  setZoomLevel: (level: number[]) => void;
  onCaptureSnapshot: () => void;
}

const CameraDisplay: React.FC<CameraDisplayProps> = ({
  cameras,
  selectedCamera,
  viewMode,
  setViewMode,
  playing,
  setPlaying,
  refreshKey,
  zoomLevel,
  setZoomLevel,
  onCaptureSnapshot,
}) => {
  const selectedCameraName = selectedCamera ? cameras.find(c => c.id === selectedCamera)?.name : '';

  return (
    <Card className="dark:border-gray-700">
      <CardHeader className="pb-2 flex-row justify-between items-center">
        <div>
          <CardTitle className="text-lg">Camera Feeds</CardTitle>
          <CardDescription>Live monitoring</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="View Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid">Grid View</SelectItem>
              <SelectItem value="single">Single View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setPlaying(!playing)}>
            {playing ? 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg> : 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            }
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {cameras.filter(c => c.online).slice(0, 9).map(camera => (
              <div 
                key={camera.id} 
                className="relative rounded-md overflow-hidden border dark:border-gray-700 cursor-pointer"
                onClick={() => selectedCamera !== camera.id && setViewMode('single')}
              >
                <img 
                  src={generateCCTVPlaceholder(camera.id + refreshKey, refreshKey)} 
                  alt={camera.name} 
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 flex justify-between">
                  <span>{camera.name}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                {camera.hasMotion && (
                  <div className="absolute top-2 right-2 flex items-center">
                    <Badge className="bg-red-500 text-white text-xs">Motion</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {selectedCamera ? (
              <div className="relative rounded-md overflow-hidden border dark:border-gray-700">
                <img 
                  src={generateCCTVPlaceholder(selectedCamera + refreshKey, refreshKey)} 
                  alt="Selected Camera" 
                  className="w-full h-auto"
                  style={{ transform: `scale(${zoomLevel[0]/100})` }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 flex justify-between">
                  <span>{selectedCameraName}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="absolute top-2 right-2 flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="bg-black/50 text-white border-0 hover:bg-black/70">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-black/50 text-white border-0 hover:bg-black/70" onClick={onCaptureSnapshot}>
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">Select a camera to view</p>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Zoom Level: {zoomLevel[0]}%</span>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setZoomLevel([100])}>Reset</Button>
                </div>
              </div>
              <Slider
                value={zoomLevel}
                min={100}
                max={200}
                step={10}
                onValueChange={setZoomLevel}
              />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between dark:border-gray-700">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" /> Live as of {new Date().toLocaleTimeString()}
        </div>
        <Button variant="outline" onClick={onCaptureSnapshot}>
          <Camera className="h-4 w-4 mr-2" />
          Capture Snapshot
        </Button>
      </CardFooter>
    </Card>
  );
};

// Badge component for the camera status indicator
const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};

export default CameraDisplay;
