
import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCw, Search, Plus, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CCTVHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onRefresh: () => void;
  onAddCameras: () => void;
  onAISearch: () => void;
  isAdmin: boolean;
  onAdminMode: () => void;
}

const CCTVHeader: React.FC<CCTVHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onRefresh,
  onAddCameras,
  onAISearch,
  isAdmin,
  onAdminMode
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold dark:text-white text-gray-800">CCTV Monitoring</h1>
      <div className="flex space-x-2">
        <Link to="/cctv-how-it-works">
          <Button variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
            <HelpCircle className="h-4 w-4 mr-2" />
            How It Works
          </Button>
        </Link>
        <div className="relative w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            className="pl-8"
            placeholder="Search cameras..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={onRefresh}>
          <RotateCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          onClick={onAddCameras}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Cameras
        </Button>
        <Button className="btn-primary" onClick={onAISearch}>
          <Search className="h-4 w-4 mr-2" />
          AI Search
        </Button>
        {isAdmin && (
          <Button 
            variant="outline" 
            className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800"
            onClick={onAdminMode}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admin Mode
          </Button>
        )}
      </div>
    </div>
  );
};

export default CCTVHeader;
