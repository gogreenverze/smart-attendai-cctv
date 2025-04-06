
import React from 'react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/use-pwa';
import { Download, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PWAPrompt: React.FC = () => {
  const { isInstallable, isUpdateAvailable, promptInstall, applyUpdate } = usePWA();

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result) {
      toast({
        title: "Installation Started",
        description: "The app is being installed on your device.",
      });
    }
  };

  const handleUpdate = () => {
    applyUpdate();
    toast({
      title: "Updating",
      description: "The app is updating to the latest version.",
    });
  };

  if (!isInstallable && !isUpdateAvailable) return null;

  return (
    <div className="fixed bottom-16 right-4 z-50 md:bottom-4">
      {isInstallable && (
        <Button 
          onClick={handleInstall} 
          className="mb-2 bg-school-primary hover:bg-school-primary/90 text-white flex items-center gap-2"
        >
          <Download size={16} />
          Install App
        </Button>
      )}
      
      {isUpdateAvailable && (
        <Button 
          onClick={handleUpdate} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Update Available
        </Button>
      )}
    </div>
  );
};
