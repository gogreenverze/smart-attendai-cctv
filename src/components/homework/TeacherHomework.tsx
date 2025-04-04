
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Send, BookOpen } from 'lucide-react';
import HomeworkForm from './HomeworkForm';
import HomeworkList from './HomeworkList';

interface TeacherHomeworkProps {
  user: any;
  classes: any[];
  sections: any[];
  subjects: any[];
  homework: any[];
  loadingHomework: boolean;
  selectedClass: string;
  selectedSection: string;
  onClassChange: (value: string) => void;
  onSectionChange: (value: string) => void;
  refreshHomework: () => void;
}

const TeacherHomework: React.FC<TeacherHomeworkProps> = ({
  user,
  classes,
  sections,
  subjects,
  homework,
  loadingHomework,
  selectedClass,
  selectedSection,
  onClassChange,
  onSectionChange,
  refreshHomework
}) => {
  const [activeTab, setActiveTab] = useState("assign");
  
  return (
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
            <HomeworkForm 
              classes={classes} 
              sections={sections} 
              subjects={subjects}
              onSuccess={refreshHomework}
              user={user}
            />
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
                <Select value={selectedClass} onValueChange={onClassChange}>
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
            
            {/* Display homework assignments */}
            <HomeworkList homework={homework} loading={loadingHomework} userRole="teacher" />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
            <Button 
              onClick={() => setActiveTab("assign")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Assignment
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TeacherHomework;
