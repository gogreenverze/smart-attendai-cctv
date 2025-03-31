import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Clock, Database, Bell, Shield, Moon, Sun, Upload, DownloadCloud, Save } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [attendanceReminders, setAttendanceReminders] = useState(true);
  const [maximumBackupSize, setMaximumBackupSize] = useState(500);
  const [dataRetentionPeriod, setDataRetentionPeriod] = useState(365);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  const handleBackupNow = () => {
    toast({
      title: "Backup started",
      description: "Database backup has been initiated. This may take a few moments.",
    });
    
    // Simulate backup completion
    setTimeout(() => {
      toast({
        title: "Backup completed",
        description: "Database has been backed up successfully.",
      });
    }, 2000);
  };

  const handleRestoreBackup = () => {
    toast({
      title: "Restore initiated",
      description: "Please select a backup file to restore.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage general application settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="text-sm text-muted-foreground">
                      Choose between light and dark mode.
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sun className="h-5 w-5" />
                    <Switch 
                      id="theme" 
                      checked={theme === 'dark'} 
                      onCheckedChange={toggleTheme}
                    />
                    <Moon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="attendance-reminders">Attendance Reminders</Label>
                    <div className="text-sm text-muted-foreground">
                      Send reminders for teachers to mark attendance.
                    </div>
                  </div>
                  <Switch 
                    id="attendance-reminders" 
                    checked={attendanceReminders}
                    onCheckedChange={setAttendanceReminders}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <select 
                    id="timezone" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="UTC">UTC</option>
                    <option value="IST">India Standard Time (UTC+5:30)</option>
                    <option value="EST">Eastern Standard Time (UTC-5)</option>
                    <option value="PST">Pacific Standard Time (UTC-8)</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications via email.
                    </div>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="app-notifications">In-App Notifications</Label>
                    <div className="text-sm text-muted-foreground">
                      Receive notifications within the application.
                    </div>
                  </div>
                  <Switch 
                    id="app-notifications" 
                    checked={appNotifications}
                    onCheckedChange={setAppNotifications}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notification-frequency">Notification Frequency</Label>
                <select 
                  id="notification-frequency" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="realtime">Real-time</option>
                  <option value="hourly">Hourly Digest</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Digest</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Settings</CardTitle>
              <CardDescription>Manage database backups and maintenance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-backup">Automatic Backups</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically backup the database daily.
                    </div>
                  </div>
                  <Switch 
                    id="auto-backup" 
                    checked={autoBackup}
                    onCheckedChange={setAutoBackup}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="max-backup-size">Maximum Backup Size (MB)</Label>
                <Input 
                  id="max-backup-size" 
                  type="number" 
                  value={maximumBackupSize}
                  onChange={(e) => setMaximumBackupSize(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Input 
                  id="data-retention" 
                  type="number" 
                  value={dataRetentionPeriod}
                  onChange={(e) => setDataRetentionPeriod(parseInt(e.target.value) || 0)}
                />
              </div>

              <Separator />

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button onClick={handleBackupNow} className="flex items-center">
                  <DownloadCloud className="mr-2 h-4 w-4" />
                  Backup Now
                </Button>
                <Button onClick={handleRestoreBackup} variant="outline" className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  Restore Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage security and privacy settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable two-factor authentication for enhanced security.
                    </div>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue={90} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue={30} />
              </div>

              <Separator />

              <Button variant="destructive" className="w-full sm:w-auto">
                Reset All Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center">
          {isSaving ? (
            <>Saving...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Settings;
