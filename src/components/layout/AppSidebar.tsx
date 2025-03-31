
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Camera, 
  BarChart, 
  Search, 
  Settings, 
  User,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Toggle } from '@/components/ui/toggle';

const AppSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;

  // Define menu items based on user role
  const getMenuItems = () => {
    const allItems = [
      { title: "Dashboard", path: "/dashboard", icon: Home, roles: ['admin', 'teacher', 'student', 'parent', 'cctv_operator'] },
      { title: "Users", path: "/users", icon: Users, roles: ['admin'] },
      { title: "Classes", path: "/classes", icon: BookOpen, roles: ['admin', 'teacher'] },
      { title: "Attendance", path: "/attendance", icon: Calendar, roles: ['admin', 'teacher', 'student', 'parent'] },
      { title: "CCTV Monitoring", path: "/cctv", icon: Camera, roles: ['admin', 'cctv_operator'] },
      { title: "Reports", path: "/reports", icon: BarChart, roles: ['admin', 'teacher', 'parent'] },
      { title: "AI Search", path: "/search", icon: Search, roles: ['admin', 'cctv_operator'] },
      { title: "Settings", path: "/settings", icon: Settings, roles: ['admin'] },
    ];

    return allItems.filter(item => 
      user?.role && item.roles.includes(user.role as any)
    );
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => {
    return currentPath === path;
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Sidebar className="bg-school-primary text-white border-r-0">
      <SidebarHeader className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <img 
            src="/placeholder.svg" 
            alt="School Logo" 
            className="h-8 w-8 bg-white rounded-full p-1"
          />
          <div>
            <h1 className="font-bold text-lg">Banadurai</h1>
            <p className="text-xs opacity-80">Attendance System</p>
          </div>
        </div>
        <SidebarTrigger className="text-white hover:bg-white/10" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={`${isActive(item.path) ? 'bg-white/10' : 'hover:bg-white/5'}`}>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-white/10">{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs opacity-80 capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
            <Toggle 
              pressed={theme === 'dark'} 
              onPressedChange={toggleTheme}
              className="hover:bg-white/10 text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </Toggle>
          </div>
          <div>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="hover:bg-white/5">
                  <Link to="/profile" className="flex items-center gap-3">
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} className="hover:bg-white/5">
                  <div className="flex items-center gap-3">
                    <LogOut size={18} />
                    <span>Logout</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
