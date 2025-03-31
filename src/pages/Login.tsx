
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
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
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-school-light to-white dark:from-school-dark dark:to-gray-900 flex flex-col items-center justify-center p-4">
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
        
        <Card className="border-school-primary/10 shadow-lg">
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
      </div>
    </div>
  );
};

export default Login;
