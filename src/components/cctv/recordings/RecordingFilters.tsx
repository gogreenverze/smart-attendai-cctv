
import React from 'react';
import { Filter, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface RecordingFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  cameraFilter: string;
  setCameraFilter: (value: string) => void;
  fetchRecordings: () => void;
  isLoading: boolean;
}

const RecordingFilters: React.FC<RecordingFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  cameraFilter,
  setCameraFilter,
  fetchRecordings,
  isLoading
}) => {
  return (
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
  );
};

export default RecordingFilters;
