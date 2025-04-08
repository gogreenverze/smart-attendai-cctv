
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const CameraSettings: React.FC = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">Camera Settings</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Auto-discovery frequency</span>
          <Select defaultValue="manual">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual only</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Default camera resolution</span>
          <Select defaultValue="720p">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select resolution" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="480p">480p</SelectItem>
              <SelectItem value="720p">720p (HD)</SelectItem>
              <SelectItem value="1080p">1080p (Full HD)</SelectItem>
              <SelectItem value="4k">4K (Ultra HD)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Motion detection sensitivity</span>
          <div className="w-[180px]">
            <Slider defaultValue={[75]} max={100} step={1} />
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Record on motion</span>
          <Switch defaultChecked />
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Notification on motion</span>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default CameraSettings;
