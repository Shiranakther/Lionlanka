const express = require('express');
const router = express.Router();
const {
  getChats,
  createOrUpdateChat,
  getChat,
  deleteChat,
  togglePin
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getChats);
router.post('/', protect, createOrUpdateChat);
router.get('/:id', protect, getChat);
router.delete('/:id', protect, deleteChat);
router.patch('/:id/pin', protect, togglePin);

module.exports = router;
