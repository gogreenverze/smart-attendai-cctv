
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AISearchEmptyStateProps {
  onNewSearch: () => void;
}

const AISearchEmptyState: React.FC<AISearchEmptyStateProps> = ({ onNewSearch }) => {
  return (
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
  );
};

export default AISearchEmptyState;
