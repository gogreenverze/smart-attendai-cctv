
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export interface Recording {
  id: number;
  cameraName: string;
  timestamp: Date;
  duration: string;
  fileSize: string;
  thumbnailUrl: string;
}

interface RecordingCardProps {
  recording: Recording;
}

const RecordingCard: React.FC<RecordingCardProps> = ({ recording }) => {
  const { toast } = useToast();

  const handleDownload = (id: number) => {
    toast({
      title: 'Download Started',
      description: `Recording #${id} is being downloaded`
    });
  };

  return (
    <div className="border dark:border-gray-700 rounded-md overflow-hidden">
      <div className="relative">
        <img 
          src={recording.thumbnailUrl} 
          alt={recording.cameraName} 
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 flex justify-between">
          <span className="font-medium">{recording.cameraName}</span>
          <span>{format(recording.timestamp, 'dd MMM yyyy, h:mm a')}</span>
        </div>
      </div>
      <div className="p-3 space-y-1 dark:text-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">Duration:</span>
          <span className="font-medium">{recording.duration}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">File Size:</span>
          <span className="font-medium">{recording.fileSize}</span>
        </div>
      </div>
      <div className="border-t dark:border-gray-700 p-3 flex justify-between">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button size="sm" onClick={() => handleDownload(recording.id)}>
          <Download className="h-3 w-3 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};

export default RecordingCard;
