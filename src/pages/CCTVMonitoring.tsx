
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Camera, Maximize2, Play, Pause, Download, Search, RotateCw, Calendar, Clock, AlertTriangle, Plus, Settings, RefreshCw, Check, X, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DiscoveredCamera, cameraDiscoveryService } from '@/services/CameraDiscoveryService';
import { FacialSearchQuery, FacialSearchResult, facialRecognitionService } from '@/services/FacialRecognitionService';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cameraLocations } from './CCTVData';

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
  const [showDiscoveryDialog, setShowDiscoveryDialog] = useState(false);
  const [discoveredCameras, setDiscoveredCameras] = useState<DiscoveredCamera[]>([]);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [currentTab, setCurrentTab] = useState('live');
  const [faceSearchResults, setFaceSearchResults] = useState<FacialSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchDate, setSearchDate] = useState<Date | undefined>(new Date());
  const [searchPerson, setSearchPerson] = useState('');
  const [showAISearchDialog, setShowAISearchDialog] = useState(false);
  const [autoAttendanceEnabled, setAutoAttendanceEnabled] = useState(false);
  
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
    setShowAISearchDialog(true);
  };

  const handleDiscoverCameras = async () => {
    setIsDiscovering(true);
    try {
      const cameras = await cameraDiscoveryService.discoverCameras();
      setDiscoveredCameras(cameras);
      toast({
        title: "Camera Discovery Completed",
        description: `Found ${cameras.length} cameras on the network`
      });
    } catch (error) {
      toast({
        title: "Discovery Failed",
        description: "Unable to discover cameras on the network",
        variant: "destructive"
      });
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleConfigureCamera = async (camera: DiscoveredCamera) => {
    try {
      const success = await cameraDiscoveryService.configureCamera(camera);
      if (success) {
        toast({
          title: "Camera Configured",
          description: `${camera.name} was successfully configured and added`
        });
        
        // Update the camera in the discovered list
        setDiscoveredCameras(prev => 
          prev.map(c => c.id === camera.id ? {...c, isConfigured: true} : c)
        );
      } else {
        toast({
          title: "Configuration Failed",
          description: "Unable to configure the camera",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: "An error occurred while configuring the camera",
        variant: "destructive"
      });
    }
  };

  const handleFaceSearch = async () => {
    setIsSearching(true);
    try {
      const query: FacialSearchQuery = {
        personName: searchPerson || undefined,
        startDate: searchDate,
        endDate: searchDate ? new Date(searchDate.getTime() + 24*60*60*1000) : undefined,
        limit: 20
      };
      
      const results = await facialRecognitionService.searchByFace(query);
      setFaceSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: "No facial matches found for your search criteria",
        });
      } else {
        toast({
          title: "Search Complete",
          description: `Found ${results.length} potential matches`,
        });
      }
      
      setShowAISearchDialog(false);
      setCurrentTab('ai-search');
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to complete facial recognition search",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleAutoAttendance = () => {
    setAutoAttendanceEnabled(prev => !prev);
    toast({
      title: autoAttendanceEnabled ? "Auto-Attendance Disabled" : "Auto-Attendance Enabled",
      description: autoAttendanceEnabled 
        ? "Automatic attendance marking has been turned off" 
        : "System will now automatically mark attendance using facial recognition"
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
          <Button 
            variant="outline" 
            onClick={() => setShowDiscoveryDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Cameras
          </Button>
          <Button className="btn-primary" onClick={handleAISearch}>
            <Search className="h-4 w-4 mr-2" />
            AI Search
          </Button>
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-4" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="live">Live View</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="events">Detection Events</TabsTrigger>
          <TabsTrigger value="ai-search">AI Search Results</TabsTrigger>
          <TabsTrigger value="settings">CCTV Settings</TabsTrigger>
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
                <CardFooter className="py-2 flex justify-between border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`${autoAttendanceEnabled ? 'bg-green-100' : ''}`}
                    onClick={handleToggleAutoAttendance}
                  >
                    {autoAttendanceEnabled ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Auto Attendance On
                      </>
                    ) : (
                      <>
                        <Settings className="h-4 w-4 mr-2" />
                        Enable Auto Attendance
                      </>
                    )}
                  </Button>
                </CardFooter>
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
        
        <TabsContent value="ai-search">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Facial Recognition Search Results</CardTitle>
                <CardDescription>AI-powered search results</CardDescription>
              </div>
              <Button onClick={() => setShowAISearchDialog(true)}>
                <Search className="h-4 w-4 mr-2" />
                New Search
              </Button>
            </CardHeader>
            <CardContent>
              {faceSearchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Search className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No search results yet</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    Use the AI Search feature to find people across camera footage using facial recognition
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setShowAISearchDialog(true)}
                  >
                    Start New Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {faceSearchResults.map((result, i) => (
                    <div key={i} className="border rounded-md overflow-hidden">
                      <div className="relative">
                        <img 
                          src={result.imageUrl} 
                          alt={result.personName} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{result.personName}</span>
                            <Badge variant="outline" className="text-white border-white">
                              {(result.matchConfidence * 100).toFixed(1)}% Match
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Camera:</span>
                          <span className="font-medium">{result.cameraName}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Date:</span>
                          <span className="font-medium">
                            {format(result.timestamp, 'dd MMM yyyy')}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Time:</span>
                          <span className="font-medium">
                            {format(result.timestamp, 'h:mm a')}
                          </span>
                        </div>
                      </div>
                      <div className="border-t p-3 flex justify-between">
                        <Button variant="outline" size="sm">
                          View Footage
                        </Button>
                        <Button size="sm">
                          Mark Attendance
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>CCTV System Settings</CardTitle>
              <CardDescription>Configure camera and AI settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Camera Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Auto-discovery frequency</span>
                      <Select defaultValue="manual">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual only</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Default camera resolution</span>
                      <Select defaultValue="720p">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select resolution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="480p">480p</SelectItem>
                          <SelectItem value="720p">720p (HD)</SelectItem>
                          <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                          <SelectItem value="4k">4K (Ultra HD)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Motion detection sensitivity</span>
                      <div className="w-[180px]">
                        <Slider defaultValue={[75]} max={100} step={1} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Record on motion</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Notification on motion</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">AI Recognition Settings</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Face recognition confidence threshold</span>
                      <div className="w-[180px]">
                        <Slider defaultValue={[70]} max={100} step={1} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Auto-mark attendance</span>
                      <Switch checked={autoAttendanceEnabled} onCheckedChange={handleToggleAutoAttendance} />
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Student recognition model</span>
                      <Select defaultValue="facenet">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="facenet">FaceNet</SelectItem>
                          <SelectItem value="dlib">DLib</SelectItem>
                          <SelectItem value="deepface">DeepFace</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Process frames</span>
                      <Select defaultValue="15fps">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select framerate" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5fps">5 FPS</SelectItem>
                          <SelectItem value="15fps">15 FPS</SelectItem>
                          <SelectItem value="30fps">30 FPS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span>Save recognition data</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Training & Management</h3>
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
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button>
                <Check className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Camera Discovery Dialog */}
      <Dialog open={showDiscoveryDialog} onOpenChange={setShowDiscoveryDialog}>
        <DialogContent className="sm:max-w-[600px]">
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
                <p className="text-center text-gray-600">
                  Scanning network for ONVIF-compatible cameras...
                </p>
              </div>
            ) : discoveredCameras.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  {discoveredCameras.length} camera{discoveredCameras.length !== 1 ? 's' : ''} discovered on your network:
                </p>
                <div className="max-h-[300px] overflow-y-auto space-y-3">
                  {discoveredCameras.map(camera => (
                    <div key={camera.id} className="flex justify-between items-center border rounded-md p-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <Camera className="h-6 w-6 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-medium">{camera.name}</h4>
                          <p className="text-sm text-gray-600">{camera.ip}:{camera.port}</p>
                          <p className="text-xs text-gray-500">{camera.manufacturer} {camera.model}</p>
                        </div>
                      </div>
                      <div>
                        {camera.isConfigured ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Configured
                          </Badge>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConfigureCamera(camera)}
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
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <RefreshCw className="h-8 w-8 text-gray-500" />
                </div>
                <h4 className="text-lg font-medium">No cameras discovered yet</h4>
                <p className="text-gray-600 mt-2">
                  Click the scan button to search for CCTV cameras on your network
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <div className="flex w-full justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowDiscoveryDialog(false)}
              >
                Close
              </Button>
              <Button
                onClick={handleDiscoverCameras}
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
      
      {/* AI Search Dialog */}
      <Dialog open={showAISearchDialog} onOpenChange={setShowAISearchDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>AI-Powered Facial Search</DialogTitle>
            <DialogDescription>
              Search for people across camera footage using facial recognition
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Person Name</label>
              <Input 
                placeholder="Enter name to search" 
                value={searchPerson}
                onChange={e => setSearchPerson(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {searchDate ? format(searchDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={searchDate}
                    onSelect={setSearchDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Camera Locations</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select cameras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cameras</SelectItem>
                  <SelectItem value="entrance">Entrance Cameras</SelectItem>
                  <SelectItem value="classroom">Classroom Cameras</SelectItem>
                  <SelectItem value="playground">Playground Cameras</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleFaceSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper component for Switch
const Switch = ({ checked, onCheckedChange, defaultChecked }: any) => {
  const [isChecked, setIsChecked] = useState(defaultChecked || checked || false);
  
  useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);
  
  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onCheckedChange) {
      onCheckedChange(newValue);
    }
  };
  
  return (
    <div 
      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${
        isChecked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
      onClick={handleToggle}
    >
      <div 
        className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform ${
          isChecked ? 'transform translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </div>
  );
};

export default CCTVMonitoring;
