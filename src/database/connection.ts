
import knex, { Knex } from 'knex';
import { createTables, seedInitialData } from './schema';
import path from 'path';

// SQLite database connection configuration
let db: Knex | null = null;

export async function initializeDatabase(): Promise<Knex> {
  try {
    if (!db) {
      console.log('Initializing database connection...');
      
      db = knex({
        client: 'better-sqlite3',
        connection: {
          filename: path.resolve(__dirname, '../../school_attendance.sqlite'),
        },
        useNullAsDefault: true,
      });

      // Create tables if they don't exist
      await createTables(db);
      
      // Seed initial data
      await seedInitialData(db);
      
      console.log('Database initialized successfully');
    }
    
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export function getDbConnection(): Knex {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.destroy();
    db = null;
    console.log('Database connection closed');
  }
}
