
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getFeedsByDateRange } from '@/database/models/cctv';
import { Recording } from './RecordingCard';

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [cameraFilter, setCameraFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRecordings();
  }, [selectedDate, cameraFilter]);

  const fetchRecordings = async () => {
    setIsLoading(true);
    try {
      // Calculate end date (end of the selected day)
      const endDate = selectedDate ? new Date(selectedDate) : new Date();
      endDate.setHours(23, 59, 59, 999);
      
      // Get recordings from database
      const feeds = await getFeedsByDateRange(selectedDate || new Date(), endDate);
      
      // Transform the data for display
      const mockRecordings: Recording[] = feeds.map((feed, index) => ({
        id: feed.feed_id || index,
        cameraName: `Camera ${feed.camera_id}`,
        timestamp: feed.timestamp,
        duration: '2:15',
        fileSize: '45.2 MB',
        thumbnailUrl: `https://picsum.photos/seed/${feed.camera_id + index}/300/200?grayscale`
      }));
      
      // Add some mock data for demonstration
      if (mockRecordings.length < 5) {
        for (let i = 0; i < 5; i++) {
          mockRecordings.push({
            id: 1000 + i,
            cameraName: ['Main Entrance', 'Cafeteria', 'Playground', 'Classroom 10A', 'Library'][i % 5],
            timestamp: new Date(new Date().setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))),
            duration: `${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 59).toString().padStart(2, '0')}`,
            fileSize: `${Math.floor(Math.random() * 90) + 10}.${Math.floor(Math.random() * 9)}MB`,
            thumbnailUrl: `https://picsum.photos/seed/${i + 50}/300/200?grayscale`
          });
        }
      }

      setRecordings(mockRecordings);
    } catch (error) {
      console.error('Error fetching recordings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch recordings',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recordings,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    isLoading,
    cameraFilter,
    setCameraFilter,
    fetchRecordings
  };
};
