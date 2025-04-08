
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface AIRecognitionSettingsProps {
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: (enabled: boolean) => void;
}

const AIRecognitionSettings: React.FC<AIRecognitionSettingsProps> = ({
  autoAttendanceEnabled,
  onToggleAutoAttendance
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium dark:text-white">AI Recognition Settings</h3>
      <div className="space-y-2">
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Face recognition confidence threshold</span>
          <div className="w-[180px]">
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Auto-mark attendance</span>
          <Switch 
            checked={autoAttendanceEnabled} 
            onCheckedChange={onToggleAutoAttendance} 
          />
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Student recognition model</span>
          <Select defaultValue="facenet">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="facenet">FaceNet</SelectItem>
              <SelectItem value="dlib">DLib</SelectItem>
              <SelectItem value="deepface">DeepFace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Process frames</span>
          <Select defaultValue="15fps">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select framerate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5fps">5 FPS</SelectItem>
              <SelectItem value="15fps">15 FPS</SelectItem>
              <SelectItem value="30fps">30 FPS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
          <span className="dark:text-gray-300">Save recognition data</span>
          <Switch defaultChecked />
        </div>
      </div>
    </div>
  );
};

export default AIRecognitionSettings;
