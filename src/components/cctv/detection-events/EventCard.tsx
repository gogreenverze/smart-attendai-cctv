
import React from 'react';
import { AlertTriangle, Camera } from 'lucide-react';

export interface DetectionEvent {
  id: number;
  camera: string;
  time: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  timestamp?: Date;
}

interface EventCardProps {
  event: DetectionEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="flex items-start space-x-4 p-4 border dark:border-gray-700 rounded-md">
      <div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          event.severity === 'warning' ? 'bg-amber-100 dark:bg-amber-900/30' :
          event.severity === 'success' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
        }`}>
          {event.severity === 'warning' ? (
            <AlertTriangle className={`h-4 w-4 text-amber-500 dark:text-amber-400`} />
          ) : event.severity === 'success' ? (
            <Camera className={`h-4 w-4 text-green-500 dark:text-green-400`} />
          ) : (
            <Camera className={`h-4 w-4 text-blue-500 dark:text-blue-400`} />
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium dark:text-white">{event.camera}</h4>
          <span className="text-sm text-gray-500 dark:text-gray-400">{event.time}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{event.description}</p>
      </div>
    </div>
  );
};

export default EventCard;
