
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch as SwitchUI } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Settings, Server, Database, RefreshCw, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';

interface CCTVAdminControlsProps {
  isAdmin: boolean;
}

export const CCTVAdminControls: React.FC<CCTVAdminControlsProps> = ({ isAdmin }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('security');
  const [retentionDays, setRetentionDays] = useState<number[]>([30]);
  const [isBackupEnabled, setIsBackupEnabled] = useState(true);
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(true);
  const [isMultiFactorEnabled, setIsMultiFactorEnabled] = useState(false);
  const [storageUsage, setStorageUsage] = useState(42); // Percentage used
  const [isSaving, setIsSaving] = useState(false);
  const [accessLogs, setAccessLogs] = useState([
    { id: 1, user: 'admin@school.com', action: 'Configured camera', timestamp: '2025-04-07 09:45:23', ip: '192.168.1.103' },
    { id: 2, user: 'operator@school.com', action: 'Viewed live feed', timestamp: '2025-04-07 08:30:12', ip: '192.168.1.105' },
    { id: 3, user: 'admin@school.com', action: 'Updated retention policy', timestamp: '2025-04-06 17:14:52', ip: '192.168.1.103' },
  ]);

  if (!isAdmin) {
    return null;
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings saved",
        description: "Your CCTV system settings have been updated successfully."
      });
    }, 1500);
  };

  const handlePurgeOldData = () => {
    toast({
      title: "Confirmation Required",
      description: "This will permanently delete footage older than the retention period. Are you sure?",
      action: (
        <div className="flex space-x-2">
          <Button size="sm" variant="destructive" onClick={() => 
            toast({
              title: "Data Purge Initiated",
              description: "The system is purging old footage. This may take a few minutes."
            })
          }>
            Yes, Delete
          </Button>
          <Button size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      )
    });
  };

  const handleToggleEncryption = (enabled: boolean) => {
    setIsEncryptionEnabled(enabled);
    if (enabled) {
      toast({
        title: "Encryption Enabled",
        description: "All new footage will be encrypted. This may impact system performance."
      });
    } else {
      toast({
        variant: "destructive",
        title: "Warning: Encryption Disabled",
        description: "Your CCTV footage will no longer be encrypted. This may pose security risks."
      });
    }
  };

  return (
    <Card className="dark-mode-transition dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-amber-500" />
            CCTV Administrative Controls
          </CardTitle>
          <CardDescription>Advanced settings for system administrators</CardDescription>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="security" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="storage">
              <Database className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger value="network">
              <Server className="h-4 w-4 mr-2" />
              Network
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Settings className="h-4 w-4 mr-2" />
              System Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="encryption">End-to-End Encryption</Label>
                    <SwitchUI 
                      id="encryption"
                      checked={isEncryptionEnabled} 
                      onCheckedChange={handleToggleEncryption} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Encrypts all footage during transmission and storage
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="mfa">Multi-Factor Authentication</Label>
                    <SwitchUI 
                      id="mfa"
                      checked={isMultiFactorEnabled} 
                      onCheckedChange={setIsMultiFactorEnabled} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all CCTV operator accounts
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="access-level">Access Control Level</Label>
                  <Select defaultValue="strict">
                    <SelectTrigger id="access-level">
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal (View Only)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="strict">Strict</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Controls permissions for non-admin users
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
                  <Select defaultValue="aes256" disabled={!isEncryptionEnabled}>
                    <SelectTrigger id="encryption-algorithm">
                      <SelectValue placeholder="Select algorithm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aes128">AES-128</SelectItem>
                      <SelectItem value="aes256">AES-256 (Recommended)</SelectItem>
                      <SelectItem value="chacha20">ChaCha20-Poly1305</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="auth-expiry">Authentication Expiry</Label>
                  <Select defaultValue="8h">
                    <SelectTrigger id="auth-expiry">
                      <SelectValue placeholder="Select expiry time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="4h">4 Hours</SelectItem>
                      <SelectItem value="8h">8 Hours</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Time before requiring re-authentication
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ip-restrictions">IP Restrictions</Label>
                  <Input 
                    id="ip-restrictions"
                    placeholder="e.g. 192.168.1.0/24" 
                    defaultValue="192.168.1.0/24, 10.0.0.0/8"
                  />
                  <p className="text-sm text-muted-foreground">
                    Restrict access to specific IP ranges (comma separated)
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Data Retention Period (Days)</Label>
                    <span className="font-medium">{retentionDays[0]} days</span>
                  </div>
                  <Slider
                    value={retentionDays}
                    min={7}
                    max={90}
                    step={1}
                    onValueChange={setRetentionDays}
                  />
                  <p className="text-sm text-muted-foreground">
                    Footage older than this will be automatically purged
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="backup">Automatic Backup</Label>
                    <SwitchUI 
                      id="backup"
                      checked={isBackupEnabled} 
                      onCheckedChange={setIsBackupEnabled} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Backup critical footage to secondary storage
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="backup-schedule">Backup Schedule</Label>
                  <Select defaultValue="daily" disabled={!isBackupEnabled}>
                    <SelectTrigger id="backup-schedule">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex justify-between">
                    <span>Storage Usage</span>
                    <span className={storageUsage > 80 ? "text-destructive" : ""}>
                      {storageUsage}% of 2TB
                    </span>
                  </Label>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-2 ${
                        storageUsage > 90 ? "bg-destructive" : 
                        storageUsage > 70 ? "bg-amber-500" : 
                        "bg-green-500"
                      }`}
                      style={{ width: `${storageUsage}%` }}
                    ></div>
                  </div>
                  {storageUsage > 80 && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Storage space is running low
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="compression">Video Compression</Label>
                  <Select defaultValue="h265">
                    <SelectTrigger id="compression">
                      <SelectValue placeholder="Select compression" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="h264">H.264</SelectItem>
                      <SelectItem value="h265">H.265/HEVC (Better Compression)</SelectItem>
                      <SelectItem value="av1">AV1 (Best Compression)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  variant="destructive" 
                  className="w-full mt-8"
                  onClick={handlePurgeOldData}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Purge Old Data
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="proxy">Proxy Configuration</Label>
                  <Input 
                    id="proxy"
                    placeholder="proxy.example.com:8080" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bandwidth">Bandwidth Limit</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="bandwidth">
                      <SelectValue placeholder="Select limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Limit</SelectItem>
                      <SelectItem value="low">Low (1 Mbps)</SelectItem>
                      <SelectItem value="medium">Medium (5 Mbps)</SelectItem>
                      <SelectItem value="high">High (10 Mbps)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="https">Enforce HTTPS</Label>
                    <SwitchUI 
                      id="https"
                      checked={true} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require secure connections for all camera feeds
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rtsp-port">RTSP Port</Label>
                  <Input 
                    id="rtsp-port"
                    type="number" 
                    defaultValue="554"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="discovery">Camera Discovery Protocol</Label>
                  <Select defaultValue="onvif">
                    <SelectTrigger id="discovery">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onvif">ONVIF</SelectItem>
                      <SelectItem value="upnp">UPnP</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="firewall">Network Firewall</Label>
                    <SwitchUI 
                      id="firewall"
                      checked={true} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enable internal firewall for camera network
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="rounded-md border">
              <div className="flex items-center p-3 bg-muted/50">
                <div className="w-1/4 font-medium">User</div>
                <div className="w-1/3 font-medium">Action</div>
                <div className="w-1/4 font-medium">Timestamp</div>
                <div className="w-1/6 font-medium">IP Address</div>
              </div>
              <div className="divide-y">
                {accessLogs.map(log => (
                  <div key={log.id} className="flex items-center p-3 hover:bg-muted/30">
                    <div className="w-1/4 truncate">{log.user}</div>
                    <div className="w-1/3 truncate">{log.action}</div>
                    <div className="w-1/4 truncate">{log.timestamp}</div>
                    <div className="w-1/6 truncate">{log.ip}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Logs
              </Button>
              <Button variant="outline">
                Export All Logs
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <div className="flex items-center text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
          System status: Operational
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Restart CCTV System
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CCTVAdminControls;
