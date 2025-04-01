
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/database/service';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Users, Loader2, BookOpen } from 'lucide-react';

// Student enrollment form schema
const studentSchema = z.object({
  first_name: z.string().min(2, { message: "First name must be at least 2 characters." }),
  last_name: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  roll_number: z.string().min(1, { message: "Roll number is required." }),
  class_id: z.string().min(1, { message: "Class is required." }),
  section_id: z.string().min(1, { message: "Section is required." }),
});

// Homework assignment form schema
const homeworkSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  class_id: z.string().min(1, { message: "Class is required." }),
  section_id: z.string().min(1, { message: "Section is required." }),
  subject_id: z.string().min(1, { message: "Subject is required." }),
  due_date: z.date({ required_error: "Due date is required." }),
});

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("students");
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  
  // Student enrollment form
  const studentForm = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      roll_number: "",
      class_id: "",
      section_id: "",
    },
  });
  
  // Homework assignment form
  const homeworkForm = useForm<z.infer<typeof homeworkSchema>>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      title: "",
      description: "",
      class_id: "",
      section_id: "",
      subject_id: "",
      due_date: new Date(),
    },
  });
  
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch classes
        const fetchedClasses = await DatabaseService.classes.getAllClasses();
        setClasses(fetchedClasses);
        
        // Fetch subjects
        const fetchedSubjects = await DatabaseService.subjects.getAll();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);
  
  useEffect(() => {
    if (selectedClass) {
      // Fetch sections for selected class
      const fetchSections = async () => {
        try {
          const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(selectedClass));
          setSections(fetchedSections);
        } catch (error) {
          console.error("Failed to fetch sections:", error);
        }
      };
      
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass]);
  
  useEffect(() => {
    if (selectedClass && selectedSection) {
      // Fetch students for selected class and section
      fetchStudents();
    }
  }, [selectedClass, selectedSection]);
  
  const fetchStudents = async () => {
    if (!selectedClass || !selectedSection) return;
    
    setLoadingStudents(true);
    try {
      const fetchedStudents = await DatabaseService.classes.getStudentsByClass(
        Number(selectedClass),
        Number(selectedSection)
      );
      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load students. Please try again.",
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  // Student form class change handler
  const onStudentClassChange = (value: string) => {
    studentForm.setValue("class_id", value);
    studentForm.setValue("section_id", "");
    
    // Fetch sections for this class
    const fetchSections = async () => {
      try {
        const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(value));
        setSections(fetchedSections);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    
    fetchSections();
  };
  
  const onStudentSubmit = async (data: z.infer<typeof studentSchema>) => {
    try {
      const result = await DatabaseService.classes.createStudentWithUser({
        ...data,
        class_id: Number(data.class_id),
        section_id: Number(data.section_id),
      });
      
      if (result) {
        toast({
          title: "Success",
          description: "Student enrolled successfully.",
        });
        studentForm.reset();
        
        // Refresh student list if on same class/section
        if (data.class_id === selectedClass && data.section_id === selectedSection) {
          fetchStudents();
        }
      }
    } catch (error) {
      console.error("Failed to enroll student:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to enroll student. Please try again.",
      });
    }
  };
  
  const onHomeworkSubmit = async (data: z.infer<typeof homeworkSchema>) => {
    try {
      const result = await DatabaseService.classes.createHomework({
        ...data,
        class_id: Number(data.class_id),
        section_id: Number(data.section_id),
        subject_id: Number(data.subject_id),
        teacher_id: user?.user_id || 1, // Use actual teacher ID
        is_active: true,
      });
      
      if (result) {
        toast({
          title: "Success",
          description: "Homework assigned successfully.",
        });
        homeworkForm.reset();
      }
    } catch (error) {
      console.error("Failed to assign homework:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign homework. Please try again.",
      });
    }
  };
  
  // For select inputs in homework form
  const onHomeworkClassChange = (value: string) => {
    homeworkForm.setValue("class_id", value);
    homeworkForm.setValue("section_id", "");
    
    // Fetch sections for this class
    const fetchSections = async () => {
      try {
        const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(value));
        setSections(fetchedSections);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    
    fetchSections();
  };
  
  // Check if user is a teacher
  if (user?.role !== 'teacher') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Only teachers can access this page.</p>
          <Button asChild>
            <a href="/dashboard">Return to Dashboard</a>
          </Button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage students and assignments</p>
        </div>
        <Button asChild variant="outline">
          <a href="/homework">View Homework Page</a>
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Student Enrollment</span>
          </TabsTrigger>
          <TabsTrigger value="homework" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Homework Assignment</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="students" className="space-y-6">
          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>Class Students</CardTitle>
              <CardDescription>View and manage students by class and section</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="class-filter">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                          {cls.class_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="section-filter">Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                    disabled={!selectedClass || sections.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((section) => (
                        <SelectItem key={section.section_id} value={section.section_id.toString()}>
                          {section.section_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {loadingStudents ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {students.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-muted">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">Roll Number</th>
                              <th className="px-4 py-3 text-left font-medium">Name</th>
                              <th className="px-4 py-3 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map((student) => (
                              <tr key={student.student_id} className="border-t">
                                <td className="px-4 py-3">{student.roll_number}</td>
                                <td className="px-4 py-3">{`${student.first_name} ${student.last_name}`}</td>
                                <td className="px-4 py-3">
                                  <Button variant="outline" size="sm">View Details</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8 border rounded-md bg-muted/10">
                      <p>No students found for the selected class and section.</p>
                      <p className="text-sm text-muted-foreground mt-1">Use the form below to enroll students.</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Student Enrollment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Enroll New Student</CardTitle>
              <CardDescription>Add a new student to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={studentForm.control}
                      name="roll_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roll Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Roll Number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="class_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select 
                            onValueChange={onStudentClassChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                                  {cls.class_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={studentForm.control}
                      name="section_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!studentForm.watch("class_id")}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sections.map((section) => (
                                <SelectItem key={section.section_id} value={section.section_id.toString()}>
                                  {section.section_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="flex items-center gap-2"
                      disabled={studentForm.formState.isSubmitting}
                    >
                      {studentForm.formState.isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Enroll Student
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="homework" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assign Homework</CardTitle>
              <CardDescription>Create new homework assignments for your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...homeworkForm}>
                <form onSubmit={homeworkForm.handleSubmit(onHomeworkSubmit)} className="space-y-4">
                  <FormField
                    control={homeworkForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Homework Title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={homeworkForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed instructions for the homework" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={homeworkForm.control}
                      name="class_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select 
                            onValueChange={onHomeworkClassChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem key={cls.class_id} value={cls.class_id.toString()}>
                                  {cls.class_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={homeworkForm.control}
                      name="section_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Section</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                            disabled={!homeworkForm.watch("class_id") || sections.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Section" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sections.map((section) => (
                                <SelectItem key={section.section_id} value={section.section_id.toString()}>
                                  {section.section_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={homeworkForm.control}
                      name="subject_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                                  {subject.subject_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={homeworkForm.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className="w-full pl-3 text-left font-normal"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="flex items-center gap-2"
                      disabled={homeworkForm.formState.isSubmitting}
                    >
                      {homeworkForm.formState.isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                      Assign Homework
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeacherDashboard;
