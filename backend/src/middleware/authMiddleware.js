const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Middleware untuk verifikasi Admin Token
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Akses admin ditolak. Token tidak ditemukan.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Token admin tidak valid atau kadaluarsa.');
  }
};

/**
 * Middleware untuk verifikasi User Token
 */
const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Silakan login terlebih dahulu untuk mengakses fitur ini.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 401, 'Sesi login telah berakhir. Silakan login kembali.');
  }
};

module.exports = { 
  verifyToken, 
  verifyUserToken 
};
