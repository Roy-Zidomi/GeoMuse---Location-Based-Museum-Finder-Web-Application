require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrateV2() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('Adding harga_tiket and kepengurusan columns to museum table...');
    
    await client.query(`
      ALTER TABLE museum 
      ADD COLUMN IF NOT EXISTS harga_tiket TEXT,
      ADD COLUMN IF NOT EXISTS kepengurusan TEXT;
    `);

    await client.query('COMMIT');
    console.log('Migrasi V2 sukses! Kolom harga_tiket dan kepengurusan telah ditambahkan.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration V2 failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrateV2();
