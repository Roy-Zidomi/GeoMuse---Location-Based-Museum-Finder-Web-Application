const { query } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

const JWT_SECRET = process.env.JWT_SECRET || 'user_secret_key_123';

/**
 * Register User
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, 'Nama, email, dan password wajib diisi');
    }

    // Check if user exists
    const checkUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return errorResponse(res, 400, 'Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    return successResponse(res, 'Registrasi berhasil', { user, token }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Login User
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, 'Email dan password wajib diisi');
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 401, 'Email atau password salah');
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: 'user' }, JWT_SECRET, { expiresIn: '7d' });

    // Don't send password
    delete user.password;

    return successResponse(res, 'Login berhasil', { user, token });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Me (Current User)
 */
const getMe = async (req, res, next) => {
  try {
    const result = await query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id]);
    return successResponse(res, 'Data user berhasil diambil', result.rows[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};
