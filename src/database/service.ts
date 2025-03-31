
import { initializeDatabase, getDbConnection, closeDatabase } from './connection';
import * as UserModel from './models/user';
import * as AttendanceModel from './models/attendance';
import * as CCTVModel from './models/cctv';
import * as ClassModel from './models/class';

// Initialize and export database service
export const DatabaseService = {
  // Initialization
  initialize: async () => {
    await initializeDatabase();
  },
  
  close: async () => {
    await closeDatabase();
  },
  
  // User related functions
  users: {
    getAll: UserModel.getAllUsers,
    getById: UserModel.getUserById,
    getByUsername: UserModel.getUserByUsername,
    create: UserModel.createUser,
    update: UserModel.updateUser,
    delete: UserModel.deleteUser,
    getWithRoles: UserModel.getUsersWithRoles
  },
  
  // Attendance related functions
  attendance: {
    getByDate: AttendanceModel.getAttendanceByDate,
    getByStudent: AttendanceModel.getAttendanceByStudent,
    getByDateAndClass: AttendanceModel.getAttendanceByDateAndClass,
    create: AttendanceModel.createAttendance,
    update: AttendanceModel.updateAttendance,
    bulkCreate: AttendanceModel.bulkCreateAttendance,
    getStats: AttendanceModel.getAttendanceStats
  },
  
  // CCTV related functions
  cctv: {
    // Camera management
    getAllCameras: CCTVModel.getAllCameras,
    getCameraById: CCTVModel.getCameraById,
    createCamera: CCTVModel.createCamera,
    updateCamera: CCTVModel.updateCamera,
    deleteCamera: CCTVModel.deleteCamera,
    
    // Feeds management
    createFeed: CCTVModel.createCCTVFeed,
    getFeedsByDateRange: CCTVModel.getFeedsByDateRange,
    getFeedsByCamera: CCTVModel.getFeedsByCamera,
    
    // AI search
    logAISearch: CCTVModel.logAISearch,
    getAISearchLogs: CCTVModel.getAISearchLogs,
    getDetectionsByPerson: CCTVModel.getDetectionsByPerson
  },
  
  // Class, section, and student related functions
  classes: {
    getAllClasses: ClassModel.getAllClasses,
    getClassById: ClassModel.getClassById,
    createClass: ClassModel.createClass,
    updateClass: ClassModel.updateClass,
    deleteClass: ClassModel.deleteClass,
    getSectionsByClass: ClassModel.getSectionsByClass,
    createSection: ClassModel.createSection,
    getStudentsByClass: ClassModel.getStudentsByClass,
    getStudentById: ClassModel.getStudentById,
    createStudent: ClassModel.createStudent,
    updateStudent: ClassModel.updateStudent,
    deleteStudent: ClassModel.deleteStudent,
    getClassWithStats: ClassModel.getClassWithStats
  },
  
  // Raw database access (for custom queries)
  raw: {
    query: async (sql: string, params: any[] = []) => {
      const db = getDbConnection();
      return db.raw(sql, params);
    }
  }
};

export default DatabaseService;
