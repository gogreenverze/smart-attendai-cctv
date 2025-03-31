
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
  students: []
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
    getWithRoles: async () => mockData.users.map((user: any) => ({ ...user, role_name: 'Mock Role' }))
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
  // Add sample classes
  mockData.classes = [
    { class_id: 1, class_name: '10th Grade', academic_year: '2025-2026', created_at: new Date(), updated_at: new Date() },
    { class_id: 2, class_name: '11th Grade', academic_year: '2025-2026', created_at: new Date(), updated_at: new Date() },
    { class_id: 3, class_name: '12th Grade', academic_year: '2025-2026', created_at: new Date(), updated_at: new Date() }
  ];
  
  // Add sample sections
  mockData.sections = [
    { section_id: 1, section_name: 'A', class_id: 1, created_at: new Date(), updated_at: new Date() },
    { section_id: 2, section_name: 'B', class_id: 1, created_at: new Date(), updated_at: new Date() },
    { section_id: 3, section_name: 'A', class_id: 2, created_at: new Date(), updated_at: new Date() },
    { section_id: 4, section_name: 'B', class_id: 2, created_at: new Date(), updated_at: new Date() },
    { section_id: 5, section_name: 'A', class_id: 3, created_at: new Date(), updated_at: new Date() },
    { section_id: 6, section_name: 'B', class_id: 3, created_at: new Date(), updated_at: new Date() }
  ];
  
  // Add sample students
  mockData.students = Array.from({ length: 60 }, (_, i) => ({
    student_id: i + 1,
    user_id: i + 100,
    roll_number: `S${i + 1}`,
    class_id: Math.ceil((i + 1) / 20),
    section_id: Math.ceil((i + 1) % 2 === 0 ? (i + 1) / 10 : (i + 1) / 10 - 0.5),
    created_at: new Date(),
    updated_at: new Date()
  }));
  
  // Add sample cameras
  mockData.cameras = [
    { camera_id: 1, camera_name: 'Main Gate', location: 'School Entrance', ip_address: '192.168.1.100', is_active: true, created_at: new Date(), updated_at: new Date() },
    { camera_id: 2, camera_name: 'Corridor 1', location: '1st Floor', ip_address: '192.168.1.101', is_active: true, created_at: new Date(), updated_at: new Date() },
    { camera_id: 3, camera_name: 'Corridor 2', location: '2nd Floor', ip_address: '192.168.1.102', is_active: true, created_at: new Date(), updated_at: new Date() }
  ];
  
  // Save initial mock data to localStorage
  localStorage.setItem('school_attendance_mock_data', JSON.stringify(mockData));
}

export default DatabaseService;
