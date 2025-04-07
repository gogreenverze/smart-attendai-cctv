
import React from 'react';
import { Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EventList from './detection-events/EventList';
import EventFilters from './detection-events/EventFilters';
import { useEventData } from './detection-events/useEventData';
import { DetectionEvent } from './detection-events/EventCard';

interface DetectionEventsProps {
  events?: DetectionEvent[];
}

const DetectionEvents: React.FC<DetectionEventsProps> = ({ events: initialEvents }) => {
  const {
    events: filteredEvents,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    isLoading,
    severityFilter,
    setSeverityFilter,
    fetchEvents,
    logEvent
  } = useEventData(initialEvents);

  return (
    <Card className="dark:border-gray-700">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Detection Events</CardTitle>
          <CardDescription>AI-detected events from camera feeds</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => logEvent('Manual event logged by user')}>
            <Camera className="h-4 w-4 mr-2" />
            Log Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <EventFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          severityFilter={severityFilter}
          setSeverityFilter={setSeverityFilter}
          onRefresh={fetchEvents}
          isLoading={isLoading}
        />

        <EventList events={filteredEvents} isLoading={isLoading} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredEvents.length} events
        </p>
        <Button variant="outline" onClick={fetchEvents} disabled={isLoading}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetectionEvents;
