const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { generateArticleImage } = require('../controllers/aiController');

// All AI routes require authentication to prevent abuse
router.post('/generate-image', protect, generateArticleImage);

module.exports = router;
