
import React from 'react';
import { FacialSearchResult } from '@/services/FacialRecognitionService';
import AISearchResultCard from './AISearchResultCard';
import AISearchEmptyState from './AISearchEmptyState';

interface AISearchResultsListProps {
  results: FacialSearchResult[];
  onNewSearch: () => void;
}

const AISearchResultsList: React.FC<AISearchResultsListProps> = ({ results, onNewSearch }) => {
  if (results.length === 0) {
    return <AISearchEmptyState onNewSearch={onNewSearch} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {results.map((result, i) => (
        <AISearchResultCard key={i} result={result} />
      ))}
    </div>
  );
};

export default AISearchResultsList;
