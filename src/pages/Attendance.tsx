
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar as CalendarIcon, 
  CalendarDays, 
  ChevronDown, 
  Download, 
  FileText, 
  Printer, 
  Search, 
  Camera, 
  UserCheck 
} from 'lucide-react';

// Mock data for students in a class
const studentsData = [
  { id: 1, name: 'Amit Sharma', status: 'present', rollNumber: '10A01', photo: '/placeholder.svg' },
  { id: 2, name: 'Priya Patel', status: 'present', rollNumber: '10A02', photo: '/placeholder.svg' },
  { id: 3, name: 'Rahul Singh', status: 'absent', rollNumber: '10A03', photo: '/placeholder.svg' },
  { id: 4, name: 'Neha Verma', status: 'present', rollNumber: '10A04', photo: '/placeholder.svg' },
  { id: 5, name: 'Vikram Malhotra', status: 'present', rollNumber: '10A05', photo: '/placeholder.svg' },
  { id: 6, name: 'Sonia Gupta', status: 'absent', rollNumber: '10A06', photo: '/placeholder.svg' },
  { id: 7, name: 'Rajesh Kumar', status: 'present', rollNumber: '10A07', photo: '/placeholder.svg' },
  { id: 8, name: 'Ananya Desai', status: 'present', rollNumber: '10A08', photo: '/placeholder.svg' },
  { id: 9, name: 'Kiran Reddy', status: 'late', rollNumber: '10A09', photo: '/placeholder.svg' },
  { id: 10, name: 'Deepak Joshi', status: 'present', rollNumber: '10A10', photo: '/placeholder.svg' },
];

// Mock data for classes
const classesList = [
  { id: 1, name: 'Class 10A' },
  { id: 2, name: 'Class 9B' },
  { id: 3, name: 'Class 8C' },
  { id: 4, name: 'Class 11A' },
  { id: 5, name: 'Class 7B' },
];

type AttendanceStatus = 'present' | 'absent' | 'late';

interface Student {
  id: number;
  name: string;
  status: AttendanceStatus;
  rollNumber: string;
  photo: string;
}

const Attendance: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceMode, setAttendanceMode] = useState<string>('manual');
  const [students, setStudents] = useState<Student[]>(studentsData);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { toast } = useToast();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.filter(s => s.status === 'absent').length;
  const lateCount = students.filter(s => s.status === 'late').length;
  const attendancePercentage = Math.round((presentCount / students.length) * 100);

  const handleStatusChange = (studentId: number, status: AttendanceStatus) => {
    setStudents(students.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));
  };

  const handleCCTVAttendance = () => {
    toast({
      title: "CCTV Attendance Initiated",
      description: "Starting facial recognition scan for attendance marking",
    });
    
    // Simulate attendance marking via CCTV after a delay
    setTimeout(() => {
      toast({
        title: "Attendance Marked via CCTV",
        description: "Facial recognition completed successfully",
      });
    }, 2000);
  };

  const handleSaveAttendance = () => {
    toast({
      title: "Attendance Saved",
      description: `Attendance for ${selectedClass || 'selected class'} has been recorded`,
    });
  };

  const handleExport = (format: string) => {
    toast({
      title: `Export as ${format.toUpperCase()}`,
      description: "Attendance report would be exported here",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Attendance Management</h1>
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {date ? format(date, 'PPP') : 'Pick a date'}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classesList.map(cls => (
                <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              In {selectedClass || 'selected class'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-green-600">{presentCount}</div>
            <div className="text-sm text-green-600">{attendancePercentage}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{absentCount}</div>
            <p className="text-xs text-red-600">
              {Math.round((absentCount / students.length) * 100)}% of class
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{lateCount}</div>
            <p className="text-xs text-amber-600">
              {Math.round((lateCount / students.length) * 100)}% of class
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <div>
              <CardTitle>Attendance Sheet</CardTitle>
              <CardDescription>
                {date ? format(date, 'MMMM d, yyyy') : 'Today'} • {selectedClass || 'Select a class'}
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Select value={attendanceMode} onValueChange={setAttendanceMode}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Attendance mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="cctv">CCTV-based</SelectItem>
                  <SelectItem value="rfid">RFID</SelectItem>
                </SelectContent>
              </Select>
              {attendanceMode === 'cctv' && (
                <Button onClick={handleCCTVAttendance} className="btn-primary">
                  <Camera className="h-4 w-4 mr-2" />
                  Start CCTV Scan
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mark">
            <TabsList className="mb-4">
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="history">Attendance History</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="mark">
              <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-8"
                    placeholder="Search by name or roll number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox id="select-all" />
                      </TableHead>
                      <TableHead>Roll No.</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No students found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox id={`student-${student.id}`} />
                          </TableCell>
                          <TableCell>{student.rollNumber}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                                <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
                              </div>
                              <span>{student.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                student.status === 'present' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                student.status === 'absent' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                                'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }
                            >
                              {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`text-xs px-2 ${student.status === 'present' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
                                onClick={() => handleStatusChange(student.id, 'present')}
                              >
                                Present
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`text-xs px-2 ${student.status === 'absent' ? 'bg-red-100 text-red-800 hover:bg-red-200' : ''}`}
                                onClick={() => handleStatusChange(student.id, 'absent')}
                              >
                                Absent
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`text-xs px-2 ${student.status === 'late' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : ''}`}
                                onClick={() => handleStatusChange(student.id, 'late')}
                              >
                                Late
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button className="btn-primary" onClick={handleSaveAttendance}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Save Attendance
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="flex items-center justify-center h-64 border rounded-md">
                <div className="text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Attendance History</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    View past attendance records for this class
                  </p>
                  <Button className="mt-4" variant="outline">
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Show Calendar View
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reports">
              <div className="flex items-center justify-center h-64 border rounded-md">
                <div className="text-center">
                  <FileText className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">Attendance Reports</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Generate detailed attendance reports
                  </p>
                  <Button className="mt-4" onClick={() => handleExport('excel')}>
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
