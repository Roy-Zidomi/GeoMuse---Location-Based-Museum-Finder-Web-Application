const express = require('express');
const router = express.Router();
const userAuthController = require('../controllers/userAuthController');
const { verifyUserToken } = require('../middleware/authMiddleware');

router.post('/register', userAuthController.register);
router.post('/login', userAuthController.login);
router.get('/me', verifyUserToken, userAuthController.getMe);

module.exports = router;
