import { pool } from "./db";

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS medicines (
        id VARCHAR(255) PRIMARY KEY,
        profile_id VARCHAR(255) REFERENCES profiles(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        dosage VARCHAR(255) NOT NULL,
        inventory_count INT NOT NULL,
        warning_level INT NOT NULL,
        schedule TEXT NOT NULL,
        is_archived BOOLEAN DEFAULT false,
        created_at BIGINT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS history_logs (
        id VARCHAR(255) PRIMARY KEY,
        medicine_id VARCHAR(255) REFERENCES medicines(id) ON DELETE CASCADE,
        profile_id VARCHAR(255) REFERENCES profiles(id) ON DELETE CASCADE,
        timestamp BIGINT NOT NULL,
        scheduled_time VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS health_records (
        id VARCHAR(255) PRIMARY KEY,
        profile_id VARCHAR(255) REFERENCES profiles(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        notes TEXT,
        created_at BIGINT NOT NULL
      );
    `);
    console.log('PostgreSQL tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
  } finally {
    process.exit();
  }
};

initDB();