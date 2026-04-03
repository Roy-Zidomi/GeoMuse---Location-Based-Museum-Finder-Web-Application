require('dotenv').config();
const { pool } = require('./src/config/db');

async function createFeatureTables() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Creating museum_reviews table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS museum_reviews (
        id SERIAL PRIMARY KEY,
        museum_id INTEGER REFERENCES museum(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        likes INTEGER DEFAULT 0,
        dislikes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating museum_photos table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS museum_photos (
        id SERIAL PRIMARY KEY,
        museum_id INTEGER REFERENCES museum(id) ON DELETE CASCADE,
        user_name VARCHAR(255) NOT NULL,
        photo_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query('COMMIT');
    console.log('Berhasil membuat tabel fitur tambahan!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Gagal:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

createFeatureTables();
