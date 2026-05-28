const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
  getMyArticles,
  getArticleById
} = require('../controllers/articleController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getArticles);
router.get('/user/mine', protect, getMyArticles);
router.get('/id/:id', getArticleById);
router.get('/:slug', getArticle);
router.post('/', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 3 }]), createArticle);
router.put('/:id', protect, upload.fields([{ name: 'coverImage', maxCount: 1 }, { name: 'images', maxCount: 3 }]), updateArticle);
router.delete('/:id', protect, deleteArticle);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
