
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Download, FileText, Printer, Filter } from 'lucide-react';

// Mock data for attendance by class
const attendanceByClassData = [
  { name: 'Class 10A', present: 95, absent: 5 },
  { name: 'Class 9B', present: 88, absent: 12 },
  { name: 'Class 8C', present: 92, absent: 8 },
  { name: 'Class 11A', present: 85, absent: 15 },
  { name: 'Class 7B', present: 90, absent: 10 },
];

// Mock data for attendance trend
const attendanceTrendData = [
  { date: 'Mon', attendance: 92 },
  { date: 'Tue', attendance: 94 },
  { date: 'Wed', attendance: 91 },
  { date: 'Thu', attendance: 89 },
  { date: 'Fri', attendance: 95 },
];

// Mock data for attendance by gender
const attendanceByGenderData = [
  { name: 'Boys', value: 525 },
  { name: 'Girls', value: 625 },
];

// Mock data for CCTV usage
const cctvUsageData = [
  { name: 'Attendance Marking', value: 45 },
  { name: 'Security Monitoring', value: 25 },
  { name: 'Student Behavior', value: 15 },
  { name: 'Other', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const GENDER_COLORS = ['#1a56db', '#e83e8c'];
const CCTV_COLORS = ['#1a56db', '#fd7e14', '#20c997', '#6c757d'];

const Reports: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState('week');
  const [selectedClass, setSelectedClass] = useState('all');
  
  const { toast } = useToast();

  const handleExport = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: "Report would be exported here",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Print Report",
      description: "Report would be sent to printer",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Select defaultValue="pdf" onValueChange={handleExport}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Export As" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Export as PDF</SelectItem>
              <SelectItem value="excel">Export as Excel</SelectItem>
              <SelectItem value="csv">Export as CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Report Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="attendance">Attendance Report</SelectItem>
                <SelectItem value="cctv">CCTV Usage Report</SelectItem>
                <SelectItem value="student">Student Performance</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Date Range</CardTitle>
          </CardHeader>
          <CardContent className="flex space-x-2">
            <div className="flex-1">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-10 p-0">
                  <Calendar className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Class Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="10A">Class 10A</SelectItem>
                <SelectItem value="9B">Class 9B</SelectItem>
                <SelectItem value="8C">Class 8C</SelectItem>
                <SelectItem value="11A">Class 11A</SelectItem>
                <SelectItem value="7B">Class 7B</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Report Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Report</TabsTrigger>
          <TabsTrigger value="charts">Charts & Graphs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Class</CardTitle>
                <CardDescription>
                  Present vs Absent for {dateRange === 'day' ? 'Today' : 
                                         dateRange === 'week' ? 'This Week' : 
                                         dateRange === 'month' ? 'This Month' : 'Selected Period'}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={attendanceByClassData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#1a56db" name="Present %" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
                <CardDescription>
                  Daily attendance percentage
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={attendanceTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#1a56db" 
                      activeDot={{ r: 8 }}
                      name="Attendance %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Gender</CardTitle>
                <CardDescription>
                  Distribution of student attendance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={attendanceByGenderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {attendanceByGenderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>CCTV System Usage</CardTitle>
                <CardDescription>
                  Breakdown of CCTV system utilization
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cctvUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {cctvUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CCTV_COLORS[index % CCTV_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle>Detailed Report</CardTitle>
                  <CardDescription>
                    {reportType === 'attendance' ? 'Attendance Report' : 
                     reportType === 'cctv' ? 'CCTV Usage Report' : 'Student Performance Report'} for {
                      dateRange === 'day' ? 'Today' : 
                      dateRange === 'week' ? 'This Week' : 
                      dateRange === 'month' ? 'This Month' : 'Selected Period'
                    }
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Input 
                      placeholder="Search report..." 
                      className="pl-8 w-[200px]"
                    />
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Detailed Report</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  This section would show a detailed tabular report based on selected filters and report type.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button onClick={() => handleExport('pdf')} className="btn-primary">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Full Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Customizable Charts</CardTitle>
              <CardDescription>
                Create visual representations of your data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700">Chart Builder</h3>
                <p className="text-gray-500 max-w-md mt-2">
                  This section would allow creating custom charts and graphs from attendance and CCTV data.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button className="btn-primary">
                    Generate New Chart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
