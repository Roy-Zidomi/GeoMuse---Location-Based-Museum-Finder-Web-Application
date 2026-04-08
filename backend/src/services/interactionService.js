const { query } = require('../config/db');

/**
 * Tambah interaksi museum (Review atau Photo)
 */
const addInteraction = async ({ museum_id, user_id, user_name, type, rating = null, comment = null, photo_url = null }) => {
  const sql = `
    INSERT INTO museum_interactions (museum_id, user_id, user_name, type, rating, comment, photo_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const result = await query(sql, [museum_id, user_id, user_name, type, rating, comment, photo_url]);
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

/**
 * Admin: Ambil semua interaksi dengan informasi museum
 */
const getAllInteractions = async ({ type, museum_id, page = 1, limit = 10 }) => {
  const conditions = [];
  const params = [];
  let idx = 1;

  if (type) {
    conditions.push(`mi.type = $${idx}`);
    params.push(type);
    idx++;
  }
  if (museum_id) {
    conditions.push(`mi.museum_id = $${idx}`);
    params.push(museum_id);
    idx++;
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  const offset = (page - 1) * limit;

  // Count total
  const countSql = `SELECT COUNT(*) FROM museum_interactions mi ${whereClause}`;
  const countRes = await query(countSql, params);
  const total = parseInt(countRes.rows[0].count, 10);

  // Data
  const sql = `
    SELECT mi.*, m.nama_museum
    FROM museum_interactions mi
    JOIN museum m ON mi.museum_id = m.id
    ${whereClause}
    ORDER BY mi.created_at DESC
    LIMIT $${idx} OFFSET $${idx + 1}
  `;
  
  const result = await query(sql, [...params, limit, offset]);

  return {
    data: result.rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
};

/**
 * Hapus interaksi
 */
const deleteInteraction = async (id) => {
  const sql = `DELETE FROM museum_interactions WHERE id = $1 RETURNING *`;
  const result = await query(sql, [id]);
  return result.rows[0];
};

module.exports = {
  addInteraction,
  getInteractionsByMuseumId,
  updateInteractionReaction,
  getAllInteractions,
  deleteInteraction,
};
