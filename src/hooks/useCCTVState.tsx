
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DiscoveredCamera, cameraDiscoveryService } from '@/services/CameraDiscoveryService';
import { FacialSearchQuery, FacialSearchResult, facialRecognitionService } from '@/services/FacialRecognitionService';
import { cameraLocations } from '@/pages/CCTVData';

export const useCCTVState = () => {
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

  return {
    selectedCamera,
    viewMode,
    playing,
    zoomLevel,
    refreshKey,
    searchQuery,
    showDiscoveryDialog,
    discoveredCameras,
    isDiscovering,
    currentTab,
    faceSearchResults,
    isSearching,
    searchDate,
    searchPerson,
    showAISearchDialog,
    autoAttendanceEnabled,
    setSelectedCamera,
    setViewMode,
    setPlaying,
    setZoomLevel,
    setRefreshKey,
    setSearchQuery,
    setShowDiscoveryDialog,
    setCurrentTab,
    setSearchDate,
    setSearchPerson,
    setAutoAttendanceEnabled,
    handleCameraSelect,
    handleCaptureSnapshot,
    handleAISearch,
    handleDiscoverCameras,
    handleConfigureCamera,
    handleFaceSearch,
    handleToggleAutoAttendance
  };
};
