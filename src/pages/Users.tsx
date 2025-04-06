import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Users as UsersIcon, 
  Edit, 
  School, 
  User,
  X
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { DatabaseService } from '@/database/service';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import UserEditDialog from '@/components/users/UserEditDialog';
import UserAddDialog from '@/components/users/UserAddDialog';
import TeacherAssignmentDialog from '@/components/users/TeacherAssignmentDialog';

interface User {
  user_id: number;
  username: string;
  email: string;
  role_name: string;
  first_name: string;
  last_name: string;
  created_at: string;
  avatar?: string;
  is_active: boolean;
  teacher_id?: number;
  assignment_count?: number;
  assigned_classes?: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRole, setActiveRole] = useState('all');
  const { user: currentUser } = useAuth();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        let fetchedUsers = await DatabaseService.users.getWithRoles();
        
        if (fetchedUsers.length === 0) {
          const mockUsers = [
            { user_id: 1, username: 'admin', email: 'admin@banadurai.edu', role_name: 'admin', created_at: new Date().toISOString() },
            { user_id: 2, username: 'teacher1', email: 'teacher1@banadurai.edu', role_name: 'teacher', created_at: new Date().toISOString() },
            { user_id: 3, username: 'teacher2', email: 'teacher2@banadurai.edu', role_name: 'teacher', created_at: new Date().toISOString() },
            { user_id: 4, username: 'student1', email: 'student1@banadurai.edu', role_name: 'student', created_at: new Date().toISOString() },
            { user_id: 5, username: 'parent1', email: 'parent1@banadurai.edu', role_name: 'parent', created_at: new Date().toISOString() },
            { user_id: 6, username: 'operator', email: 'cctv@banadurai.edu', role_name: 'cctv_operator', created_at: new Date().toISOString() },
          ];
          
          for (const user of mockUsers) {
            await DatabaseService.users.create({
              ...user,
              password_hash: 'hashed_password',
              role_id: getRoleId(user.role_name),
              first_name: user.username,
              last_name: 'User',
              is_active: true
            });
          }
          
          fetchedUsers = await DatabaseService.users.getWithRoles();
        }
        
        const teachersData = await DatabaseService.users.getTeachersWithAssignments();
        
        const enhancedUsers = fetchedUsers.map(user => {
          const teacherInfo = teachersData.find(t => t.user_id === user.user_id);
          if (teacherInfo) {
            return {
              ...user,
              teacher_id: teacherInfo.teacher_id,
              assignment_count: teacherInfo.assignment_count,
              assigned_classes: teacherInfo.assigned_classes
            };
          }
          return user;
        });
        
        console.log('Fetched users:', enhancedUsers);
        setUsers(enhancedUsers);
        setFilteredUsers(enhancedUsers);
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

    if (currentUser?.role === 'admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let result = [...users];
    
    if (searchQuery) {
      result = result.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
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

  const getRoleId = (roleName: string): number => {
    switch (roleName) {
      case 'admin': return 1;
      case 'teacher': return 2;
      case 'student': return 3;
      case 'parent': return 4;
      case 'cctv_operator': return 5;
      default: return 3;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'teacher':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'student':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'parent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'cctv_operator':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleManageTeacherAssignments = (user: User) => {
    setSelectedUser(user);
    setIsAssignDialogOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await DatabaseService.users.delete(userId);
      setUsers(users.filter(user => user.user_id !== userId));
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
    }
  };

  const handleUserUpdated = async () => {
    try {
      const updatedUsers = await DatabaseService.users.getWithRoles();
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Failed to refresh users:", error);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You don't have permission to access the User Management section.</p>
          <Button asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles in the system.</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
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
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-lg font-medium">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          {filteredUsers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.user_id} className="card-hover dark:bg-gray-800/50 dark:border-gray-700">
                  <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback className="bg-primary/10 text-primary dark:bg-primary/20">
                        {user.first_name ? user.first_name[0].toUpperCase() : user.username ? user.username[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {user.first_name} {user.last_name}
                        {!user.is_active && (
                          <Badge variant="outline" className="ml-2 text-xs bg-gray-100 text-gray-600">Inactive</Badge>
                        )}
                      </CardTitle>
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
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit user
                        </DropdownMenuItem>
                        {user.role_name === 'teacher' && (
                          <DropdownMenuItem onClick={() => handleManageTeacherAssignments(user)}>
                            <School className="mr-2 h-4 w-4" /> Manage class assignments
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600 dark:text-red-400"
                          onClick={() => handleDeleteUser(user.user_id)}
                        >
                          <X className="mr-2 h-4 w-4" /> Delete user
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <Badge className={getRoleBadgeColor(user.role_name)}>
                          {user.role_name.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {user.role_name === 'teacher' && user.assignment_count > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-muted-foreground flex items-center">
                            <School className="mr-1 h-3 w-3" /> 
                            Assigned to: {user.assigned_classes?.split(',').join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border rounded-md dark:border-gray-700">
              <div className="text-center">
                <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-lg font-medium">No users found</p>
                <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            </div>
          )}
        </>
      )}
      
      <UserAddDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onUserAdded={handleUserUpdated}
      />
      
      <UserEditDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={selectedUser}
        onUserUpdated={handleUserUpdated}
      />
      
      <TeacherAssignmentDialog
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        teacher={selectedUser}
        onAssignmentsUpdated={handleUserUpdated}
      />
    </div>
  );
};

export default Users;
