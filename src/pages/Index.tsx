
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeDatabase } from '@/database/connection';

const Index: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialize database when the index page loads
    const setupDatabase = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    setupDatabase();
    
    // Redirect to dashboard page
    navigate('/dashboard');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Initializing database and redirecting to dashboard...</p>
    </div>
  );
};

export default Index;
