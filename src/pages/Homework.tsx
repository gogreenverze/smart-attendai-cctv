
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/database/service';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import TeacherHomework from '@/components/homework/TeacherHomework';
import StudentHomework from '@/components/homework/StudentHomework';

const Homework = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [homeworkHistory, setHomeworkHistory] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadingHomework, setLoadingHomework] = useState(false);

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
          }
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
      fetchHomework();
    }
  }, [selectedClass, selectedSection, user]);

  const fetchHomework = async () => {
    if (!selectedClass || !selectedSection) return;
    
    setLoadingHomework(true);
    try {
      if (user?.role === 'student') {
        // Get current homework assignments for student
        const fetchedHomework = await DatabaseService.classes.getHomeworkForStudent(
          user.id,
          Number(selectedClass),
          Number(selectedSection)
        );
        setHomework(fetchedHomework);
        
        // Get completed homework history for student
        const fetchedHistory = await DatabaseService.classes.getHomeworkHistory(user.id);
        setHomeworkHistory(fetchedHistory);
      } else {
        // For teachers and other roles
        const fetchedHomework = await DatabaseService.classes.getHomeworkByClass(
          Number(selectedClass),
          Number(selectedSection)
        );
        setHomework(fetchedHomework);
      }
    } catch (error) {
      console.error("Failed to fetch homework:", error);
    } finally {
      setLoadingHomework(false);
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
            {user?.role === 'teacher' 
              ? 'Assign and manage homework for your classes' 
              : 'View assigned homework and update your progress'
            }
          </p>
        </div>
        
        {user?.role === 'teacher' && (
          <Button asChild variant="outline">
            <a href="/teacher-dashboard">Go to Teacher Dashboard</a>
          </Button>
        )}
      </div>
      
      {user?.role === 'teacher' ? (
        <TeacherHomework 
          user={user}
          classes={classes}
          sections={sections}
          subjects={subjects}
          homework={homework}
          loadingHomework={loadingHomework}
          selectedClass={selectedClass}
          selectedSection={selectedSection}
          onClassChange={setSelectedClass}
          onSectionChange={setSelectedSection}
          refreshHomework={fetchHomework}
        />
      ) : (
        <StudentHomework 
          user={user}
          classes={classes}
          sections={sections}
          homeworkItems={homework}
          homeworkHistory={homeworkHistory}
          loadingHomework={loadingHomework}
          selectedClass={selectedClass}
          selectedSection={selectedSection}
          onClassChange={setSelectedClass}
          onSectionChange={setSelectedSection}
          refreshHomework={fetchHomework}
        />
      )}
    </div>
  );
};

export default Homework;
