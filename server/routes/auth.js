const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth'); // You will need to create this file next!

// 🔐 Public Authentication Routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🛡️ Protected Profile Routes (Requires Auth Middleware)
// This allows AGENT: KATHAN to update their email and profile picture
router.put('/profile', auth, authController.updateProfile);

// 📡 Recovery Routes (Forgot Username/Password)
router.post('/forgot-password', authController.forgotPassword);
router.post('/forgot-username', authController.forgotUsername);

// Ensure this has the :token parameter!
router.post('/reset-password/:token', authController.resetPassword);
module.exports = router;