
import React from 'react';
import RecordingCard, { Recording } from './RecordingCard';
import { Calendar, Clock } from 'lucide-react';

interface RecordingsListProps {
  recordings: Recording[];
  isLoading: boolean;
  searchTerm: string;
  cameraFilter: string;
}

const RecordingsList: React.FC<RecordingsListProps> = ({ 
  recordings, 
  isLoading, 
  searchTerm, 
  cameraFilter 
}) => {
  const filteredRecordings = recordings.filter(recording => 
    recording.cameraName.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (cameraFilter === 'all' || recording.cameraName.toLowerCase().includes(cameraFilter.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (filteredRecordings.length === 0) {
    return (
      <div className="text-center space-y-4 py-12">
        <div className="flex items-center justify-center space-x-4">
          <Calendar className="h-8 w-8 text-gray-400" />
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">No Recordings Found</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Try adjusting your search filters to find recordings from the archive.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredRecordings.map((recording) => (
        <RecordingCard key={recording.id} recording={recording} />
      ))}
    </div>
  );
};

export default RecordingsList;
