
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import CameraList from './CameraList';
import CameraDisplay from './CameraDisplay';

interface LiveViewTabProps {
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
  viewMode: string;
  setViewMode: (mode: string) => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
  refreshKey: number;
  zoomLevel: number[];
  setZoomLevel: (level: number[]) => void;
  onCaptureSnapshot: () => void;
}

const LiveViewTab: React.FC<LiveViewTabProps> = ({
  cameras,
  selectedCamera,
  onSelectCamera,
  searchQuery,
  autoAttendanceEnabled,
  onToggleAutoAttendance,
  viewMode,
  setViewMode,
  playing,
  setPlaying,
  refreshKey,
  zoomLevel,
  setZoomLevel,
  onCaptureSnapshot,
}) => {
  return (
    <TabsContent value="live" className="space-y-4">
      <div className="flex space-x-4">
        <div className="w-1/4 space-y-4">
          <CameraList 
            cameras={cameras}
            selectedCamera={selectedCamera}
            onSelectCamera={onSelectCamera}
            searchQuery={searchQuery}
            autoAttendanceEnabled={autoAttendanceEnabled}
            onToggleAutoAttendance={onToggleAutoAttendance}
          />
        </div>
        <div className="w-3/4">
          <CameraDisplay 
            cameras={cameras}
            selectedCamera={selectedCamera}
            viewMode={viewMode}
            setViewMode={setViewMode}
            playing={playing}
            setPlaying={setPlaying}
            refreshKey={refreshKey}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            onCaptureSnapshot={onCaptureSnapshot}
          />
        </div>
      </div>
    </TabsContent>
  );
};

export default LiveViewTab;
