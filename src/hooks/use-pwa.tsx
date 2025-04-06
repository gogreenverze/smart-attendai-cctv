
import { useState, useEffect } from 'react';

// Type for BeforeInstallPromptEvent which is not in standard TypeScript defs
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is installed (different methods for different platforms)
    const checkIfInstalled = () => {
      // For iOS using standalone mode detection
      if (window.navigator.standalone) {
        setIsInstalled(true);
        return;
      }

      // For Android/Chrome using display-mode media query
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
    };

    // Listen for the beforeinstallprompt event to detect if app can be installed
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Store the event for later use
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for app install
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('PWA installed successfully');
    };

    // Listen for service worker updates
    const handleServiceWorkerUpdate = () => {
      setIsUpdateAvailable(true);
    };

    // Set up event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if service worker is controlling the page, which means it's installed
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // Set up a listener to detect when the service worker has an update
      navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
    }

    // Check initial state
    checkIfInstalled();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return false;

    // Show the install prompt
    await installPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await installPrompt.userChoice;
    
    // User accepted the prompt
    if (choiceResult.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
      return true;
    }
    
    // User dismissed the prompt
    return false;
  };

  const applyUpdate = () => {
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      // Send a message to the service worker to skip waiting
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      setIsUpdateAvailable(false);
    }
  };

  return {
    isInstallable: Boolean(installPrompt),
    isInstalled,
    isUpdateAvailable,
    promptInstall,
    applyUpdate
  };
}
