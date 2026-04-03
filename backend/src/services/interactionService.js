const { query } = require('../config/db');

/**
 * Tambah interaksi museum (Review atau Photo)
 */
const addInteraction = async ({ museum_id, user_name, type, rating = null, comment = null, photo_url = null }) => {
  const sql = `
    INSERT INTO museum_interactions (museum_id, user_name, type, rating, comment, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const result = await query(sql, [museum_id, user_name, type, rating, comment, photo_url]);
  return result.rows[0];
};

/**
 * Ambil semua interaksi untuk satu museum
 */
const getInteractionsByMuseumId = async (museum_id) => {
  const sql = `
    SELECT * FROM museum_interactions
    WHERE museum_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await query(sql, [museum_id]);
  return result.rows;
};

/**
 * Update like/dislike interaksi
 */
const updateInteractionReaction = async (id, type) => {
  const column = type === 'like' ? 'likes' : 'dislikes';
  const sql = `
    UPDATE museum_interactions
    SET ${column} = ${column} + 1
    WHERE id = $1
    RETURNING *;
  `;
  const result = await query(sql, [id]);
  return result.rows[0];
};

module.exports = {
  addInteraction,
  getInteractionsByMuseumId,
  updateInteractionReaction,
};
