
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { getFeedsByDateRange } from '@/database/models/cctv';

interface Recording {
  id: number;
  cameraName: string;
  timestamp: Date;
  duration: string;
  fileSize: string;
  thumbnailUrl: string;
}

const RecordingsArchive: React.FC = () => {
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

  const handleDownload = (id: number) => {
    toast({
      title: 'Download Started',
      description: `Recording #${id} is being downloaded`
    });
  };

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8"
              placeholder="Search recordings..."
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
            value={cameraFilter}
            onValueChange={setCameraFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by camera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cameras</SelectItem>
              <SelectItem value="entrance">Entrance</SelectItem>
              <SelectItem value="cafeteria">Cafeteria</SelectItem>
              <SelectItem value="playground">Playground</SelectItem>
              <SelectItem value="classroom">Classrooms</SelectItem>
              <SelectItem value="library">Library</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={fetchRecordings} disabled={isLoading}>
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
          </div>
        ) : filteredRecordings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecordings.map((recording) => (
              <div key={recording.id} className="border dark:border-gray-700 rounded-md overflow-hidden">
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
            ))}
          </div>
        ) : (
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
        )}
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
