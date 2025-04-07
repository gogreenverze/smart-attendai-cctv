
import React from 'react';
import { Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CCTVTabsProps {
  currentTab: string;
  onTabChange: (value: string) => void;
  isAdmin: boolean;
  children: React.ReactNode;
}

const CCTVTabs: React.FC<CCTVTabsProps> = ({
  currentTab,
  onTabChange,
  isAdmin,
  children
}) => {
  return (
    <Tabs defaultValue="live" className="space-y-4" value={currentTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="live">Live View</TabsTrigger>
        <TabsTrigger value="recordings">Recordings</TabsTrigger>
        <TabsTrigger value="events">Detection Events</TabsTrigger>
        <TabsTrigger value="ai-search">AI Search Results</TabsTrigger>
        <TabsTrigger value="settings">CCTV Settings</TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="admin" className="bg-amber-50 text-amber-800 data-[state=active]:bg-amber-700 data-[state=active]:text-white dark:bg-amber-900/20 dark:text-amber-400 dark:data-[state=active]:bg-amber-700 dark:data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Admin Controls
          </TabsTrigger>
        )}
      </TabsList>
      
      {children}
    </Tabs>
  );
};

export default CCTVTabs;
