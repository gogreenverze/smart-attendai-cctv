
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Edit, Trash2, Search, Download, Upload, Book, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/database/service';

const Classes: React.FC = () => {
  const [classData, setClassData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddHomeworkDialogOpen, setIsAddHomeworkDialogOpen] = useState(false);
  const [isManageStudentsDialogOpen, setIsManageStudentsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [homework, setHomework] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newClass, setNewClass] = useState({
    name: '',
    section: '',
    students: 0,
    subjects: [] as string[],
    teacherInCharge: ''
  });
  
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: new Date()
  });

  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: ''
  });
  
  const { toast } = useToast();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const canManageClasses = isAdmin || isTeacher;

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classes = await DatabaseService.classes.getAllClasses();
        const fetchedSubjects = await DatabaseService.subjects.getAll();
        
        setClassData(classes);
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast({
          title: "Error",
          description: "Failed to fetch classes",
          variant: "destructive"
        });
      }
    };

    fetchClasses();
  }, [toast]);

  useEffect(() => {
    if (selectedClass) {
      const fetchSections = async () => {
        try {
          const sectionList = await DatabaseService.classes.getSectionsByClass(selectedClass.class_id);
          setSections(sectionList);

          if (sectionList.length > 0) {
            setSelectedSection(sectionList[0].section_id.toString());
            fetchHomework(selectedClass.class_id, sectionList[0].section_id);
            fetchStudents(selectedClass.class_id, sectionList[0].section_id);
          }
        } catch (error) {
          console.error('Error fetching sections:', error);
        }
      };

      fetchSections();
    }
  }, [selectedClass]);

  const fetchHomework = async (classId: number, sectionId?: number) => {
    try {
      const homeworkList = await DatabaseService.classes.getHomeworkByClass(classId, sectionId);
      setHomework(homeworkList);
    } catch (error) {
      console.error('Error fetching homework:', error);
    }
  };

  const fetchStudents = async (classId: number, sectionId?: number) => {
    try {
      const studentList = await DatabaseService.classes.getStudentsByClass(classId, sectionId);
      setStudents(studentList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const filteredClasses = classData.filter(cls => 
    cls.class_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClass = async () => {
    if (!newClass.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in the class name",
        variant: "destructive",
      });
      return;
    }

    try {
      // Add the class
      const [classId] = await DatabaseService.classes.createClass({
        class_name: newClass.name,
        academic_year: '2025-2026',
        board_type: 'TN State Board'
      });

      // Add sections A, B, C
      for (const section of ['A', 'B', 'C']) {
        await DatabaseService.classes.createSection({
          class_id: classId,
          section_name: section
        });
      }

      // Refresh class list
      const updatedClasses = await DatabaseService.classes.getAllClasses();
      setClassData(updatedClasses);

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
    } catch (error) {
      console.error('Error adding class:', error);
      toast({
        title: "Error",
        description: "Failed to add class",
        variant: "destructive"
      });
    }
  };

  const handleEditClass = async () => {
    if (!selectedClass) return;
    
    try {
      await DatabaseService.classes.updateClass(selectedClass.class_id, {
        class_name: selectedClass.class_name
      });

      // Refresh class list
      const updatedClasses = await DatabaseService.classes.getAllClasses();
      setClassData(updatedClasses);
      
      setIsEditDialogOpen(false);
      toast({
        title: "Class Updated",
        description: `${selectedClass.class_name} has been successfully updated`,
      });
    } catch (error) {
      console.error('Error updating class:', error);
      toast({
        title: "Error",
        description: "Failed to update class",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClass = async () => {
    if (!selectedClass) return;
    
    try {
      await DatabaseService.classes.deleteClass(selectedClass.class_id);

      // Refresh class list
      const updatedClasses = await DatabaseService.classes.getAllClasses();
      setClassData(updatedClasses);
      
      setIsDeleteDialogOpen(false);
      toast({
        title: "Class Deleted",
        description: `${selectedClass.class_name} has been removed`,
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      toast({
        title: "Error",
        description: "Failed to delete class",
        variant: "destructive"
      });
    }
  };

  const handleAddHomework = async () => {
    if (!newHomework.title || !newHomework.description || !selectedSubject || !selectedSection || !newHomework.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await DatabaseService.classes.createHomework({
        class_id: selectedClass?.class_id,
        section_id: parseInt(selectedSection),
        subject_id: parseInt(selectedSubject),
        teacher_id: 1, // Mock teacher ID
        title: newHomework.title,
        description: newHomework.description,
        due_date: newHomework.dueDate,
        is_active: true
      });

      // Refresh homework list
      fetchHomework(selectedClass?.class_id, parseInt(selectedSection));

      setNewHomework({
        title: '',
        description: '',
        subjectId: '',
        dueDate: new Date()
      });
      
      setIsAddHomeworkDialogOpen(false);
      toast({
        title: "Homework Added",
        description: `New homework assignment has been added`,
      });
    } catch (error) {
      console.error('Error adding homework:', error);
      toast({
        title: "Error",
        description: "Failed to add homework",
        variant: "destructive"
      });
    }
  };

  const handleAddStudent = async () => {
    if (!newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.rollNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the user first
      const [userId] = await DatabaseService.users.create({
        username: newStudent.email.split('@')[0],
        password_hash: 'default123', // In a real app, this would be properly hashed
        email: newStudent.email,
        role_id: 3, // Student role ID
        first_name: newStudent.firstName,
        last_name: newStudent.lastName,
        is_active: true
      });

      // Create the student record
      await DatabaseService.classes.createStudent({
        user_id: userId,
        roll_number: newStudent.rollNumber,
        class_id: selectedClass?.class_id,
        section_id: parseInt(selectedSection)
      });

      // Refresh student list
      fetchStudents(selectedClass?.class_id, parseInt(selectedSection));

      setNewStudent({
        firstName: '',
        lastName: '',
        email: '',
        rollNumber: ''
      });
      
      toast({
        title: "Student Added",
        description: `${newStudent.firstName} ${newStudent.lastName} has been added to the class`,
      });
    } catch (error) {
      console.error('Error adding student:', error);
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive"
      });
    }
  };

  const handleSectionChange = (sectionId: string) => {
    setSelectedSection(sectionId);
    fetchHomework(selectedClass?.class_id, parseInt(sectionId));
    fetchStudents(selectedClass?.class_id, parseInt(sectionId));
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Class Management</h1>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleImport}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canManageClasses && (
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
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input 
                      id="className" 
                      placeholder="e.g. 1st Standard" 
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academic">Academic Year</Label>
                    <Select defaultValue="2025-2026" disabled>
                      <SelectTrigger id="academic">
                        <SelectValue placeholder="Select academic year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025-2026">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="board">Board Type</Label>
                    <Select defaultValue="TN State Board" disabled>
                      <SelectTrigger id="board">
                        <SelectValue placeholder="Select board type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TN State Board">Tamil Nadu State Board</SelectItem>
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
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle>Class List</CardTitle>
              <CardDescription>Tamil Nadu State Board Classes</CardDescription>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                className="pl-8 w-full md:w-[250px]"
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
              <TabsTrigger value="class-details" disabled={!selectedClass}>Class Details</TabsTrigger>
            </TabsList>
            <TabsContent value="classes">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Board Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                          No classes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClasses.map((cls) => (
                        <TableRow key={cls.class_id}>
                          <TableCell className="font-medium">{cls.class_name}</TableCell>
                          <TableCell>{cls.academic_year}</TableCell>
                          <TableCell>{cls.board_type || "TN State Board"}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedClass(cls);
                                }}
                              >
                                <Book className="h-4 w-4" />
                              </Button>

                              {canManageClasses && (
                                <>
                                  <Dialog open={isEditDialogOpen && selectedClass?.class_id === cls.class_id} onOpenChange={(open) => {
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
                                          <div className="space-y-2">
                                            <Label htmlFor="editClassName">Class Name</Label>
                                            <Input 
                                              id="editClassName" 
                                              value={selectedClass.class_name}
                                              onChange={(e) => setSelectedClass({...selectedClass, class_name: e.target.value})}
                                            />
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="editAcademicYear">Academic Year</Label>
                                            <Select value={selectedClass.academic_year} disabled>
                                              <SelectTrigger id="editAcademicYear">
                                                <SelectValue placeholder="Select academic year" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="2025-2026">2025-2026</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Label htmlFor="editBoardType">Board Type</Label>
                                            <Select value={selectedClass.board_type || "TN State Board"} disabled>
                                              <SelectTrigger id="editBoardType">
                                                <SelectValue placeholder="Select board type" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="TN State Board">Tamil Nadu State Board</SelectItem>
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
                                  
                                  <Dialog open={isDeleteDialogOpen && selectedClass?.class_id === cls.class_id} onOpenChange={(open) => {
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
                                          <p><strong>Class:</strong> {selectedClass.class_name}</p>
                                          <p><strong>Academic Year:</strong> {selectedClass.academic_year}</p>
                                          <p><strong>Board:</strong> {selectedClass.board_type || "TN State Board"}</p>
                                        </div>
                                      )}
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                        <Button variant="destructive" onClick={handleDeleteClass}>Delete Class</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="class-details">
              {selectedClass && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{selectedClass.class_name}</h2>
                      <p className="text-muted-foreground">Tamil Nadu State Board • {selectedClass.academic_year}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {isTeacher && (
                        <Dialog open={isAddHomeworkDialogOpen} onOpenChange={setIsAddHomeworkDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="btn-primary">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Homework
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Homework</DialogTitle>
                              <DialogDescription>
                                Assign homework for the class
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="homeworkTitle">Title</Label>
                                <Input 
                                  id="homeworkTitle" 
                                  value={newHomework.title}
                                  onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="homeworkSection">Section</Label>
                                <Select value={selectedSection} onValueChange={handleSectionChange}>
                                  <SelectTrigger id="homeworkSection">
                                    <SelectValue placeholder="Select section" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {sections.map((section) => (
                                      <SelectItem key={section.section_id} value={section.section_id.toString()}>
                                        Section {section.section_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="homeworkSubject">Subject</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                  <SelectTrigger id="homeworkSubject">
                                    <SelectValue placeholder="Select subject" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {subjects.map((subject) => (
                                      <SelectItem key={subject.subject_id} value={subject.subject_id.toString()}>
                                        {subject.subject_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {newHomework.dueDate ? format(newHomework.dueDate, "PPP") : "Select a date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={newHomework.dueDate}
                                      onSelect={(date) => setNewHomework({...newHomework, dueDate: date || new Date()})}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="homeworkDescription">Description</Label>
                                <Textarea 
                                  id="homeworkDescription"
                                  rows={4}
                                  value={newHomework.description}
                                  onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddHomeworkDialogOpen(false)}>Cancel</Button>
                              <Button className="btn-primary" onClick={handleAddHomework}>Assign Homework</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      {isTeacher && (
                        <Dialog open={isManageStudentsDialogOpen} onOpenChange={setIsManageStudentsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Users className="h-4 w-4 mr-2" />
                              Manage Students
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Manage Students</DialogTitle>
                              <DialogDescription>
                                Add or remove students from {selectedClass.class_name}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="studentSection">Section</Label>
                                  <Select value={selectedSection} onValueChange={handleSectionChange}>
                                    <SelectTrigger id="studentSection">
                                      <SelectValue placeholder="Select section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {sections.map((section) => (
                                        <SelectItem key={section.section_id} value={section.section_id.toString()}>
                                          Section {section.section_name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h3 className="text-lg font-medium">Add New Student</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input 
                                      id="firstName" 
                                      value={newStudent.firstName}
                                      onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input 
                                      id="lastName" 
                                      value={newStudent.lastName}
                                      onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input 
                                      id="email" 
                                      type="email"
                                      value={newStudent.email}
                                      onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="rollNumber">Roll Number</Label>
                                    <Input 
                                      id="rollNumber" 
                                      value={newStudent.rollNumber}
                                      onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <Button className="mt-2" onClick={handleAddStudent}>Add Student</Button>
                              </div>

                              <div className="space-y-2">
                                <h3 className="text-lg font-medium">Current Students</h3>
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Roll Number</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {students.length === 0 ? (
                                        <TableRow>
                                          <TableCell colSpan={3} className="text-center py-4 text-gray-500">
                                            No students found
                                          </TableCell>
                                        </TableRow>
                                      ) : (
                                        students.map((student) => (
                                          <TableRow key={student.student_id}>
                                            <TableCell>{student.roll_number}</TableCell>
                                            <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                                            <TableCell>
                                              <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                              </Button>
                                              <Button variant="ghost" size="icon">
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                              </Button>
                                            </TableCell>
                                          </TableRow>
                                        ))
                                      )}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => setIsManageStudentsDialogOpen(false)}>Done</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>Sections</CardTitle>
                          <CardDescription>Manage class sections</CardDescription>
                        </div>
                        <Select value={selectedSection} onValueChange={handleSectionChange}>
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Select section" />
                          </SelectTrigger>
                          <SelectContent>
                            {sections.map((section) => (
                              <SelectItem key={section.section_id} value={section.section_id.toString()}>
                                Section {section.section_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="homework">
                        <TabsList className="mb-4">
                          <TabsTrigger value="homework">Homework</TabsTrigger>
                          <TabsTrigger value="students">Students</TabsTrigger>
                        </TabsList>
                        <TabsContent value="homework">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Subject</TableHead>
                                  <TableHead>Due Date</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {homework.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                      No homework assignments found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  homework.map((hw) => (
                                    <TableRow key={hw.homework_id}>
                                      <TableCell className="font-medium">{hw.title}</TableCell>
                                      <TableCell>{hw.subject_name}</TableCell>
                                      <TableCell>{format(new Date(hw.due_date), 'PPP')}</TableCell>
                                      <TableCell>
                                        {isTeacher && (
                                          <div className="flex space-x-2">
                                            <Button variant="ghost" size="icon">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </div>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                        <TabsContent value="students">
                          <div className="rounded-md border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Roll Number</TableHead>
                                  <TableHead>Name</TableHead>
                                  {isTeacher && <TableHead>Actions</TableHead>}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {students.length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={isTeacher ? 3 : 2} className="text-center py-4 text-gray-500">
                                      No students found
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  students.map((student) => (
                                    <TableRow key={student.student_id}>
                                      <TableCell>{student.roll_number}</TableCell>
                                      <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                                      {isTeacher && (
                                        <TableCell>
                                          <div className="flex space-x-2">
                                            <Button variant="ghost" size="icon">
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                              <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  ))
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Classes;
