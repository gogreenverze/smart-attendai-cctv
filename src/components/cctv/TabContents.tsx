
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import RecordingsArchive from './RecordingsArchive';
import DetectionEvents from './DetectionEvents';
import AISearchResults from './ai-search/AISearchResults';
import CCTVSettings from './CCTVSettings';
import CCTVAdminControls from './CCTVAdminControls';
import { FacialSearchResult } from '@/services/FacialRecognitionService';

interface TabContentsProps {
  faceSearchResults: FacialSearchResult[];
  onNewSearch: () => void;
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: (enabled: boolean) => void;
  isAdmin: boolean;
}

export const RecordingsTab: React.FC = () => {
  return (
    <TabsContent value="recordings">
      <RecordingsArchive />
    </TabsContent>
  );
};

export const EventsTab: React.FC = () => {
  return (
    <TabsContent value="events">
      <DetectionEvents />
    </TabsContent>
  );
};

export const AISearchTab: React.FC<{
  faceSearchResults: FacialSearchResult[];
  onNewSearch: () => void;
}> = ({ faceSearchResults, onNewSearch }) => {
  return (
    <TabsContent value="ai-search">
      <AISearchResults 
        faceSearchResults={faceSearchResults}
        onNewSearch={onNewSearch}
      />
    </TabsContent>
  );
};

export const SettingsTab: React.FC<{
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: (enabled: boolean) => void;
}> = ({ autoAttendanceEnabled, onToggleAutoAttendance }) => {
  return (
    <TabsContent value="settings">
      <CCTVSettings 
        autoAttendanceEnabled={autoAttendanceEnabled}
        onToggleAutoAttendance={onToggleAutoAttendance}
      />
    </TabsContent>
  );
};

export const AdminTab: React.FC<{
  isAdmin: boolean;
}> = ({ isAdmin }) => {
  return (
    <TabsContent value="admin">
      <CCTVAdminControls isAdmin={isAdmin} />
    </TabsContent>
  );
};
