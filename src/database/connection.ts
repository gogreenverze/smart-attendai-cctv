
// This is a browser-compatible mock implementation of the database connection
import { Knex } from 'knex';

// Mock database connection for browser environment
let db: any = null;

export async function initializeDatabase(): Promise<any> {
  try {
    if (!db) {
      console.log('Initializing mock database in browser environment...');
      
      // Create mock db object
      db = {
        schema: {
          hasTable: async () => false,
          createTable: async () => true,
        },
        // Additional mock methods will be added as needed
        raw: async (sql: string) => ({ rows: [] }),
        select: () => db,
        where: () => db,
        insert: () => [1],
        update: () => 1,
        delete: () => 1,
        join: () => db,
        andWhere: () => db,
        first: () => ({}),
        count: () => db,
        orderBy: () => db,
        limit: () => db,
        whereBetween: () => db,
      };
      
      console.log('Mock database initialized successfully');
    }
    
    return db;
  } catch (error) {
    console.error('Error initializing mock database:', error);
    throw error;
  }
}

export function getDbConnection(): any {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    db = null;
    console.log('Mock database connection closed');
  }
}
