
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatabaseService } from '@/database/service';

interface StudentClassSelectionProps {
  userId: string;
  onComplete: (classId: string, sectionId: string) => void;
}

const StudentClassSelection: React.FC<StudentClassSelectionProps> = ({ userId, onComplete }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const fetchedClasses = await DatabaseService.classes.getAllClasses();
        setClasses(fetchedClasses);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      const fetchSections = async () => {
        try {
          const fetchedSections = await DatabaseService.classes.getSectionsByClass(Number(selectedClass));
          setSections(fetchedSections);
          if (fetchedSections.length > 0) {
            setSelectedSection("");
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

  const handleSubmit = () => {
    if (selectedClass && selectedSection) {
      // Save student preferences in localStorage
      localStorage.setItem(`student_${userId}_class`, selectedClass);
      localStorage.setItem(`student_${userId}_section`, selectedSection);
      
      onComplete(selectedClass, selectedSection);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class-select">Select Your Class</Label>
            <Select 
              value={selectedClass} 
              onValueChange={setSelectedClass}
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
            <Label htmlFor="section-select">Select Your Section</Label>
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
          
          <Button 
            onClick={handleSubmit}
            disabled={!selectedClass || !selectedSection}
            className="w-full"
          >
            Confirm Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentClassSelection;
