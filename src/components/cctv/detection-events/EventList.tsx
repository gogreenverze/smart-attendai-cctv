
import React from 'react';
import EventCard, { DetectionEvent } from './EventCard';
import EmptyState from './EmptyState';

interface EventListProps {
  events: DetectionEvent[];
  isLoading: boolean;
}

const EventList: React.FC<EventListProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
