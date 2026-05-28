const express = require('express');
const router = express.Router();
const {
  getSavedArticles,
  saveArticle,
  removeSavedArticle,
  getSavedChats,
  saveChat,
  removeSavedChat
} = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

router.get('/articles', protect, getSavedArticles);
router.post('/articles/:id', protect, saveArticle);
router.delete('/articles/:id', protect, removeSavedArticle);

router.get('/chats', protect, getSavedChats);
router.post('/chats', protect, saveChat);
router.delete('/chats/:id', protect, removeSavedChat);

module.exports = router;
