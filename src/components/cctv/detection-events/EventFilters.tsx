
import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface EventFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  severityFilter: string;
  setSeverityFilter: (severity: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedDate,
  setSelectedDate,
  severityFilter,
  setSeverityFilter,
  onRefresh,
  isLoading
}) => {
  return (
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
      
      <Button onClick={onRefresh} disabled={isLoading}>
        Refresh
      </Button>
    </div>
  );
};

export default EventFilters;
