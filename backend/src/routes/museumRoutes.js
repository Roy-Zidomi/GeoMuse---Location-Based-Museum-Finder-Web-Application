const express = require('express');
const router = express.Router();
const museumController = require('../controllers/museumController');

// GET /api/museums/nearby - Museum terdekat (harus sebelum /:id)
router.get('/nearby', museumController.getNearbyMuseums);

// GET /api/museums/stats - Statistik dashboard umum
router.get('/stats', museumController.getStats);
router.get('/stats/by-province', museumController.getByProvince);
router.get('/stats/by-category', museumController.getByCategory);
router.get('/stats/top-regencies', museumController.getTopRegencies);

// GET /api/museums - Semua museum (dengan filter, search, pagination)
router.get('/', museumController.getMuseums);

// GET /api/museums/:id - Detail museum
router.get('/:id', museumController.getMuseumById);

module.exports = router;
