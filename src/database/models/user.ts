
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
