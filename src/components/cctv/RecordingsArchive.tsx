
import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import RecordingFilters from './recordings/RecordingFilters';
import RecordingsList from './recordings/RecordingsList';
import { useRecordings } from './recordings/useRecordings';

const RecordingsArchive: React.FC = () => {
  const {
    recordings,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    isLoading,
    cameraFilter,
    setCameraFilter,
    fetchRecordings
  } = useRecordings();

  // Filter recordings based on search term and camera filter
  const filteredRecordings = recordings.filter(recording => 
    recording.cameraName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (cameraFilter === 'all' || recording.cameraName.toLowerCase().includes(cameraFilter.toLowerCase()))
  );

  return (
    <Card className="dark:border-gray-700">
      <CardHeader>
        <CardTitle>Recordings Archive</CardTitle>
        <CardDescription>Access past footage and recordings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <RecordingFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          cameraFilter={cameraFilter}
          setCameraFilter={setCameraFilter}
          fetchRecordings={fetchRecordings}
          isLoading={isLoading}
        />

        <RecordingsList
          recordings={recordings}
          isLoading={isLoading}
          searchTerm={searchTerm}
          cameraFilter={cameraFilter}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredRecordings.length} recordings
        </p>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecordingsArchive;
