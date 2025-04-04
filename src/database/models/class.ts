
import { getDbConnection } from '../connection';

export interface Class {
  class_id?: number;
  class_name: string;
  academic_year: string;
  board_type?: string;
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

export interface Homework {
  homework_id?: number;
  class_id: number;
  section_id: number;
  subject_id: number;
  teacher_id: number;
  title: string;
  description: string;
  due_date: Date;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface HomeworkStatus {
  status_id?: number;
  homework_id: number;
  student_id: string;
  status: 'pending' | 'accepted' | 'completed';
  comments?: string | null;
  submission_date?: Date;
  updated_at?: Date;
}

// Class related functions
export async function getAllClasses(): Promise<Class[]> {
  const db = getDbConnection();
  return db('classes').select('*').orderBy('class_name');
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

// Homework related functions
export async function createHomework(homework: Homework): Promise<number[]> {
  const db = getDbConnection();
  return db('homework').insert(homework);
}

export async function getHomeworkByClass(classId: number, sectionId?: number): Promise<any[]> {
  const db = getDbConnection();
  let query = db('homework')
    .join('subjects', 'homework.subject_id', '=', 'subjects.subject_id')
    .join('teachers', 'homework.teacher_id', '=', 'teachers.teacher_id')
    .join('users', 'teachers.user_id', '=', 'users.user_id')
    .where('homework.class_id', classId)
    .select(
      'homework.*',
      'subjects.subject_name',
      'users.first_name',
      'users.last_name'
    );

  if (sectionId) {
    query = query.where('homework.section_id', sectionId);
  }

  return query.orderBy('homework.due_date', 'desc');
}

export async function getHomeworkForStudent(studentId: string, classId: number, sectionId: number): Promise<any[]> {
  const db = getDbConnection();
  return db('homework')
    .join('subjects', 'homework.subject_id', '=', 'subjects.subject_id')
    .join('teachers', 'homework.teacher_id', '=', 'teachers.teacher_id')
    .join('users', 'teachers.user_id', '=', 'users.user_id')
    .leftJoin('homework_status', function() {
      this.on('homework.homework_id', '=', 'homework_status.homework_id')
        .andOn('homework_status.student_id', '=', db.raw('?', [studentId]));
    })
    .where('homework.class_id', classId)
    .where('homework.section_id', sectionId)
    .select(
      'homework.*',
      'subjects.subject_name',
      'users.first_name',
      'users.last_name',
      'homework_status.status',
      'homework_status.comments',
      'homework_status.submission_date',
      'homework_status.updated_at as status_updated_at'
    )
    .orderBy('homework.due_date', 'desc');
}

export async function getHomeworkHistory(studentId: string): Promise<any[]> {
  const db = getDbConnection();
  return db('homework_status')
    .join('homework', 'homework_status.homework_id', '=', 'homework.homework_id')
    .join('subjects', 'homework.subject_id', '=', 'subjects.subject_id')
    .join('teachers', 'homework.teacher_id', '=', 'teachers.teacher_id')
    .join('users', 'teachers.user_id', '=', 'users.user_id')
    .where('homework_status.student_id', studentId)
    .where('homework_status.status', 'completed')
    .select(
      'homework.*',
      'subjects.subject_name',
      'users.first_name',
      'users.last_name',
      'homework_status.status',
      'homework_status.comments',
      'homework_status.submission_date',
      'homework_status.updated_at as status_updated_at'
    )
    .orderBy('homework_status.updated_at', 'desc');
}

export async function updateHomeworkStatus(statusData: HomeworkStatus): Promise<number[]> {
  const db = getDbConnection();
  
  // Check if a status record already exists
  const existing = await db('homework_status')
    .where({
      homework_id: statusData.homework_id,
      student_id: statusData.student_id
    })
    .first();
  
  const now = new Date();
  
  if (existing) {
    // Update existing status
    await db('homework_status')
      .where({
        homework_id: statusData.homework_id,
        student_id: statusData.student_id
      })
      .update({
        status: statusData.status,
        comments: statusData.comments,
        updated_at: now
      });
    
    return [existing.status_id];
  } else {
    // Insert new status
    return db('homework_status').insert({
      homework_id: statusData.homework_id,
      student_id: statusData.student_id,
      status: statusData.status,
      comments: statusData.comments,
      submission_date: now,
      updated_at: now
    });
  }
}

export async function getHomeworkById(homeworkId: number): Promise<any | undefined> {
  const db = getDbConnection();
  return db('homework')
    .join('subjects', 'homework.subject_id', '=', 'subjects.subject_id')
    .join('teachers', 'homework.teacher_id', '=', 'teachers.teacher_id')
    .join('users', 'teachers.user_id', '=', 'users.user_id')
    .join('classes', 'homework.class_id', '=', 'classes.class_id')
    .join('sections', 'homework.section_id', '=', 'sections.section_id')
    .where('homework.homework_id', homeworkId)
    .select(
      'homework.*',
      'subjects.subject_name',
      'users.first_name',
      'users.last_name',
      'classes.class_name',
      'sections.section_name'
    )
    .first();
}

export async function updateHomework(homeworkId: number, homeworkData: Partial<Homework>): Promise<number> {
  const db = getDbConnection();
  return db('homework').where('homework_id', homeworkId).update(homeworkData);
}

export async function deleteHomework(homeworkId: number): Promise<number> {
  const db = getDbConnection();
  return db('homework').where('homework_id', homeworkId).delete();
}

