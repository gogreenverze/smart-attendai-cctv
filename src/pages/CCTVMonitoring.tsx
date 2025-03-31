
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Camera, Maximize2, Play, Pause, Download, Search, RotateCw, Calendar, Clock, AlertTriangle } from 'lucide-react';

// Mock data for camera feeds
const cameraLocations = [
  { id: 1, name: 'Main Entrance', online: true, hasMotion: false },
  { id: 2, name: 'Class 10A', online: true, hasMotion: true },
  { id: 3, name: 'Class 9B', online: true, hasMotion: false },
  { id: 4, name: 'Computer Lab', online: true, hasMotion: false },
  { id: 5, name: 'Playground', online: true, hasMotion: true },
  { id: 6, name: 'Cafeteria', online: true, hasMotion: true },
  { id: 7, name: 'Admin Block', online: true, hasMotion: false },
  { id: 8, name: 'Library', online: false, hasMotion: false },
  { id: 9, name: 'Science Lab', online: true, hasMotion: false },
  { id: 10, name: 'Parking Area', online: true, hasMotion: false },
  { id: 11, name: 'Sports Field', online: true, hasMotion: true },
  { id: 12, name: 'Auditorium', online: false, hasMotion: false },
];

// Mock data for detection events
const detectionEvents = [
  { id: 1, camera: 'Main Entrance', time: '08:15 AM', description: 'Multiple students detected entering', severity: 'info' },
  { id: 2, camera: 'Class 10A', time: '09:30 AM', description: 'Attendance captured', severity: 'success' },
  { id: 3, camera: 'Playground', time: '10:45 AM', description: 'Motion detected during class hours', severity: 'warning' },
  { id: 4, camera: 'Admin Block', time: '11:20 AM', description: 'Staff movement', severity: 'info' },
  { id: 5, camera: 'Cafeteria', time: '12:30 PM', description: 'Student gathering during lunch', severity: 'info' },
];

// Function to generate a "static" looking image to simulate CCTV feed
const generateCCTVPlaceholder = (id: number) => {
  const seed = id * 100;
  const date = new Date();
  const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return `https://picsum.photos/seed/${seed}/350/200?grayscale`;
};

const CCTVMonitoring: React.FC = () => {
  const [selectedCamera, setSelectedCamera] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState('grid');
  const [playing, setPlaying] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();

  // Filter cameras based on search query
  const filteredCameras = cameraLocations.filter(camera => 
    camera.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Refresh camera feeds every 5 seconds
  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setRefreshKey(prev => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [playing]);

  const handleCameraSelect = (id: number) => {
    setSelectedCamera(id);
    toast({
      title: "Camera Selected",
      description: `Now viewing ${cameraLocations.find(c => c.id === id)?.name}`
    });
  };

  const handleCaptureSnapshot = () => {
    toast({
      title: "Snapshot Captured",
      description: "Image saved to library"
    });
  };

  const handleAISearch = () => {
    toast({
      title: "AI Search Initiated",
      description: "This would integrate with facial recognition"
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">CCTV Monitoring</h1>
        <div className="flex space-x-2">
          <div className="relative w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search cameras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setRefreshKey(prev => prev + 1)}>
            <RotateCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button className="btn-primary" onClick={handleAISearch}>
            <Search className="h-4 w-4 mr-2" />
            AI Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">Live View</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="events">Detection Events</TabsTrigger>
        </TabsList>
        <TabsContent value="live" className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/4 space-y-4">
              <Card>
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
                          selectedCamera === camera.id ? 'bg-school-primary text-white' : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        onClick={() => handleCameraSelect(camera.id)}
                      >
                        <div className="flex items-center">
                          <Camera className={`h-4 w-4 ${selectedCamera === camera.id ? 'text-white' : 'text-gray-700'} mr-2`} />
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
              </Card>
            </div>
            <div className="w-3/4">
              <Card>
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
                      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredCameras.filter(c => c.online).slice(0, 9).map(camera => (
                        <div 
                          key={camera.id} 
                          className="relative rounded-md overflow-hidden border cursor-pointer"
                          onClick={() => handleCameraSelect(camera.id)}
                        >
                          <img 
                            src={generateCCTVPlaceholder(camera.id + refreshKey)} 
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
                        <div className="relative rounded-md overflow-hidden border">
                          <img 
                            src={generateCCTVPlaceholder(selectedCamera + refreshKey)} 
                            alt="Selected Camera" 
                            className="w-full h-auto"
                            style={{ transform: `scale(${zoomLevel[0]/100})` }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 flex justify-between">
                            <span>{cameraLocations.find(c => c.id === selectedCamera)?.name}</span>
                            <span>{new Date().toLocaleTimeString()}</span>
                          </div>
                          <div className="absolute top-2 right-2 flex items-center space-x-2">
                            <Button variant="outline" size="icon" className="bg-black/50 text-white border-0 hover:bg-black/70">
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" className="bg-black/50 text-white border-0 hover:bg-black/70" onClick={handleCaptureSnapshot}>
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center border rounded-md bg-gray-50">
                          <p className="text-gray-500">Select a camera to view</p>
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Zoom Level: {zoomLevel[0]}%</span>
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
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Live as of {new Date().toLocaleTimeString()}
                  </div>
                  <Button variant="outline" onClick={handleCaptureSnapshot}>
                    <Camera className="h-4 w-4 mr-2" />
                    Capture Snapshot
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="recordings">
          <Card>
            <CardHeader>
              <CardTitle>Recordings Archive</CardTitle>
              <CardDescription>Access past footage and recordings</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-96">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Calendar className="h-8 w-8 text-gray-400" />
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-700">Recording Archive</h3>
                <p className="text-gray-500 max-w-md">
                  This section would allow searching and viewing of recorded CCTV footage by date, time, and camera location.
                </p>
                <Button className="btn-primary">
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample Recording
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Detection Events</CardTitle>
              <CardDescription>AI-detected events from camera feeds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detectionEvents.map(event => (
                  <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-md">
                    <div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.severity === 'warning' ? 'bg-amber-100' :
                        event.severity === 'success' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {event.severity === 'warning' ? (
                          <AlertTriangle className={`h-4 w-4 text-amber-500`} />
                        ) : event.severity === 'success' ? (
                          <Camera className={`h-4 w-4 text-green-500`} />
                        ) : (
                          <Camera className={`h-4 w-4 text-blue-500`} />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{event.camera}</h4>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CCTVMonitoring;
