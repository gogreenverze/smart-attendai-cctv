
import React from 'react';
import { Check, RefreshCw, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

interface CCTVSettingsProps {
  autoAttendanceEnabled: boolean;
  onToggleAutoAttendance: (enabled: boolean) => void;
}

const CCTVSettings: React.FC<CCTVSettingsProps> = ({ 
  autoAttendanceEnabled, 
  onToggleAutoAttendance 
}) => {
  return (
    <Card className="dark:border-gray-700">
      <CardHeader>
        <CardTitle>CCTV System Settings</CardTitle>
        <CardDescription>Configure camera and AI settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
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
        </div>
        
        <div className="pt-4 border-t dark:border-gray-700">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Training & Management</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Training Images
            </Button>
            <Button variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retrain AI Model
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t dark:border-gray-700 pt-4 flex justify-between">
        <Button variant="outline">Reset to Default</Button>
        <Button>
          <Check className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CCTVSettings;
