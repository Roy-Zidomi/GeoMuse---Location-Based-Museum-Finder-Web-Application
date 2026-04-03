const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Unified Interactions
router.get('/museums/:museum_id', interactionController.getMuseumInteractions);
router.post('/reviews', interactionController.postReview);
router.post('/photos', upload.single('photo'), interactionController.postPhoto);
router.post('/:id/react', interactionController.reactInteraction);

module.exports = router;
