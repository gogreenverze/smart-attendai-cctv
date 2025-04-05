
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDatabase } from '@/database/connection';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize mock database when the index page loads
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Mock database initialized successfully');
        toast({
          title: "Database Initialized",
          description: "Browser-compatible mock database is ready.",
        });
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
    
    // Redirect to login page instead of dashboard
    navigate('/login');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Initializing database and redirecting to login...</p>
    </div>
  );
};

export default Index;
