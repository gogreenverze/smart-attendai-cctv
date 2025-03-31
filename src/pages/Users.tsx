
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Plus, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DatabaseService } from '@/database/service';
import { toast } from '@/components/ui/use-toast';

interface User {
  user_id: number;
  username: string;
  email: string;
  role_name: string;
  created_at: string;
  avatar?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await DatabaseService.users.getWithRoles();
        
        // If no users exist, add some mock users
        if (fetchedUsers.length === 0) {
          const mockUsers = [
            { user_id: 1, username: 'admin', email: 'admin@school.edu', role_name: 'admin', created_at: new Date().toISOString() },
            { user_id: 2, username: 'teacher1', email: 'teacher1@school.edu', role_name: 'teacher', created_at: new Date().toISOString() },
            { user_id: 3, username: 'teacher2', email: 'teacher2@school.edu', role_name: 'teacher', created_at: new Date().toISOString() },
            { user_id: 4, username: 'student1', email: 'student1@school.edu', role_name: 'student', created_at: new Date().toISOString() },
            { user_id: 5, username: 'parent1', email: 'parent1@school.edu', role_name: 'parent', created_at: new Date().toISOString() },
            { user_id: 6, username: 'operator', email: 'operator@school.edu', role_name: 'cctv_operator', created_at: new Date().toISOString() },
          ];
          
          for (const user of mockUsers) {
            await DatabaseService.users.create(user);
          }
          
          setUsers(mockUsers);
          setFilteredUsers(mockUsers);
        } else {
          setUsers(fetchedUsers);
          setFilteredUsers(fetchedUsers);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    // Filter users based on search query and active role
    let result = [...users];
    
    if (searchQuery) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeRole !== 'all') {
      result = result.filter(user => user.role_name === activeRole);
    }
    
    setFilteredUsers(result);
  }, [searchQuery, activeRole, users]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleFilter = (role: string) => {
    setActiveRole(role);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'student':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-purple-100 text-purple-800';
      case 'cctv_operator':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles in the system.</p>
        </div>
        <Button className="btn-primary">
          <Plus className="mr-2 h-4 w-4" /> Add New User
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto">
          <TabsList>
            <TabsTrigger value="all" onClick={() => handleRoleFilter('all')}>All</TabsTrigger>
            <TabsTrigger value="admin" onClick={() => handleRoleFilter('admin')}>Admins</TabsTrigger>
            <TabsTrigger value="teacher" onClick={() => handleRoleFilter('teacher')}>Teachers</TabsTrigger>
            <TabsTrigger value="student" onClick={() => handleRoleFilter('student')}>Students</TabsTrigger>
            <TabsTrigger value="other" onClick={() => handleRoleFilter('other')}>Others</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse-slow">
            <p className="text-lg font-medium">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredUsers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.user_id} className="card-hover">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.username}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit user</DropdownMenuItem>
                        <DropdownMenuItem>Change role</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete user</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getRoleBadgeColor(user.role_name)}>
                        {user.role_name.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border rounded-md">
              <div className="text-center">
                <p className="text-lg font-medium">No users found</p>
                <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
