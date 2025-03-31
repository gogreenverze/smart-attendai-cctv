
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Upload, 
  User, 
  Camera, 
  Calendar, 
  Clock, 
  MapPin, 
  Sliders, 
  Image as ImageIcon,
  RefreshCw,
  Download
} from 'lucide-react';

// Mock search results
const mockSearchResults = [
  { 
    id: 1, 
    imageSrc: '/placeholder.svg', 
    name: 'Amit Sharma', 
    matchConfidence: 98, 
    location: 'Main Entrance', 
    timestamp: '08:15 AM, Today',
    type: 'student'
  },
  { 
    id: 2, 
    imageSrc: '/placeholder.svg', 
    name: 'Amit Sharma', 
    matchConfidence: 95, 
    location: 'Classroom 10A', 
    timestamp: '09:30 AM, Today',
    type: 'student'
  },
  { 
    id: 3, 
    imageSrc: '/placeholder.svg', 
    name: 'Amit Sharma', 
    matchConfidence: 92, 
    location: 'Cafeteria', 
    timestamp: '12:45 PM, Today',
    type: 'student'
  },
  { 
    id: 4, 
    imageSrc: '/placeholder.svg', 
    name: 'Kumar S.', 
    matchConfidence: 96, 
    location: 'Staff Room', 
    timestamp: '10:20 AM, Today',
    type: 'teacher'
  },
  { 
    id: 5, 
    imageSrc: '/placeholder.svg', 
    name: 'Unknown Person', 
    matchConfidence: 78, 
    location: 'Admin Block', 
    timestamp: '02:15 PM, Yesterday',
    type: 'unknown'
  },
];

const AISearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('text');
  const [searchResults, setSearchResults] = useState<typeof mockSearchResults | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState([90]);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  const handleSearch = () => {
    if (searchQuery.trim() === '' && searchMode === 'text') {
      toast({
        title: "Search query required",
        description: "Please enter a name to search for",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    // Simulate API call with a delay
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setAnalyzing(false);
      toast({
        title: "Search Complete",
        description: `Found ${mockSearchResults.length} results matching your query`,
      });
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setUploading(false);
      setAnalyzing(true);
      
      // Simulate analysis
      setTimeout(() => {
        setSearchResults(mockSearchResults);
        setAnalyzing(false);
        toast({
          title: "Image Analysis Complete",
          description: `Found ${mockSearchResults.length} possible matches`,
        });
      }, 2000);
    }, 1000);
  };

  const handleLiveSearch = () => {
    toast({
      title: "Live Search Activated",
      description: "Scanning CCTV feeds for the person matching your query",
    });
    
    setAnalyzing(true);
    
    // Simulate search
    setTimeout(() => {
      setSearchResults(mockSearchResults.slice(0, 3));
      setAnalyzing(false);
      toast({
        title: "Live Search Results",
        description: "Found 3 real-time matches from active cameras",
      });
    }, 3000);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prevLocations => 
      prevLocations.includes(location)
        ? prevLocations.filter(loc => loc !== location)
        : [...prevLocations, location]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">AI Image Search</h1>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Sliders className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Find People in CCTV Footage</CardTitle>
          <CardDescription>
            Search for students or staff using our AI-powered facial recognition system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="text" onValueChange={setSearchMode}>
            <TabsList className="mb-4 grid grid-cols-3 w-[400px]">
              <TabsTrigger value="text">
                <User className="h-4 w-4 mr-2" />
                Search by Name
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="h-4 w-4 mr-2" />
                Search by Image
              </TabsTrigger>
              <TabsTrigger value="live">
                <Camera className="h-4 w-4 mr-2" />
                Live Search
              </TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <TabsContent value="text" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          className="pl-8"
                          placeholder="Enter student or staff name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button className="btn-primary" onClick={handleSearch} disabled={analyzing}>
                        {analyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {showFilters && (
                      <div className="border rounded-md p-4 space-y-4">
                        <h3 className="font-medium">Advanced Filters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Search Date</Label>
                            <Select value={selectedDate} onValueChange={setSelectedDate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select date range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="last-week">Last 7 days</SelectItem>
                                <SelectItem value="last-month">Last 30 days</SelectItem>
                                <SelectItem value="custom">Custom range</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Confidence Threshold</Label>
                            <div className="pt-2">
                              <Slider 
                                value={confidenceThreshold} 
                                onValueChange={setConfidenceThreshold}
                                max={100}
                                step={5}
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Min: {confidenceThreshold[0]}%</span>
                                <span>100%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Locations</Label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Main Entrance', 'Classrooms', 'Cafeteria', 'Playground', 'Admin Block', 'Library'].map(location => (
                              <div key={location} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`location-${location}`} 
                                  checked={selectedLocations.includes(location)}
                                  onCheckedChange={() => toggleLocation(location)}
                                />
                                <label htmlFor={`location-${location}`} className="text-sm">{location}</label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="image" className="mt-0">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <h3 className="text-lg font-medium">Upload an image</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Drag & drop an image or click to browse
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex justify-center">
                      <Button className="btn-primary w-full sm:w-auto" disabled={uploading || analyzing}>
                        {uploading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : analyzing ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search with this Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="live" className="mt-0">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md bg-gray-50">
                      <h3 className="font-medium">Live CCTV Search</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Search for a person across all active CCTV cameras in real-time
                      </p>
                      
                      <div className="mt-4 space-y-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            className="pl-8"
                            placeholder="Enter name to search live CCTV feeds..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="text-sm text-gray-500">or</div>
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Reference Image
                        </Button>
                      </div>
                      
                      <div className="mt-4">
                        <Button className="w-full btn-primary" onClick={handleLiveSearch} disabled={analyzing}>
                          {analyzing ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Scanning Cameras...
                            </>
                          ) : (
                            <>
                              <Camera className="h-4 w-4 mr-2" />
                              Start Live Camera Search
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">How it works</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Provide search details</h4>
                      <p className="text-gray-500">Enter a name, upload an image, or start a live search</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">AI processes your query</h4>
                      <p className="text-gray-500">Our facial recognition system analyzes CCTV footage</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Review matches</h4>
                      <p className="text-gray-500">Results are displayed with confidence scores and timestamps</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-school-primary text-white flex items-center justify-center">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium">Generate reports</h4>
                      <p className="text-gray-500">Save and export findings for attendance or security purposes</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-sm text-gray-500">
                  <p>This AI-powered search complies with all privacy regulations and school policies.</p>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              Showing {searchResults.length} matches from CCTV footage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map(result => (
                <div key={result.id} className="border rounded-md overflow-hidden">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={result.imageSrc} 
                      alt={result.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{result.name}</span>
                        <span className="text-xs bg-white/20 rounded px-1.5 py-0.5">
                          {result.matchConfidence}% match
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{result.location}</span>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span>{result.timestamp}</span>
                    </div>
                    <div className="pt-2 flex justify-between">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button className="bg-school-primary text-white hover:bg-school-primary/90" size="sm">
                        <User className="h-3 w-3 mr-1" />
                        {result.type === 'student' ? 'Student Profile' : 
                         result.type === 'teacher' ? 'Teacher Profile' : 'Unknown'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-4">
            <p className="text-sm text-gray-500">Results based on {confidenceThreshold[0]}% confidence threshold</p>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AISearch;
