
import { getDbConnection } from '../connection';

export interface User {
  user_id?: number;
  username: string;
  password_hash: string;
  email: string;
  role_id: number;
  first_name: string;
  last_name: string;
  profile_picture?: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Teacher {
  teacher_id?: number;
  user_id: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface TeacherAssignment {
  assignment_id?: number;
  teacher_id: number;
  class_id: number;
  section_id: number;
  subject_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllUsers(): Promise<User[]> {
  const db = getDbConnection();
  return db('users').select('*');
}

export async function getUserById(userId: number): Promise<User | undefined> {
  const db = getDbConnection();
  return db('users').where('user_id', userId).first();
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const db = getDbConnection();
  return db('users').where('username', username).first();
}

export async function createUser(user: User): Promise<number[]> {
  const db = getDbConnection();
  return db('users').insert(user);
}

export async function updateUser(userId: number, userData: Partial<User>): Promise<number> {
  const db = getDbConnection();
  return db('users').where('user_id', userId).update(userData);
}

export async function deleteUser(userId: number): Promise<number> {
  const db = getDbConnection();
  return db('users').where('user_id', userId).delete();
}

export async function getUsersWithRoles(): Promise<any[]> {
  const db = getDbConnection();
  return db('users')
    .join('roles', 'users.role_id', '=', 'roles.role_id')
    .select('users.*', 'roles.role_name');
}

// Teacher-related functions
export async function createTeacher(teacher: Teacher): Promise<number[]> {
  const db = getDbConnection();
  return db('teachers').insert(teacher);
}

export async function getTeacherByUserId(userId: number): Promise<any | undefined> {
  const db = getDbConnection();
  return db('teachers').where('user_id', userId).first();
}

export async function assignTeacherToClass(assignment: TeacherAssignment): Promise<number[]> {
  const db = getDbConnection();
  return db('teacher_assignments').insert(assignment);
}

export async function removeTeacherAssignment(assignmentId: number): Promise<number> {
  const db = getDbConnection();
  return db('teacher_assignments').where('assignment_id', assignmentId).delete();
}

export async function getTeacherAssignments(teacherId: number): Promise<any[]> {
  const db = getDbConnection();
  return db('teacher_assignments')
    .join('classes', 'teacher_assignments.class_id', '=', 'classes.class_id')
    .join('sections', 'teacher_assignments.section_id', '=', 'sections.section_id')
    .leftJoin('subjects', 'teacher_assignments.subject_id', '=', 'subjects.subject_id')
    .where('teacher_assignments.teacher_id', teacherId)
    .select(
      'teacher_assignments.*',
      'classes.class_name',
      'sections.section_name',
      'subjects.subject_name'
    );
}

export async function getTeachersWithAssignments(): Promise<any[]> {
  const db = getDbConnection();
  return db('teachers')
    .join('users', 'teachers.user_id', '=', 'users.user_id')
    .leftJoin('teacher_assignments', 'teachers.teacher_id', '=', 'teacher_assignments.teacher_id')
    .leftJoin('classes', 'teacher_assignments.class_id', '=', 'classes.class_id')
    .leftJoin('sections', 'teacher_assignments.section_id', '=', 'sections.section_id')
    .select(
      'teachers.*',
      'users.first_name',
      'users.last_name',
      'users.email',
      'users.username',
      db.raw('GROUP_CONCAT(DISTINCT classes.class_name) as assigned_classes'),
      db.raw('COUNT(DISTINCT teacher_assignments.assignment_id) as assignment_count')
    )
    .groupBy('teachers.teacher_id');
}
