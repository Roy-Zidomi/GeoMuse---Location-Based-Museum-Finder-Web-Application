require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function migrateUsers() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Creating users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Ensure museum_interactions table exists...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS museum_interactions (
        id SERIAL PRIMARY KEY,
        museum_id INTEGER REFERENCES museum(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL, -- 'REVIEW' or 'PHOTO'
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        photo_url TEXT,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Adding user_id to museum_interactions...');
    // Check if column exists first to avoid error
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='museum_interactions' AND column_name='user_id';
    `);

    if (checkColumn.rows.length === 0) {
      await client.query(`
        ALTER TABLE museum_interactions 
        ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `);
    }

    await client.query('COMMIT');
    console.log('Migrasi User BERHASIL!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migrasi User Gagal:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrateUsers();
