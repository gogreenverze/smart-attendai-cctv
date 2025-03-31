
import { getDbConnection } from '../connection';

export interface Class {
  class_id?: number;
  class_name: string;
  academic_year: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Section {
  section_id?: number;
  section_name: string;
  class_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface Student {
  student_id?: number;
  user_id: number;
  roll_number: string;
  class_id: number;
  section_id: number;
  created_at?: Date;
  updated_at?: Date;
}

// Class related functions
export async function getAllClasses(): Promise<Class[]> {
  const db = getDbConnection();
  return db('classes').select('*');
}

export async function getClassById(classId: number): Promise<Class | undefined> {
  const db = getDbConnection();
  return db('classes').where('class_id', classId).first();
}

export async function createClass(classData: Class): Promise<number[]> {
  const db = getDbConnection();
  return db('classes').insert(classData);
}

export async function updateClass(classId: number, classData: Partial<Class>): Promise<number> {
  const db = getDbConnection();
  return db('classes').where('class_id', classId).update(classData);
}

export async function deleteClass(classId: number): Promise<number> {
  const db = getDbConnection();
  return db('classes').where('class_id', classId).delete();
}

// Section related functions
export async function getSectionsByClass(classId: number): Promise<Section[]> {
  const db = getDbConnection();
  return db('sections').where('class_id', classId);
}

export async function createSection(section: Section): Promise<number[]> {
  const db = getDbConnection();
  return db('sections').insert(section);
}

// Student related functions
export async function getStudentsByClass(classId: number, sectionId?: number): Promise<any[]> {
  const db = getDbConnection();
  let query = db('students')
    .join('users', 'students.user_id', '=', 'users.user_id')
    .where('students.class_id', classId)
    .select(
      'students.*',
      'users.first_name',
      'users.last_name',
      'users.profile_picture'
    );

  if (sectionId) {
    query = query.where('students.section_id', sectionId);
  }

  return query;
}

export async function getStudentById(studentId: number): Promise<any | undefined> {
  const db = getDbConnection();
  return db('students')
    .join('users', 'students.user_id', '=', 'users.user_id')
    .join('classes', 'students.class_id', '=', 'classes.class_id')
    .join('sections', 'students.section_id', '=', 'sections.section_id')
    .where('students.student_id', studentId)
    .select(
      'students.*',
      'users.first_name',
      'users.last_name',
      'users.email',
      'users.profile_picture',
      'classes.class_name',
      'sections.section_name'
    )
    .first();
}

export async function createStudent(student: Student): Promise<number[]> {
  const db = getDbConnection();
  return db('students').insert(student);
}

export async function updateStudent(studentId: number, studentData: Partial<Student>): Promise<number> {
  const db = getDbConnection();
  return db('students').where('student_id', studentId).update(studentData);
}

export async function deleteStudent(studentId: number): Promise<number> {
  const db = getDbConnection();
  return db('students').where('student_id', studentId).delete();
}

export async function getClassWithStats(): Promise<any[]> {
  const db = getDbConnection();
  const today = new Date().toISOString().split('T')[0];
  
  return db.raw(`
    SELECT 
      c.class_id,
      c.class_name,
      COUNT(DISTINCT s.student_id) as total_students,
      COUNT(DISTINCT a.attendance_id) as attendance_today,
      SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
      SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
      SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count
    FROM 
      classes c
      LEFT JOIN sections sec ON c.class_id = sec.class_id
      LEFT JOIN students s ON c.class_id = s.class_id
      LEFT JOIN attendance a ON s.student_id = a.student_id AND a.date = ?
    GROUP BY 
      c.class_id, c.class_name
    ORDER BY 
      c.class_name
  `, [today]);
}
