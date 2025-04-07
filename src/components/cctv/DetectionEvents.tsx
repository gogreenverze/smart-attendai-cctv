
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Camera, Search, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { logAISearch, getAISearchLogs } from '@/database/models/cctv';

interface DetectionEvent {
  id: number;
  camera: string;
  time: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  timestamp?: Date;
}

interface DetectionEventsProps {
  events?: DetectionEvent[];
}

const DetectionEvents: React.FC<DetectionEventsProps> = ({ events: initialEvents }) => {
  const [events, setEvents] = useState<DetectionEvent[]>(initialEvents || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    if (!initialEvents) {
      fetchEvents();
    }
  }, [selectedDate, initialEvents]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const logs = await getAISearchLogs();
      
      // Transform logs to detection events
      let fetchedEvents: DetectionEvent[] = logs.map((log, index) => {
        const severity: ('info' | 'warning' | 'success') = 
          ['warning', 'info', 'success'][Math.floor(Math.random() * 3)] as 'info' | 'warning' | 'success';
          
        return {
          id: log.log_id || index + 1,
          camera: log.search_criteria.includes('camera') ? log.search_criteria : 'AI Detection',
          time: format(log.searched_at || new Date(), 'h:mm a'),
          description: `${log.search_type} - ${log.search_criteria}`,
          severity,
          timestamp: log.searched_at
        };
      });
      
      // Add mock data if not enough real data
      if (fetchedEvents.length < 5) {
        const mockEvents = [
          { id: 101, camera: 'Main Entrance', time: '08:15 AM', description: 'Multiple students detected entering', severity: 'info' as const, timestamp: new Date(new Date().setHours(8, 15)) },
          { id: 102, camera: 'Class 10A', time: '09:30 AM', description: 'Attendance captured', severity: 'success' as const, timestamp: new Date(new Date().setHours(9, 30)) },
          { id: 103, camera: 'Playground', time: '10:45 AM', description: 'Motion detected during class hours', severity: 'warning' as const, timestamp: new Date(new Date().setHours(10, 45)) },
          { id: 104, camera: 'Admin Block', time: '11:20 AM', description: 'Staff movement', severity: 'info' as const, timestamp: new Date(new Date().setHours(11, 20)) },
          { id: 105, camera: 'Cafeteria', time: '12:30 PM', description: 'Student gathering during lunch', severity: 'info' as const, timestamp: new Date(new Date().setHours(12, 30)) },
        ];
        fetchedEvents = [...fetchedEvents, ...mockEvents];
      }
      
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch detection events',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logEvent = async (description: string) => {
    try {
      await logAISearch({
        user_id: 1, // Default user ID
        search_type: 'event_log',
        search_criteria: description,
      });
      
      toast({
        title: 'Event Logged',
        description: 'Detection event has been logged'
      });
      
      fetchEvents();
    } catch (error) {
      console.error('Error logging event:', error);
      toast({
        title: 'Error',
        description: 'Failed to log event',
        variant: 'destructive'
      });
    }
  };

  const filteredEvents = events.filter(event => 
    (event.camera.toLowerCase().includes(searchTerm.toLowerCase()) || 
     event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (severityFilter === 'all' || event.severity === severityFilter)
  );

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
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Select
            value={severityFilter}
            onValueChange={setSeverityFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="info">Information</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchEvents} disabled={isLoading}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.length > 0 ? (
              filteredEvents.map(event => (
                <div key={event.id} className="flex items-start space-x-4 p-4 border dark:border-gray-700 rounded-md">
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
              ))
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No events found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
                  Try adjusting your search filters or check back later.
                </p>
              </div>
            )}
          </div>
        )}
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
