const { successResponse, errorResponse } = require('../utils/responseFormatter');
const interactionService = require('../services/interactionService');

/**
 * Kirim Review
 */
const postReview = async (req, res, next) => {
  try {
    const { museum_id, rating, comment } = req.body;
    const user_name = req.user.name;
    const user_id = req.user.id;

    if (!museum_id || !rating) {
      return errorResponse(res, 400, 'museum_id dan rating wajib diisi');
    }

    const review = await interactionService.addInteraction({ 
      museum_id, 
      user_id,
      user_name, 
      type: 'REVIEW', 
      rating, 
      comment 
    });
    return successResponse(res, 'Ulasan berhasil dikirim', review, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Upload Foto
 */
const postPhoto = async (req, res, next) => {
  try {
    const { museum_id, comment } = req.body;
    const user_name = req.user.name;
    const user_id = req.user.id;

    if (!req.file) {
      return errorResponse(res, 400, 'Harap lampirkan file foto');
    }

    const photo_url = `/uploads/${req.file.filename}`;
    const photo = await interactionService.addInteraction({ 
      museum_id, 
      user_id,
      user_name, 
      type: 'PHOTO', 
      photo_url,
      comment: comment || 'Kunjungan Museum'
    });

    return successResponse(res, 'Foto berhasil diunggah', photo, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Ambil Daftar Interaksi (Review & Foto Tergabung)
 */
const getMuseumInteractions = async (req, res, next) => {
  try {
    const { museum_id } = req.params;
    const interactions = await interactionService.getInteractionsByMuseumId(museum_id);
    return successResponse(res, 'Daftar interaksi berhasil diambil', interactions);
  } catch (error) {
    next(error);
  }
};

/**
 * Like/Dislike Interaksi
 */
const reactInteraction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'like' or 'dislike'

    if (!['like', 'dislike'].includes(type)) {
      return errorResponse(res, 400, 'Tipe reaksi harus "like" atau "dislike"');
    }

    const interaction = await interactionService.updateInteractionReaction(id, type);
    return successResponse(res, 'Reaksi berhasil diperbarui', interaction);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postReview,
  postPhoto,
  getMuseumInteractions,
  reactInteraction,
};
