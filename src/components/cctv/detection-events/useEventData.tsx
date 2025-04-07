
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { DetectionEvent } from './EventCard';
import { useToast } from '@/hooks/use-toast';
import { logAISearch, getAISearchLogs } from '@/database/models/cctv';

export const useEventData = (initialEvents?: DetectionEvent[]) => {
  const [events, setEvents] = useState<DetectionEvent[]>(initialEvents || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState('all');
  const { toast } = useToast();

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

  useEffect(() => {
    if (!initialEvents) {
      fetchEvents();
    }
  }, [selectedDate, initialEvents]);

  const filteredEvents = events.filter(event => 
    (event.camera.toLowerCase().includes(searchTerm.toLowerCase()) || 
     event.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (severityFilter === 'all' || event.severity === severityFilter)
  );

  return {
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
  };
};
