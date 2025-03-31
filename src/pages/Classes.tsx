
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Search, Download, Upload, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for classes
const initialClasses = [
  { id: 1, name: '9A', section: 'A', students: 42, subjects: ['Mathematics', 'Science', 'English'], teacherInCharge: 'Mrs. Sharma' },
  { id: 2, name: '10B', section: 'B', students: 39, subjects: ['Physics', 'Chemistry', 'Mathematics'], teacherInCharge: 'Mr. Kumar' },
  { id: 3, name: '8C', section: 'C', students: 45, subjects: ['English', 'Social Studies', 'Science'], teacherInCharge: 'Ms. Gupta' },
  { id: 4, name: '11A', section: 'A', students: 38, subjects: ['Computer Science', 'Mathematics', 'Physics'], teacherInCharge: 'Mr. Verma' },
  { id: 5, name: '7B', section: 'B', students: 44, subjects: ['Science', 'English', 'History'], teacherInCharge: 'Mrs. Patel' },
];

// Mock data for teachers
const teachers = [
  { id: 1, name: 'Mrs. Sharma', subject: 'Mathematics' },
  { id: 2, name: 'Mr. Kumar', subject: 'Physics' },
  { id: 3, name: 'Ms. Gupta', subject: 'English' },
  { id: 4, name: 'Mr. Verma', subject: 'Computer Science' },
  { id: 5, name: 'Mrs. Patel', subject: 'Science' },
];

// Mock data for subjects
const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English', 'Hindi', 'Social Studies', 'History', 
  'Geography', 'Computer Science', 'Physical Education'
];

interface ClassData {
  id: number;
  name: string;
  section: string;
  students: number;
  subjects: string[];
  teacherInCharge: string;
}

const Classes: React.FC = () => {
  const [classData, setClassData] = useState<ClassData[]>(initialClasses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [newClass, setNewClass] = useState({
    name: '',
    section: '',
    students: 0,
    subjects: [] as string[],
    teacherInCharge: ''
  });
  
  const { toast } = useToast();

  const filteredClasses = classData.filter(cls => 
    cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.teacherInCharge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClass = () => {
    if (!newClass.name || !newClass.section || !newClass.teacherInCharge) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newId = Math.max(0, ...classData.map(c => c.id)) + 1;
    setClassData([...classData, { id: newId, ...newClass }]);
    setNewClass({
      name: '',
      section: '',
      students: 0,
      subjects: [],
      teacherInCharge: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Class Added",
      description: `${newClass.name} has been successfully added`,
    });
  };

  const handleEditClass = () => {
    if (!selectedClass) return;
    
    setClassData(classData.map(cls => 
      cls.id === selectedClass.id ? selectedClass : cls
    ));
    setIsEditDialogOpen(false);
    toast({
      title: "Class Updated",
      description: `${selectedClass.name} has been successfully updated`,
    });
  };

  const handleDeleteClass = () => {
    if (!selectedClass) return;
    
    setClassData(classData.filter(cls => cls.id !== selectedClass.id));
    setIsDeleteDialogOpen(false);
    toast({
      title: "Class Deleted",
      description: `${selectedClass.name} has been removed`,
    });
  };

  const handleImport = () => {
    toast({
      title: "Import Not Available",
      description: "This feature would allow importing class data via CSV/Excel",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export Not Available",
      description: "This feature would allow exporting class data to CSV/Excel",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Class Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Enter the details for the new class
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input 
                      id="className" 
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input 
                      id="section" 
                      value={newClass.section}
                      onChange={(e) => setNewClass({...newClass, section: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="students">Number of Students</Label>
                  <Input 
                    id="students" 
                    type="number"
                    value={newClass.students || ''}
                    onChange={(e) => setNewClass({...newClass, students: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher in Charge</Label>
                  <Select onValueChange={(value) => setNewClass({...newClass, teacherInCharge: value})}>
                    <SelectTrigger id="teacher">
                      <SelectValue placeholder="Select a teacher" />
                    </SelectTrigger>
                    <SelectContent>
                      {teachers.map(teacher => (
                        <SelectItem key={teacher.id} value={teacher.name}>
                          {teacher.name} ({teacher.subject})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button className="btn-primary" onClick={handleAddClass}>Add Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Class List</CardTitle>
              <CardDescription>Manage all classes and sections</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-8 w-[250px]"
                placeholder="Search classes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classes">
            <TabsList className="mb-4">
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
            </TabsList>
            <TabsContent value="classes">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Teacher in Charge</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                          No classes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClasses.map((cls) => (
                        <TableRow key={cls.id}>
                          <TableCell className="font-medium">{cls.name}</TableCell>
                          <TableCell>{cls.section}</TableCell>
                          <TableCell>{cls.students}</TableCell>
                          <TableCell>{cls.teacherInCharge}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog open={isEditDialogOpen && selectedClass?.id === cls.id} onOpenChange={(open) => {
                                setIsEditDialogOpen(open);
                                if (!open) setSelectedClass(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedClass(cls)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Class</DialogTitle>
                                    <DialogDescription>
                                      Update the details for this class
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedClass && (
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="editClassName">Class Name</Label>
                                          <Input 
                                            id="editClassName" 
                                            value={selectedClass.name}
                                            onChange={(e) => setSelectedClass({...selectedClass, name: e.target.value})}
                                          />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="editSection">Section</Label>
                                          <Input 
                                            id="editSection" 
                                            value={selectedClass.section}
                                            onChange={(e) => setSelectedClass({...selectedClass, section: e.target.value})}
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="editStudents">Number of Students</Label>
                                        <Input 
                                          id="editStudents" 
                                          type="number"
                                          value={selectedClass.students}
                                          onChange={(e) => setSelectedClass({...selectedClass, students: parseInt(e.target.value) || 0})}
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="editTeacher">Teacher in Charge</Label>
                                        <Select 
                                          value={selectedClass.teacherInCharge}
                                          onValueChange={(value) => setSelectedClass({...selectedClass, teacherInCharge: value})}
                                        >
                                          <SelectTrigger id="editTeacher">
                                            <SelectValue placeholder="Select a teacher" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {teachers.map(teacher => (
                                              <SelectItem key={teacher.id} value={teacher.name}>
                                                {teacher.name} ({teacher.subject})
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                                    <Button className="btn-primary" onClick={handleEditClass}>Update Class</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog open={isDeleteDialogOpen && selectedClass?.id === cls.id} onOpenChange={(open) => {
                                setIsDeleteDialogOpen(open);
                                if (!open) setSelectedClass(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedClass(cls)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Delete Class</DialogTitle>
                                    <DialogDescription>
                                      Are you sure you want to delete this class? This action cannot be undone.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedClass && (
                                    <div className="py-4">
                                      <p><strong>Class:</strong> {selectedClass.name}</p>
                                      <p><strong>Section:</strong> {selectedClass.section}</p>
                                      <p><strong>Teacher:</strong> {selectedClass.teacherInCharge}</p>
                                    </div>
                                  )}
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleDeleteClass}>Delete Class</Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="sections">
              <div className="p-4 text-center text-gray-500">
                Section management would be displayed here
              </div>
            </TabsContent>
            <TabsContent value="subjects">
              <div className="p-4 text-center text-gray-500">
                Subject management would be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classes;
