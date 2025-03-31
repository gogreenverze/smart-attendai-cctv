
import { getDbConnection } from '../connection';

export interface Attendance {
  attendance_id?: number;
  student_id: number;
  date: string; // YYYY-MM-DD format
  status: 'present' | 'absent' | 'late';
  remarks?: string;
  marked_by: string;
  attendance_mode?: 'manual' | 'cctv' | 'rfid';
  created_at?: Date;
  updated_at?: Date;
}

export async function getAttendanceByDate(date: string): Promise<Attendance[]> {
  const db = getDbConnection();
  return db('attendance').where('date', date);
}

export async function getAttendanceByStudent(studentId: number): Promise<Attendance[]> {
  const db = getDbConnection();
  return db('attendance').where('student_id', studentId);
}

export async function getAttendanceByDateAndClass(date: string, classId: number): Promise<any[]> {
  const db = getDbConnection();
  return db('attendance')
    .join('students', 'attendance.student_id', '=', 'students.student_id')
    .join('users', 'students.user_id', '=', 'users.user_id')
    .where('attendance.date', date)
    .andWhere('students.class_id', classId)
    .select(
      'attendance.*',
      'students.roll_number',
      'users.first_name',
      'users.last_name'
    );
}

export async function createAttendance(attendance: Attendance): Promise<number[]> {
  const db = getDbConnection();
  return db('attendance').insert(attendance);
}

export async function updateAttendance(attendanceId: number, attendanceData: Partial<Attendance>): Promise<number> {
  const db = getDbConnection();
  return db('attendance').where('attendance_id', attendanceId).update(attendanceData);
}

export async function bulkCreateAttendance(attendanceRecords: Attendance[]): Promise<number[]> {
  const db = getDbConnection();
  return db('attendance').insert(attendanceRecords);
}

export async function getAttendanceStats(classId: number, startDate: string, endDate: string): Promise<any> {
  const db = getDbConnection();
  const results = await db.raw(`
    SELECT 
      status, 
      COUNT(*) as count,
      (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM attendance 
                           JOIN students ON attendance.student_id = students.student_id 
                           WHERE students.class_id = ? AND date BETWEEN ? AND ?)) as percentage
    FROM attendance 
    JOIN students ON attendance.student_id = students.student_id 
    WHERE students.class_id = ? AND date BETWEEN ? AND ?
    GROUP BY status
  `, [classId, startDate, endDate, classId, startDate, endDate]);
  
  return results;
}
