
import React from 'react';
import { Calendar, Clock, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RecordingsArchive: React.FC = () => {
  return (
    <Card className="dark:border-gray-700">
      <CardHeader>
        <CardTitle>Recordings Archive</CardTitle>
        <CardDescription>Access past footage and recordings</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-96">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-4">
            <Calendar className="h-8 w-8 text-gray-400" />
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">Recording Archive</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            This section would allow searching and viewing of recorded CCTV footage by date, time, and camera location.
          </p>
          <Button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Download Sample Recording
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecordingsArchive;
