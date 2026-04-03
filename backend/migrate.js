require('dotenv').config();
const { pool } = require('./src/config/db');

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    console.log('1. Populating Provinsi...');
    await client.query(`
      INSERT INTO provinsi (nama_provinsi)
      SELECT DISTINCT provinsi FROM temp_museum
      WHERE provinsi IS NOT NULL AND provinsi != ''
      AND NOT EXISTS (SELECT 1 FROM provinsi p2 WHERE p2.nama_provinsi = temp_museum.provinsi);
    `);

    console.log('2. Populating Kabupaten...');
    await client.query(`
      INSERT INTO kabupaten (provinsi_id, nama_kabupaten)
      SELECT DISTINCT p.id, t.kabupaten
      FROM temp_museum t
      JOIN provinsi p ON t.provinsi = p.nama_provinsi
      WHERE t.kabupaten IS NOT NULL AND t.kabupaten != ''
      AND NOT EXISTS (
        SELECT 1 FROM kabupaten k2 
        WHERE k2.nama_kabupaten = t.kabupaten AND k2.provinsi_id = p.id
      );
    `);

    console.log('3. Populating Kategori...');
    await client.query(`
      INSERT INTO kategori (nama_kategori)
      SELECT DISTINCT kategori FROM temp_museum
      WHERE kategori IS NOT NULL AND kategori != ''
      AND NOT EXISTS (SELECT 1 FROM kategori kt WHERE kt.nama_kategori = temp_museum.kategori);
    `);

    console.log('4. Updating Museum Foreign Keys...');
    await client.query(`
      UPDATE museum m
      SET 
        provinsi_id = p.id,
        kabupaten_id = k.id,
        kategori_id = kt.id
      FROM temp_museum t
      LEFT JOIN provinsi p ON t.provinsi = p.nama_provinsi
      LEFT JOIN kabupaten k ON t.kabupaten = k.nama_kabupaten AND p.id = k.provinsi_id
      LEFT JOIN kategori kt ON t.kategori = kt.nama_kategori
      WHERE m.source_id = t.source_id OR m.nama_museum = t.nama_museum;
    `);

    await client.query('COMMIT');
    console.log('Migrasi sukses!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
