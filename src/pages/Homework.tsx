
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/database/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Loader2, Send, Book, Plus } from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';

// Homework assignment form schema
const homeworkSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  class_id: z.string().min(1, { message: "Class is required." }),
  section_id: z.string().min(1, { message: "Section is required." }),
  subject_id: z.string().min(1, { message: "Subject is required." }),
  due_date: z.date({ required_error: "Due date is required." }),
});

const Homework = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === 'teacher' ? "assign" : "view");
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingHomework, setLoadingHomework] = useState(false);

  // Homework assignment form
  const homeworkForm = useForm<z.infer<typeof homeworkSchema>>({
    resolver: zodResolver(homeworkSchema),
    defaultValues: {
      title: "",
      description: "",
      class_id: "",
      section_id: "",
      subject_id: "",
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date is one week from now
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch classes
        const fetchedClasses = await DatabaseService.classes.getAllClasses();
        setClasses(fetchedClasses);
        
        // Fetch subjects for teachers
        if (user?.role === 'teacher') {
          const fetchedSubjects = await DatabaseService.subjects.getAll();
          setSubjects(fetchedSubjects);
        }
        
        if (user?.role === 'student' && fetchedClasses.length > 0) {
          // For students, we'll set their class and section
          // In a real app, this would come from the student's profile
          setSelectedClass(fetchedClasses[0].class_id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, [user]);
  
  useEffect(() => {
    if (selectedClass) {
      const fetchSections = async () => {
        try {
          const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(selectedClass));
          setSections(fetchedSections);
          
          if (fetchedSections.length > 0) {
            setSelectedSection(fetchedSections[0].section_id.toString());
            
            // Update form value if in assign tab
            if (activeTab === "assign" && user?.role === 'teacher') {
              homeworkForm.setValue("section_id", fetchedSections[0].section_id.toString());
            }
          }
        } catch (error) {
          console.error("Failed to fetch sections:", error);
        }
      };
      
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass, activeTab]);
  
  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchHomework();
    }
  }, [selectedClass, selectedSection]);

  const onHomeworkClassChange = (value: string) => {
    homeworkForm.setValue("class_id", value);
    homeworkForm.setValue("section_id", "");
    
    // Fetch sections for this class
    const fetchSections = async () => {
      try {
        const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(value));
        setSections(fetchedSections);
        
        // Set first section as default if available
        if (fetchedSections.length > 0) {
          homeworkForm.setValue("section_id", fetchedSections[0].section_id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch sections:", error);
      }
    };
    
    fetchSections();
  };
  
  const fetchHomework = async () => {
    if (!selectedClass || !selectedSection) return;
    
    setLoadingHomework(true);
    try {
      const fetchedHomework = await DatabaseService.classes.getHomeworkByClass(
        Number(selectedClass),
        Number(selectedSection)
      );
      setHomework(fetchedHomework);
    } catch (error) {
      console.error("Failed to fetch homework:", error);
    } finally {
      setLoadingHomework(false);
    }
  };
  
  const getHomeworkStatusBadge = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    
    if (isAfter(now, due)) {
      return <Badge variant="destructive">Past Due</Badge>;
    } else {
      const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 1) {
        return <Badge variant="destructive">Due Today</Badge>;
      } else if (daysUntilDue <= 3) {
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Due Soon</Badge>;
      } else {
        return <Badge variant="outline">Upcoming</Badge>;
      }
    }
  };

  const onHomeworkSubmit = async (data: z.infer<typeof homeworkSchema>) => {
    try {
      const result = await DatabaseService.classes.createHomework({
        ...data,
        class_id: Number(data.class_id),
        section_id: Number(data.section_id),
        subject_id: Number(data.subject_id),
        teacher_id: user?.id ? Number(user.id) : 1, // In a real app, this would be the actual teacher ID
        is_active: true,
      });
      
      if (result) {
        toast({
          title: "Success",
          description: "Homework assigned successfully.",
        });
        homeworkForm.reset({
          title: "",
          description: "",
          class_id: data.class_id,
          section_id: data.section_id,
          subject_id: data.subject_id,
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        
        // Refresh homework list if viewing the same class/section
        if (data.class_id === selectedClass && data.section_id === selectedSection) {
          fetchHomework();
        }
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
          <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
          <p className="text-muted-foreground">
            {user?.role === 'teacher' ? 'Assign and manage homework for your classes' : 'View assigned homework and due dates'}
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <Button asChild variant="outline">
            <a href="/teacher-dashboard">Go to Teacher Dashboard</a>
          </Button>
        )}
      </div>
      
      {user?.role === 'teacher' ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="assign" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <span>Assign Homework</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>View Assignments</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assign" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign New Homework</CardTitle>
                <CardDescription>Create and broadcast homework to classes and sections</CardDescription>
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
                                  <Calendar className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="p-3">
                                <div className="space-y-3">
                                  <Label>Select due date</Label>
                                  <div className="rounded-md border">
                                    <input 
                                      type="date" 
                                      className="w-full p-2" 
                                      onChange={(e) => {
                                        const selectedDate = new Date(e.target.value);
                                        field.onChange(selectedDate);
                                      }}
                                      min={new Date().toISOString().split('T')[0]}
                                    />
                                  </div>
                                </div>
                              </div>
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
                          <Send className="h-4 w-4" />
                        )}
                        Broadcast Homework
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="view" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homework Assignments</CardTitle>
                <CardDescription>View all homework assigned to classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                
                {/* Display homework assignments */}
                {loadingHomework ? (
                  <div className="flex justify-center items-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    {homework.length > 0 ? (
                      <div className="grid gap-4">
                        {homework.map((hw) => (
                          <Card key={hw.homework_id} className="overflow-hidden">
                            <div className="flex flex-col md:flex-row">
                              <div className="bg-primary/10 p-4 flex items-center justify-center md:w-24">
                                <Book className="h-10 w-10 text-primary" />
                              </div>
                              <CardContent className="flex-1 p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <h3 className="font-bold text-lg">{hw.title}</h3>
                                  {getHomeworkStatusBadge(hw.due_date)}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Subject: {hw.subject_name} | Teacher: {hw.first_name} {hw.last_name}
                                </p>
                                <div className="mt-4">
                                  <p className="text-sm">{hw.description}</p>
                                </div>
                                <div className="mt-4 flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>Due: {format(new Date(hw.due_date), "PPP")}</span>
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center p-8 border rounded-md bg-muted/10">
                        <p>No homework assignments found for the selected class and section.</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
              {user?.role === 'teacher' && (
                <CardFooter className="border-t px-6 py-4 flex justify-end">
                  <Button 
                    onClick={() => setActiveTab("assign")}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create New Assignment
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        // Student/Parent view
        <Card>
          <CardHeader>
            <CardTitle>Homework Assignments</CardTitle>
            <CardDescription>View assigned homework and due dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="class-filter">Class</Label>
                <Select 
                  value={selectedClass} 
                  onValueChange={setSelectedClass}
                  disabled={user?.role === 'student'}
                >
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
                  disabled={!selectedClass || sections.length === 0 || user?.role === 'student'}
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
            
            {loadingHomework ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {homework.length > 0 ? (
                  <div className="grid gap-4">
                    {homework.map((hw) => (
                      <Card key={hw.homework_id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="bg-primary/10 p-4 flex items-center justify-center md:w-24">
                            <BookOpen className="h-10 w-10 text-primary" />
                          </div>
                          <CardContent className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h3 className="font-bold text-lg">{hw.title}</h3>
                              {getHomeworkStatusBadge(hw.due_date)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Subject: {hw.subject_name} | Teacher: {hw.first_name} {hw.last_name}
                            </p>
                            <div className="mt-4">
                              <p className="text-sm">{hw.description}</p>
                            </div>
                            <div className="mt-4 flex items-center text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>Due: {format(new Date(hw.due_date), "PPP")}</span>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border rounded-md bg-muted/10">
                    <p>No homework assignments found for the selected class and section.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Homework;
