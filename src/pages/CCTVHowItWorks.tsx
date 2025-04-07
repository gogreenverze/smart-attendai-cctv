
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, UserCheck, Camera, Clock, Settings, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const CCTVHowItWorks: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`space-y-6 animate-fade-in dark-mode-transition ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold dark:text-white text-gray-800">How It Works: CCTV & AI System</h1>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>CCTV System Overview</CardTitle>
              <CardDescription>How our intelligent CCTV system works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Camera className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium">Video Capture</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    High-definition cameras placed at strategic locations capture video feeds continuously.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-medium">AI Processing</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our AI engine analyzes video feeds in real-time to detect people, events, and attendance.
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <UserCheck className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-medium">Automated Actions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Based on AI analysis, the system automates attendance, security alerts, and record-keeping.
                  </p>
                </div>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">System Architecture</h3>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-1 p-4">
                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/20 mb-4">
                          <h4 className="font-medium mb-2">Camera Network</h4>
                          <ul className="list-disc pl-5 text-sm">
                            <li>IP Cameras with configurable resolution</li>
                            <li>Centralized storage and backup</li>
                            <li>Motion detection capabilities</li>
                          </ul>
                        </div>
                        
                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                          <h4 className="font-medium mb-2">AI Processing Engine</h4>
                          <ul className="list-disc pl-5 text-sm">
                            <li>Facial recognition and tracking</li>
                            <li>Behavior pattern recognition</li>
                            <li>Real-time analytics</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="flex-1 p-4">
                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-purple-50 dark:bg-purple-900/20 mb-4">
                          <h4 className="font-medium mb-2">Database System</h4>
                          <ul className="list-disc pl-5 text-sm">
                            <li>Efficient video storage with compression</li>
                            <li>Searchable metadata and event logs</li>
                            <li>Automated backup schedule</li>
                          </ul>
                        </div>
                        
                        <div className="border dark:border-gray-700 rounded-lg p-4 bg-amber-50 dark:bg-amber-900/20">
                          <h4 className="font-medium mb-2">Admin Interface</h4>
                          <ul className="list-disc pl-5 text-sm">
                            <li>Monitoring dashboard with alerts</li>
                            <li>User management with role-based access</li>
                            <li>Configuration and maintenance tools</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center z-10 border-4 border-white dark:border-gray-900">
                      <div className="text-center">
                        <div className="font-bold">CCTV</div>
                        <div className="text-xs">Core System</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>Automated Attendance System</CardTitle>
              <CardDescription>How CCTV cameras track and mark attendance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">Attendance Process Flow</h3>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center text-center p-4 border rounded-lg dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <span className="font-bold">1</span>
                        </div>
                        <h4 className="font-medium mb-2">Video Capture</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Cameras capture individuals entering designated areas
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 border rounded-lg dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <span className="font-bold">2</span>
                        </div>
                        <h4 className="font-medium mb-2">Face Detection</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          AI identifies faces in the video feed
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 border rounded-lg dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <span className="font-bold">3</span>
                        </div>
                        <h4 className="font-medium mb-2">Identity Matching</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          System matches faces with student/staff database
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-center text-center p-4 border rounded-lg dark:border-gray-700">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <span className="font-bold">4</span>
                        </div>
                        <h4 className="font-medium mb-2">Attendance Marking</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          System records attendance with timestamp in database
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Key Features</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-6 w-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Contactless Attendance</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">No need for physical contact or cards</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-6 w-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Fraud Prevention</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Prevents proxy attendance and buddy punching</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-6 w-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Real-time Updates</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance data is updated instantly in the system</p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-6 w-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Automated Reporting</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Generates daily, weekly and monthly attendance reports</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Accuracy Metrics</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Face Detection Rate</span>
                          <span className="text-sm font-medium">99.7%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '99.7%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Identity Matching</span>
                          <span className="text-sm font-medium">98.2%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '98.2%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">False Positive Rate</span>
                          <span className="text-sm font-medium">0.05%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '0.05%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Processing Speed</span>
                          <span className="text-sm font-medium">95.8%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '95.8%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>Live Monitoring System</CardTitle>
              <CardDescription>Real-time surveillance and monitoring capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Real-time Monitoring Features</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-4">
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Camera className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Multi-Camera View</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Monitor multiple camera feeds simultaneously with a flexible grid layout
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Intelligent Alerts</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Receive automatic alerts for unauthorized access, unusual activities, or system issues
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Clock className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Time-stamped Recording</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            All footage is time-stamped for accurate record-keeping and easy reference
                          </p>
                        </div>
                      </li>
                      <li className="flex">
                        <div className="mr-4 mt-1">
                          <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <Settings className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">Customizable Controls</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Pan, tilt, zoom and adjust camera settings remotely through the control panel
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Security Monitoring Diagram</h3>
                  </div>
                  <div className="p-6">
                    <div className="relative w-full h-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg border dark:border-gray-700 overflow-hidden">
                      {/* Simplified school layout */}
                      <div className="absolute w-full h-full p-4">
                        {/* Building outline */}
                        <div className="absolute border-2 border-gray-400 dark:border-gray-600 left-[10%] top-[10%] right-[10%] bottom-[10%] rounded-lg"></div>
                        
                        {/* Entrance */}
                        <div className="absolute left-[50%] top-[10%] w-[20%] h-[5%] border-2 border-gray-400 dark:border-gray-600 -translate-x-1/2"></div>
                        
                        {/* Camera locations */}
                        <div className="absolute left-[50%] top-[6%] -translate-x-1/2 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="Entrance Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        <div className="absolute left-[15%] top-[25%] w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="West Wing Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        <div className="absolute right-[15%] top-[25%] w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="East Wing Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        <div className="absolute left-[15%] bottom-[25%] w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="South West Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        <div className="absolute right-[15%] bottom-[25%] w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="South East Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        <div className="absolute left-[50%] bottom-[15%] -translate-x-1/2 w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center" title="Rear Entrance Camera">
                          <Camera className="h-4 w-4 text-red-600" />
                        </div>
                        
                        {/* Coverage indicators */}
                        <div className="absolute left-[50%] top-[6%] -translate-x-1/2 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                        <div className="absolute left-[15%] top-[25%] w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                        <div className="absolute right-[15%] top-[25%] w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                        <div className="absolute left-[15%] bottom-[25%] w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                        <div className="absolute right-[15%] bottom-[25%] w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                        <div className="absolute left-[50%] bottom-[15%] -translate-x-1/2 w-32 h-32 bg-blue-500/10 dark:bg-blue-500/20 rounded-full"></div>
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute bottom-2 right-2 bg-white/80 dark:bg-black/50 p-2 rounded text-xs">
                        <div className="flex items-center mb-1">
                          <div className="w-3 h-3 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mr-1">
                            <Camera className="h-2 w-2 text-red-600" />
                          </div>
                          <span>Camera Location</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500/20 rounded-full mr-1"></div>
                          <span>Coverage Area</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">Monitoring Dashboard Components</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-center mb-3">Live View</h4>
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md mb-3 flex items-center justify-center">
                        <Camera className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Real-time video feeds with multi-camera grid layout
                      </p>
                    </div>
                    
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-center mb-3">Event Log</h4>
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md mb-3 flex flex-col items-center justify-center px-4">
                        <div className="w-full border-b border-gray-300 dark:border-gray-600 py-1 text-xs flex justify-between">
                          <span>08:15</span>
                          <span>Motion Detected - Entrance</span>
                        </div>
                        <div className="w-full border-b border-gray-300 dark:border-gray-600 py-1 text-xs flex justify-between">
                          <span>08:30</span>
                          <span>Attendance Marked - Class A</span>
                        </div>
                        <div className="w-full border-b border-gray-300 dark:border-gray-600 py-1 text-xs flex justify-between">
                          <span>09:15</span>
                          <span>Area Access - Admin Block</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Chronological list of activities and detections
                      </p>
                    </div>
                    
                    <div className="border dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-medium text-center mb-3">Status Monitor</h4>
                      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md mb-3 flex flex-col items-center justify-center px-4">
                        <div className="flex justify-between w-full mb-2">
                          <span className="text-xs">System Health</span>
                          <span className="text-xs text-green-600">Optimal</span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5 mb-3">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                        
                        <div className="flex justify-between w-full mb-2">
                          <span className="text-xs">Storage</span>
                          <span className="text-xs text-yellow-600">78%</span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5 mb-3">
                          <div className="bg-yellow-600 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        
                        <div className="flex justify-between w-full mb-2">
                          <span className="text-xs">Network</span>
                          <span className="text-xs text-green-600">Good</span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
                          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '86%' }}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Health and status of all monitoring systems
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Features Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>AI Capabilities</CardTitle>
              <CardDescription>How our AI enhances the CCTV system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Facial Recognition</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Identifies students and staff with 99.7% accuracy for attendance and security
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Behavior Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Detects unusual activities, gatherings, and safety concerns in real-time
                  </p>
                </div>
                
                <div className="flex flex-col items-center text-center p-6 border rounded-lg dark:border-gray-700">
                  <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Smart Search</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Search vast video archives by person, activity, location, and time
                  </p>
                </div>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">AI Processing Pipeline</h3>
                </div>
                <div className="p-6">
                  <div className="relative">
                    <div className="overflow-x-auto">
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="border dark:border-gray-700 rounded-lg p-4 md:w-1/4">
                          <h4 className="font-medium text-center mb-2">Video Input</h4>
                          <div className="relative rounded-md overflow-hidden mb-3">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-gray-500" />
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            Raw footage from cameras
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        
                        <div className="border dark:border-gray-700 rounded-lg p-4 md:w-1/4">
                          <h4 className="font-medium text-center mb-2">AI Processing</h4>
                          <div className="aspect-video bg-indigo-100 dark:bg-indigo-900/30 rounded-md mb-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            Object detection, face recognition, behavior analysis
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        
                        <div className="border dark:border-gray-700 rounded-lg p-4 md:w-1/4">
                          <h4 className="font-medium text-center mb-2">Data Analysis</h4>
                          <div className="aspect-video bg-green-100 dark:bg-green-900/30 rounded-md mb-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            Pattern recognition and data correlation
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 rotate-90 md:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        
                        <div className="border dark:border-gray-700 rounded-lg p-4 md:w-1/4">
                          <h4 className="font-medium text-center mb-2">Action Outputs</h4>
                          <div className="aspect-video bg-blue-100 dark:bg-blue-900/30 rounded-md mb-3 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                            Alerts, attendance, reports, and archiving
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">AI Search Capabilities</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium">Intelligent Search Criteria</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-sm">Person Search - Find specific individuals</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-sm">Time-based Search - Find events by time</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-sm">Location Search - Search by camera/area</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-sm">Event Search - Find specific activities</span>
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                          <span className="text-sm">Object Search - Find items or objects</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 border-b dark:border-gray-700">
                        <h4 className="font-medium text-sm">Search Demonstration</h4>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-900">
                        <div className="border dark:border-gray-700 rounded-md p-3 mb-4">
                          <div className="flex space-x-2 mb-3">
                            <div className="grow">
                              <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                            <div>
                              <div className="h-8 w-20 bg-blue-500 rounded"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                            <div>
                              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                            <div>
                              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                            <div>
                              <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded"></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <p>Search example: "Find all instances of student ID #1234 in the cafeteria between 12:00-13:00"</p>
                          <ol className="list-decimal ml-4 mt-2 space-y-1">
                            <li>AI identifies the student from database</li>
                            <li>System queries footage from cafeteria cameras</li>
                            <li>Time range is filtered to lunch period</li>
                            <li>Facial recognition processing is applied</li>
                            <li>Results are presented with timestamps</li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card className="dark:border-gray-700">
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>Keeping the CCTV monitoring system running efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Maintenance Schedule</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <h4 className="font-medium">Daily Checks</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                          <li>System health monitoring</li>
                          <li>Camera feed verification</li>
                          <li>Storage space assessment</li>
                          <li>Alert system testing</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <h4 className="font-medium">Weekly Maintenance</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                          <li>Camera lens cleaning</li>
                          <li>Software updates</li>
                          <li>Database optimization</li>
                          <li>Network performance testing</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-4 py-2">
                        <h4 className="font-medium">Monthly Tasks</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                          <li>Hardware inspection</li>
                          <li>Cable connection checks</li>
                          <li>Archival of older footage</li>
                          <li>System configuration review</li>
                        </ul>
                      </div>
                      
                      <div className="border-l-4 border-amber-500 pl-4 py-2">
                        <h4 className="font-medium">Quarterly Maintenance</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                          <li>Full system diagnostics</li>
                          <li>Camera positioning adjustments</li>
                          <li>Major software updates</li>
                          <li>Backup system verification</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-medium">Maintenance Tasks Visual Guide</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-sm mb-2">Hardware Inspection</h4>
                        <ol className="text-xs text-gray-600 dark:text-gray-400 text-left space-y-1">
                          <li>1. Check physical conditions</li>
                          <li>2. Look for damages</li>
                          <li>3. Test power connections</li>
                          <li>4. Verify mounting security</li>
                        </ol>
                      </div>
                      
                      <div className="border dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-sm mb-2">Network Security</h4>
                        <ol className="text-xs text-gray-600 dark:text-gray-400 text-left space-y-1">
                          <li>1. Update system passwords</li>
                          <li>2. Check access control</li>
                          <li>3. Scan for vulnerabilities</li>
                          <li>4. Verify secure connections</li>
                        </ol>
                      </div>
                      
                      <div className="border dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-sm mb-2">Data Management</h4>
                        <ol className="text-xs text-gray-600 dark:text-gray-400 text-left space-y-1">
                          <li>1. Archive older footage</li>
                          <li>2. Clean up temporary files</li>
                          <li>3. Optimize storage usage</li>
                          <li>4. Test backup recovery</li>
                        </ol>
                      </div>
                      
                      <div className="border dark:border-gray-700 rounded-lg p-4 flex flex-col items-center text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-sm mb-2">Software Updates</h4>
                        <ol className="text-xs text-gray-600 dark:text-gray-400 text-left space-y-1">
                          <li>1. Check for updates</li>
                          <li>2. Test updates in staging</li>
                          <li>3. Deploy to production</li>
                          <li>4. Verify functionality</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b dark:border-gray-700">
                  <h3 className="text-lg font-medium">Troubleshooting Guide</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 border-b dark:border-gray-700 flex items-center">
                        <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                        <h4 className="font-medium text-red-800 dark:text-red-400">Camera Feed Interruption</h4>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Symptoms</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>Black screen on camera feed</li>
                              <li>Frozen image on display</li>
                              <li>"No Signal" error</li>
                              <li>Intermittent feed loss</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Possible Causes</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>Power supply issues</li>
                              <li>Network connectivity problems</li>
                              <li>Camera hardware failure</li>
                              <li>Cable damage or disconnection</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Solutions</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>Check power connections</li>
                              <li>Verify network connectivity</li>
                              <li>Inspect cable connections</li>
                              <li>Restart camera and system</li>
                              <li>Replace hardware if necessary</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-amber-50 dark:bg-amber-900/20 px-4 py-2 border-b dark:border-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h4 className="font-medium text-amber-800 dark:text-amber-400">Storage System Warnings</h4>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="text-sm font-medium mb-2">Symptoms</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>"Low Storage" warnings</li>
                              <li>Slow system performance</li>
                              <li>Missing recordings</li>
                              <li>Premature footage deletion</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Possible Causes</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>Insufficient storage capacity</li>
                              <li>Improper retention settings</li>
                              <li>Storage hardware issues</li>
                              <li>Database fragmentation</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium mb-2">Solutions</h5>
                            <ul className="list-disc pl-5 text-xs text-gray-600 dark:text-gray-400">
                              <li>Add additional storage</li>
                              <li>Adjust retention policies</li>
                              <li>Archive older footage</li>
                              <li>Optimize video compression</li>
                              <li>Repair/replace storage hardware</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CCTVHowItWorks;
