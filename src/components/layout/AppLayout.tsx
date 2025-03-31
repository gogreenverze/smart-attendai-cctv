
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppSidebar from './AppSidebar';
import MobileNavigation from './MobileNavigation';
import { SidebarProvider } from '@/components/ui/sidebar';
import { initializeDatabase } from '@/database/connection';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const AppLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Initialize mock database when the application starts
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Mock database initialized successfully in AppLayout');
      } catch (error) {
        console.error('Failed to initialize mock database:', error);
        toast({
          variant: "destructive",
          title: "Database Error",
          description: "Failed to initialize mock database. Please refresh the page.",
        });
      }
    };

    setupDatabase();
  }, []);

  useEffect(() => {
    // Add class to body for PWA padding
    if (isMobile) {
      document.body.classList.add('has-mobile-nav');
    } else {
      document.body.classList.remove('has-mobile-nav');
    }
    
    return () => {
      document.body.classList.remove('has-mobile-nav');
    };
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-pulse-slow">
          <h2 className="text-2xl font-semibold text-school-primary">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <main className="container mx-auto py-6 px-4 pb-20 md:pb-6">
            <Outlet />
          </main>
        </div>
        <MobileNavigation />
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
