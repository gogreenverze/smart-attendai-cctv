
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, Check } from 'lucide-react';
import HomeworkList from './HomeworkList';
import HomeworkDetails from './HomeworkDetails';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface StudentHomeworkProps {
  user: any;
  classes: any[];
  sections: any[];
  homeworkItems: any[];
  homeworkHistory: any[];
  loadingHomework: boolean;
  selectedClass: string;
  selectedSection: string;
  onClassChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  refreshHomework: () => void;
}

const StudentHomework: React.FC<StudentHomeworkProps> = ({
  user,
  classes,
  sections,
  homeworkItems,
  homeworkHistory,
  loadingHomework,
  selectedClass,
  selectedSection,
  onClassChange,
  onSectionChange,
  refreshHomework
}) => {
  const [selectedTab, setSelectedTab] = useState('current');
  const [selectedHomework, setSelectedHomework] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleHomeworkSelect = (homework: any) => {
    setSelectedHomework(homework);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = () => {
    refreshHomework();
    setIsDialogOpen(false);
  };

  // Get class and section names for display
  const currentClass = classes.find(c => c.class_id.toString() === selectedClass);
  const currentSection = sections.find(s => s.section_id.toString() === selectedSection);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Homework Assignments</CardTitle>
        <CardDescription>
          {currentClass && currentSection ? 
            `Viewing homework for ${currentClass.class_name} - ${currentSection.section_name}` : 
            "View assigned homework and update your progress"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="class-filter">Class</Label>
            <Select 
              value={selectedClass} 
              onValueChange={onClassChange}
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
              onValueChange={onSectionChange}
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
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="current" className="flex gap-2 items-center">
              <BookOpen className="h-4 w-4" />
              <span>Current</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex gap-2 items-center">
              <Clock className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <HomeworkList 
              homework={homeworkItems.filter(hw => hw.status !== 'completed')} 
              loading={loadingHomework}
              userRole={user?.role}
              onSelectHomework={handleHomeworkSelect}
            />
          </TabsContent>
          
          <TabsContent value="history">
            <HomeworkList 
              homework={homeworkHistory} 
              loading={loadingHomework}
              userRole={user?.role}
              onSelectHomework={handleHomeworkSelect}
            />
          </TabsContent>
        </Tabs>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-2xl">
            {selectedHomework && (
              <HomeworkDetails 
                homework={selectedHomework}
                userRole={user?.role}
                userId={user?.id}
                onStatusUpdate={handleStatusUpdate}
                onClose={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StudentHomework;
