
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import StudentClassSelection from '@/components/login/StudentClassSelection';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showClassSelection, setShowClassSelection] = useState(false);
  const { login, isLoading, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    
    if (success) {
      // If student, check if they already have class/section saved
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.role === 'student') {
          const savedClass = localStorage.getItem(`student_${userData.id}_class`);
          const savedSection = localStorage.getItem(`student_${userData.id}_section`);
          
          if (savedClass && savedSection) {
            navigate('/dashboard');
          } else {
            // Show class selection
            setShowClassSelection(true);
          }
        } else {
          // For non-students, go directly to dashboard
          navigate('/dashboard');
        }
      }
    }
  };

  const handleClassSelectionComplete = (classId: string, sectionId: string) => {
    navigate('/dashboard');
  };

  const handleDemoLogin = async (role: string) => {
    let demoEmail = '';
    switch(role) {
      case 'admin':
        demoEmail = 'admin@banadurai.edu';
        break;
      case 'teacher':
        demoEmail = 'teacher@banadurai.edu';
        break;
      case 'student':
        demoEmail = 'student@banadurai.edu';
        break;
      case 'parent':
        demoEmail = 'parent@banadurai.edu';
        break;
      case 'cctv':
        demoEmail = 'cctv@banadurai.edu';
        break;
    }
    
    const success = await login(demoEmail, 'password');
    if (success) {
      if (role === 'student') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const savedClass = localStorage.getItem(`student_${userData.id}_class`);
          const savedSection = localStorage.getItem(`student_${userData.id}_section`);
          
          if (savedClass && savedSection) {
            navigate('/dashboard');
          } else {
            setShowClassSelection(true);
          }
        }
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-school-light to-white dark:from-school-dark dark:to-gray-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleTheme}
          className="rounded-full bg-white/10 border-white/20 hover:bg-white/20"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
        </Button>
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/1f4f9fa5-0aaa-4bad-a14a-688644038c53.png" 
            alt="School Logo" 
            className="h-24 w-24 mx-auto mb-4 bg-white rounded-full p-1.5 shadow-md"
          />
          <h1 className="text-3xl font-bold text-school-primary dark:text-white">Banadurai Higher Secondary School</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Attendance Management System</p>
        </div>
        
        {showClassSelection && user?.role === 'student' ? (
          <div className="transition-all">
            <h2 className="text-2xl font-bold text-center mb-4">Welcome, {user.name}!</h2>
            <p className="text-center mb-6">Please select your class and section to continue</p>
            <StudentClassSelection 
              userId={user.id} 
              onComplete={handleClassSelectionComplete} 
            />
          </div>
        ) : (
          <Card className="border-school-primary/10 shadow-lg dark:bg-gray-800/50 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="yourname@banadurai.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
                
                <div className="w-full">
                  <p className="text-sm text-center mb-2 text-gray-500 dark:text-gray-400">Quick Demo Login as:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button type="button" onClick={() => handleDemoLogin('admin')} variant="outline" size="sm">Admin</Button>
                    <Button type="button" onClick={() => handleDemoLogin('teacher')} variant="outline" size="sm">Teacher</Button>
                    <Button type="button" onClick={() => handleDemoLogin('student')} variant="outline" size="sm">Student</Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button type="button" onClick={() => handleDemoLogin('parent')} variant="outline" size="sm">Parent</Button>
                    <Button type="button" onClick={() => handleDemoLogin('cctv')} variant="outline" size="sm">CCTV Operator</Button>
                  </div>
                </div>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Login;
