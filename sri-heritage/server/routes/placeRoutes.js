const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlace,
  createPlace,
  updatePlace
} = require('../controllers/placeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getPlaces);
router.get('/:slug', getPlace);
router.post('/', protect, admin, createPlace);
router.put('/:id', protect, admin, updatePlace);

module.exports = router;
