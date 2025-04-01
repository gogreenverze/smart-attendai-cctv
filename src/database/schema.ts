
import { Knex } from 'knex';

// Database schema definitions

export async function createTables(knex: Knex): Promise<void> {
  // Check if tables already exist before creating them
  const tablesExist = await knex.schema.hasTable('users');
  
  if (!tablesExist) {
    // Roles table
    await knex.schema.createTable('roles', (table) => {
      table.increments('role_id').primary();
      table.string('role_name').notNullable().unique();
      table.jsonb('permissions').notNullable();
      table.timestamps(true, true);
    });

    // Users table
    await knex.schema.createTable('users', (table) => {
      table.increments('user_id').primary();
      table.string('username').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('email').notNullable().unique();
      table.integer('role_id').unsigned().notNullable();
      table.foreign('role_id').references('roles.role_id');
      table.string('first_name').notNullable();
      table.string('last_name').notNullable();
      table.string('profile_picture').nullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });

    // Classes table
    await knex.schema.createTable('classes', (table) => {
      table.increments('class_id').primary();
      table.string('class_name').notNullable().unique();
      table.string('academic_year').notNullable();
      table.string('board_type').defaultTo('TN State Board');
      table.timestamps(true, true);
    });

    // Sections table
    await knex.schema.createTable('sections', (table) => {
      table.increments('section_id').primary();
      table.string('section_name').notNullable();
      table.integer('class_id').unsigned().notNullable();
      table.foreign('class_id').references('classes.class_id');
      table.unique(['class_id', 'section_name']);
      table.timestamps(true, true);
    });

    // Subjects table
    await knex.schema.createTable('subjects', (table) => {
      table.increments('subject_id').primary();
      table.string('subject_name').notNullable();
      table.string('subject_code').notNullable().unique();
      table.timestamps(true, true);
    });

    // Teachers table
    await knex.schema.createTable('teachers', (table) => {
      table.increments('teacher_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.string('qualification').nullable();
      table.string('specialization').nullable();
      table.timestamps(true, true);
    });

    // Teacher_Subject assignments table
    await knex.schema.createTable('teacher_subjects', (table) => {
      table.increments('id').primary();
      table.integer('teacher_id').unsigned().notNullable();
      table.integer('subject_id').unsigned().notNullable();
      table.integer('class_id').unsigned().notNullable();
      table.integer('section_id').unsigned().notNullable();
      table.foreign('teacher_id').references('teachers.teacher_id');
      table.foreign('subject_id').references('subjects.subject_id');
      table.foreign('class_id').references('classes.class_id');
      table.foreign('section_id').references('sections.section_id');
      table.unique(['teacher_id', 'subject_id', 'class_id', 'section_id']);
      table.timestamps(true, true);
    });

    // Students table
    await knex.schema.createTable('students', (table) => {
      table.increments('student_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.string('roll_number').notNullable();
      table.integer('class_id').unsigned().notNullable();
      table.integer('section_id').unsigned().notNullable();
      table.foreign('class_id').references('classes.class_id');
      table.foreign('section_id').references('sections.section_id');
      table.unique(['roll_number', 'class_id', 'section_id']);
      table.timestamps(true, true);
    });

    // Parents table
    await knex.schema.createTable('parents', (table) => {
      table.increments('parent_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.string('phone_number').notNullable();
      table.timestamps(true, true);
    });

    // Parent-Student relationships
    await knex.schema.createTable('parent_students', (table) => {
      table.increments('id').primary();
      table.integer('parent_id').unsigned().notNullable();
      table.integer('student_id').unsigned().notNullable();
      table.foreign('parent_id').references('parents.parent_id');
      table.foreign('student_id').references('students.student_id');
      table.unique(['parent_id', 'student_id']);
      table.timestamps(true, true);
    });

    // Homework table - NEW
    await knex.schema.createTable('homework', (table) => {
      table.increments('homework_id').primary();
      table.integer('class_id').unsigned().notNullable();
      table.foreign('class_id').references('classes.class_id');
      table.integer('section_id').unsigned().notNullable();
      table.foreign('section_id').references('sections.section_id');
      table.integer('subject_id').unsigned().notNullable();
      table.foreign('subject_id').references('subjects.subject_id');
      table.integer('teacher_id').unsigned().notNullable();
      table.foreign('teacher_id').references('teachers.teacher_id');
      table.string('title').notNullable();
      table.text('description').notNullable();
      table.date('due_date').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });

    // Attendance table
    await knex.schema.createTable('attendance', (table) => {
      table.increments('attendance_id').primary();
      table.integer('student_id').unsigned().notNullable();
      table.foreign('student_id').references('students.student_id');
      table.date('date').notNullable();
      table.enum('status', ['present', 'absent', 'late']).notNullable();
      table.string('remarks').nullable();
      table.string('marked_by').notNullable();
      table.string('attendance_mode').defaultTo('manual'); // manual, cctv, rfid
      table.unique(['student_id', 'date']);
      table.timestamps(true, true);
    });

    // CCTV Cameras table
    await knex.schema.createTable('cctv_cameras', (table) => {
      table.increments('camera_id').primary();
      table.string('camera_name').notNullable().unique();
      table.string('location').notNullable();
      table.string('ip_address').notNullable();
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    });

    // CCTV Feeds table
    await knex.schema.createTable('cctv_feeds', (table) => {
      table.increments('feed_id').primary();
      table.integer('camera_id').unsigned().notNullable();
      table.foreign('camera_id').references('cctv_cameras.camera_id');
      table.timestamp('timestamp').notNullable();
      table.string('image_path').nullable();
      table.string('video_path').nullable();
      table.integer('detected_person_id').unsigned().nullable();
      table.foreign('detected_person_id').references('users.user_id');
      table.timestamps(true, true);
    });

    // AI Search Logs table
    await knex.schema.createTable('ai_search_logs', (table) => {
      table.increments('log_id').primary();
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('users.user_id');
      table.string('search_type').notNullable(); // face_recognition, object_detection
      table.string('search_criteria').notNullable();
      table.jsonb('result').nullable();
      table.timestamp('searched_at').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    });

    // Reports table
    await knex.schema.createTable('reports', (table) => {
      table.increments('report_id').primary();
      table.string('report_type').notNullable(); // attendance, cctv, performance
      table.integer('generated_by').unsigned().notNullable();
      table.foreign('generated_by').references('users.user_id');
      table.timestamp('generated_at').defaultTo(knex.fn.now());
      table.string('content_path').notNullable();
      table.jsonb('parameters').nullable();
      table.timestamps(true, true);
    });

    console.log('All tables created successfully');
  } else {
    console.log('Tables already exist');
  }
}

export async function seedInitialData(knex: Knex): Promise<void> {
  // Check if roles table has data
  const rolesCount = await knex('roles').count({ count: '*' }).first();
  
  if (rolesCount && Number(rolesCount.count) === 0) {
    // Seed roles
    await knex('roles').insert([
      { 
        role_name: 'Admin', 
        permissions: JSON.stringify({
          users: ['create', 'read', 'update', 'delete'],
          classes: ['create', 'read', 'update', 'delete'],
          attendance: ['create', 'read', 'update', 'delete'],
          cctv: ['read', 'search'],
          reports: ['create', 'read'],
          homework: ['create', 'read', 'update', 'delete']
        })
      },
      { 
        role_name: 'Teacher', 
        permissions: JSON.stringify({
          users: ['read'],
          classes: ['read'],
          students: ['create', 'read', 'update', 'delete'],
          attendance: ['create', 'read', 'update'],
          cctv: ['read'],
          reports: ['create', 'read'],
          homework: ['create', 'read', 'update', 'delete']
        })
      },
      { 
        role_name: 'Student', 
        permissions: JSON.stringify({
          users: ['read'],
          attendance: ['read'],
          reports: ['read'],
          homework: ['read']
        })
      },
      { 
        role_name: 'Parent', 
        permissions: JSON.stringify({
          users: ['read'],
          attendance: ['read'],
          reports: ['read'],
          homework: ['read']
        })
      },
      { 
        role_name: 'CCTV Operator', 
        permissions: JSON.stringify({
          cctv: ['read', 'search', 'update'],
          reports: ['create', 'read']
        })
      }
    ]);

    console.log('Initial roles added successfully');
  }

  // Add an admin user if there are no users
  const usersCount = await knex('users').count({ count: '*' }).first();
  
  if (usersCount && Number(usersCount.count) === 0) {
    // Get admin role id
    const adminRole = await knex('roles').where('role_name', 'Admin').first();
    
    if (adminRole) {
      await knex('users').insert({
        username: 'admin',
        // In a real application, this should be properly hashed
        password_hash: 'admin123', // This is a placeholder - would use bcrypt in production
        email: 'admin@school.com',
        role_id: adminRole.role_id,
        first_name: 'Admin',
        last_name: 'User',
        is_active: true
      });
      
      console.log('Initial admin user added successfully');
    }
  }
}
