
import React, { useState, useEffect } from 'react';
import { RotateCw, Search, Plus, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { DiscoveredCamera, cameraDiscoveryService } from '@/services/CameraDiscoveryService';
import { FacialSearchQuery, FacialSearchResult, facialRecognitionService } from '@/services/FacialRecognitionService';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import CCTVAdminControls from '@/components/cctv/CCTVAdminControls';
import CameraList from '@/components/cctv/CameraList';
import CameraDisplay from '@/components/cctv/CameraDisplay';
import AISearchResults from '@/components/cctv/AISearchResults';
import DetectionEvents from '@/components/cctv/DetectionEvents';
import RecordingsArchive from '@/components/cctv/RecordingsArchive';
import CCTVSettings from '@/components/cctv/CCTVSettings';
import CameraDiscoveryDialog from '@/components/cctv/CameraDiscoveryDialog';
import AISearchDialog from '@/components/cctv/AISearchDialog';
import { cameraLocations } from './CCTVData';

// Mock data for detection events
const detectionEvents = [
  { id: 1, camera: 'Main Entrance', time: '08:15 AM', description: 'Multiple students detected entering', severity: 'info' as const },
  { id: 2, camera: 'Class 10A', time: '09:30 AM', description: 'Attendance captured', severity: 'success' as const },
  { id: 3, camera: 'Playground', time: '10:45 AM', description: 'Motion detected during class hours', severity: 'warning' as const },
  { id: 4, camera: 'Admin Block', time: '11:20 AM', description: 'Staff movement', severity: 'info' as const },
  { id: 5, camera: 'Cafeteria', time: '12:30 PM', description: 'Student gathering during lunch', severity: 'info' as const },
];

const CCTVMonitoring: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
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
  const isAdmin = user?.role === 'admin';
  
  const { toast } = useToast();

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
    <div className={`space-y-6 animate-fade-in dark-mode-transition ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800">CCTV Monitoring</h1>
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
          {isAdmin && (
            <Button 
              variant="outline" 
              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
              onClick={() => setCurrentTab('admin')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin Mode
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="live" className="space-y-4" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList>
          <TabsTrigger value="live">Live View</TabsTrigger>
          <TabsTrigger value="recordings">Recordings</TabsTrigger>
          <TabsTrigger value="events">Detection Events</TabsTrigger>
          <TabsTrigger value="ai-search">AI Search Results</TabsTrigger>
          <TabsTrigger value="settings">CCTV Settings</TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin" className="bg-amber-50 text-amber-800 data-[state=active]:bg-amber-700 data-[state=active]:text-white dark:bg-amber-900/20 dark:text-amber-400 dark:data-[state=active]:bg-amber-700 dark:data-[state=active]:text-white">
              <Shield className="h-4 w-4 mr-2" />
              Admin Controls
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="live" className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/4 space-y-4">
              <CameraList 
                cameras={cameraLocations}
                selectedCamera={selectedCamera}
                onSelectCamera={handleCameraSelect}
                searchQuery={searchQuery}
                autoAttendanceEnabled={autoAttendanceEnabled}
                onToggleAutoAttendance={handleToggleAutoAttendance}
              />
            </div>
            <div className="w-3/4">
              <CameraDisplay 
                cameras={cameraLocations}
                selectedCamera={selectedCamera}
                viewMode={viewMode}
                setViewMode={setViewMode}
                playing={playing}
                setPlaying={setPlaying}
                refreshKey={refreshKey}
                zoomLevel={zoomLevel}
                setZoomLevel={setZoomLevel}
                onCaptureSnapshot={handleCaptureSnapshot}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="recordings">
          <RecordingsArchive />
        </TabsContent>
        
        <TabsContent value="events">
          <DetectionEvents events={detectionEvents} />
        </TabsContent>
        
        <TabsContent value="ai-search">
          <AISearchResults 
            faceSearchResults={faceSearchResults}
            onNewSearch={() => setShowAISearchDialog(true)}
          />
        </TabsContent>
        
        <TabsContent value="settings">
          <CCTVSettings 
            autoAttendanceEnabled={autoAttendanceEnabled}
            onToggleAutoAttendance={setAutoAttendanceEnabled}
          />
        </TabsContent>
        
        <TabsContent value="admin">
          <CCTVAdminControls isAdmin={isAdmin} />
        </TabsContent>
      </Tabs>
      
      {/* Camera Discovery Dialog */}
      <CameraDiscoveryDialog 
        open={showDiscoveryDialog}
        onOpenChange={setShowDiscoveryDialog}
        discoveredCameras={discoveredCameras}
        isDiscovering={isDiscovering}
        onDiscoverCameras={handleDiscoverCameras}
        onConfigureCamera={handleConfigureCamera}
      />
      
      {/* AI Search Dialog */}
      <AISearchDialog 
        open={showAISearchDialog}
        onOpenChange={setShowAISearchDialog}
        searchPerson={searchPerson}
        setSearchPerson={setSearchPerson}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        isSearching={isSearching}
        onSearch={handleFaceSearch}
      />
    </div>
  );
};

export default CCTVMonitoring;
