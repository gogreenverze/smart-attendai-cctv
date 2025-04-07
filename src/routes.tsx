
import React from 'react';
import { useRoutes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import CCTVMonitoring from './pages/CCTVMonitoring';
import CCTVHowItWorks from './pages/CCTVHowItWorks';
import Reports from './pages/Reports';
import AISearch from './pages/AISearch';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import TeacherDashboard from './pages/TeacherDashboard';
import Homework from './pages/Homework';

export const AppRoutes = () => {
  const routes = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/users', element: <Users /> },
    { path: '/classes', element: <Classes /> },
    { path: '/attendance', element: <Attendance /> },
    { path: '/cctv', element: <CCTVMonitoring /> },
    { path: '/cctv-how-it-works', element: <CCTVHowItWorks /> },
    { path: '/reports', element: <Reports /> },
    { path: '/search', element: <AISearch /> },
    { path: '/settings', element: <Settings /> },
    { path: '/login', element: <Login /> },
    { path: '/teacher-dashboard', element: <TeacherDashboard /> },
    { path: '/homework', element: <Homework /> },
    { path: '*', element: <NotFound /> }
  ]);
  
  return routes;
};
