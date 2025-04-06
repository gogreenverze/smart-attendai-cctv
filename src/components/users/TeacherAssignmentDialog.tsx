
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { DatabaseService } from '@/database/service';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TeacherAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: any;
  onAssignmentsUpdated: () => void;
}

const TeacherAssignmentDialog = ({ isOpen, onClose, teacher, onAssignmentsUpdated }: TeacherAssignmentDialogProps) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('none');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!teacher) return;
      
      setIsLoading(true);
      try {
        // Fetch classes
        const classList = await DatabaseService.classes.getAllClasses();
        setClasses(classList);
        
        // Fetch subjects
        const subjectList = await DatabaseService.subjects.getAll();
        setSubjects(subjectList);
        
        // Fetch current assignments
        if (teacher.teacher_id) {
          const teacherAssignments = await DatabaseService.users.getTeacherAssignments(teacher.teacher_id);
          setAssignments(teacherAssignments);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load teacher assignment data.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [teacher, isOpen]);

  // Update sections when class changes
  useEffect(() => {
    const fetchSections = async () => {
      if (!selectedClass) {
        setSections([]);
        return;
      }
      
      try {
        const sectionList = await DatabaseService.classes.getSectionsByClass(parseInt(selectedClass));
        setSections(sectionList);
      } catch (error) {
        console.error("Failed to fetch sections:", error);
        setSections([]);
      }
    };
    
    fetchSections();
  }, [selectedClass]);

  const handleAddAssignment = async () => {
    if (!selectedClass || !selectedSection || !teacher) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both class and section",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if teacher record exists, if not create one
      let teacherId = teacher.teacher_id;
      
      if (!teacherId) {
        const newTeacher = { user_id: teacher.user_id };
        const result = await DatabaseService.users.createTeacher(newTeacher);
        teacherId = result[0];
      }
      
      // Create the assignment
      const newAssignment = {
        teacher_id: teacherId,
        class_id: parseInt(selectedClass),
        section_id: parseInt(selectedSection),
        subject_id: selectedSubject !== 'none' ? parseInt(selectedSubject) : undefined
      };
      
      await DatabaseService.users.assignTeacherToClass(newAssignment);
      
      // Refresh assignments
      const teacherAssignments = await DatabaseService.users.getTeacherAssignments(teacherId);
      setAssignments(teacherAssignments);
      
      // Reset selections
      setSelectedClass('');
      setSelectedSection('');
      setSelectedSubject('none');
      
      toast({
        title: "Success",
        description: "Teacher assignment added successfully.",
      });
      
      onAssignmentsUpdated();
    } catch (error) {
      console.error("Failed to assign teacher:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to assign teacher to class/section.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId: number) => {
    try {
      await DatabaseService.users.removeTeacherAssignment(assignmentId);
      
      // Update assignments list
      setAssignments(assignments.filter(a => a.assignment_id !== assignmentId));
      
      toast({
        title: "Success",
        description: "Assignment removed successfully.",
      });
      
      onAssignmentsUpdated();
    } catch (error) {
      console.error("Failed to remove assignment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove teacher assignment.",
      });
    }
  };

  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Class Assignments</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-4 text-center">Loading assignment data...</div>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">
                Assignments for {teacher.first_name} {teacher.last_name}
              </h3>
              
              <div className="mt-2 space-y-4">
                {assignments.length > 0 ? (
                  <div className="grid gap-2">
                    {assignments.map((assignment) => (
                      <div key={assignment.assignment_id} className="flex items-center justify-between rounded-md border p-2">
                        <div>
                          <span className="font-medium">{assignment.class_name} - {assignment.section_name}</span>
                          {assignment.subject_name && (
                            <span className="ml-2 text-sm text-muted-foreground">({assignment.subject_name})</span>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveAssignment(assignment.assignment_id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No assignments yet</div>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Add New Assignment</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select 
                    value={selectedClass} 
                    onValueChange={setSelectedClass}
                  >
                    <SelectTrigger id="class">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.class_id} value={classItem.class_id.toString()}>
                          {classItem.class_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <Select 
                    value={selectedSection} 
                    onValueChange={setSelectedSection}
                    disabled={!selectedClass || sections.length === 0}
                  >
                    <SelectTrigger id="section">
                      <SelectValue placeholder={selectedClass ? "Select section" : "Select class first"} />
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
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Select 
                  value={selectedSubject} 
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No specific subject</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                        {subject.subject_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            type="button" 
            onClick={handleAddAssignment}
            disabled={isSubmitting || !selectedClass || !selectedSection}
          >
            {isSubmitting ? 'Adding...' : 'Add Assignment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherAssignmentDialog;
