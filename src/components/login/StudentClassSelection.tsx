
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DatabaseService } from '@/database/service';
import { toast } from '@/hooks/use-toast';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const fetchedClasses = await DatabaseService.classes.getAllClasses();
        setClasses(fetchedClasses);
        setLoading(false);
        
        // If there's only one class, auto-select it
        if (fetchedClasses.length === 1) {
          setSelectedClass(fetchedClasses[0].class_id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        setError("Failed to load classes. Please try again.");
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
          
          // If there's only one section, auto-select it
          if (fetchedSections.length === 1) {
            setSelectedSection(fetchedSections[0].section_id.toString());
          } else {
            // Reset section selection when class changes
            setSelectedSection("");
          }
        } catch (error) {
          console.error("Failed to fetch sections:", error);
          setError("Failed to load sections. Please try again.");
        }
      };
      
      fetchSections();
    } else {
      setSections([]);
    }
  }, [selectedClass]);

  const handleSubmit = () => {
    if (!selectedClass) {
      toast({
        title: "Class Required",
        description: "Please select your class to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedSection) {
      toast({
        title: "Section Required",
        description: "Please select your section to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Save student preferences in localStorage
    localStorage.setItem(`student_${userId}_class`, selectedClass);
    localStorage.setItem(`student_${userId}_section`, selectedSection);
    
    onComplete(selectedClass, selectedSection);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-destructive/10 rounded-md border border-destructive/20">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class-select" className="flex items-center">
              Select Your Class 
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={selectedClass} 
              onValueChange={setSelectedClass}
              required
            >
              <SelectTrigger className={!selectedClass ? "border-destructive" : ""}>
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
            <Label htmlFor="section-select" className="flex items-center">
              Select Your Section
              <span className="text-destructive ml-1">*</span>
            </Label>
            <Select 
              value={selectedSection} 
              onValueChange={setSelectedSection}
              disabled={!selectedClass || sections.length === 0}
              required
            >
              <SelectTrigger className={selectedClass && !selectedSection ? "border-destructive" : ""}>
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
            {sections.length === 0 && selectedClass && (
              <p className="text-sm text-muted-foreground">No sections available for this class</p>
            )}
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
