require('dotenv').config();
const { pool } = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seedAdmin() {
  const client = await pool.connect();
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@museumnesia.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Checking for admin table...');
    // Ensure admin table exists (adjust schema if needed)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Seeding admin user...');
    await client.query(`
      INSERT INTO admins (email, password)
      VALUES ($1, $2)
      ON CONFLICT (email) DO UPDATE SET password = $2;
    `, [email, hashedPassword]);

    console.log('-----------------------------------');
    console.log('✅ Admin Seeding BERHASIL!');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('-----------------------------------');
    console.log('Gunakan data di atas untuk login di http://localhost:5173/admin/login');

  } catch (err) {
    console.error('Gagal:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seedAdmin();
