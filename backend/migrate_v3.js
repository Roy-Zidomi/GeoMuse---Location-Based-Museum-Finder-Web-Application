require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrateV3() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Adding website_url column to museum table...');
    
    await client.query(`
      ALTER TABLE museum 
      ADD COLUMN IF NOT EXISTS website_url TEXT;
    `);

    await client.query('COMMIT');
    console.log('Migrasi V3 sukses! Kolom website_url telah ditambahkan.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration V3 failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrateV3();
