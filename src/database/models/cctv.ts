
import { getDbConnection } from '../connection';

export interface CCTVCamera {
  camera_id?: number;
  camera_name: string;
  location: string;
  ip_address: string;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CCTVFeed {
  feed_id?: number;
  camera_id: number;
  timestamp: Date;
  image_path?: string;
  video_path?: string;
  detected_person_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface AISearchLog {
  log_id?: number;
  user_id: number;
  search_type: string;
  search_criteria: string;
  result?: any;
  searched_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export async function getAllCameras(): Promise<CCTVCamera[]> {
  const db = getDbConnection();
  return db('cctv_cameras').select('*');
}

export async function getCameraById(cameraId: number): Promise<CCTVCamera | undefined> {
  const db = getDbConnection();
  return db('cctv_cameras').where('camera_id', cameraId).first();
}

export async function createCamera(camera: CCTVCamera): Promise<number[]> {
  const db = getDbConnection();
  return db('cctv_cameras').insert(camera);
}

export async function updateCamera(cameraId: number, cameraData: Partial<CCTVCamera>): Promise<number> {
  const db = getDbConnection();
  return db('cctv_cameras').where('camera_id', cameraId).update(cameraData);
}

export async function deleteCamera(cameraId: number): Promise<number> {
  const db = getDbConnection();
  return db('cctv_cameras').where('camera_id', cameraId).delete();
}

export async function createCCTVFeed(feed: CCTVFeed): Promise<number[]> {
  const db = getDbConnection();
  return db('cctv_feeds').insert(feed);
}

export async function getFeedsByDateRange(startDate: Date, endDate: Date): Promise<CCTVFeed[]> {
  const db = getDbConnection();
  return db('cctv_feeds')
    .whereBetween('timestamp', [startDate, endDate])
    .orderBy('timestamp', 'desc');
}

export async function getFeedsByCamera(cameraId: number, limit: number = 100): Promise<CCTVFeed[]> {
  const db = getDbConnection();
  return db('cctv_feeds')
    .where('camera_id', cameraId)
    .orderBy('timestamp', 'desc')
    .limit(limit);
}

export async function logAISearch(searchLog: AISearchLog): Promise<number[]> {
  const db = getDbConnection();
  return db('ai_search_logs').insert(searchLog);
}

export async function getAISearchLogs(userId?: number, limit: number = 50): Promise<AISearchLog[]> {
  const db = getDbConnection();
  let query = db('ai_search_logs').orderBy('searched_at', 'desc').limit(limit);
  
  if (userId) {
    query = query.where('user_id', userId);
  }
  
  return query;
}

export async function getDetectionsByPerson(personId: number): Promise<CCTVFeed[]> {
  const db = getDbConnection();
  return db('cctv_feeds')
    .where('detected_person_id', personId)
    .orderBy('timestamp', 'desc');
}
