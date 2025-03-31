
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  Calendar, 
  Settings,
  User,
  BookOpen,
  Camera,
  BarChart,
  Search
} from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;

  // Define menu items based on user role
  const getMenuItems = () => {
    const allItems = [
      { title: "Dashboard", path: "/dashboard", icon: Home, roles: ['admin', 'teacher', 'student', 'parent', 'cctv_operator'] },
      { title: "Users", path: "/users", icon: Users, roles: ['admin'] },
      { title: "Classes", path: "/classes", icon: BookOpen, roles: ['admin', 'teacher'] },
      { title: "Attendance", path: "/attendance", icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
      { title: "CCTV", path: "/cctv", icon: Camera, roles: ['admin', 'cctv_operator'] },
      { title: "Reports", path: "/reports", icon: BarChart, roles: ['admin', 'teacher', 'parent'] },
      { title: "Search", path: "/search", icon: Search, roles: ['admin', 'cctv_operator'] },
      { title: "Profile", path: "/profile", icon: User, roles: ['admin', 'teacher', 'student', 'parent', 'cctv_operator'] },
    ];

    return allItems.filter(item => 
      user?.role && item.roles.includes(user.role as any)
    ).slice(0, 5); // Limit to 5 items for mobile nav
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="mobile-nav md:hidden">
      <div className="grid grid-cols-5 h-16">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.path} 
            className={`flex flex-col items-center justify-center p-2 ${
              isActive(item.path) 
                ? 'text-primary' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon size={20} />
            <span className="text-xs mt-1">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNavigation;
