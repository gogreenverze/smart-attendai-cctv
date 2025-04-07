
import React from 'react';
import { Calendar as CalendarIcon, Search } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface AISearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchPerson: string;
  setSearchPerson: (name: string) => void;
  searchDate: Date | undefined;
  setSearchDate: (date: Date | undefined) => void;
  isSearching: boolean;
  onSearch: () => void;
}

const AISearchDialog: React.FC<AISearchDialogProps> = ({
  open,
  onOpenChange,
  searchPerson,
  setSearchPerson,
  searchDate,
  setSearchDate,
  isSearching,
  onSearch,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:border-gray-700 dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>AI-Powered Facial Search</DialogTitle>
          <DialogDescription>
            Search for people across camera footage using facial recognition
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Person Name</label>
            <Input 
              placeholder="Enter name to search" 
              value={searchPerson}
              onChange={e => setSearchPerson(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {searchDate ? format(searchDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={searchDate}
                  onSelect={setSearchDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium dark:text-white">Camera Locations</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Select cameras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cameras</SelectItem>
                <SelectItem value="entrance">Entrance Cameras</SelectItem>
                <SelectItem value="classroom">Classroom Cameras</SelectItem>
                <SelectItem value="playground">Playground Cameras</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            onClick={onSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AISearchDialog;
