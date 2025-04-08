
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCCTVState } from '@/hooks/useCCTVState';
import { cameraLocations } from './CCTVData';
import CCTVHeader from '@/components/cctv/CCTVHeader';
import CCTVTabs from '@/components/cctv/CCTVTabs';
import LiveViewTab from '@/components/cctv/LiveViewTab';
import { RecordingsTab, EventsTab, AISearchTab, SettingsTab, AdminTab } from '@/components/cctv/TabContents';
import CameraDiscoveryDialog from '@/components/cctv/CameraDiscoveryDialog';
import AISearchDialog from '@/components/cctv/AISearchDialog';

const CCTVMonitoring: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const isAdmin = user?.role === 'admin';
  
  const {
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
    setShowAISearchDialog,
    setAutoAttendanceEnabled,
    handleCameraSelect,
    handleCaptureSnapshot,
    handleAISearch,
    handleDiscoverCameras,
    handleConfigureCamera,
    handleFaceSearch,
    handleToggleAutoAttendance
  } = useCCTVState();

  return (
    <div className={`space-y-6 animate-fade-in dark-mode-transition ${isDarkMode ? 'dark' : ''}`}>
      <CCTVHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => setRefreshKey(prev => prev + 1)}
        onAddCameras={() => setShowDiscoveryDialog(true)}
        onAISearch={handleAISearch}
        isAdmin={isAdmin}
        onAdminMode={() => setCurrentTab('admin')}
      />

      <CCTVTabs
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isAdmin={isAdmin}
      >
        <LiveViewTab
          cameras={cameraLocations}
          selectedCamera={selectedCamera}
          onSelectCamera={handleCameraSelect}
          searchQuery={searchQuery}
          autoAttendanceEnabled={autoAttendanceEnabled}
          onToggleAutoAttendance={handleToggleAutoAttendance}
          viewMode={viewMode}
          setViewMode={setViewMode}
          playing={playing}
          setPlaying={setPlaying}
          refreshKey={refreshKey}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          onCaptureSnapshot={handleCaptureSnapshot}
        />
        
        <RecordingsTab />
        <EventsTab />
        
        <AISearchTab 
          faceSearchResults={faceSearchResults}
          onNewSearch={handleAISearch}
        />
        
        <SettingsTab 
          autoAttendanceEnabled={autoAttendanceEnabled}
          onToggleAutoAttendance={setAutoAttendanceEnabled}
        />
        
        <AdminTab isAdmin={isAdmin} />
      </CCTVTabs>
      
      <CameraDiscoveryDialog 
        open={showDiscoveryDialog}
        onOpenChange={setShowDiscoveryDialog}
        discoveredCameras={discoveredCameras}
        isDiscovering={isDiscovering}
        onDiscoverCameras={handleDiscoverCameras}
        onConfigureCamera={handleConfigureCamera}
      />
      
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
