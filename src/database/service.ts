
import { initializeDatabase, getDbConnection, closeDatabase } from './connection';
import * as UserModel from './models/user';
import * as AttendanceModel from './models/attendance';
import * as CCTVModel from './models/cctv';
import * as ClassModel from './models/class';

// Mock data for the browser environment
const mockData = {
  users: [],
  attendance: [],
  cameras: [],
  feeds: [],
  aiSearchLogs: [],
  classes: [],
  sections: [],
  students: [],
  homework: [],
  homework_status: [],
  subjects: []
};

// Initialize and export database service
export const DatabaseService = {
  // Initialization
  initialize: async () => {
    await initializeDatabase();
    console.log('DatabaseService initialized with mock data for browser');
    
    // Load any saved mock data from localStorage
    try {
      const savedData = localStorage.getItem('school_attendance_mock_data');
      if (savedData) {
        Object.assign(mockData, JSON.parse(savedData));
        console.log('Loaded mock data from localStorage');
      }
    } catch (error) {
      console.error('Failed to load mock data from localStorage:', error);
    }
  },
  
  close: async () => {
    await closeDatabase();
  },
  
  // User related functions
  users: {
    getAll: async () => mockData.users,
    getById: async (id: number) => mockData.users.find((user: any) => user.user_id === id),
    getByUsername: async (username: string) => mockData.users.find((user: any) => user.username === username),
    create: async (user: any) => {
      const newId = mockData.users.length > 0 ? Math.max(...mockData.users.map((u: any) => u.user_id)) + 1 : 1;
      const newUser = { ...user, user_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.users.push(newUser);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    update: async (id: number, userData: any) => {
      const index = mockData.users.findIndex((user: any) => user.user_id === id);
      if (index !== -1) {
        mockData.users[index] = { ...mockData.users[index], ...userData, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    delete: async (id: number) => {
      const initialLength = mockData.users.length;
      mockData.users = mockData.users.filter((user: any) => user.user_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.users.length;
    },
    getWithRoles: async () => {
      // Fix: Map real role names based on role_id instead of using "Mock Role"
      return mockData.users.map((user: any) => {
        let role_name = "unknown";
        switch (user.role_id) {
          case 1:
            role_name = "admin";
            break;
          case 2:
            role_name = "teacher";
            break;
          case 3:
            role_name = "student";
            break;
          case 4:
            role_name = "parent";
            break;
          case 5:
            role_name = "cctv_operator";
            break;
        }
        return { ...user, role_name };
      });
    }
  },
  
  // Attendance related functions
  attendance: {
    getByDate: async (date: string) => mockData.attendance.filter((a: any) => a.date === date),
    getByStudent: async (studentId: number) => mockData.attendance.filter((a: any) => a.student_id === studentId),
    getByDateAndClass: async (date: string, classId: number) => {
      const studentIds = mockData.students
        .filter((s: any) => s.class_id === classId)
        .map((s: any) => s.student_id);
        
      return mockData.attendance
        .filter((a: any) => a.date === date && studentIds.includes(a.student_id))
        .map((a: any) => {
          const student = mockData.students.find((s: any) => s.student_id === a.student_id);
          return {
            ...a,
            roll_number: student?.roll_number || 'Unknown',
            first_name: 'Mock',
            last_name: 'Student'
          };
        });
    },
    create: async (attendance: any) => {
      const newId = mockData.attendance.length > 0 ? Math.max(...mockData.attendance.map((a: any) => a.attendance_id)) + 1 : 1;
      const newAttendance = { ...attendance, attendance_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.attendance.push(newAttendance);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    update: async (id: number, data: any) => {
      const index = mockData.attendance.findIndex((a: any) => a.attendance_id === id);
      if (index !== -1) {
        mockData.attendance[index] = { ...mockData.attendance[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    bulkCreate: async (records: any[]) => {
      const newIds = [];
      for (const record of records) {
        const newId = mockData.attendance.length > 0 ? Math.max(...mockData.attendance.map((a: any) => a.attendance_id)) + 1 : 1;
        const newAttendance = { ...record, attendance_id: newId, created_at: new Date(), updated_at: new Date() };
        mockData.attendance.push(newAttendance);
        newIds.push(newId);
      }
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return newIds;
    },
    getStats: async (classId: number, startDate: string, endDate: string) => {
      // Simple mock implementation of stats
      return [
        { status: 'present', count: 25, percentage: 83.33 },
        { status: 'absent', count: 4, percentage: 13.33 },
        { status: 'late', count: 1, percentage: 3.33 }
      ];
    }
  },
  
  // CCTV related functions
  cctv: {
    // Camera management
    getAllCameras: async () => mockData.cameras,
    getCameraById: async (id: number) => mockData.cameras.find((c: any) => c.camera_id === id),
    createCamera: async (camera: any) => {
      const newId = mockData.cameras.length > 0 ? Math.max(...mockData.cameras.map((c: any) => c.camera_id)) + 1 : 1;
      const newCamera = { ...camera, camera_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.cameras.push(newCamera);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    updateCamera: async (id: number, data: any) => {
      const index = mockData.cameras.findIndex((c: any) => c.camera_id === id);
      if (index !== -1) {
        mockData.cameras[index] = { ...mockData.cameras[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    deleteCamera: async (id: number) => {
      const initialLength = mockData.cameras.length;
      mockData.cameras = mockData.cameras.filter((c: any) => c.camera_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.cameras.length;
    },
    
    // Feeds management
    createFeed: async (feed: any) => {
      const newId = mockData.feeds.length > 0 ? Math.max(...mockData.feeds.map((f: any) => f.feed_id)) + 1 : 1;
      const newFeed = { ...feed, feed_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.feeds.push(newFeed);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    getFeedsByDateRange: async (startDate: Date, endDate: Date) => {
      return mockData.feeds.filter((f: any) => {
        const feedDate = new Date(f.timestamp);
        return feedDate >= startDate && feedDate <= endDate;
      });
    },
    getFeedsByCamera: async (cameraId: number) => {
      return mockData.feeds.filter((f: any) => f.camera_id === cameraId);
    },
    
    // AI search
    logAISearch: async (searchLog: any) => {
      const newId = mockData.aiSearchLogs.length > 0 ? Math.max(...mockData.aiSearchLogs.map((l: any) => l.log_id)) + 1 : 1;
      const newLog = { ...searchLog, log_id: newId, searched_at: new Date(), created_at: new Date(), updated_at: new Date() };
      mockData.aiSearchLogs.push(newLog);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    getAISearchLogs: async (userId?: number) => {
      if (userId) {
        return mockData.aiSearchLogs.filter((l: any) => l.user_id === userId);
      }
      return mockData.aiSearchLogs;
    },
    getDetectionsByPerson: async (personId: number) => {
      return mockData.feeds.filter((f: any) => f.detected_person_id === personId);
    }
  },
  
  // Class, section, and student related functions
  classes: {
    getAllClasses: async () => mockData.classes,
    getClassById: async (id: number) => mockData.classes.find((c: any) => c.class_id === id),
    createClass: async (classData: any) => {
      const newId = mockData.classes.length > 0 ? Math.max(...mockData.classes.map((c: any) => c.class_id)) + 1 : 1;
      const newClass = { ...classData, class_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.classes.push(newClass);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    updateClass: async (id: number, data: any) => {
      const index = mockData.classes.findIndex((c: any) => c.class_id === id);
      if (index !== -1) {
        mockData.classes[index] = { ...mockData.classes[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    deleteClass: async (id: number) => {
      const initialLength = mockData.classes.length;
      mockData.classes = mockData.classes.filter((c: any) => c.class_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.classes.length;
    },
    getSectionsByClass: async (classId: number) => {
      return mockData.sections.filter((s: any) => s.class_id === classId);
    },
    createSection: async (section: any) => {
      const newId = mockData.sections.length > 0 ? Math.max(...mockData.sections.map((s: any) => s.section_id)) + 1 : 1;
      const newSection = { ...section, section_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.sections.push(newSection);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    getStudentsByClass: async (classId: number, sectionId?: number) => {
      let students = mockData.students.filter((s: any) => s.class_id === classId);
      if (sectionId) {
        students = students.filter((s: any) => s.section_id === sectionId);
      }
      return students.map((s: any) => ({
        ...s,
        first_name: 'Mock',
        last_name: 'Student',
        profile_picture: null
      }));
    },
    getStudentById: async (id: number) => {
      const student = mockData.students.find((s: any) => s.student_id === id);
      if (student) {
        return {
          ...student,
          first_name: 'Mock',
          last_name: 'Student',
          email: 'mock@example.com',
          profile_picture: null,
          class_name: 'Mock Class',
          section_name: 'A'
        };
      }
      return undefined;
    },
    createStudent: async (student: any) => {
      const newId = mockData.students.length > 0 ? Math.max(...mockData.students.map((s: any) => s.student_id)) + 1 : 1;
      const newStudent = { ...student, student_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.students.push(newStudent);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    updateStudent: async (id: number, data: any) => {
      const index = mockData.students.findIndex((s: any) => s.student_id === id);
      if (index !== -1) {
        mockData.students[index] = { ...mockData.students[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    deleteStudent: async (id: number) => {
      const initialLength = mockData.students.length;
      mockData.students = mockData.students.filter((s: any) => s.student_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.students.length;
    },
    getClassWithStats: async () => {
      // Mock implementation for class stats
      return mockData.classes.map((c: any) => ({
        class_id: c.class_id,
        class_name: c.class_name,
        total_students: Math.floor(Math.random() * 40) + 20,
        attendance_today: Math.floor(Math.random() * 40) + 15,
        present_count: Math.floor(Math.random() * 35) + 15,
        absent_count: Math.floor(Math.random() * 5),
        late_count: Math.floor(Math.random() * 3)
      }));
    },
    // Homework related functions
    createHomework: async (homework: any) => {
      const newId = mockData.homework.length > 0 ? Math.max(...mockData.homework.map((h: any) => h.homework_id)) + 1 : 1;
      const newHomework = { ...homework, homework_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.homework.push(newHomework);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    getHomeworkByClass: async (classId: number, sectionId?: number) => {
      let homework = mockData.homework.filter((h: any) => h.class_id === classId);
      if (sectionId) {
        homework = homework.filter((h: any) => h.section_id === sectionId);
      }
      return homework.map((h: any) => {
        const subject = mockData.subjects.find((s: any) => s.subject_id === h.subject_id) || { subject_name: 'Unknown' };
        return {
          ...h,
          subject_name: subject.subject_name,
          first_name: 'Teacher',
          last_name: 'Name'
        };
      });
    },
    getHomeworkForStudent: async (studentId: string, classId: number, sectionId: number) => {
      let homework = mockData.homework.filter((h: any) => 
        h.class_id === classId && h.section_id === sectionId
      );
      
      return homework.map((h: any) => {
        const subject = mockData.subjects.find((s: any) => s.subject_id === h.subject_id) || { subject_name: 'Unknown' };
        const status = mockData.homework_status.find((s: any) => 
          s.homework_id === h.homework_id && s.student_id === studentId
        );
        
        return {
          ...h,
          subject_name: subject.subject_name,
          first_name: 'Teacher',
          last_name: 'Name',
          status: status?.status || 'pending',
          comments: status?.comments || '',
          submission_date: status?.submission_date || null,
          updated_at: status?.updated_at || h.updated_at
        };
      });
    },
    getHomeworkHistory: async (studentId: string) => {
      const statuses = mockData.homework_status.filter((s: any) => 
        s.student_id === studentId && s.status === 'completed'
      );
      
      return statuses.map((status: any) => {
        const homework = mockData.homework.find((h: any) => h.homework_id === status.homework_id);
        if (!homework) return null;
        
        const subject = mockData.subjects.find((s: any) => s.subject_id === homework.subject_id) || { subject_name: 'Unknown' };
        
        return {
          ...homework,
          subject_name: subject.subject_name,
          first_name: 'Teacher',
          last_name: 'Name',
          status: status.status,
          comments: status.comments || '',
          submission_date: status.submission_date,
          updated_at: status.updated_at
        };
      }).filter(Boolean);
    },
    updateHomeworkStatus: async (statusData: any) => {
      const existing = mockData.homework_status.findIndex((s: any) => 
        s.homework_id === statusData.homework_id && s.student_id === statusData.student_id
      );
      
      const now = new Date();
      
      if (existing !== -1) {
        // Update existing
        mockData.homework_status[existing] = {
          ...mockData.homework_status[existing],
          status: statusData.status,
          comments: statusData.comments,
          updated_at: now
        };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return [mockData.homework_status[existing].status_id];
      } else {
        // Create new
        const newId = mockData.homework_status.length > 0 
          ? Math.max(...mockData.homework_status.map((s: any) => s.status_id)) + 1 
          : 1;
          
        const newStatus = {
          status_id: newId,
          homework_id: statusData.homework_id,
          student_id: statusData.student_id,
          status: statusData.status,
          comments: statusData.comments,
          submission_date: now,
          updated_at: now
        };
        
        mockData.homework_status.push(newStatus);
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return [newId];
      }
    },
    getHomeworkById: async (id: number) => {
      const homework = mockData.homework.find((h: any) => h.homework_id === id);
      if (homework) {
        const subject = mockData.subjects.find((s: any) => s.subject_id === homework.subject_id) || { subject_name: 'Unknown' };
        const classData = mockData.classes.find((c: any) => c.class_id === homework.class_id) || { class_name: 'Unknown' };
        const section = mockData.sections.find((s: any) => s.section_id === homework.section_id) || { section_name: 'Unknown' };
        
        return {
          ...homework,
          subject_name: subject.subject_name,
          first_name: 'Teacher',
          last_name: 'Name',
          class_name: classData.class_name,
          section_name: section.section_name
        };
      }
      return undefined;
    },
    updateHomework: async (id: number, data: any) => {
      const index = mockData.homework.findIndex((h: any) => h.homework_id === id);
      if (index !== -1) {
        mockData.homework[index] = { ...mockData.homework[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    deleteHomework: async (id: number) => {
      const initialLength = mockData.homework.length;
      mockData.homework = mockData.homework.filter((h: any) => h.homework_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.homework.length;
    },
    
    // New function for enrolling students
    enrollStudent: async (data: { class_id: number, section_id: number, student_id: number }) => {
      const { class_id, section_id, student_id } = data;
      const studentIndex = mockData.students.findIndex((s: any) => s.student_id === student_id);
      
      if (studentIndex === -1) return 0;
      
      mockData.students[studentIndex] = {
        ...mockData.students[studentIndex],
        class_id,
        section_id,
        updated_at: new Date()
      };
      
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return 1;
    },
    
    // New function to create a student with user
    createStudentWithUser: async (studentData: any) => {
      // First create user
      const userId = await DatabaseService.users.create({
        username: studentData.username,
        password_hash: 'default_password',
        email: studentData.email,
        role_id: 3, // Student role
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        is_active: true
      });
      
      // Then create student record
      const newId = mockData.students.length > 0 ? Math.max(...mockData.students.map((s: any) => s.student_id)) + 1 : 1;
      const newStudent = { 
        student_id: newId, 
        user_id: userId[0], 
        roll_number: studentData.roll_number,
        class_id: studentData.class_id,
        section_id: studentData.section_id,
        created_at: new Date(), 
        updated_at: new Date() 
      };
      mockData.students.push(newStudent);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
  },
  
  // Subject related functions
  subjects: {
    getAll: async () => mockData.subjects,
    getById: async (id: number) => mockData.subjects.find((s: any) => s.subject_id === id),
    create: async (subject: any) => {
      const newId = mockData.subjects.length > 0 ? Math.max(...mockData.subjects.map((s: any) => s.subject_id)) + 1 : 1;
      const newSubject = { ...subject, subject_id: newId, created_at: new Date(), updated_at: new Date() };
      mockData.subjects.push(newSubject);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return [newId];
    },
    update: async (id: number, data: any) => {
      const index = mockData.subjects.findIndex((s: any) => s.subject_id === id);
      if (index !== -1) {
        mockData.subjects[index] = { ...mockData.subjects[index], ...data, updated_at: new Date() };
        localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
        return 1;
      }
      return 0;
    },
    delete: async (id: number) => {
      const initialLength = mockData.subjects.length;
      mockData.subjects = mockData.subjects.filter((s: any) => s.subject_id !== id);
      localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
      return initialLength - mockData.subjects.length;
    }
  },
  
  // Raw database access (for custom queries)
  raw: {
    query: async (sql: string, params: any[] = []) => {
      console.log('Mock raw query:', sql, params);
      return { rows: [] };
    }
  }
};

// Initialize with some sample data if empty
if (mockData.classes.length === 0) {
  // Add TN State Board classes (1st to 12th)
  mockData.classes = [
    { class_id: 1, class_name: '1st Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 2, class_name: '2nd Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 3, class_name: '3rd Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 4, class_name: '4th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 5, class_name: '5th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 6, class_name: '6th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 7, class_name: '7th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 8, class_name: '8th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 9, class_name: '9th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 10, class_name: '10th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 11, class_name: '11th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() },
    { class_id: 12, class_name: '12th Standard', academic_year: '2025-2026', board_type: 'TN State Board', created_at: new Date(), updated_at: new Date() }
  ];
  
  // Add sample sections
  mockData.sections = [];
  for (let i = 1; i <= 12; i++) {
    mockData.sections.push(
      { section_id: (i-1)*3 + 1, section_name: 'A', class_id: i, created_at: new Date(), updated_at: new Date() },
      { section_id: (i-1)*3 + 2, section_name: 'B', class_id: i, created_at: new Date(), updated_at: new Date() },
      { section_id: (i-1)*3 + 3, section_name: 'C', class_id: i, created_at: new Date(), updated_at: new Date() }
    );
  }
  
  // Add TN State Board subjects
  mockData.subjects = [
    { subject_id: 1, subject_name: 'Tamil', subject_code: 'TM101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 2, subject_name: 'English', subject_code: 'EN101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 3, subject_name: 'Mathematics', subject_code: 'MA101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 4, subject_name: 'Science', subject_code: 'SC101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 5, subject_name: 'Social Science', subject_code: 'SS101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 6, subject_name: 'Physics', subject_code: 'PH101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 7, subject_name: 'Chemistry', subject_code: 'CH101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 8, subject_name: 'Biology', subject_code: 'BI101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 9, subject_name: 'Computer Science', subject_code: 'CS101', created_at: new Date(), updated_at: new Date() },
    { subject_id: 10, subject_name: 'History', subject_code: 'HI101', created_at: new Date(), updated_at: new Date() }
  ];
  
  // Add sample students
  mockData.students = Array.from({ length: 120 }, (_, i) => ({
    student_id: i + 1,
    user_id: i + 100,
    roll_number: `S${i + 1}`,
    class_id: Math.floor(i / 10) + 1, // Distributing students across classes
    section_id: ((i % 3) + 1) + (Math.floor(i / 10) * 3), // Distributing students across sections
    created_at: new Date(),
    updated_at: new Date()
  }));
  
  // Add sample cameras
  mockData.cameras = [
    { camera_id: 1, camera_name: 'Main Gate', location: 'School Entrance', ip_address: '192.168.1.100', is_active: true, created_at: new Date(), updated_at: new Date() },
    { camera_id: 2, camera_name: 'Corridor 1', location: '1st Floor', ip_address: '192.168.1.101', is_active: true, created_at: new Date(), updated_at: new Date() },
    { camera_id: 3, camera_name: 'Corridor 2', location: '2nd Floor', ip_address: '192.168.1.102', is_active: true, created_at: new Date(), updated_at: new Date() }
  ];

  // Add sample homework
  mockData.homework = [
    { 
      homework_id: 1,
      class_id: 10,
      section_id: 28,
      subject_id: 3,
      teacher_id: 1,
      title: 'Mathematics Practice Problems',
      description: 'Complete exercises 1-10 from Chapter 5',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    { 
      homework_id: 2,
      class_id: 10,
      section_id: 28,
      subject_id: 2,
      teacher_id: 1,
      title: 'English Essay',
      description: 'Write a 500-word essay on "My Favorite Book"',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  // Add sample homework status
  mockData.homework_status = [
    {
      status_id: 1,
      homework_id: 1,
      student_id: "3", // Student with ID 3
      status: "accepted",
      comments: "Working on this",
      submission_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updated_at: new Date()
    },
    {
      status_id: 2,
      homework_id: 2,
      student_id: "3", // Student with ID 3
      status: "completed",
      comments: "Completed my essay on Harry Potter",
      submission_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updated_at: new Date() 
    }
  ];
  
  // Save initial mock data to localStorage
  localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
}

export default DatabaseService;
