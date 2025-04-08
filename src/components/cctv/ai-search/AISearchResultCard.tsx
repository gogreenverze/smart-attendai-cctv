
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { FacialSearchResult } from '@/services/FacialRecognitionService';

interface AISearchResultCardProps {
  result: FacialSearchResult;
}

const AISearchResultCard: React.FC<AISearchResultCardProps> = ({ result }) => {
  return (
    <div className="border dark:border-gray-700 rounded-md overflow-hidden">
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
      <div className="p-3 space-y-1 dark:text-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">Camera:</span>
          <span className="font-medium">{result.cameraName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">Date:</span>
          <span className="font-medium">
            {format(result.timestamp, 'dd MMM yyyy')}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-700 dark:text-gray-400">Time:</span>
          <span className="font-medium">
            {format(result.timestamp, 'h:mm a')}
          </span>
        </div>
      </div>
      <div className="border-t dark:border-gray-700 p-3 flex justify-between">
        <Button variant="outline" size="sm">
          View Footage
        </Button>
        <Button size="sm">
          Mark Attendance
        </Button>
      </div>
    </div>
  );
};

export default AISearchResultCard;
