
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/database/service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Calendar, Loader2 } from 'lucide-react';
import { format, isAfter } from 'date-fns';

const Homework = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingHomework, setLoadingHomework] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const fetchedClasses = await DatabaseService.classes.getAllClasses();
        setClasses(fetchedClasses);
        
        if (user?.role === 'student') {
          if (fetchedClasses.length > 0) {
            setSelectedClass(fetchedClasses[0].class_id.toString());
          }
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
          
          if (user?.role === 'student' && fetchedSections.length > 0) {
            setSelectedSection(fetchedSections[0].section_id.toString());
          }
        } catch (error) {
          console.error("Failed to fetch sections:", error);
        }
      };
      
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass, user]);
  
  useEffect(() => {
    if (selectedClass && selectedSection) {
      fetchHomework();
    }
  }, [selectedClass, selectedSection]);
  
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
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">Due Soon</Badge>;
      } else {
        return <Badge variant="outline">Upcoming</Badge>;
      }
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

  if (user?.role === 'teacher') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Homework Management</h1>
            <p className="text-muted-foreground">Manage and assign homework to students</p>
          </div>
          <Button asChild>
            <a href="/teacher-dashboard">Go to Teacher Dashboard</a>
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p>As a teacher, you can create and manage homework assignments from the Teacher Dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Homework</h1>
          <p className="text-muted-foreground">View assigned homework and due dates</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Homework Assignments</CardTitle>
          <CardDescription>View homework for your selected class</CardDescription>
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
    </div>
  );
};

export default Homework;
