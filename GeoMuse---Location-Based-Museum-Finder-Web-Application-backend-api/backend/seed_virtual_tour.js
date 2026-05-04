require('dotenv').config();
const { pool } = require('./src/config/db');

async function run() {
  try {
    const res = await pool.query('SELECT id, nama_museum FROM museum LIMIT 1');
    if (res.rows.length > 0) {
      const museum = res.rows[0];
      console.log(`Updating museum: ${museum.nama_museum} (ID: ${museum.id})`);
      
      // Update with sample virtual tour URL
      const updateRes = await pool.query(
        'UPDATE museum SET virtual_tour_url = $1 WHERE id = $2 RETURNING *',
        ['https://pannellum.org/images/alma.jpg', museum.id]
      );
      console.log('Update successful');
      console.log('Sample URL: https://pannellum.org/images/alma.jpg');
    } else {
      console.log('No museums found in database');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

run();
