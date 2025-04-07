
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FacialSearchResult } from '@/services/FacialRecognitionService';

interface AISearchResultsProps {
  faceSearchResults: FacialSearchResult[];
  onNewSearch: () => void;
}

const AISearchResults: React.FC<AISearchResultsProps> = ({ faceSearchResults, onNewSearch }) => {
  return (
    <Card className="dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Facial Recognition Search Results</CardTitle>
          <CardDescription>AI-powered search results</CardDescription>
        </div>
        <Button onClick={onNewSearch}>
          <Search className="h-4 w-4 mr-2" />
          New Search
        </Button>
      </CardHeader>
      <CardContent>
        {faceSearchResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No search results yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mt-2">
              Use the AI Search feature to find people across camera footage using facial recognition
            </p>
            <Button 
              className="mt-4"
              onClick={onNewSearch}
            >
              Start New Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faceSearchResults.map((result, i) => (
              <div key={i} className="border dark:border-gray-700 rounded-md overflow-hidden">
                <div className="relative">
                  <img 
                    src={result.imageUrl} 
                    alt={result.personName} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.personName}</span>
                      <Badge variant="outline" className="text-white border-white">
                        {(result.matchConfidence * 100).toFixed(1)}% Match
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-1 dark:text-gray-300">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Camera:</span>
                    <span className="font-medium">{result.cameraName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Date:</span>
                    <span className="font-medium">
                      {format(result.timestamp, 'dd MMM yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-400">Time:</span>
                    <span className="font-medium">
                      {format(result.timestamp, 'h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="border-t dark:border-gray-700 p-3 flex justify-between">
                  <Button variant="outline" size="sm">
                    View Footage
                  </Button>
                  <Button size="sm">
                    Mark Attendance
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISearchResults;
