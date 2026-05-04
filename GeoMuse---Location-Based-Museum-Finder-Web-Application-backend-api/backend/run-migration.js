require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool } = require('./src/config/db');

async function run() {
  try {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    
    for (const file of files) {
      console.log(`Running migration: ${file}`);
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      await pool.query(sql);
    }
    
    console.log('All migrations executed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    pool.end();
  }
}

run();
