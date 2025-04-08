
import React from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FacialSearchResult } from '@/services/FacialRecognitionService';
import AISearchResultsList from './AISearchResultsList';

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
        <AISearchResultsList 
          results={faceSearchResults} 
          onNewSearch={onNewSearch} 
        />
      </CardContent>
    </Card>
  );
};

export default AISearchResults;
