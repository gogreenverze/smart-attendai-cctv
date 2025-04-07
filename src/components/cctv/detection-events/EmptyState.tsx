
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No events found</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mt-2">
        Try adjusting your search filters or check back later.
      </p>
    </div>
  );
};

export default EmptyState;
