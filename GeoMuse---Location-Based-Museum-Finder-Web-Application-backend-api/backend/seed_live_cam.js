require('dotenv').config();
const { pool } = require('./src/config/db');

async function run() {
  try {
    const res = await pool.query('SELECT id, nama_museum FROM museum WHERE id = 299');
    if (res.rows.length > 0) {
      const museum = res.rows[0];
      console.log(`Updating museum: ${museum.nama_museum} (ID: ${museum.id}) with Live Cam`);
      
      const updateRes = await pool.query(
        'UPDATE museum SET live_cam_url = $1 WHERE id = $2 RETURNING *',
        ['https://www.youtube.com/watch?v=0_fL4-N-v6k', museum.id]
      );
      console.log('Update successful');
      console.log('Live Cam URL: https://www.youtube.com/watch?v=0_fL4-N-v6k');
    } else {
      console.log('Museum ID 299 not found');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

run();
