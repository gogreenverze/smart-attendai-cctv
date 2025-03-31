
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Camera, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Mock data for the dashboard
const stats = {
  todayAttendance: 92,
  totalStudents: 1250,
  totalTeachers: 45,
  activeCameras: 12,
  classes: 28,
  alerts: 3
};

const recentActivities = [
  { id: 1, type: 'attendance', message: 'Class 10A attendance marked by Kumar S.', time: '12 min ago' },
  { id: 2, type: 'alert', message: 'Motion detected in Lab Area after hours', time: '25 min ago' },
  { id: 3, type: 'cctv', message: 'New CCTV footage archived for Class 9B', time: '1 hour ago' },
  { id: 4, type: 'attendance', message: 'Class 8C attendance completed with 90% presence', time: '2 hours ago' },
  { id: 5, type: 'alert', message: 'Student ID #1240 flagged for consecutive absences', time: '3 hours ago' }
];

const upcomingClasses = [
  { id: 1, class: 'Class 9A - Mathematics', time: '10:00 AM', teacher: 'Mr. Kumar' },
  { id: 2, class: 'Class 10B - Physics', time: '11:30 AM', teacher: 'Mrs. Sharma' },
  { id: 3, class: 'Class 8C - English', time: '01:15 PM', teacher: 'Ms. Gupta' },
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Content visibility based on role
  const showClassStats = ['admin', 'teacher'].includes(user?.role || '');
  const showCameraStats = ['admin', 'cctv_operator'].includes(user?.role || '');
  const showUpcomingClasses = ['admin', 'teacher'].includes(user?.role || '');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          <Clock className="inline mr-1" size={16} />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-school-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAttendance}%</div>
            <Progress value={stats.todayAttendance} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.todayAttendance > 90 ? 'Good attendance rate' : 'Attendance below target'}
            </p>
          </CardContent>
        </Card>

        {showClassStats && (
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students & Classes</CardTitle>
              <Users className="h-4 w-4 text-school-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across {stats.classes} classes and {stats.totalTeachers} teachers
              </p>
            </CardContent>
          </Card>
        )}

        {showCameraStats && (
          <Card className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CCTV Monitoring</CardTitle>
              <Camera className="h-4 w-4 text-school-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeCameras} Active</div>
              <p className="text-xs text-muted-foreground">
                {stats.alerts} alerts in the last 24 hours
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest events from the attendance system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 text-sm">
                  <div className="mt-0.5">
                    {activity.type === 'attendance' ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : activity.type === 'alert' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Camera className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.message}</p>
                    <p className="text-gray-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        {showUpcomingClasses && (
          <Card className="card-hover">
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Today's scheduled sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium text-gray-800">{cls.class}</p>
                    <div className="flex justify-between mt-1 text-sm">
                      <span className="text-gray-600">{cls.time}</span>
                      <span className="text-school-primary">{cls.teacher}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
